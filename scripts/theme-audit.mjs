#!/usr/bin/env node
// Re-checks the slate theme in a running build, the way it was measured for
// the theme port. Run it after a Nextra upgrade or any colour change:
//
//   pnpm build && pnpm start          (in one terminal)
//   pnpm theme-audit [base-url]       (in another; default http://localhost:3000)
//
// The first run on a new machine needs a browser: pnpm exec playwright install chromium
//
// Every page linked from the sidebar is loaded at 1280px and 390px with the
// browser set to light, plus the search dialog and the mobile menu. It fails if:
//   - the page is not dark, or a theme switch is showing
//   - any visible element computes a neutral grey (r = g = b, within 3)
//   - any text is below 4.5:1 (3:1 for large text), including under the glow
//   - any keyboard focus ring is below 3:1 against what surrounds it
// Exit code 0 means everything passed.

import { chromium } from 'playwright'

const BASE = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '')
const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 390, height: 844 }
]
// The two fixed glows from app/globals.css, used for the worst-case check.
const GLOWS = [
  [59, 130, 246, 0.14],
  [16, 185, 129, 0.12]
]

// Runs inside the page. Returns grey hits and contrast failures.
function scan(glows) {
  const cv = document.createElement('canvas')
  cv.width = cv.height = 1
  const ctx = cv.getContext('2d', { willReadFrequently: true })
  const norm = s => {
    ctx.clearRect(0, 0, 1, 1)
    ctx.fillStyle = '#010203'
    ctx.fillStyle = s
    ctx.fillRect(0, 0, 1, 1)
    const d = ctx.getImageData(0, 0, 1, 1).data
    return [d[0], d[1], d[2], d[3] / 255]
  }
  const COLOR = /(rgba?|oklch|oklab|lab|lch|hsla?|color)\([^()]*\)|#[0-9a-f]{3,8}\b/gi
  const hex = c => '#' + c.slice(0, 3).map(v => v.toString(16).padStart(2, '0')).join('')
  const over = (fg, bg) => [0, 1, 2].map(i => Math.round(fg[i] * fg[3] + bg[i] * (1 - fg[3]))).concat(1)
  const lum = c => {
    const f = v => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2])
  }
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m)
    return (x + 0.05) / (y + 0.05)
  }
  const pageBg = norm(getComputedStyle(document.body).backgroundColor)
  // Composites every translucent background up to the first opaque one.
  const effBg = el => {
    const stack = []
    let e = el
    // Stop at <body>: its colour and the glow painted on it are the page.
    while (e && e !== document.body && e !== document.documentElement) {
      const c = norm(getComputedStyle(e).backgroundColor)
      if (c[3] > 0) {
        stack.push(c)
        if (c[3] >= 0.99) break
      }
      e = e.parentElement
    }
    const onPage = !e || e === document.body || e === document.documentElement
    let bg = !onPage ? stack.pop() : pageBg
    while (stack.length) bg = over(stack.pop(), bg)
    return { bg, onPage }
  }
  const visible = el => {
    const r = el.getBoundingClientRect()
    if (!r.width || !r.height) return false
    for (let e = el; e; e = e.parentElement) {
      const cs = getComputedStyle(e)
      if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) === 0) return false
    }
    return true
  }
  const name = el => {
    const cls = (el.getAttribute('class') || '').split(/\s+/).filter(Boolean).slice(0, 2).join('.')
    const text = (el.textContent || '').trim().slice(0, 30)
    return `${el.tagName.toLowerCase()}${cls ? '.' + cls : ''}${text ? ` "${text}"` : ''}`
  }

  const greys = new Set()
  const contrast = new Set()
  const grey = (el, prop, value) => {
    for (const m of value.match(COLOR) || []) {
      let c = norm(m)
      if (c[3] <= 0.01) continue
      if (c[3] < 0.99) c = over(c, effBg(el).bg)
      if (Math.max(c[0], c[1], c[2]) - Math.min(c[0], c[1], c[2]) <= 3) greys.add(`${prop} ${hex(c)} on ${name(el)}`)
    }
  }
  for (const el of document.querySelectorAll('body *')) {
    if (!visible(el)) continue
    const cs = getComputedStyle(el)
    const ownText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())
    if (ownText) grey(el, 'color', cs.color)
    grey(el, 'background-color', cs.backgroundColor)
    if (cs.backgroundImage !== 'none') grey(el, 'background-image', cs.backgroundImage)
    for (const side of ['Top', 'Right', 'Bottom', 'Left']) {
      if (parseFloat(cs[`border${side}Width`]) > 0 && cs[`border${side}Style`] !== 'none') grey(el, 'border', cs[`border${side}Color`])
    }
    if (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) grey(el, 'outline', cs.outlineColor)
    if (cs.boxShadow !== 'none') grey(el, 'box-shadow', cs.boxShadow)
    // Shapes drawn by stroke (icon lines) inherit a fill they never paint.
    if (el instanceof SVGGeometryElement && cs.stroke === 'none' && cs.fill !== 'none') grey(el, 'fill', cs.fill)
    if (el instanceof SVGGeometryElement && cs.stroke !== 'none') grey(el, 'stroke', cs.stroke)

    if (!ownText) continue
    const fg = norm(cs.color)
    const { bg, onPage } = effBg(el)
    const backs = onPage ? [bg, ...glows.map(g => over(g, bg))] : [bg]
    const size = parseFloat(cs.fontSize)
    const large = size >= 24 || (size >= 18.66 && parseInt(cs.fontWeight) >= 700)
    const need = large ? 3 : 4.5
    for (const b of backs) {
      const r = ratio(fg[3] < 1 ? over(fg, b) : fg, b)
      if (r < need) contrast.add(`${hex(fg)} on ${hex(b)} = ${r.toFixed(2)}:1 (needs ${need}) on ${name(el)}`)
    }
  }
  return { greys: [...greys], contrast: [...contrast] }
}

