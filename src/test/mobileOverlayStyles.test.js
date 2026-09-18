import { compile } from 'sass'
import { createRequire } from 'node:module'
import { describe, expect, it } from 'vitest'

const require = createRequire(import.meta.url)
const postcss = createRequire(require.resolve('vite'))('postcss')
const css = postcss.parse(compile('src/scss/_mobile-overlays.scss').css)

function elementDeclarations(element, width) {
  const declarations = {}
  css.walkRules((rule) => {
    const query = rule.parent.params?.match(/max-width:\s*([\d.]+)px/)
    if (query && width > Number(query[1])) return
    if (element.matches(rule.selector)) {
      rule.walkDecls((declaration) => {
        declarations[declaration.prop] = declaration.value
      })
    }
  })
  return declarations
}

function popupDeclarations(width) {
  const popup = document.createElement('div')
  popup.className = 'rs-picker-popup rs-picker-popup-daterange'
  return elementDeclarations(popup, width)
}

describe('date range popup bounds', () => {
  it('anchors to the phone viewport instead of the trigger below the available space', () => {
    const style = popupDeclarations(320)
    expect(style.position).toBe('fixed')
    expect(style.top).toBe('auto')
    expect(style.bottom).toBe('max(8px, env(safe-area-inset-bottom))')
    expect(style['max-height']).toBe('calc(100dvh - 24px)')
    expect(style.overflow).toBe('auto')
    expect(Number(style['z-index'])).toBeGreaterThan(1300)
  })

  it('does not reposition the popup on tablets or desktop', () => {
    expect(popupDeclarations(768)).toEqual({})
    expect(popupDeclarations(1440)).toEqual({})
  })
})

describe('short-screen MUI calendar', () => {
  it('keeps the actual action bar outside a flexible scrolling calendar body', () => {
    const paper = document.createElement('div')
    paper.className = 'MuiDialog-paper'
    paper.innerHTML = `<div class="MuiPickersLayout-root">
      <div class="MuiPickersLayout-toolbar">Choose a date</div>
      <div class="MuiPickersLayout-contentWrapper"><div class="MuiDateCalendar-root">Calendar</div></div>
      <div class="MuiDialogActions-root MuiPickersLayout-actionBar"><button>OK</button></div>
    </div>`
    const layout = elementDeclarations(paper.firstChild, 667)
    const body = elementDeclarations(paper.querySelector('.MuiPickersLayout-contentWrapper'), 667)
    const footer = elementDeclarations(paper.querySelector('.MuiPickersLayout-actionBar'), 667)
    expect(layout.display).toBe('flex')
    expect(layout['max-height']).toBe('calc(100dvh - 24px)')
    expect(body['min-height']).toBe('0')
    expect(body['overflow-y']).toBe('auto')
    expect(
      elementDeclarations(paper.querySelector('.MuiDateCalendar-root'), 667)['flex-shrink']
    ).toBe('0')
    expect(footer['flex-shrink']).toBe('0')
    expect(elementDeclarations(paper.querySelector('button'), 667)['min-height']).toBe('44px')
  })
})
