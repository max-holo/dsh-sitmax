// dsh-sitmax host plugin (npm bundle node half): system-wide idle detection.
// A browser page can only see its own keyboard/mouse events; to know whether
// the USER (not the page) is active, this half runs one long-lived PowerShell
// child that polls the Windows GetLastInputInfo API and prints `IDLE <ms>`
// lines every second, then serves the latest sample at /api/dsh-sitmax/idle.
//
// The route registers unconditionally: the monitor child may fail (non-Windows,
// spawn error, exit), and the route then reports `supported: false` so the
// client HUD falls back to page-local detection instead of breaking.
'use strict'

const { spawn } = require('node:child_process')
const https = require('node:https')

// One PowerShell child: compile the P/Invoke wrapper once, then print the
// system-wide idle milliseconds every second as `IDLE <ms>` lines (UTF-8,
// flushed) on stdout.
const PS_SCRIPT = [
  "$src = @'",
  'using System;',
  'using System.Runtime.InteropServices;',
  'public static class ConsoleIdle {',
  '  [StructLayout(LayoutKind.Sequential)]',
  '  struct LASTINPUTINFO { public uint cbSize; public uint dwTime; }',
  '  [DllImport("user32.dll")]',
  '  static extern bool GetLastInputInfo(ref LASTINPUTINFO plii);',
  '  public static uint GetIdleTicks() {',
  '    LASTINPUTINFO lii = new LASTINPUTINFO();',
  '    lii.cbSize = (uint)Marshal.SizeOf(typeof(LASTINPUTINFO));',
  '    if (!GetLastInputInfo(ref lii)) return 0;',
  '    return unchecked((uint)Environment.TickCount) - lii.dwTime;',
  '  }',
  '}',
  "'@",
  'Add-Type -TypeDefinition $src',
  "[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)",
  'while ($true) {',
  '  try { $t = [ConsoleIdle]::GetIdleTicks() } catch { $t = 0 }',
  "  [Console]::Out.WriteLine('IDLE ' + $t)",
  '  [Console]::Out.Flush()',
  '  Start-Sleep -Milliseconds 1000',
  '}',
].join('\n')

