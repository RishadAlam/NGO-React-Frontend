import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { compileString } from 'sass'
import { describe, expect, it } from 'vitest'

const require = createRequire(import.meta.url)
const postcss = createRequire(require.resolve('vite'))('postcss')
const css = postcss.parse(
  compileString(readFileSync('src/scss/_mobile.scss', 'utf8'), {
    loadPaths: ['src/scss'],
    silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin']
  }).css
)

// Check the compiled selectors against the actual nesting variants used by ModalPro.
// Geometry and the complete cascade are additionally checked in the live browser.
function declarations(element, width = 390) {
  const result = {}
  css.walkRules((rule) => {
    let parent = rule.parent
    while (parent) {
      if (parent.type === 'atrule' && parent.name === 'media') {
        const max = parent.params.match(/max-width:\s*([\d.]+)px/)
        if (max && width > Number(max[1])) return
      }
      parent = parent.parent
    }
    try {
      if (!element.matches(rule.selector)) return
    } catch {
      return
    }
    rule.walkDecls((decl) => {
      result[decl.prop] = decl.value
    })
  })
  return result
}

function fixture(kind) {
  const parts =
    '<header class="card-header">Title</header><section class="card-body">Fields<div class="card"><div class="card-body" data-nested>Permissions</div></div></section><footer class="card-footer">Save</footer>'
  const markup =
    kind === 'form-card'
      ? `<form><div class="card">${parts}</div></form>`
      : kind === 'card-form'
        ? `<div class="card"><form>${parts}</form></div>`
        : `<div class="card">${parts}</div>`
  const root = document.createElement('div')
  root.className = 'MuiModal-root'
  root.innerHTML = `<div class="mobile-app-dialog">${markup}</div>`
  return root
}

describe('shared phone modal layout', () => {
  it.each(['form-card', 'card-form', 'card'])('gives %s one flexible body scroller', (kind) => {
    const root = fixture(kind)
    const shell = declarations(root.firstChild)
    const body = declarations(root.querySelector('.card-body'))
    expect(shell.display).toBe('flex')
    expect(shell['overflow-y']).toBe('hidden')
    expect(body['min-height']).toBe('0')
    expect(body['max-height']).toBe('none')
    expect(body['overflow-y']).toBe('auto')
    expect(declarations(root.querySelector('.card-header'))['flex-shrink']).toBe('0')
    expect(declarations(root.querySelector('.card-footer'))['flex-shrink']).toBe('0')
  })

  it('does not turn nested permission content into another scroller', () => {
    const root = fixture('card')
    expect(declarations(root.querySelector('[data-nested]'))['overflow-y']).toBe('visible')
    expect(declarations(root.querySelector('[data-nested]'))['max-height']).toBe('none')
  })

  it('does not impose phone layout rules on tablet or desktop', () => {
    const root = fixture('form-card')
    for (const width of [768, 1024, 1440]) {
      expect(declarations(root.firstChild, width)).toEqual({})
      expect(declarations(root.querySelector('.card-body'), width)).toEqual({})
    }
  })

  it('lets uploaded image previews fit a narrow form', () => {
    const root = fixture('form-card')
    root.querySelector('.card-body').innerHTML =
      '<div class="image-preview"><div class="image-preview__media"><img /></div></div>'
    expect(declarations(root.querySelector('.image-preview'))['max-width']).toBe('100%')
    expect(declarations(root.querySelector('.image-preview__media')).width).toBe('100%')
  })

  it('lets the signature drawing area shrink on short screens', () => {
    const root = fixture('card')
    root.querySelector('.card').classList.add('signature-pad-card')
    const body = root.querySelector('.card-body')
    body.innerHTML = '<canvas class="signatureCanvas"></canvas>'
    expect(declarations(body)['min-height']).toBe('0')
    expect(declarations(body.firstChild)['min-height']).toBe('0')
  })
})
