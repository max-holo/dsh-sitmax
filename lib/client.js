window.__ModuleLoader__.load({
	id: "dsh-sitmax",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
// dsh-sitmax client plugin: anti-sedentary running-track HUD.
// - shell.overlay: top-center stadium running track with a small runner moving
//   along it as the 15-minute cycle progresses + the sitting time in the middle.
// - Reminder popup every 30 minutes of sitting with break mode, snooze and
//   stats; desktop notification + chime when enabled.
// - Keyboard/mouse activity detection: auto-pause when idle, resume on return,
//   count as a break when away longer than the break duration.
// - Two settings sections: configuration (persisted to localStorage) and a
//   7-day daily sitting report.
const React = require('react')

const CSS = '\n.maxm-badge{position:fixed;top:6px;left:50%;transform:translateX(-50%);z-index:4000;display:flex;flex-direction:row;align-items:center;gap:8px;cursor:grab;pointer-events:auto;user-select:none}\n.maxm-badge::before,.maxm-badge::after{content:"";position:absolute;top:0;bottom:0;width:44px;z-index:1}\n.maxm-badge::before{left:-42px}\n.maxm-badge::after{right:-42px}\n.maxm-svg{width:118px;height:auto;display:none;filter:drop-shadow(0 1px 5px rgba(0,0,0,.35))}\n.maxm-badge:hover .maxm-svg{display:block}\n.maxm-badge:not(:hover) .maxm-act-btn{display:none}\n.maxm-mini{width:30px;height:30px;display:block;flex:none}\n.maxm-badge:hover .maxm-mini{display:none}\n.maxm-mini-track{fill:none;stroke:var(--dsw-alias-label-primary,#e8e8ea);opacity:.25;stroke-width:4}\n.maxm-mini-fill{fill:none;stroke:url(#maxmSandMini);stroke-width:4;stroke-linecap:round;transform:rotate(-90deg);transform-origin:center;transition:stroke-dashoffset 1s linear}\n.maxm-break .maxm-mini-track{stroke:var(--dsw-alias-state-success-primary,#2ecc71);opacity:.5}\n.maxm-overdue .maxm-mini-track{stroke:var(--dsw-alias-state-warn-primary,#f5a623);opacity:.5}\n.maxm-offduty .maxm-mini{opacity:.45}\n.maxm-glow .maxm-svg{filter:drop-shadow(0 0 10px rgba(251,191,36,.55))}\n.maxm-act-btn{position:absolute;top:50%;margin-top:-13.5px;z-index:2;width:27px;height:27px;border-radius:50%;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.08);color:var(--dsw-alias-label-secondary,#b8b8c0);font-size:12px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;flex:none;font-family:inherit;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);transition:background .2s,color .2s,transform .1s}\n.maxm-act-btn.maxm-act-left{left:-35px}\n.maxm-act-btn.maxm-act-right{right:-35px}\n.maxm-act-btn:hover{background:rgba(255,255,255,.2);color:var(--dsw-alias-label-primary,#fff)}\n.maxm-act-btn:active{transform:scale(.92)}\n.maxm-time-text{fill:var(--dsw-alias-label-secondary,#c9c9d1);font-size:11px;font-weight:600;font-family:inherit;text-anchor:middle;letter-spacing:.03em;font-variant-numeric:tabular-nums;pointer-events:none}\n.maxm-overdue .maxm-time-text{fill:var(--dsw-alias-state-warn-primary,#f5a623)}\n.maxm-break .maxm-time-text{fill:var(--dsw-alias-state-success-primary,#2ecc71)}\n.maxm-offduty .maxm-time-text{fill:var(--dsw-alias-label-secondary,#9aa0ab)}\n.maxm-track{fill:none;stroke:var(--dsw-alias-label-primary,#e8e8ea);opacity:.22;stroke-width:8;stroke-linecap:round;stroke-linejoin:round}\n.maxm-lane{fill:none;stroke:var(--dsw-alias-label-primary,#e8e8ea);opacity:.13;stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round}\n.maxm-break .maxm-track{stroke:var(--dsw-alias-state-success-primary,#2ecc71);opacity:.5}\n.maxm-overdue .maxm-track{stroke:var(--dsw-alias-state-warn-primary,#f5a623);opacity:.5}\n.maxm-fill{fill:none;stroke:url(#maxmSand);stroke-width:8;stroke-linecap:round;stroke-linejoin:round;transition:stroke-dashoffset 1s linear}\n.maxm-head{transition:transform 1s linear}\n.maxm-runner{filter:drop-shadow(0 0 2px rgba(10,11,14,.85));animation:maxmBob .55s ease-in-out infinite alternate}\n@keyframes maxmBob{from{transform:scale(1.6) translateY(0)}to{transform:scale(1.6) translateY(-1.1px)}}\n.maxm-r-head{fill:var(--dsw-alias-label-primary,#f0f0f2)}\n.maxm-r-body,.maxm-r-arm,.maxm-r-leg{stroke:var(--dsw-alias-label-primary,#f0f0f2);stroke-width:1.7;stroke-linecap:round;fill:none}\n.maxm-modal{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:5000;width:320px;padding:18px 18px 16px;border-radius:22px;background:var(--dsw-alias-bg-overlay,rgba(30,32,38,.84));border:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.16));backdrop-filter:blur(24px) saturate(160%);-webkit-backdrop-filter:blur(24px) saturate(160%);box-shadow:0 24px 70px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.14);color:var(--dsw-alias-label-primary,#eee);pointer-events:auto;animation:maxmPop .28s cubic-bezier(.2,1.4,.4,1)}\n@keyframes maxmPop{from{opacity:0;transform:translate(-50%,-46%) scale(.92)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}\n.maxm-m-title{font-size:16px;font-weight:700;margin-bottom:8px}\n.maxm-m-break-title{color:var(--dsw-alias-state-success-primary,#2ecc71)}\n.maxm-m-body{font-size:13px;line-height:1.65;color:var(--dsw-alias-label-secondary,#b8b8c0);margin-bottom:8px}\n.maxm-m-stats{font-size:11px;color:var(--dsw-alias-label-secondary,#8f8f98);margin-bottom:12px;opacity:.9}\n.maxm-m-count{font-size:34px;font-weight:800;font-variant-numeric:tabular-nums;color:var(--dsw-alias-state-success-primary,#2ecc71);margin-bottom:10px;letter-spacing:.04em}\n.maxm-m-tips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}\n.maxm-m-tips span{font-size:12px;padding:3px 8px;border-radius:999px;border:1px solid var(--dsw-alias-border-l1,rgba(255,255,255,.12));color:var(--dsw-alias-label-secondary,#b8b8c0)}\n.maxm-m-actions{display:flex;flex-direction:column;gap:8px}\n.maxm-btn{width:100%;padding:9px 12px;border-radius:10px;border:none;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit}\n.maxm-btn-primary{background:var(--dsw-alias-brand-primary,#4f8cff);color:#fff}\n.maxm-btn-ghost{background:transparent;border:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.2));color:var(--dsw-alias-label-primary,#eee)}\n.maxm-page{display:flex;flex-direction:column;gap:10px;padding:4px 2px;max-width:480px}\n.maxm-page-title{font-size:17px;font-weight:700;color:var(--dsw-alias-label-primary,#eee)}\n.maxm-page-sub{font-size:12px;color:var(--dsw-alias-label-secondary,#a6a6ad);margin-top:-6px;margin-bottom:4px}\n.maxm-set-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 0;border-bottom:1px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08))}\n.maxm-set-lab{display:flex;flex-direction:column;gap:2px;font-size:13px;color:var(--dsw-alias-label-primary,#eee);cursor:pointer}\n.maxm-set-hint{font-size:11px;color:var(--dsw-alias-label-secondary,#8f8f98)}\n.maxm-set-num{width:76px;padding:6px 8px;border-radius:8px;border:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.16));background:var(--dsw-alias-bg-layer-2,rgba(255,255,255,.04));color:var(--dsw-alias-label-primary,#eee);font-size:13px;text-align:center}\n.maxm-set-check{width:18px;height:18px;accent-color:var(--dsw-alias-brand-primary,#4f8cff);cursor:pointer}\n.maxm-set-actions{display:flex;flex-direction:column;gap:8px;margin-top:6px}\n.maxm-set-flash{font-size:12px;color:var(--dsw-alias-state-success-primary,#2ecc71)}\n.maxm-page-sep{height:1px;background:var(--dsw-alias-border-l1,rgba(255,255,255,.08));margin:6px 0}\n.maxm-today{display:flex;gap:8px;flex-wrap:wrap;margin:2px 0 8px}\n.maxm-today span{padding:6px 10px;border-radius:10px;background:var(--dsw-alias-bg-layer-2,rgba(255,255,255,.05));border:1px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));font-size:12px;color:var(--dsw-alias-label-primary,#eee)}\n.maxm-bar-row{display:flex;align-items:center;gap:8px;padding:4px 0}\n.maxm-bar-lab{width:52px;font-size:12px;color:var(--dsw-alias-label-secondary,#a6a6ad);flex:none}\n.maxm-bar-track{flex:1;height:12px;border-radius:6px;background:var(--dsw-alias-bg-layer-2,rgba(255,255,255,.05));overflow:hidden}\n.maxm-bar-fill{height:100%;border-radius:6px;background:linear-gradient(90deg,#fbbf24,#b45309);min-width:2px;transition:width .5s}\n.maxm-bar-val{width:132px;font-size:11px;color:var(--dsw-alias-label-secondary,#a6a6ad);text-align:right;flex:none}\n.maxm-vtab{display:inline-flex;border:1px solid var(--dsw-alias-border-l1,rgba(255,255,255,.12));border-radius:8px;overflow:hidden;align-self:flex-start}\n.maxm-vtab button{border:none;background:transparent;color:var(--dsw-alias-label-secondary,#a6a6ad);padding:5px 14px;font-size:12px;cursor:pointer;font-family:inherit}\n.maxm-vtab .maxm-vtab-on{background:var(--dsw-alias-brand-primary,#4f8cff);color:#fff}\n.maxm-cal-head{display:flex;align-items:center;gap:8px;margin-bottom:2px}\n.maxm-cal-title{font-size:14px;font-weight:700;color:var(--dsw-alias-label-primary,#eee);min-width:96px;text-align:center}\n.maxm-cal-nav{border:1px solid var(--dsw-alias-border-l1,rgba(255,255,255,.12));background:transparent;color:var(--dsw-alias-label-secondary,#a6a6ad);border-radius:6px;padding:3px 10px;cursor:pointer;font-size:13px;line-height:1.4}\n.maxm-cal-todaybtn{margin-left:auto;font-size:11px;color:var(--dsw-alias-brand-primary,#4f8cff);background:transparent;border:none;cursor:pointer}\n.maxm-cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}\n.maxm-cal-dow{font-size:10px;color:var(--dsw-alias-label-secondary,#8f8f98);text-align:center;padding:2px 0}\n.maxm-cal-cell{min-height:54px;border-radius:8px;border:1px solid transparent;padding:3px 4px;cursor:pointer;display:flex;flex-direction:column;gap:1px}\n.maxm-cal-cell:hover{border-color:var(--dsw-alias-border-l2,rgba(255,255,255,.25))}\n.maxm-cal-day{font-size:11px;color:var(--dsw-alias-label-primary,#e8e8ea);line-height:1.15}\n.maxm-cal-time{font-size:10px;color:var(--dsw-alias-label-secondary,#c9c9d1);line-height:1.15;font-variant-numeric:tabular-nums}\n.maxm-cal-sub{font-size:9px;color:var(--dsw-alias-label-secondary,#8f8f98);line-height:1.15}\n.maxm-cal-empty{background:transparent;cursor:default}\n.maxm-cal-future{opacity:.35;cursor:default}\n.maxm-cal-today{border-color:var(--dsw-alias-brand-primary,#4f8cff)}\n.maxm-cal-sel{border-color:var(--dsw-alias-state-warn-primary,#f5a623);box-shadow:0 0 0 1px var(--dsw-alias-state-warn-primary,rgba(245,166,35,.4))}\n.maxm-cal-detail{margin-top:8px;padding:10px 12px;border-radius:10px;background:var(--dsw-alias-bg-layer-2,rgba(255,255,255,.04));border:1px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08))}\n.maxm-cards{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}\n.maxm-card{display:flex;flex-direction:column;gap:3px;padding:9px 11px;border-radius:10px;background:var(--dsw-alias-bg-layer-2,rgba(255,255,255,.05));border:1px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08))}\n.maxm-card-v{font-size:16px;font-weight:800;color:var(--dsw-alias-label-primary,#eee);font-variant-numeric:tabular-nums}\n.maxm-card-k{font-size:11px;color:var(--dsw-alias-label-secondary,#8f8f98)}\n.maxm-evs{margin-top:8px;display:flex;flex-direction:column}\n.maxm-evrow{display:flex;gap:8px;font-size:11px;padding:2px 0;color:var(--dsw-alias-label-secondary,#a6a6ad)}\n.maxm-evtime{flex:none;font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-primary,#c9c9d1)}\n.maxm-duty{display:none;margin-top:2px}\n.maxm-badge:hover .maxm-duty{display:block}\n.maxm-offduty .maxm-duty{display:block}\n.maxm-duty-btn{font-size:10px;line-height:1.7;border:none;background:rgba(255,255,255,.07);color:var(--dsw-alias-label-secondary,#a6a6ad);border-radius:6px;padding:0 8px;cursor:pointer;font-family:inherit;letter-spacing:.05em}\n.maxm-duty-btn:hover{color:var(--dsw-alias-label-primary,#eee);background:rgba(255,255,255,.14)}\n.maxm-offduty .maxm-svg{opacity:.4}\n.maxm-offduty .maxm-head{opacity:0}\n.maxm-pv-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:6000;display:flex;align-items:center;justify-content:center;padding:20px}\n.maxm-pv-box{position:relative;max-width:min(780px,96vw);max-height:96vh;overflow:auto;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,.5)}\n.maxm-pv-img{width:100%;display:block;image-rendering:auto}\n.maxm-pv-close{position:absolute;top:8px;right:8px;width:28px;height:28px;border-radius:50%;border:none;background:rgba(20,22,27,.85);color:#fff;font-size:14px;cursor:pointer;line-height:1}\n.maxm-cal-day-we{color:var(--dsw-alias-state-warn-primary,#f5a623)}\n.maxm-cal-day-ho{color:var(--dsw-alias-state-error-primary,#d64545)}\n.maxm-cal-tag{font-size:8px;margin-left:3px;padding:0 3px;border-radius:3px;background:rgba(220,68,68,.22);color:var(--dsw-alias-state-error-primary,#ff9b9b);line-height:1.5;vertical-align:top}\n.maxm-title-row{display:flex;flex-direction:row;align-items:center;gap:8px}\n.maxm-gh{margin-left:auto;display:flex;align-items:center;color:var(--dsw-alias-label-secondary,#a6a6ad);text-decoration:none}\n.maxm-gh:hover{color:var(--dsw-alias-label-primary,#eee)}'

const DEFAULTS = { cycleMin: 15, remindMin: 30, breakMin: 5, snoozeMin: 5, idleMin: 3, notif: true, sound: true, workH: 9, workM: 0 }
const CFG_KEY = 'dsh.sitmax.cfg.v1'
const HIST_KEY = 'dsh.sitmax.hist.v1'
const STATE_KEY = 'dsh.sitmax.state.v1'
const EVENTS_KEY = 'dsh.sitmax.events.v1'

function loadCfg() {
  const c = {}
  for (const k in DEFAULTS) c[k] = DEFAULTS[k]
  try {
    const raw = localStorage.getItem(CFG_KEY)
    if (raw) {
      const p = JSON.parse(raw)
      for (const k in DEFAULTS) if (typeof p[k] === typeof DEFAULTS[k]) c[k] = p[k]
    }
  } catch (e) { }
  // Core behaviors are always on (no toggles): idle auto-pause, global idle
  // detection, daily auto-start, workday-only timing, away-counts-as-break.
  c.idlePause = true
  c.globalIdle = true
  c.autoStart = true
  c.workdays = true
  c.autoBreak = true
  return c
}

function loadHist() {
  try {
    const raw = localStorage.getItem(HIST_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) { }
  return {}
}

function dateKey(ts) {
  const d = new Date(ts)
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

function fmt(ms) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0')
}

/** Exact duration for event text, e.g. "4 分 32 秒" (rounding a 4m32s absence up to
 * "5 分钟" made users think a break should have been credited). */
function fmtSpan(ms) {
  const s = Math.max(0, Math.round(ms / 1000))
  const m = Math.floor(s / 60)
  const r = s % 60
  if (m === 0) return r + ' 秒'
  if (r === 0) return m + ' 分钟'
  return m + ' 分 ' + r + ' 秒'
}

function fmtHm(ms) {
  const m = Math.round(ms / 60000)
  if (m < 60) return m + ' 分钟'
  return Math.floor(m / 60) + ' 小时 ' + (m % 60) + ' 分'
}

// Stadium running-track path (viewBox 0 0 150 62): two straights joined by
// semicircle ends. The progress stroke reveals along it and the runner travels
// on it with getPointAtLength.
const TRACK = 'M 38,13 H 112 A 20,20 0 0 1 112,53 H 38 A 20,20 0 0 1 38,13 Z'
// Inner lane divider, so the ring reads as a running track rather than a pill.
const TRACK_INNER = 'M 42,17 H 108 A 16,16 0 0 1 108,49 H 42 A 16,16 0 0 1 42,17 Z'

exports.name = 'dsh-sitmax-client'
exports.inject = ['slots']
exports.apply = function apply(ctx) {
  ctx.effect(() => {
    const old = document.getElementById('dsh-sitmax-css')
    if (old) old.remove()
    const el = document.createElement('style')
    el.id = 'dsh-sitmax-css'
    el.textContent = CSS
    document.head.appendChild(el)
    return () => { el.remove() }
  })

  const CFG = loadCfg()
  const HIST = loadHist()

  const persistCfg = () => { try { localStorage.setItem(CFG_KEY, JSON.stringify(CFG)) } catch (e) { } }
  const persistHist = () => { try { localStorage.setItem(HIST_KEY, JSON.stringify(HIST)) } catch (e) { } }

  // Event log: every reminder / break / pause / reset with its cause and
  // timestamp, shown in the report so the numbers are always explainable.
  let EVENTS = []
  try {
    const rawEv = localStorage.getItem(EVENTS_KEY)
    if (rawEv) EVENTS = JSON.parse(rawEv) || []
  } catch (e) { }
  function logEvent(type, note) {
    try {
      EVENTS.unshift({ t: Date.now(), type, note })
      if (EVENTS.length > 300) EVENTS.length = 300
      localStorage.setItem(EVENTS_KEY, JSON.stringify(EVENTS))
    } catch (e) { }
  }

  // Chinese statutory holiday calendar: 'YYYY-MM-DD' → { holiday, name }.
  // holiday=false entries are make-up workdays (调休上班). Loaded from the
  // host route (which fetches timor.tech) and cached in localStorage.
  const HOLIDAYS = {}
  const HOLIDAYS_KEY = 'dsh.sitmax.holidays.v1'
  try {
    const rawH = localStorage.getItem(HOLIDAYS_KEY)
    if (rawH) {
      const p = JSON.parse(rawH)
      if (p && p.map && typeof p.map === 'object') Object.assign(HOLIDAYS, p.map)
    }
  } catch (e) { }

  function isWorkday(key) {
    const d = new Date(Number(key.slice(0, 4)), Number(key.slice(5, 7)) - 1, Number(key.slice(8, 10)))
    const dow = d.getDay()
    const h = HOLIDAYS[key]
    if (h && typeof h.holiday === 'boolean') return !h.holiday
    return dow !== 0 && dow !== 6
  }

  async function loadHolidays() {
    // Throttle: at most one fetch per 5 minutes (apply + poll may both fire
    // shortly after load), and log only when the calendar actually grows.
    if (Date.now() - S.lastHolidayFetch < 300000) return
    S.lastHolidayFetch = Date.now()
    try {
      const year = new Date().getFullYear()
      const res = await fetch('/api/dsh-sitmax/holidays?year=' + year)
      if (!res.ok) return
      const j = await res.json()
      if (j && j.ok && j.map && typeof j.map === 'object') {
        let added = 0
        for (const k of Object.keys(j.map)) {
          if (!(k in HOLIDAYS)) { HOLIDAYS[k] = j.map[k]; added++ }
        }
        try { localStorage.setItem(HOLIDAYS_KEY, JSON.stringify({ year, map: j.map })) } catch (e) { }
        if (added > 0) {
          if (typeof S !== 'undefined' && S.mode === 'offduty') S.nextAutoAt = nextAutoStart(Date.now())
          logEvent('holidays-loaded', '已加载 ' + year + ' 年节假日安排（新增 ' + added + ' 天标记）')
        }
      }
    } catch (e) { }
  }

  function dayBucket(ts) {
    const k = dateKey(ts)
    if (!HIST[k] || typeof HIST[k] !== 'object') HIST[k] = { sitMs: 0, breaks: 0, cycles: 0, reminders: 0 }
    return HIST[k]
  }

  // Reconciled daily sitting total: the durable per-tick accumulation vs the
  // sum of recorded continuous stretches — the larger one wins, so 累计在座
  // can never fall below 最长连续.
  function daySitMs(b) {
    if (!b) return 0
    let m = typeof b.sitMs === 'number' ? b.sitMs : 0
    if (Array.isArray(b.stretches)) {
      let s = 0
      for (let i = 0; i < b.stretches.length; i++) s += b.stretches[i]
      if (s > m) m = s
    }
    return m
  }

  function mins(v, lo, hi) {
    const n = Math.round(Number(v))
    if (!isFinite(n)) return lo
    return Math.min(hi, Math.max(lo, n))
  }

  // Chime: generate a small WAV in memory (no assets, no network).
  let hardUri = null
  let softUri = null
  function chimeUriFor(soft) {
    try {
      const sr = 22050
      const dur = soft ? 0.35 : 0.6
      const n = Math.floor(sr * dur)
      const data = new Int16Array(n)
      const f1 = soft ? 523 : 659
      const f2 = soft ? 784 : 988
      for (let i = 0; i < n; i++) {
        const t = i / sr
        const env = Math.min(1, (n - i) / (sr * 0.15))
        data[i] = Math.round(Math.max(-1, Math.min(1, (Math.sin(2 * Math.PI * f1 * t) + 0.5 * Math.sin(2 * Math.PI * f2 * t)) * 0.28 * env)) * 0x7fff)
      }
      const buf = new ArrayBuffer(44 + n * 2)
      const dv = new DataView(buf)
      const ws = (o, s) => { for (let i = 0; i < s.length; i++) dv.setUint8(o + i, s.charCodeAt(i)) }
      ws(0, 'RIFF'); dv.setUint32(4, 36 + n * 2, true); ws(8, 'WAVE'); ws(12, 'fmt ')
      dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 1, true)
      dv.setUint32(24, sr, true); dv.setUint32(28, sr * 2, true); dv.setUint16(32, 2, true); dv.setUint16(34, 16, true)
      ws(36, 'data'); dv.setUint32(40, n * 2, true)
      new Int16Array(buf, 44).set(data)
      const bytes = new Uint8Array(buf)
      let bin = ''
      for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
      return 'data:audio/wav;base64,' + window.btoa(bin)
    } catch (e) { return null }
  }

  function beep(soft) {
    if (!CFG.sound) return
    try {
      const uri = soft ? (softUri = softUri || chimeUriFor(true)) : (hardUri = hardUri || chimeUriFor(false))
      if (!uri) return
      const a = new Audio(uri)
      const p = a.play()
      if (p && typeof p.catch === 'function') p.catch(() => {})
    } catch (e) { }
  }

  function notify(title, body) {
    if (!CFG.notif) return 'off'
    try {
      if (typeof Notification === 'undefined') return 'unsupported'
      if (Notification.permission !== 'granted') return 'no-permission'
      const n = new Notification(title, { body: body })
      n.onclick = () => { try { window.focus() } catch (e) { } }
      return 'sent'
    } catch (e) { return 'error' }
  }

  const S = {
    mode: 'sitting',
    pauseKind: '',
    skipBreakCredit: false,
    sitAnchor: Date.now(),
    stretchStart: Date.now(),
    nextRemindAt: Date.now() + CFG.remindMin * 60000,
    pauseStart: 0,
    breakUntil: 0,
    frozenPhase: 0,
    prevPhase: 0,
    glowUntil: 0,
    showModal: false,
    total: 0,
    pathEl: null,
    lastActivity: Date.now(),
    lastTick: Date.now(),
    lastNotifAt: 0,
    histDirty: 0,
    globalIdleMs: null,
    globalSupported: false,
    globalSampleAt: 0,
    lastPeakEndedAt: 0,
    nextAutoAt: 0,
    dayKey: dateKey(Date.now()),
    lastHolidayFetch: 0,
    everGlobal: false,
    stats: { popups: 0, breaks: 0, cycles: 0 },
  }

  // Persist the sitting-clock anchor too, so a quick page refresh keeps the
  // "已坐" clock, the sand-flow phase and the reminder countdown running.
  function persistState() {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify({
        mode: S.mode,
        anchor: S.sitAnchor,
        stretchStart: S.stretchStart,
        nextRemindAt: S.nextRemindAt,
        breakUntil: S.breakUntil,
        stats: { popups: S.stats.popups, breaks: S.stats.breaks, cycles: S.stats.cycles },
        savedAt: Date.now(),
      }))
    } catch (e) { }
  }
  function flush() { persistHist(); persistState() }

  // Continuous-sitting stretches: each stretch is recorded when it ends so
  // the report can show the longest single sitting session, distinct from
  // the daily accumulated total.
  function recordStretch(endTs) {
    const dur = endTs - S.stretchStart
    if (dur >= 60000) {
      const b = dayBucket(endTs)
      if (!Array.isArray(b.stretches)) b.stretches = []
      b.stretches.push(dur)
      if (b.stretches.length > 100) b.stretches.shift()
      if (!b.maxStretch || dur > b.maxStretch) b.maxStretch = dur
    }
  }

  // ---- single-driver protection: with several DSH tabs open, only ONE tab
  // ticks the clock, writes state and fires reminders, so a stale tab can
  // never overwrite the live clock or double-count sitting time. The other
  // tabs stay read-only ("follower"). Election is deterministic: the tab
  // with the smallest random id becomes the driver. ----
  const TAB_ID = Math.random().toString(36).slice(2, 10)
  let role = 'unknown' // 'leader' | 'follower' | 'unknown'
  let leaderId = null
  let lastHeartbeat = Date.now()
  let candidates = [TAB_ID]
  let roleListener = null
  const bc = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('dsh-sitmax') : null

  function setRole(r) {
    role = r
    if (roleListener !== null) roleListener(r)
  }
  function hello() {
    if (bc === null) { setRole('leader'); return }
    candidates = [TAB_ID]
    setRole('unknown')
    bc.postMessage({ type: 'hello', id: TAB_ID })
    setTimeout(() => {
      if (role !== 'unknown') return
      const ids = Array.from(candidates).sort()
      if (ids[0] === TAB_ID) {
        setRole('leader')
        bc.postMessage({ type: 'leader', id: TAB_ID })
        bc.postMessage({ type: 'heartbeat', id: TAB_ID })
      } else {
        leaderId = ids[0]
        lastHeartbeat = Date.now()
        setRole('follower')
        bc.postMessage({ type: 'hello', id: TAB_ID })
      }
    }, 400)
  }
  if (bc !== null) {
    bc.onmessage = (ev) => {
      const m = ev.data || {}
      if (m.type === 'hello') {
        if (!candidates.includes(m.id)) candidates.push(m.id)
        if (role === 'leader') bc.postMessage({ type: 'leader', id: TAB_ID })
      } else if (m.type === 'leader') {
        if (m.id !== TAB_ID) {
          leaderId = m.id
          lastHeartbeat = Date.now()
          setRole('follower')
        } else {
          setRole('leader')
        }
      } else if (m.type === 'heartbeat' && m.id === leaderId) {
        lastHeartbeat = Date.now()
      } else if (m.type === 'bye' && m.id === leaderId) {
        leaderId = null
        hello()
      }
    }
  }
  hello()
  ctx.effect(() => {
    const keeper = setInterval(() => {
      if (bc === null) return
      if (role === 'leader') {
        bc.postMessage({ type: 'heartbeat', id: TAB_ID })
      } else if (leaderId !== null && Date.now() - lastHeartbeat > 15000) {
        hello()
      }
    }, 5000)
    const bye = () => { if (bc !== null && role === 'leader') { try { bc.postMessage({ type: 'bye', id: TAB_ID }) } catch (e) { } } }
    window.addEventListener('beforeunload', bye)
    return () => {
      clearInterval(keeper)
      window.removeEventListener('beforeunload', bye)
      if (bc !== null) { try { bc.close() } catch (e) { } }
    }
  })

  const cycleMs = () => CFG.cycleMin * 60000
  const remindMs = () => CFG.remindMin * 60000
  const breakMs = () => CFG.breakMin * 60000

  // Next occurrence of the configured daily auto-start time (HH:MM), skipping
  // weekends and statutory holidays when workday-only mode is on.
  function nextAutoStart(now) {
    for (let i = 0; i < 16; i++) {
      const t = new Date(now + i * 86400000)
      const at = new Date(t.getFullYear(), t.getMonth(), t.getDate(), CFG.workH, CFG.workM, 0, 0).getTime()
      if (at <= now) continue
      if (!CFG.workdays || isWorkday(dateKey(at))) return at
    }
    return now + 86400000
  }

  function currentPhase(now) {
    if (S.mode !== 'sitting') return S.frozenPhase
    const c = cycleMs()
    return (((now - S.sitAnchor) % c) + c) % c / c
  }

  // Restore the pre-refresh sitting clock: a quick refresh (≤90s gap) keeps
  // the "已坐" timer, sand phase and reminder countdown running, and the
  // refresh gap is still counted as sitting time in the daily report.
  try {
    const raw = localStorage.getItem(STATE_KEY)
    if (raw) {
      const st = JSON.parse(raw)
      const now = Date.now()
      if (st && typeof st.mode === 'string' && st.mode === 'offduty') {
        // Off-duty survives any gap: it stays stopped until the user clicks
        // "start overtime" or the daily auto-start time arrives.
        S.mode = 'offduty'
        S.frozenPhase = 0
        S.showModal = false
        S.nextAutoAt = nextAutoStart(now)
        if (st.stats && typeof st.stats === 'object') {
          S.stats.popups = Number(st.stats.popups) || 0
          S.stats.breaks = Number(st.stats.breaks) || 0
          S.stats.cycles = Number(st.stats.cycles) || 0
        }
      } else if (st && typeof st.savedAt === 'number' && typeof st.anchor === 'number'
        && now - st.savedAt >= 0 && now - st.savedAt <= 90000
        && (st.mode === 'sitting' || st.mode === 'break')) {
        S.sitAnchor = st.anchor
        S.stretchStart = typeof st.stretchStart === 'number' ? st.stretchStart : st.anchor
        if (st.mode === 'break' && typeof st.breakUntil === 'number' && st.breakUntil > now) {
          S.mode = 'break'
          S.breakUntil = st.breakUntil
        } else {
          S.mode = 'sitting'
          S.nextRemindAt = typeof st.nextRemindAt === 'number' && st.nextRemindAt > now ? st.nextRemindAt : now + remindMs()
          dayBucket(now).sitMs += now - st.savedAt
        }
        if (st.stats && typeof st.stats === 'object') {
          S.stats.popups = Number(st.stats.popups) || 0
          S.stats.breaks = Number(st.stats.breaks) || 0
          S.stats.cycles = Number(st.stats.cycles) || 0
        }
        S.lastTick = now
        persistHist()
        logEvent('restore', '刷新后恢复计时（继续之前的「已坐」时钟）')
      }
    }
  } catch (e) { }

  // Load the statutory-holiday calendar once at startup (and every 12h from
  // the leader poll below).
  loadHolidays()

  // Idle detection: auto-pause when away, resume on return; a long absence
  // counts as a completed break (auto-reset).
  function resumeFromAway(now) {
    const away = now - S.pauseStart
    if (CFG.autoBreak && away >= breakMs() && !S.skipBreakCredit) {
      recordStretch(S.pauseStart)
      S.stretchStart = now
      S.stats.breaks++
      dayBucket(now).breaks++
      S.mode = 'sitting'
      S.sitAnchor = now
      S.nextRemindAt = now + remindMs()
      S.frozenPhase = 0
      S.prevPhase = 0
      S.pauseKind = ''
      S.showModal = false
      flush()
      logEvent('away-reset', '离开 ' + fmtSpan(away) + '（≥ 休息时长 ' + CFG.breakMin + ' 分钟），算完成一次休息并重置计时')
    } else {
      S.sitAnchor += away
      S.nextRemindAt += away
      S.mode = 'sitting'
      S.prevPhase = currentPhase(now)
      S.pauseKind = ''
      logEvent('resume', '回来继续计时（扣掉离开的 ' + fmtSpan(away) + '，未到休息时长 ' + CFG.breakMin + ' 分钟）')
    }
    S.skipBreakCredit = false
    S.lastTick = now
  }

  function onActivity() {
    if (role !== 'leader') return
    const now = Date.now()
    S.lastActivity = now
    if (S.mode !== 'paused' || S.pauseKind !== 'auto') return
    resumeFromAway(now)
  }

  ctx.effect(() => {
    const evs = ['keydown', 'mousedown', 'pointerdown', 'wheel', 'touchstart']
    for (let i = 0; i < evs.length; i++) document.addEventListener(evs[i], onActivity, { passive: true })
    const save = () => flush()
    window.addEventListener('beforeunload', save)
    document.addEventListener('visibilitychange', save)
    return () => {
      for (let i = 0; i < evs.length; i++) document.removeEventListener(evs[i], onActivity)
      window.removeEventListener('beforeunload', save)
      document.removeEventListener('visibilitychange', save)
    }
  })

  // Poll the host route for the Windows-wide idle sample (GetLastInputInfo).
  // While it answers, the SYSTEM-wide idle decides "away"; the page-local
  // events above stay as the fallback when the route is unavailable.
  ctx.effect(() => {
    let stopped = false
    let timer = null
    async function poll() {
      if (role !== 'leader') {
        if (!stopped) timer = setTimeout(poll, 2000)
        return
      }
      const nowTs = Date.now()
      if (nowTs - S.lastHolidayFetch > 12 * 3600000) {
        S.lastHolidayFetch = nowTs
        loadHolidays()
      }
      try {
        const res = await fetch('/api/dsh-sitmax/idle', { cache: 'no-store' })
        if (res.ok) {
          const j = await res.json()
          if (j && typeof j.idleMs === 'number' && !stopped) {
            const prevGlobal = S.globalSupported
            S.globalIdleMs = j.idleMs
            S.globalSupported = j.supported === true
            S.globalSampleAt = Date.now()
            if (S.globalSupported && !S.everGlobal) S.everGlobal = true
            if (prevGlobal && !S.globalSupported) {
              logEvent('global-lost', '全局检测连接断开：自动暂停已临时关闭，避免误判「离开」')
            }
            // Retroactive away correction: the host kept sampling while this
            // tab was throttled or frozen (locked workstation), so this page
            // missed the whole away stretch. When such a stretch ended, remove
            // the overlapping part from the sitting clock now.
            if (typeof j.idlePeakEndedAt === 'number' && typeof j.idlePeak === 'number'
              && j.idlePeakEndedAt > S.lastPeakEndedAt) {
              S.lastPeakEndedAt = j.idlePeakEndedAt
              const end = j.idlePeakEndedAt
              const start = end - (typeof j.idlePeakLast === 'number' ? j.idlePeakLast : j.idlePeak)
              const overlap = Math.max(0, end - Math.max(S.sitAnchor, start))
              if (overlap >= CFG.idleMin * 60000) {
                if (S.mode === 'sitting') {
                  if (CFG.autoBreak && overlap >= breakMs()) {
                    recordStretch(start)
                    S.stretchStart = Date.now()
                    S.stats.breaks++
                    dayBucket(Date.now()).breaks++
                    S.mode = 'sitting'
                    S.sitAnchor = Date.now()
                    S.nextRemindAt = Date.now() + remindMs()
                    S.frozenPhase = 0
                    S.prevPhase = 0
                    S.showModal = false
                    persistHist()
                    logEvent('retro-reset', '锁屏/冻结期间离开约 ' + Math.round(overlap / 60000) + ' 分钟，已按完成休息重置')
                  } else {
                    S.sitAnchor += overlap
                    S.nextRemindAt += overlap
                    logEvent('retro-correct', '锁屏/冻结期间离开约 ' + Math.round(overlap / 60000) + ' 分钟，已从计时中扣除')
                  }
                  S.lastTick = Date.now()
                }
              }
            }
          }
        }
      } catch (err) {
        // route not registered yet; keep polling
      }
      if (!stopped) timer = setTimeout(poll, 2000)
    }
    timer = setTimeout(poll, 300)
    return () => { stopped = true; clearTimeout(timer) }
  })

  // HUD position: null = default top-center. Drag anywhere and it is remembered;
  // double-click resets to the default.
  const HUD_POS_KEY = 'dsh.sitmax.pos.v1'
  let hudPos = (() => {
    try {
      const raw = localStorage.getItem(HUD_POS_KEY)
      if (raw !== null) {
        const parsed = JSON.parse(raw)
        if (parsed !== null && typeof parsed === 'object' && Number.isFinite(parsed.x) && Number.isFinite(parsed.y)) {
          return { x: parsed.x, y: parsed.y }
        }
      }
    } catch (err) { /* ignore */ }
    return null
  })()
  let hudDrag = null
  let suppressHudClick = false

  function MAXWidget() {
    const [v, setV] = React.useState(() => derive(Date.now()))

    function derive(now) {
      const tickGap = now - S.lastTick
      // Global idle (Windows-wide) wins when available; page events are the
      // fallback. Extrapolate the last sample forward to "now"; tolerate up
      // to 120s of staleness so a throttled tab still detects absence from a
      // slightly older sample instead of giving up.
      const pageIdle = now - S.lastActivity
      let globalIdle = null
      if (S.globalSupported && S.globalIdleMs !== null) {
        const staleness = now - S.globalSampleAt
        if (staleness <= 120000) {
          globalIdle = S.globalIdleMs + Math.max(0, staleness)
        }
      }
      if (S.mode === 'sitting') {
        // When the system reports the user active (fresh global idle), a long
        // tick gap means browser throttling, not absence: count wall-clock
        // time so throttled tabs never undercount sitting.
        let delta = Math.min(tickGap, 5000)
        if (globalIdle !== null && globalIdle < 60000 && tickGap <= 600000) delta = tickGap
        if (delta > 0) dayBucket(now).sitMs += delta
      }
      S.lastTick = now
      if (now - S.histDirty > 15000) { S.histDirty = now; flush() }

      const globalActive = CFG.globalIdle && globalIdle !== null

      // "Present" means the user touched the system within the last minute —
      // reminders must never fire while nobody is there.
      const userPresent = (globalIdle !== null ? globalIdle : pageIdle) < 60000

      // Wake-from-stall backstop: when the tab froze (locked workstation /
      // energy saver) and no fresh global sample exists, conservatively treat
      // the stalled time as NOT sitting — the clock must never count phantom
      // sitting time.
      if (S.mode === 'sitting' && tickGap > 30000 && globalIdle === null) {
        const skip = tickGap - 30000
        S.sitAnchor += skip
        S.nextRemindAt += skip
        S.stretchStart += skip
        if (skip >= 120000) logEvent('stall-skip', '心跳中断约 ' + Math.round(tickGap / 60000) + ' 分钟，该时段未计入久坐')
      }

      // Auto-pause requires trustworthy idle data. Skip it when: the tab just
      // woke from a stall (a frozen/throttled page would otherwise turn its
      // ancient last-input time into a phantom "away" stretch), or the global
      // connection was lost after having worked (degraded page-only detection
      // misfires when the user works in other apps).
      // Auto-pause requires trustworthy idle data. The stall guard (tickGap)
      // only applies to the page-fallback path: a fresh-enough global sample
      // is valid even across throttled ticks.
      const autoPauseAllowed = CFG.idlePause && (globalActive || !S.everGlobal) && (globalActive || tickGap < 30000)
      if (autoPauseAllowed && S.mode === 'sitting') {
        const away = globalActive ? globalIdle : pageIdle
        if (away > CFG.idleMin * 60000) {
          S.mode = 'paused'
          S.pauseKind = 'auto'
          S.frozenPhase = currentPhase(now)
          // Freeze the clock at the moment input stopped, not at the moment
          // this tick noticed it.
          S.pauseStart = globalActive ? now - globalIdle : S.lastActivity
          const pausedAt = new Date(S.pauseStart)
          logEvent('pause', '无输入超过 ' + CFG.idleMin + ' 分钟，自动暂停（从 ' + String(pausedAt.getHours()).padStart(2, '0') + ':' + String(pausedAt.getMinutes()).padStart(2, '0') + ' 起算）')
        }
      }
      // The user touched something anywhere in Windows (another app counts):
      // resume even when this page saw no event of its own.
      if (S.mode === 'paused' && S.pauseKind === 'auto' && globalActive && globalIdle < 2000) {
        resumeFromAway(now)
      }

      const p = currentPhase(now)
      let showModal = S.showModal
      if (S.mode === 'sitting' && now >= S.nextRemindAt && !showModal && userPresent) {
        showModal = true
        S.showModal = true
        S.stats.popups++
        dayBucket(now).reminders++
        S.lastNotifAt = now
        const nr = notify('⏰ 该起来走走了', '已经连续坐满 ' + CFG.remindMin + ' 分钟啦，起来接杯水、伸个懒腰吧～')
        if (nr !== 'sent') logEvent('notif-skip', '桌面通知未发送（' + nr + '）')
        beep(false)
        flush()
        logEvent('remind', '到点提醒 · 已连续坐 ' + CFG.remindMin + ' 分钟')
      }
      if (S.mode === 'sitting' && showModal && now >= S.nextRemindAt && now - S.lastNotifAt > 300000 && userPresent) {
        S.lastNotifAt = now
        notify('⏰ 还在坐着吗？', '起来活动一下，眼睛看看远处～')
        beep(false)
      }
      if (S.mode === 'break' && now >= S.breakUntil) {
        S.mode = 'sitting'
        S.sitAnchor = now
        S.stretchStart = now
        S.nextRemindAt = now + remindMs()
        S.frozenPhase = 0
        S.prevPhase = 0
        S.showModal = false
        showModal = false
        // The break itself counts as absence: if the user is still away when
        // the countdown ends, pause (without charging another break) and wait
        // for their return instead of instantly flagging "no input".
        if (globalIdle !== null && globalIdle > CFG.idleMin * 60000) {
          S.mode = 'paused'
          S.pauseKind = 'auto'
          S.pauseStart = now
          S.skipBreakCredit = true
          logEvent('pause', '休息结束但你尚未回来，暂停等待你回来')
        } else {
          S.skipBreakCredit = false
        }
        notify('✅ 休息结束', '欢迎回来，新一轮计时开始～')
        beep(true)
        logEvent('break-end', '休息倒计时结束，重新开始计时')
      }
      // Day rollover: on a non-workday (with workday-only mode on), a session
      // that ran past midnight automatically goes off-duty.
      const dk = dateKey(now)
      if (dk !== S.dayKey) {
        S.dayKey = dk
        if (CFG.workdays && S.mode === 'sitting' && !isWorkday(dk)) {
          recordStretch(now)
          S.stretchStart = now
          S.mode = 'offduty'
          S.showModal = false
          S.frozenPhase = 0
          S.nextAutoAt = nextAutoStart(now)
          flush()
          logEvent('auto-offduty', '进入周末/节假日，自动停止计时（点「开始加班」可继续）')
        }
      }
      if (S.mode === 'offduty' && CFG.autoStart && (!CFG.workdays || isWorkday(dk)) && now >= S.nextAutoAt) {
        S.mode = 'sitting'
        S.sitAnchor = now
        S.stretchStart = now
        S.nextRemindAt = now + remindMs()
        S.prevPhase = 0
        S.frozenPhase = 0
        S.lastTick = now
        flush()
        logEvent('auto-start', '到上班时间（' + String(CFG.workH).padStart(2, '0') + ':' + String(CFG.workM).padStart(2, '0') + '），自动恢复计时')
      }
      if (S.mode === 'sitting') {
        if (S.prevPhase > 0.6 && p < 0.4) {
          S.stats.cycles++
          dayBucket(now).cycles++
          S.glowUntil = now + 2600
        }
        S.prevPhase = p
      }
      const overdue = S.mode === 'sitting' && now >= S.nextRemindAt
      let notifOk = false
      try { notifOk = CFG.notif && typeof Notification !== 'undefined' && Notification.permission === 'granted' } catch (e) { }
      return {
        now, p, mode: S.mode, pauseKind: S.pauseKind,
        modal: showModal, overdue, glow: now < S.glowUntil, notifOk,
        sitMs: S.mode === 'sitting' ? now - S.sitAnchor : 0,
        remainMs: Math.max(0, S.nextRemindAt - now),
        breakMs: S.mode === 'break' ? Math.max(0, S.breakUntil - now) : 0,
        remindMin: CFG.remindMin,
        stats: { popups: S.stats.popups, breaks: S.stats.breaks, cycles: S.stats.cycles },
      }
    }

    const [tabRole, setTabRole] = React.useState(role)
    React.useEffect(() => {
      roleListener = setTabRole
      setTabRole(role)
      return () => { roleListener = null }
    }, [])
    React.useEffect(() => {
      if (tabRole !== 'leader') return
      const t = setInterval(() => setV(derive(Date.now())), 1000)
      return () => clearInterval(t)
    }, [tabRole])

    const togglePause = () => {
      if (tabRole !== 'leader') return
      if (S.mode === 'offduty') return
      const now = Date.now()
      markActive(now)
      if (S.mode === 'sitting') {
        S.mode = 'paused'
        S.pauseKind = 'manual'
        S.frozenPhase = currentPhase(now)
        S.pauseStart = now
      } else if (S.mode === 'paused') {
        const dt = now - S.pauseStart
        S.sitAnchor += dt
        S.nextRemindAt += dt
        S.mode = 'sitting'
        S.pauseKind = ''
        S.prevPhase = currentPhase(now)
      }
      setV(derive(now))
    }

    const ackBreak = () => {
      const now = Date.now()
      recordStretch(now)
      S.stretchStart = now
      S.skipBreakCredit = false
      S.mode = 'break'
      S.frozenPhase = currentPhase(now)
      S.breakUntil = now + breakMs()
      S.stats.breaks++
      dayBucket(now).breaks++
      flush()
      logEvent('break-start', '点击「起来了」开始 ' + CFG.breakMin + ' 分钟休息')
      setV(derive(now))
    }

    const endBreak = () => {
      const now = Date.now()
      S.mode = 'sitting'
      S.sitAnchor = now
      S.stretchStart = now
      S.skipBreakCredit = false
      S.nextRemindAt = now + remindMs()
      S.frozenPhase = 0
      S.prevPhase = 0
      S.showModal = false
      logEvent('break-end', '点击「我回来了」提前结束休息')
      setV(derive(now))
    }

    const snooze = () => {
      const now = Date.now()
      S.nextRemindAt = now + CFG.snoozeMin * 60000
      S.showModal = false
      logEvent('snooze', '点击「再坐一会儿」暂缓 ' + CFG.snoozeMin + ' 分钟')
      setV(derive(now))
    }

    const goOffDuty = () => {
      if (tabRole !== 'leader') return
      const now = Date.now()
      markActive(now)
      // Off-duty ends the sitting session: bank the stretch, then reset the
      // clock so the next session starts from 0:00.
      recordStretch(S.pauseKind === 'auto' ? S.pauseStart : now)
      S.stretchStart = now
      S.sitAnchor = now
      S.nextRemindAt = now + remindMs()
      S.mode = 'offduty'
      S.pauseKind = ''
      S.showModal = false
      S.frozenPhase = 0
      S.prevPhase = 0
      S.nextAutoAt = nextAutoStart(now)
      flush()
      logEvent('offduty', '点击「下班」，停止计时并重置已坐时间')
      setV(derive(now))
    }

    // A user click is fresh activity: clear the idle samples so the very
    // next tick cannot misjudge "away" from a pre-click stale sample.
    const markActive = (now) => {
      S.lastActivity = now
      S.globalIdleMs = 0
      S.globalSampleAt = now
    }

    const startOvertime = () => {
      if (tabRole !== 'leader') return
      const now = Date.now()
      markActive(now)
      S.mode = 'sitting'
      S.sitAnchor = now
      S.stretchStart = now
      S.nextRemindAt = now + remindMs()
      S.prevPhase = 0
      S.frozenPhase = 0
      S.lastTick = now
      flush()
      logEvent('overtime', '点击「开始加班」，恢复计时')
      setV(derive(now))
    }

    // Status line under the letters (inside the glass capsule): time while
    // sitting, countdown while resting, one word otherwise.
    let statusText = tabRole !== 'leader' ? '只读' : '已坐 ' + fmt(v.sitMs)
    if (tabRole === 'leader') {
      if (v.mode === 'break') statusText = '休息 ' + fmt(v.breakMs)
      if (v.mode === 'paused') statusText = v.pauseKind === 'auto' ? '暂停' : '已暂停'
      if (v.mode === 'offduty') statusText = CFG.workdays && !isWorkday(dateKey(Date.now())) ? '周末' : '已下班'
    }

    let pt = { x: -20, y: -20 }
    if (S.total > 0 && S.pathEl) {
      const q = S.pathEl.getPointAtLength(S.total * Math.min(1, Math.max(0, v.p)))
      pt = { x: q.x, y: q.y }
    }

    const badgeClass = 'maxm-badge' + (v.glow ? ' maxm-glow' : '') + (v.mode === 'break' ? ' maxm-break' : '') + (v.overdue ? ' maxm-overdue' : '') + (v.mode === 'offduty' ? ' maxm-offduty' : '')

    // Collapsed mini ring geometry (viewBox 40x40, circle r=15 starting at top).
    const miniR = 15
    const miniC = 2 * Math.PI * miniR
    const miniP = Math.min(1, Math.max(0, v.p))
    const miniAngle = -Math.PI / 2 + miniP * 2 * Math.PI
    const miniDot = { x: 20 + miniR * Math.cos(miniAngle), y: 20 + miniR * Math.sin(miniAngle) }
    const miniRunner = React.createElement('g', { style: { transform: 'translate(' + miniDot.x + 'px, ' + miniDot.y + 'px) scale(0.62)' } },
      React.createElement('circle', { className: 'maxm-r-head', cx: '0', cy: '-6.6', r: '2.2' }),
      React.createElement('line', { className: 'maxm-r-body', x1: '0', y1: '-4.4', x2: '0', y2: '1.2' }),
      React.createElement('line', { className: 'maxm-r-arm', x1: '0', y1: '-3.2', x2: '-3.3', y2: '-1' }),
      React.createElement('line', { className: 'maxm-r-arm', x1: '0', y1: '-3.2', x2: '3.1', y2: '-4.3' }),
      React.createElement('line', { className: 'maxm-r-leg', x1: '0', y1: '1.2', x2: '-3.1', y2: '4.4' }),
      React.createElement('line', { className: 'maxm-r-leg', x1: '0', y1: '1.2', x2: '3.1', y2: '3.4' }),
    )

    const badgeStyle = hudPos !== null ? { left: hudPos.x + 'px', top: hudPos.y + 'px', transform: 'translate(-50%, -50%)' } : undefined

    const badge = React.createElement('div', {
      className: badgeClass,
      style: badgeStyle,
      title: (v.mode === 'paused' ? '点击继续计时' : '点击暂停计时') + '（拖动可移动位置，双击复位）',
      onClick: (e) => { if (suppressHudClick) return; togglePause(e) },
      onPointerDown: (e) => {
        if (e.button !== 0) return
        const el = e.currentTarget
        const rect = el.getBoundingClientRect()
        // Anchor the drag on the badge CENTRE, so the ring lands centred under
        // the pointer and expands/collapses around the same point.
        hudDrag = { startX: e.clientX, startY: e.clientY, cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2, moved: false, captured: false }
        // NOTE: no setPointerCapture here — capturing on pointerdown retargets
        // the click to the badge and swallows clicks on the side buttons.
      },
      onPointerMove: (e) => {
        if (hudDrag === null) return
        const dx = e.clientX - hudDrag.startX
        const dy = e.clientY - hudDrag.startY
        if (!hudDrag.moved && Math.abs(dx) < 4 && Math.abs(dy) < 4) return
        hudDrag.moved = true
        const el = e.currentTarget
        if (!hudDrag.captured) {
          try { el.setPointerCapture(e.pointerId) } catch (err) { /* ignore */ }
          hudDrag.captured = true
        }
        const x = Math.round(Math.max(15, Math.min(window.innerWidth - 15, hudDrag.cx + dx)))
        const y = Math.round(Math.max(15, Math.min(window.innerHeight - 15, hudDrag.cy + dy)))
        hudPos = { x, y }
        el.style.left = x + 'px'
        el.style.top = y + 'px'
        el.style.transform = 'translate(-50%, -50%)'
      },
      onPointerUp: (e) => {
        const dragged = hudDrag !== null && hudDrag.moved
        const captured = hudDrag !== null && hudDrag.captured === true
        hudDrag = null
        if (captured) { try { e.currentTarget.releasePointerCapture(e.pointerId) } catch (err) { /* ignore */ } }
        if (dragged) {
          try { localStorage.setItem(HUD_POS_KEY, JSON.stringify(hudPos)) } catch (err) { /* ignore */ }
          suppressHudClick = true
          setTimeout(() => { suppressHudClick = false }, 0)
        }
      },
      onDoubleClick: (e) => {
        hudPos = null
        try { localStorage.removeItem(HUD_POS_KEY) } catch (err) { /* ignore */ }
        const el = e.currentTarget
        el.style.left = ''
        el.style.top = ''
        el.style.transform = ''
      },
    },
      // Collapsed mini ring (hidden while hovered/expanded).
      React.createElement('svg', { className: 'maxm-mini', viewBox: '0 0 40 40', 'aria-hidden': true },
        React.createElement('defs', null,
          React.createElement('linearGradient', { id: 'maxmSandMini', x1: '0', y1: '0', x2: '1', y2: '1' },
            React.createElement('stop', { offset: '0%', stopColor: '#fde68a' }),
            React.createElement('stop', { offset: '50%', stopColor: '#fbbf24' }),
            React.createElement('stop', { offset: '100%', stopColor: '#b45309' }),
          ),
        ),
        React.createElement('circle', { className: 'maxm-mini-track', cx: '20', cy: '20', r: '15' }),
        React.createElement('circle', {
          className: 'maxm-mini-fill', cx: '20', cy: '20', r: '15',
          style: { strokeDasharray: miniC, strokeDashoffset: miniC * (1 - miniP) },
        }),
        miniRunner,
      ),
      tabRole === 'leader' ? React.createElement('button', {
        type: 'button',
        className: 'maxm-act-btn maxm-act-left',
        title: v.mode === 'offduty' ? '开始加班' : '下班',
        onPointerDown: (e) => { e.stopPropagation() },
        onClick: (e) => { e.stopPropagation(); if (v.mode === 'offduty') { startOvertime() } else { goOffDuty() } },
      }, v.mode === 'offduty' ? '💼' : '🌙') : null,
      React.createElement('svg', { className: 'maxm-svg', viewBox: '0 0 150 66', 'aria-hidden': true },
        React.createElement('defs', null,
          React.createElement('linearGradient', { id: 'maxmSand', x1: '0', y1: '0', x2: '1', y2: '1' },
            React.createElement('stop', { offset: '0%', stopColor: '#fde68a' }),
            React.createElement('stop', { offset: '50%', stopColor: '#fbbf24' }),
            React.createElement('stop', { offset: '100%', stopColor: '#b45309' }),
          ),
        ),
        React.createElement('path', { className: 'maxm-track', d: TRACK }),
        React.createElement('path', { className: 'maxm-lane', d: TRACK_INNER }),
        React.createElement('path', {
          className: 'maxm-fill', d: TRACK,
          ref: (el) => {
            S.pathEl = el
            if (el) {
              S.total = el.getTotalLength()
              el.style.strokeDasharray = String(S.total)
              el.style.strokeDashoffset = String(S.total * (1 - Math.min(1, Math.max(0, currentPhase(Date.now())))))
            }
          },
          style: {
            strokeDasharray: S.total > 0 ? S.total : '0.001',
            strokeDashoffset: S.total > 0 ? S.total * (1 - Math.min(1, Math.max(0, v.p))) : 0,
          },
        }),
        React.createElement('text', { className: 'maxm-time-text', x: '75', y: '36.5' }, statusText),
        React.createElement('g', { className: 'maxm-head', style: { transform: 'translate(' + pt.x + 'px, ' + pt.y + 'px)' } },
          React.createElement('g', { className: 'maxm-runner' },
            React.createElement('circle', { className: 'maxm-r-head', cx: '0', cy: '-6.6', r: '2.2' }),
            React.createElement('line', { className: 'maxm-r-body', x1: '0', y1: '-4.4', x2: '0', y2: '1.2' }),
            React.createElement('line', { className: 'maxm-r-arm', x1: '0', y1: '-3.2', x2: '-3.3', y2: '-1' }),
            React.createElement('line', { className: 'maxm-r-arm', x1: '0', y1: '-3.2', x2: '3.1', y2: '-4.3' }),
            React.createElement('line', { className: 'maxm-r-leg', x1: '0', y1: '1.2', x2: '-3.1', y2: '4.4' }),
            React.createElement('line', { className: 'maxm-r-leg', x1: '0', y1: '1.2', x2: '3.1', y2: '3.4' }),
          ),
        ),
      ),
      tabRole === 'leader' && v.mode !== 'offduty' ? React.createElement('button', {
        type: 'button',
        className: 'maxm-act-btn maxm-act-right',
        title: v.mode === 'paused' ? '继续计时' : '暂停计时',
        onPointerDown: (e) => { e.stopPropagation() },
        onClick: (e) => { e.stopPropagation(); togglePause() },
      }, v.mode === 'paused' ? '▶' : '⏸') : null,
    )

    let modal = null
    if (v.modal) {
      if (v.mode === 'break') {
        modal = React.createElement('div', { className: 'maxm-modal', role: 'dialog' },
          React.createElement('div', { className: 'maxm-m-title maxm-m-break-title' }, '🧘 休息中，放松一下'),
          React.createElement('div', { className: 'maxm-m-count' }, fmt(v.breakMs)),
          React.createElement('div', { className: 'maxm-m-tips' },
            React.createElement('span', null, '💧 喝口水'),
            React.createElement('span', null, '👀 看看远处'),
            React.createElement('span', null, '🙆 伸个懒腰'),
            React.createElement('span', null, '🚶 起来走走'),
          ),
          React.createElement('button', { className: 'maxm-btn maxm-btn-ghost', onClick: endBreak }, '▶ 我回来了，继续工作'),
        )
      } else {
        modal = React.createElement('div', { className: 'maxm-modal', role: 'dialog' },
          React.createElement('div', { className: 'maxm-m-title' }, '⏰ 该起来走走了'),
          React.createElement('div', { className: 'maxm-m-body' }, '你已经连续坐满 ' + v.remindMin + ' 分钟啦。起来接杯水、伸个懒腰，让眼睛看看远处吧～'),
          React.createElement('div', { className: 'maxm-m-stats' }, '本次运行 · 已提醒 ' + v.stats.popups + ' 次 · 完成休息 ' + v.stats.breaks + ' 次 · 完成轮次 ' + v.stats.cycles),
          React.createElement('div', { className: 'maxm-m-stats' }, '提示：点「我去休息」会暂停计时并记一次休息，倒计时结束自动重新计'),
          v.notifOk ? null : React.createElement('div', { className: 'maxm-m-stats', style: { color: 'var(--dsw-alias-state-warn-primary, #f5a623)' } }, '💡 未发送桌面通知：检查「久坐沙漏 · 设置」的开关与授权；若已开启仍收不到，检查 Windows 通知设置 / 专注助手'),
          React.createElement('div', { className: 'maxm-m-actions' },
            React.createElement('button', { className: 'maxm-btn maxm-btn-primary', onClick: ackBreak }, '✅ 我去休息（' + CFG.breakMin + ' 分钟倒计时）'),
            React.createElement('button', { className: 'maxm-btn maxm-btn-ghost', onClick: snooze }, '⏳ 再坐 ' + CFG.snoozeMin + ' 分钟'),
          ),
        )
      }
    }

    return React.createElement(React.Fragment, null, badge, modal)
  }

  // GitHub mark（官方 octocat 轮廓，currentColor 跟随主题文字色）。
  const GITHUB_MARK_PATH = 'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z'

  /** 设置/报告页标题行右侧的 GitHub 图标链接（由 HeaderIcons 组合）。 */
  function githubLinkEl(key) {
    return React.createElement('a', {
      key,
      href: 'https://github.com/max-holo/dsh-sitmax',
      target: '_blank',
      rel: 'noopener noreferrer',
      title: 'GitHub：max-holo/dsh-sitmax',
      'aria-label': '在 GitHub 上查看本项目',
      className: 'maxm-gh',
      style: { marginLeft: 0 },
    }, React.createElement('svg', {
      viewBox: '0 0 16 16',
      width: '15',
      height: '15',
      fill: 'currentColor',
      'aria-hidden': 'true',
    }, React.createElement('path', { d: GITHUB_MARK_PATH })))
  }

  /** npm 累计下载量：模块级缓存 10 分钟（服务端另有 30 分钟缓存），设置/报告页共用。 */
  const NPM_MARK_PATH = 'M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z'
  let dlMemo = { at: 0, promise: null }
  function fetchTotal() {
    if (dlMemo.promise !== null && Date.now() - dlMemo.at < 600000) return dlMemo.promise
    dlMemo = {
      at: Date.now(),
      promise: fetch('/api/dsh-sitmax/downloads')
        .then((r) => r.json())
        .then((j) => (j && j.ok && typeof j.total === 'number' ? j.total : null))
        .catch(() => null),
    }
    return dlMemo.promise
  }

  /** 标题行右侧：npm 图标 + 累计下载（取不到就不显示）+ GitHub 图标。 */
  function HeaderIcons() {
    const [total, setTotal] = React.useState(null)
    const [ready, setReady] = React.useState(false)
    React.useEffect(() => {
      let stopped = false
      fetchTotal().then((n) => { if (!stopped) { setTotal(n); setReady(true) } })
      return () => { stopped = true }
    }, [])
    return React.createElement('div', { style: { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', marginLeft: 'auto' } },
      ready && total !== null
        ? React.createElement('a', {
            href: 'https://www.npmjs.com/package/dsh-sitmax',
            target: '_blank',
            rel: 'noopener noreferrer',
            title: 'npm：dsh-sitmax · 累计下载 ' + total.toLocaleString('en-US'),
            className: 'maxm-gh',
            style: { marginLeft: 0, gap: '4px' },
          },
          React.createElement('svg', { viewBox: '0 0 24 24', width: '13', height: '13', fill: 'currentColor', 'aria-hidden': 'true' }, React.createElement('path', { d: NPM_MARK_PATH })),
          React.createElement('span', { style: { fontSize: '12px', fontVariantNumeric: 'tabular-nums' } }, total.toLocaleString('en-US')))
        : null,
      githubLinkEl(),
    )
  }

  function SettingsPage() {
    const [form, setForm] = React.useState(() => ({ cycleMin: CFG.cycleMin, remindMin: CFG.remindMin, breakMin: CFG.breakMin, snoozeMin: CFG.snoozeMin, idleMin: CFG.idleMin, notif: CFG.notif, sound: CFG.sound, workH: CFG.workH, workM: CFG.workM }))
    const [flash, setFlash] = React.useState('')
    const [perm, setPerm] = React.useState(() => { try { return typeof Notification !== 'undefined' ? String(Notification.permission) : '不支持' } catch (e) { return '不支持' } })

    const set = (k, val) => setForm(Object.assign({}, form, { [k]: val }))

    const num = (k, label, hint, lo, hi) => React.createElement('label', { className: 'maxm-set-row', key: k },
      React.createElement('span', { className: 'maxm-set-lab' }, label, React.createElement('span', { className: 'maxm-set-hint' }, hint)),
      React.createElement('input', { type: 'number', className: 'maxm-set-num', min: lo, max: hi, value: form[k], onChange: (e) => set(k, Number(e.target.value)) }),
    )
    const tog = (k, label, hint) => React.createElement('label', { className: 'maxm-set-row', key: k },
      React.createElement('span', { className: 'maxm-set-lab' }, label, React.createElement('span', { className: 'maxm-set-hint' }, hint)),
      React.createElement('input', { type: 'checkbox', className: 'maxm-set-check', checked: form[k], onChange: (e) => set(k, e.target.checked) }),
    )
    const btn = (label, cls, onClick) => React.createElement('button', { className: 'maxm-btn ' + cls, onClick: onClick }, label)

    const save = () => {
      CFG.cycleMin = mins(form.cycleMin, 5, 120)
      CFG.remindMin = mins(form.remindMin, 10, 180)
      CFG.breakMin = mins(form.breakMin, 1, 30)
      CFG.snoozeMin = mins(form.snoozeMin, 1, 30)
      CFG.idleMin = mins(form.idleMin, 1, 30)
      CFG.notif = !!form.notif
      CFG.sound = !!form.sound
      CFG.workH = mins(form.workH, 0, 23)
      CFG.workM = mins(form.workM, 0, 59)
      persistCfg()
      if (S.mode === 'offduty') S.nextAutoAt = nextAutoStart(Date.now())
      if (S.mode === 'sitting') S.nextRemindAt = S.sitAnchor + remindMs()
      setForm({ cycleMin: CFG.cycleMin, remindMin: CFG.remindMin, breakMin: CFG.breakMin, snoozeMin: CFG.snoozeMin, idleMin: CFG.idleMin, notif: CFG.notif, sound: CFG.sound, workH: CFG.workH, workM: CFG.workM })
      setFlash('已保存 ✓')
      setTimeout(() => setFlash(''), 2500)
      try { if (CFG.notif && typeof Notification !== 'undefined' && Notification.permission === 'default') Notification.requestPermission() } catch (e) { }
    }

    const reset = () => {
      for (const k in DEFAULTS) CFG[k] = DEFAULTS[k]
      CFG.idlePause = true
      CFG.globalIdle = true
      CFG.autoStart = true
      CFG.workdays = true
      CFG.autoBreak = true
      persistCfg()
      if (S.mode === 'offduty') S.nextAutoAt = nextAutoStart(Date.now())
      if (S.mode === 'sitting') S.nextRemindAt = S.sitAnchor + remindMs()
      setForm({ cycleMin: CFG.cycleMin, remindMin: CFG.remindMin, breakMin: CFG.breakMin, snoozeMin: CFG.snoozeMin, idleMin: CFG.idleMin, notif: CFG.notif, sound: CFG.sound, workH: CFG.workH, workM: CFG.workM })
      setFlash('已恢复默认 ✓')
      setTimeout(() => setFlash(''), 2500)
    }

    const testNotif = () => {
      const sendTest = (title, body) => {
        try {
          const n = new Notification(title, { body })
          n.onclick = () => { try { window.focus() } catch (e) { } }
          return true
        } catch (e) { return false }
      }
      try {
        if (typeof Notification === 'undefined') {
          setPerm('不支持')
          setFlash('⚠ 当前浏览器不支持桌面通知')
          return
        }
        if (Notification.permission === 'granted') {
          const sent = sendTest('✅ 桌面通知正常', '这是 MAX 久坐沙漏的测试通知。到点提醒（默认每 30 分钟）就会以这种形式出现。')
          setPerm('granted')
          setFlash(sent ? '✅ 测试通知已发送——留意屏幕右下角（或 Windows 通知中心）' : '⚠ 通知构造失败，请检查浏览器/系统通知是否被禁用')
        } else if (Notification.permission === 'denied') {
          setPerm('denied')
          setFlash('⚠ 权限已被拒绝：点地址栏左侧的锁/铃铛图标 → 通知 → 允许；或进浏览器站点设置把本地址的通知打开')
        } else {
          const r = Notification.requestPermission()
          setFlash('⏳ 已发出权限请求——请留意浏览器左上角或地址栏的弹窗，选择「允许」')
          if (r && typeof r.then === 'function') {
            r.then((p) => {
              setPerm(String(p))
              if (p === 'granted') {
                sendTest('✅ 桌面通知已开启', 'MAX 久坐沙漏：以后每到提醒时间，会在这里提醒你起来活动。')
                setFlash('✅ 已授权并发送测试通知——留意屏幕右下角')
              } else if (p === 'denied') {
                setFlash('⚠ 已拒绝。可到浏览器站点设置里重新允许（地址栏锁图标 → 通知）')
              } else {
                setFlash('未做选择，仍为未授权状态；再点一次按钮试试')
              }
            })
          } else {
            setPerm(String(Notification.permission))
            setFlash('已提交请求，请在浏览器弹窗中选择允许')
          }
        }
        setTimeout(() => setFlash(''), 8000)
      } catch (e) {
        setPerm('失败')
        setFlash('⚠ 请求失败：' + String(e && e.message ? e.message : e))
      }
    }

    const testSound = () => { const was = CFG.sound; CFG.sound = true; beep(false); CFG.sound = was }

    const permText = perm === 'granted' ? '✅ 已开启——到点会在系统里弹通知' : perm === 'denied' ? '❌ 已被拒绝（点下方按钮查看开启方法）' : perm === '不支持' ? '当前浏览器不支持' : '未授权（点下方按钮请求）'
    const roleText = role === 'leader' ? '🟢 本页正在计时' : role === 'follower' ? '🟡 副标签页：计时由另一标签页驱动，本页只读' : '⏳ 正在选举计时标签页…'
    const holidayText = Object.keys(HOLIDAYS).length > 0 ? '✅ 节假日数据已加载（' + Object.keys(HOLIDAYS).length + ' 天标记）' : '⚠ 节假日数据未加载：暂按周末判断，法定假日请留意'
    const onWin = /Win/i.test(navigator.platform || '')
    const globalText = S.globalSupported
      ? '✅ 全局检测已连接 · 系统级空闲 ' + fmt(S.globalIdleMs ?? 0)
      : onWin
        ? '⚠ 全局检测未连接 · 自动暂停已临时关闭（防误判）· 重启 dsh web 后恢复'
        : '⚠ 全局检测仅支持 Windows，已回退为页面内检测'

    return React.createElement('div', { className: 'maxm-page' },
      React.createElement('div', { className: 'maxm-title-row' },
        React.createElement('div', { className: 'maxm-page-title' }, '久坐沙漏 · 设置'),
        React.createElement(HeaderIcons, { key: 'icons' }),
      ),
      React.createElement('div', { className: 'maxm-page-sub' }, '保存后立即生效，并持久保存在本浏览器（localStorage）'),
      num('cycleMin', '沙漏循环时长', '沙流从 M 流到 X 的一轮时长（分钟）', 5, 120),
      num('remindMin', '提醒间隔', '连续坐多久后弹窗提醒起身（分钟）', 10, 180),
      num('breakMin', '休息时长', '点“起来了”后的休息倒计时（分钟）', 1, 30),
      num('snoozeMin', '暂缓时长', '点“再坐一会儿”后延迟多久提醒（分钟）', 1, 30),
      num('idleMin', '离开判定', '无键鼠操作多久视为离开（分钟）', 1, 30),
      num('workH', '上班时间 · 时', '工作日自动恢复计时的小时（0-23）', 0, 23),
      num('workM', '上班时间 · 分', '工作日自动恢复计时的分钟（0-59）', 0, 59),
      tog('notif', '桌面通知', '切到其他应用/标签页也能收到系统通知'),
      tog('sound', '提示音', '到点播放一声轻快的提示音'),
      React.createElement('div', { className: 'maxm-set-actions' },
        btn('💾 保存设置', 'maxm-btn-primary', save),
        btn('恢复默认', 'maxm-btn-ghost', reset),
      ),
      flash ? React.createElement('div', { className: 'maxm-set-flash' }, flash) : null,
      React.createElement('div', { className: 'maxm-page-sep' }),
      React.createElement('div', { className: 'maxm-set-lab' }, roleText),
      React.createElement('div', { className: 'maxm-set-lab' }, globalText),
      React.createElement('div', { className: 'maxm-set-lab' }, holidayText),
      React.createElement('div', { className: 'maxm-set-lab' }, '通知权限：' + permText),
      React.createElement('div', { className: 'maxm-set-actions' },
        btn('🔔 请求 / 测试桌面通知', 'maxm-btn-ghost', testNotif),
        btn('🔊 测试提示音', 'maxm-btn-ghost', testSound),
        btn('🔄 刷新节假日数据', 'maxm-btn-ghost', () => { setFlash('正在刷新节假日数据…'); loadHolidays() }),
      ),
    )
  }

  function ReportPage() {
    const [now, setNow] = React.useState(Date.now())
    const [view, setView] = React.useState('calendar')
    const [ym, setYm] = React.useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() } })
    const [sel, setSel] = React.useState(() => dateKey(Date.now()))
    const [rflash, setRflash] = React.useState('')
    const [previewUrl, setPreviewUrl] = React.useState(null)
    React.useEffect(() => {
      setNow(Date.now())
      const t = setInterval(() => setNow(Date.now()), 15000)
      return () => clearInterval(t)
    }, [])

    const todayKey = dateKey(Date.now())
    const WEEK = ['一', '二', '三', '四', '五', '六', '日']

    function fmtShort(ms) {
      if (ms <= 0) return ''
      const m = Math.round(ms / 60000)
      if (m < 60) return m + 'm'
      return Math.floor(m / 60) + 'h' + String(m % 60).padStart(2, '0')
    }

    const tb = HIST[todayKey] || { sitMs: 0, breaks: 0, reminders: 0, maxStretch: 0 }
    // The stretch that is still open right now counts toward "longest
    // continuous" too, marked as in-progress. Clamp to the sitting anchor so
    // it can never exceed the accumulated sitting time.
    const openStretchMs = S.mode === 'sitting' ? Date.now() - Math.max(S.stretchStart, S.sitAnchor) : 0
    const openIsMax = openStretchMs >= 60000 && openStretchMs >= (tb.maxStretch || 0)
    const tbStretch = Math.max(tb.maxStretch || 0, openStretchMs)
    const tbSit = daySitMs(tb) + openStretchMs
    let max30Stretch = openStretchMs
    for (let i = 0; i < 30; i++) {
      const b = HIST[dateKey(Date.now() - i * 86400000)]
      if (b && typeof b.maxStretch === 'number' && b.maxStretch > max30Stretch) max30Stretch = b.maxStretch
    }

    function agg(days) {
      let sit = 0, br = 0, re = 0, cy = 0, nDays = 0
      for (let i = 0; i < days; i++) {
        const b = HIST[dateKey(Date.now() - i * 86400000)]
        const sitV = daySitMs(b) + (i === 0 ? openStretchMs : 0)
        if (sitV > 0) nDays++
        if (b) { sit += sitV; br += b.breaks; re += b.reminders; cy += b.cycles }
      }
      return { sit, br, re, cy, nDays }
    }
    const w7 = agg(7)
    const w30 = agg(30)

    // ---- calendar cells ----
    const first = new Date(ym.y, ym.m, 1)
    const lead = (first.getDay() + 6) % 7
    const dim = new Date(ym.y, ym.m + 1, 0).getDate()
    const cells = []
    for (let i = 0; i < lead; i++) cells.push(null)
    for (let d = 1; d <= dim; d++) cells.push({ d })
    const LEVEL_BG = ['', 'rgba(46,206,113,.10)', 'rgba(251,191,36,.16)', 'rgba(245,158,11,.26)', 'rgba(220,68,68,.32)']

    const cellEl = (c) => {
      const key = dateKey(new Date(ym.y, ym.m, c.d).getTime())
      const b = HIST[key] || { sitMs: 0, breaks: 0, cycles: 0, reminders: 0 }
      const future = key > todayKey
      const sit = daySitMs(b) + (key === todayKey ? openStretchMs : 0)
      const level = sit <= 0 ? 0 : sit < 7200000 ? 1 : sit < 14400000 ? 2 : sit < 21600000 ? 3 : 4
      const cls = 'maxm-cal-cell' + (key === todayKey ? ' maxm-cal-today' : '') + (key === sel ? ' maxm-cal-sel' : '') + (future ? ' maxm-cal-future' : '')
      const dow = new Date(ym.y, ym.m, c.d).getDay()
      const h = HOLIDAYS[key]
      const weekend = dow === 0 || dow === 6
      const dayCls = 'maxm-cal-day' + (weekend && !(h && !h.holiday) ? ' maxm-cal-day-we' : '') + (h && h.holiday ? ' maxm-cal-day-ho' : '')
      const title = h ? (h.holiday ? (h.name || '节假日') : '调休上班') : (weekend ? '周末' : undefined)
      return React.createElement('div', {
        className: cls, key, style: { background: LEVEL_BG[level] },
        title,
        onClick: () => { if (!future) setSel(key) },
      },
        React.createElement('div', { className: dayCls }, c.d,
          h ? React.createElement('span', { className: 'maxm-cal-tag' }, h.holiday ? '假' : '班') : null),
        sit > 0 ? React.createElement('div', { className: 'maxm-cal-time' }, fmtShort(sit)) : null,
        (b.breaks > 0 || b.reminders > 0) ? React.createElement('div', { className: 'maxm-cal-sub' },
          (b.breaks > 0 ? '休' + b.breaks : '') + (b.reminders > 0 ? (b.breaks > 0 ? ' · ' : '') + '提' + b.reminders : '')) : null,
      )
    }

    // ---- selected day detail ----
    const sd = new Date(Number(sel.slice(0, 4)), Number(sel.slice(5, 7)) - 1, Number(sel.slice(8, 10)))
    const sb = HIST[sel] || { sitMs: 0, breaks: 0, cycles: 0, reminders: 0 }
    const selTitle = (sd.getMonth() + 1) + '月' + sd.getDate() + '日 · 周' + WEEK[(sd.getDay() + 6) % 7] + (sel === todayKey ? '（今天）' : '')
    const selEmpty = (sel === todayKey ? tbSit : daySitMs(sb)) <= 0 && sb.breaks <= 0 && sb.reminders <= 0

    const clear = () => {
      for (const k in HIST) delete HIST[k]
      persistHist()
      logEvent('clear', '清除了历史数据')
      setNow(Date.now())
    }

    const nav = (delta) => {
      let y = ym.y
      let m = ym.m + delta
      if (m < 0) { m = 11; y -= 1 }
      if (m > 11) { m = 0; y += 1 }
      setYm({ y, m })
    }

    // ---- stats view data ----
    let bestKey = null, bestMs = 0, mildKey = null, mildMs = Infinity, recDays = 0
    for (const k in HIST) {
      const b = HIST[k]
      if (!b) continue
      const v = daySitMs(b) + (k === todayKey ? openStretchMs : 0)
      if (v > 0) recDays++
      if (v > bestMs) { bestMs = v; bestKey = k }
      if (v > 0 && v < mildMs) { mildMs = v; mildKey = k }
    }
    const dayLabel = (k) => {
      const d = new Date(Number(k.slice(0, 4)), Number(k.slice(5, 7)) - 1, Number(k.slice(8, 10)))
      return (d.getMonth() + 1) + '/' + d.getDate()
    }
    const conv = w30.re > 0 ? Math.round(100 * w30.br / w30.re) + '%' : '—'

    const bars = []
    for (let i = 0; i < 7; i++) {
      const t = new Date(Date.now() - i * 86400000)
      const k = dateKey(t.getTime())
      const b = HIST[k] || { sitMs: 0, breaks: 0 }
      bars.push({ k, label: i === 0 ? '今天' : (t.getMonth() + 1) + '/' + t.getDate(), sitMs: daySitMs(b) + (i === 0 ? openStretchMs : 0), breaks: b.breaks })
    }
    const barMax = Math.max(1, ...bars.map((b) => b.sitMs))

    const vtab = React.createElement('div', { className: 'maxm-vtab' },
      React.createElement('button', { className: view === 'calendar' ? 'maxm-vtab-on' : '', onClick: () => setView('calendar') }, '📅 日历'),
      React.createElement('button', { className: view === 'stats' ? 'maxm-vtab-on' : '', onClick: () => setView('stats') }, '📊 统计'),
    )

    const dayEvents = EVENTS.filter((e) => e && typeof e.t === 'number' && dateKey(e.t) === sel)
    const dayEventsBlock = dayEvents.length > 0 ? React.createElement('div', { className: 'maxm-evs' },
      React.createElement('div', { className: 'maxm-page-sub' }, '当日事件时间线'),
      dayEvents.map((e) => {
        const d = new Date(e.t)
        return React.createElement('div', { className: 'maxm-evrow', key: e.t + '-' + e.type },
          React.createElement('span', { className: 'maxm-evtime' }, String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')),
          React.createElement('span', { className: 'maxm-evnote' }, e.note),
        )
      }),
    ) : null

    const calView = React.createElement(React.Fragment, null,
      React.createElement('div', { className: 'maxm-cal-head' },
        React.createElement('button', { className: 'maxm-cal-nav', onClick: () => nav(-1) }, '‹'),
        React.createElement('div', { className: 'maxm-cal-title' }, ym.y + ' 年 ' + (ym.m + 1) + ' 月'),
        React.createElement('button', { className: 'maxm-cal-nav', onClick: () => nav(1) }, '›'),
        React.createElement('button', {
          className: 'maxm-cal-todaybtn',
          onClick: () => { const d = new Date(); setYm({ y: d.getFullYear(), m: d.getMonth() }); setSel(todayKey) },
        }, '回今天'),
      ),
      React.createElement('div', { className: 'maxm-cal-grid' },
        WEEK.map((w) => React.createElement('div', { className: 'maxm-cal-dow', key: 'w' + w }, w)),
        cells.map((c, i) => c === null ? React.createElement('div', { className: 'maxm-cal-cell maxm-cal-empty', key: 'pad' + i }) : cellEl(c)),
      ),
      React.createElement('div', { className: 'maxm-cal-detail' },
        React.createElement('div', { style: { fontSize: 12, fontWeight: 600, color: 'var(--dsw-alias-label-primary,#eee)', marginBottom: 6 } }, '📋 ' + selTitle),
        selEmpty
          ? React.createElement('div', { className: 'maxm-page-sub' }, '这一天没有在座记录——说明你坐得不多，或者插件当时没开 🙂')
          : React.createElement('div', { className: 'maxm-today' },
              React.createElement('span', null, '🪑 累计在座 ' + fmtHm(sel === todayKey ? tbSit : daySitMs(sb))),
              React.createElement('span', null, '📏 最长连续 ' + fmtHm(sel === todayKey ? tbStretch : (sb.maxStretch || 0)) + (sel === todayKey && openIsMax ? '（进行中）' : '')),
              React.createElement('span', null, '⏰ 提醒 ' + sb.reminders + ' 次'),
              React.createElement('span', null, '✅ 休息 ' + sb.breaks + ' 次'),
              React.createElement('span', null, '🔄 轮次 ' + sb.cycles),
            ),
        dayEventsBlock,
      ),
    )

    const renderPreview = () => {
      try {
        const W = 720
        const H = 950
        const c = document.createElement('canvas')
        c.width = W * 3
        c.height = H * 3
        const x = c.getContext('2d')
        if (x === null) throw new Error('canvas 2d unavailable')
        x.scale(3, 3)
        x.fillStyle = '#14161b'
        x.fillRect(0, 0, W, H)
        x.fillStyle = '#1b1e26'
        x.fillRect(0, 0, W, 110)
        x.fillStyle = '#fbbf24'
        x.fillRect(0, 110, W, 4)
        const d0 = new Date()
        x.fillStyle = '#f2f3f7'
        x.font = '700 26px system-ui, "Segoe UI", "Microsoft YaHei", sans-serif'
        x.fillText('MAX 久坐沙漏 · 每日报告', 32, 56)
        x.fillStyle = '#9aa0ab'
        x.font = '14px system-ui, "Segoe UI", "Microsoft YaHei", sans-serif'
        x.fillText(d0.getFullYear() + ' 年 ' + (d0.getMonth() + 1) + ' 月 ' + d0.getDate() + ' 日  ' + String(d0.getHours()).padStart(2, '0') + ':' + String(d0.getMinutes()).padStart(2, '0') + ' 生成', 32, 86)
        let y = 152
        const section = (title) => {
          x.fillStyle = '#fbbf24'
          x.font = '700 17px system-ui, "Segoe UI", "Microsoft YaHei", sans-serif'
          x.fillText(title, 32, y)
          y += 26
        }
        const row = (label, value) => {
          x.fillStyle = '#aeb4bf'
          x.font = '14px system-ui, "Segoe UI", "Microsoft YaHei", sans-serif'
          x.fillText(label, 32, y)
          x.fillStyle = '#f2f3f7'
          x.font = '700 15px system-ui, "Segoe UI", "Microsoft YaHei", sans-serif'
          x.textAlign = 'right'
          x.fillText(value, W - 32, y)
          x.textAlign = 'left'
          y += 30
        }
        section('今日概览')
        row('累计在座（当天总时长，多段累加）', fmtHm(tbSit))
        row('最长连续在座（单次不离开）', fmtHm(tbStretch) + (openIsMax ? '（进行中）' : ''))
        row('提醒 / 完成休息', tb.reminders + ' 次 / ' + tb.breaks + ' 次')
        y += 12
        section('近 7 天每日累计在座')
        for (let i = 0; i < bars.length; i++) {
          const b = bars[i]
          x.fillStyle = '#aeb4bf'
          x.font = '12px system-ui, "Segoe UI", "Microsoft YaHei", sans-serif'
          x.fillText(b.label, 32, y + 11)
          x.fillStyle = '#232833'
          x.fillRect(120, y, W - 320, 16)
          const w = b.sitMs > 0 ? Math.max(4, (W - 320) * (b.sitMs / barMax)) : 0
          const g = x.createLinearGradient(120, 0, 120 + (W - 320), 0)
          g.addColorStop(0, '#fbbf24')
          g.addColorStop(1, '#b45309')
          x.fillStyle = g
          x.fillRect(120, y, w, 16)
          x.fillStyle = '#f2f3f7'
          x.font = '700 12px system-ui, "Segoe UI", "Microsoft YaHei", sans-serif'
          x.textAlign = 'right'
          x.fillText(fmtHm(b.sitMs), W - 32, y + 12)
          x.textAlign = 'left'
          y += 30
        }
        y += 12
        section('近 30 天汇总')
        row('累计在座', fmtHm(w30.sit))
        row('日均在座（' + w30.nDays + ' 天有记录）', w30.nDays > 0 ? fmtHm(w30.sit / w30.nDays) : '—')
        row('最长连续在座', fmtHm(max30Stretch) + (openIsMax ? '（进行中）' : ''))
        row('完成休息 / 提醒', w30.br + ' 次 / ' + w30.re + ' 次')
        y += 14
        x.fillStyle = '#636a76'
        x.font = '12px system-ui, "Segoe UI", "Microsoft YaHei", sans-serif'
        x.fillText('由 dsh-sitmax 插件生成 · 数据来源：本机浏览器（localStorage）', 32, y)
        const url = c.toDataURL('image/png')
        setPreviewUrl(url)
      } catch (e) {
        setRflash('⚠ 预览失败：' + String(e && e.message ? e.message : e))
      }
    }

    const card = (k, v) => React.createElement('div', { className: 'maxm-card' },
      React.createElement('div', { className: 'maxm-card-v' }, v),
      React.createElement('div', { className: 'maxm-card-k' }, k),
    )

    const statsView = React.createElement(React.Fragment, null,
      React.createElement('div', { className: 'maxm-page-sub' }, '「累计在座」是当天坐在电脑前的总时长（多段累加），不是连续坐着的时长；「最长连续」才是单次不离开的最长时长。'),
      React.createElement('div', { className: 'maxm-cards' },
        card('今日累计在座', fmtHm(tbSit)),
        card('今日最长连续在座', fmtHm(tbStretch) + (openIsMax ? ' · 进行中' : '')),
        card('近 7 天累计在座', fmtHm(w7.sit)),
        card('近 30 天累计在座', fmtHm(w30.sit)),
        card('近 30 天日均在座（' + w30.nDays + ' 天有记录）', w30.nDays > 0 ? fmtHm(w30.sit / w30.nDays) : '—'),
        card('近 30 天最长连续在座', fmtHm(max30Stretch) + (openIsMax ? ' · 进行中' : '')),
        card('近 30 天完成休息', w30.br + ' 次'),
        card('近 30 天提醒', w30.re + ' 次'),
        card('提醒 → 休息转化率', conv),
      ),
      bestKey !== null ? React.createElement('div', { className: 'maxm-page-sub' }, '🏆 单日累计最多：' + dayLabel(bestKey) + ' · ' + fmtHm(bestMs)) : null,
      mildKey !== null ? React.createElement('div', { className: 'maxm-page-sub' }, '🌿 单日累计最少：' + dayLabel(mildKey) + ' · ' + fmtHm(mildMs)) : null,
      React.createElement('div', { className: 'maxm-page-sub' }, '共 ' + recDays + ' 天有记录'),
      React.createElement('div', { className: 'maxm-page-title', style: { fontSize: 14, marginTop: 6 } }, '近 7 天每日累计在座'),
      bars.map((b) => React.createElement('div', { className: 'maxm-bar-row', key: b.k },
        React.createElement('span', { className: 'maxm-bar-lab' }, b.label),
        React.createElement('div', { className: 'maxm-bar-track' },
          React.createElement('div', { className: 'maxm-bar-fill', style: { width: (100 * b.sitMs / barMax).toFixed(1) + '%' } }),
        ),
        React.createElement('span', { className: 'maxm-bar-val' }, fmtHm(b.sitMs) + ' · 休' + b.breaks),
      )),
      rflash ? React.createElement('div', { className: 'maxm-set-flash' }, rflash) : null,
      React.createElement('div', { className: 'maxm-set-actions' },
        React.createElement('button', { className: 'maxm-btn maxm-btn-primary', onClick: renderPreview }, '🖼 预览报告图片'),
        React.createElement('button', { className: 'maxm-btn maxm-btn-ghost', onClick: clear }, '🗑 清除历史数据'),
      ),
    )

    return React.createElement('div', { className: 'maxm-page' },
      React.createElement('div', { className: 'maxm-title-row' },
        React.createElement('div', { className: 'maxm-page-title' }, '久坐沙漏 · 每日报告'),
        React.createElement(HeaderIcons, { key: 'icons' }),
      ),
      React.createElement('div', { className: 'maxm-page-sub' }, '数据保存在本浏览器，跨会话累计；按自然日归档'),
      vtab,
      view === 'calendar' ? calView : statsView,
      previewUrl !== null ? React.createElement('div', { className: 'maxm-pv-backdrop', onClick: () => setPreviewUrl(null) },
        React.createElement('div', { className: 'maxm-pv-box', onClick: (e) => e.stopPropagation() },
          React.createElement('img', { className: 'maxm-pv-img', src: previewUrl, alt: '久坐报告预览' }),
          React.createElement('button', { type: 'button', className: 'maxm-pv-close', 'aria-label': '关闭预览', onClick: () => setPreviewUrl(null) }, '✕'),
        ),
      ) : null,
    )
  }

  ctx.slots.inject('shell.overlay', () => ctx.slots.register(
    { name: 'shell.overlay', id: 'dsh-sitmax-hud', order: 0, label: 'MAX 久坐监督沙漏' },
    () => React.createElement(MAXWidget),
  ))
  ctx.slots.inject('settings.section', () => ctx.slots.register(
    { name: 'settings.section', id: 'dsh-sitmax-settings', order: 12, label: '久坐沙漏 · 设置' },
    () => React.createElement(SettingsPage),
  ))
  ctx.slots.inject('settings.section', () => ctx.slots.register(
    { name: 'settings.section', id: 'dsh-sitmax-report', order: 13, label: '久坐沙漏 · 报告' },
    () => React.createElement(ReportPage),
  ))
}

		return module.exports;
	}
});