module.exports = {
  name: 'dsh-sitmax',
  inject: ['webServer'],
  apply(ctx) {
    const webServer = ctx.webServer

    const state = {
      supported: false,
      idleMs: null,
      sampleAt: 0,
      attempts: 0,
      lastError: null,
      idlePeak: 0,
      idlePeakEndedAt: 0,
      idlePeakLast: 0,
    }

    let child = null
    let stopped = false

    // Chinese statutory holiday calendar (timor.tech, no key required): per
    // year a map of MM-DD → { holiday, name }. holiday=false entries are
    // make-up workdays (调休上班). Cached for a day; failures are retried
    // after 30 minutes.
    const holidaysCache = new Map()
    function fetchHolidays(year) {
      return new Promise((resolve, reject) => {
        const req = https.get('https://timor.tech/api/holiday/year/' + year, (res) => {
          let d = ''
          res.on('data', (c) => { d += c })
          res.on('end', () => {
            try { resolve(JSON.parse(d)) } catch (err) { reject(err) }
          })
        })
        req.on('error', reject)
        req.setTimeout(8000, () => { req.destroy(new Error('holiday fetch timeout')) })
      })
    }

    function start() {
      if (stopped || process.platform !== 'win32') return
      let proc = null
      try {
        proc = spawn('powershell.exe', ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', PS_SCRIPT], {
          stdio: ['ignore', 'pipe', 'pipe'],
          windowsHide: true,
        })
      } catch (err) {
        state.lastError = String(err && err.message ? err.message : err)
        return
      }
      child = proc
      let buf = ''
      let errBuf = ''
      proc.stdout.on('data', (chunk) => {
        buf += chunk.toString('utf8')
        const lines = buf.split(/\r?\n/)
        buf = lines.pop()
        for (const line of lines) {
          const m = /^IDLE (\d+)$/.exec(line.trim())
          if (m !== null) {
            const idle = Number(m[1])
            state.idleMs = idle
            state.sampleAt = Date.now()
            state.supported = true
            state.attempts = 0
            state.lastError = null
            // Track away stretches: the peak idle of the current stretch, and
            // the timestamp at which it ended (idle dropped below 2s). The
            // browser tab may be throttled/frozen during a locked workstation,
            // so the client corrects its sitting clock from these values when
            // it comes back.
            if (idle < 2000) {
              if (state.idlePeak >= 5000) {
                state.idlePeakLast = state.idlePeak
                state.idlePeakEndedAt = Date.now()
              }
              state.idlePeak = idle
            } else if (idle > state.idlePeak) {
              state.idlePeak = idle
            }
          }
        }
      })
      proc.stderr.on('data', (chunk) => {
        errBuf += chunk.toString('utf8')
        if (errBuf.length > 4000) errBuf = errBuf.slice(-4000)
        if (state.supported === false) state.lastError = errBuf.slice(-300)
      })
      proc.on('error', (err) => {
        state.lastError = String(err && err.message ? err.message : err)
      })
      proc.on('exit', () => {
        if (child === proc) child = null
        if (stopped) return
        state.supported = false
        state.idleMs = null
        // Never give up: retry with capped exponential backoff so a transient
        // PowerShell death can always recover without a dsh restart.
        state.attempts += 1
        setTimeout(start, Math.min(30000, 5000 * state.attempts))
      })
    }

    ctx.effect(() => {
      start()
      return () => {
        stopped = true
        if (child !== null) {
          try { child.kill() } catch (err) { }
          child = null
        }
      }
    })

    ctx.effect(() => webServer.register({
      kind: 'exact',
      path: '/api/dsh-sitmax/idle',
      handler(req, res) {
        const body = JSON.stringify({
          ok: true,
          supported: state.supported,
          idleMs: state.idleMs,
          ageMs: state.sampleAt === 0 ? null : Date.now() - state.sampleAt,
          idlePeak: state.idlePeak,
          idlePeakLast: state.idlePeakLast,
          idlePeakEndedAt: state.idlePeakEndedAt,
          lastError: state.lastError,
        })
        res.writeHead(200, {
          'content-type': 'application/json; charset=utf-8',
          'cache-control': 'no-store',
        })
        res.end(body)
      },
    }))

    ctx.effect(() => webServer.register({
      kind: 'exact',
      path: '/api/dsh-sitmax/holidays',
      handler(req, res) {
        const url = new URL(req.url ?? '/', 'http://x')
        const year = Number(url.searchParams.get('year')) || new Date().getFullYear()
        const serve = (ok, map, error) => {
          res.writeHead(200, {
            'content-type': 'application/json; charset=utf-8',
            'cache-control': 'no-store',
          })
          res.end(JSON.stringify({ ok, year, map: map || null, error: error || null }))
        }
        const cached = holidaysCache.get(year)
        if (cached !== undefined) {
          const age = Date.now() - cached.at
          if (cached.map !== null && age < 86400000) return serve(true, cached.map)
          if (cached.map === null && age < 1800000) return serve(false, null, 'holiday fetch recently failed, retrying later')
        }
        fetchHolidays(year).then((j) => {
          if (!j || j.code !== 0 || typeof j.holiday !== 'object' || j.holiday === null) {
            holidaysCache.set(year, { at: Date.now(), map: null })
            return serve(false, null, 'holiday api returned an unexpected shape')
          }
          const map = {}
          for (const k of Object.keys(j.holiday)) {
            const e = j.holiday[k]
            if (e && typeof e === 'object' && typeof e.holiday === 'boolean') {
              map[year + '-' + k] = { holiday: e.holiday, name: typeof e.name === 'string' ? e.name : '' }
            }
          }
          holidaysCache.set(year, { at: Date.now(), map })
          serve(true, map)
        }).catch((err) => {
          holidaysCache.set(year, { at: Date.now(), map: null })
          serve(false, null, String(err && err.message ? err.message : err))
        })
      },
    }))
  },
}
