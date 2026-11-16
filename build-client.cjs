// Build the browser bundle for the dsh-sitmax client plugin in the exact
// lazy-CJS factory format the client module system serves (/plugins):
//   window.__ModuleLoader__.load({ id: "<pkg>", factory: (require) => { ...code...; return module.exports; } });
//
// src-client/index.js is a single-file plugin whose only import is the React
// baseline external, so the build is a deterministic transform (import/exports
// → CommonJS) plus the factory wrapper — no bundler spawn required.
// Run: node build-client.cjs
'use strict'
const fs = require('node:fs')
const path = require('node:path')

// The module-table bundle id MUST equal the npm package name (the client
// modules registry keys rows by package name), so read it from package.json —
// renaming or scoping the package needs no build script edit.
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'))
const id = typeof pkg.name === 'string' && pkg.name.length > 0 ? pkg.name : 'dsh-sitmax'
const source = fs.readFileSync(path.join(__dirname, 'src-client', 'index.js'), 'utf8')

let body = source
  .replace("import React from 'react'", "const React = require('react')")
  .replace(/export const name = 'dsh-sitmax-client'/, "exports.name = 'dsh-sitmax-client'")
  .replace(/export const inject = \['slots'\]/, "exports.inject = ['slots']")
  .replace(/export function apply\(ctx\) \{/, 'exports.apply = function apply(ctx) {')

for (const needle of ['import ', 'export ']) {
  if (body.includes(needle)) throw new Error('untransformed ESM syntax left in client source: ' + needle)
}

const banner = [
  'window.__ModuleLoader__.load({',
  '\tid: ' + JSON.stringify(id) + ',',
  '\tfactory: (require) => {',
  '\t\tvar module = { exports: {} };',
  '\t\tvar exports = module.exports;',
  '\t\tObject.defineProperty(exports, Symbol.toStringTag, { value: "Module" });',
].join('\n')
const footer = '\t\treturn module.exports;\n\t}\n});'

const out = banner + '\n' + body + '\n' + footer + '\n'
fs.mkdirSync(path.join(__dirname, 'lib'), { recursive: true })
fs.writeFileSync(path.join(__dirname, 'lib', 'client.js'), out, 'utf8')
console.log('built lib/client.js (' + out.length + ' bytes)')