// Runs inside the page on the focused element. Returns ring colours and ratios.
async function focusRing(glows) {
  const el = document.activeElement
  if (!el || el === document.body) return null
  // Some controls fade their ring in; measure once the transition has ended.
  await Promise.all(el.getAnimations().map(a => a.finished.catch(() => {})))
  const cv = document.createElement('canvas')
  cv.width = cv.height = 1
  const ctx = cv.getContext('2d')
  const norm = s => {
    ctx.clearRect(0, 0, 1, 1)
    ctx.fillStyle = s
    ctx.fillRect(0, 0, 1, 1)
    const d = ctx.getImageData(0, 0, 1, 1).data
    return [d[0], d[1], d[2], d[3] / 255]
  }
  const over = (fg, bg) => [0, 1, 2].map(i => Math.round(fg[i] * fg[3] + bg[i] * (1 - fg[3]))).concat(1)
  const lum = c => {
    const f = v => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2])
  }
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m)
    return (x + 0.05) / (y + 0.05)
  }
  let bg = norm(getComputedStyle(document.body).backgroundColor)
  let onPage = true
  const stack = []
  for (let e = el.parentElement; e && e !== document.body && e !== document.documentElement; e = e.parentElement) {
    const c = norm(getComputedStyle(e).backgroundColor)
    if (c[3] > 0) {
      stack.push(c)
      if (c[3] >= 0.99) {
        onPage = false
        break
      }
    }
  }
  if (!onPage) bg = stack.pop()
  while (stack.length) bg = over(stack.pop(), bg)
  const backs = onPage ? [bg, ...glows.map(g => over(g, bg))] : [bg]
  const cs = getComputedStyle(el)
  const colors = []
  if (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) colors.push(cs.outlineColor)
  for (const m of cs.boxShadow.match(/(rgba?|oklch|oklab|lab|color)\([^()]*\)/g) || []) colors.push(m)
  const rings = colors.map(norm).filter(c => c[3] > 0)
  // Every band of the ring (Nextra draws an offset band and an outer band) must pass.
  const worst = rings.length ? Math.min(...rings.map(c => Math.min(...backs.map(b => ratio(c[3] < 1 ? over(c, b) : c, b))))) : 0
  const label = (el.getAttribute('aria-label') || el.textContent || el.placeholder || el.tagName).trim().slice(0, 30)
  return { label: `${el.tagName.toLowerCase()} "${label}"`, worst }
}

const failures = []
const fail = (where, msg) => failures.push(`${where}: ${msg}`)

async function check(page, where) {
  const state = await page.evaluate(() => ({
    dark: document.documentElement.classList.contains('dark'),
    switches: [...document.querySelectorAll('button')].filter(b => /^(light|dark|system)$/i.test(b.textContent.trim())).length
  }))
  if (!state.dark) fail(where, 'page is not dark')
  if (state.switches) fail(where, `${state.switches} theme switch control(s) showing`)
  const { greys, contrast } = await page.evaluate(scan, GLOWS)
  greys.forEach(g => fail(where, `neutral grey: ${g}`))
  contrast.forEach(c => fail(where, `contrast: ${c}`))
}

const browser = await chromium.launch()
let pages = []
try {
  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({ viewport: vp, colorScheme: 'light' })
    const page = await context.newPage()
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
    if (!pages.length) {
      pages = await page.evaluate(() => [
        ...new Set(
          [...document.querySelectorAll('aside a[href^="/"]')].map(a => a.getAttribute('href').split('#')[0])
        )
      ])
      if (!pages.length) throw new Error(`No sidebar links found at ${BASE}/. Is the site running?`)
    }
    for (const path of pages) {
      await page.goto(BASE + path, { waitUntil: 'networkidle' })
      const where = `${vp.name} ${path}`
      await check(page, where)
      if (vp.name !== 'desktop') continue
      const seen = new Set()
      for (let i = 0; i < 60; i++) {
        await page.keyboard.press('Tab')
        const ring = await page.evaluate(focusRing, GLOWS)
        if (!ring || seen.has(ring.label)) continue
        seen.add(ring.label)
        if (ring.worst < 3) fail(where, `focus ring ${ring.worst.toFixed(2)}:1 (needs 3) on ${ring.label}`)
      }
    }
    await page.goto(`${BASE}${pages[0]}`, { waitUntil: 'networkidle' })
    if (vp.name === 'mobile') {
      await page.getByRole('button', { name: 'Menu' }).click()
      await page.waitForTimeout(400)
      await check(page, `${vp.name} menu open`)
    }
    const search = page.locator('input[type=search]:visible').first()
    await search.click()
    await search.fill('a')
    await page.waitForTimeout(1000)
    await check(page, `${vp.name} search open`)
    await context.close()
  }
} finally {
  await browser.close()
}

console.log(`Checked ${pages.length} pages at ${VIEWPORTS.map(v => v.width).join(' and ')}px, plus search and the mobile menu.`)
if (failures.length) {
  console.log(`\n${failures.length} problem(s):`)
  failures.forEach(f => console.log(`  ${f}`))
  process.exit(1)
}
console.log('All theme checks passed.')
