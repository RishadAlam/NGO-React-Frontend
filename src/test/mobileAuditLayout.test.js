import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { createHash } from 'node:crypto'
import { compileString } from 'sass'
import { describe, expect, it } from 'vitest'

const require = createRequire(import.meta.url)
const postcss = createRequire(require.resolve('vite'))('postcss')
const css = postcss.parse(
  compileString(readFileSync('src/scss/_mobile.scss', 'utf8'), {
    loadPaths: ['src/scss'],
    silenceDeprecations: ['import', 'global-builtin']
  }).css
)

// Compiled phone declarations, not a geometry simulator. Chrome owns cascade/visual QA.
function styles(markup, selector) {
  const root = document.createElement('div')
  root.className = 'mobile-page-grid'
  root.innerHTML = markup
  const element = root.querySelector(selector)
  const result = {}
  css.walkRules((rule) => {
    let parent = rule.parent
    while (parent) {
      if (parent.type === 'atrule' && parent.name === 'media') {
        const max = parent.params.match(/max-width:\s*([\d.]+)px/)
        if (max && Number(max[1]) < 390) return
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

describe('Chrome audit phone layout contracts', () => {
  it('keeps page uploads compact without cropping artwork', () => {
    const markup =
      '<div class="image-preview"><div class="image-preview__media"><img /></div></div>'
    expect(parseFloat(styles(markup, '.image-preview__media')['max-width'])).toBeLessThanOrEqual(
      120
    )
    expect(styles(markup, 'img')['object-fit']).toBe('contain')
  })
  it('constrains only the static signature preview', () => {
    expect(styles('<img class="signature-field__preview" />', 'img')['max-height']).toBe('100px')
    expect(styles('<canvas class="signatureCanvas" />', 'canvas')['max-height']).toBeUndefined()
  })
  it('gives a complete date range a full filter row', () => {
    expect(
      styles(
        '<div class="row"><div class="col-xxl-2"><div class="rs-picker-daterange"></div></div></div>',
        '.col-xxl-2'
      )['grid-column'].replace(/\s/g, '')
    ).toBe('1/-1')
  })
  it('allows readable standard labels to wrap in document flow', () => {
    const label = styles(
      '<div class="MuiFormControl-root"><label class="MuiInputLabel-root MuiInputLabel-standard MuiInputLabel-shrink">দীর্ঘ লেবেল</label></div>',
      'label'
    )
    expect(label['font-size']).toBe('14px')
    expect(label.position).toBe('static')
    expect(label.transform).toBe('none')
    expect(label['white-space']).toBe('normal')
  })
  it('keeps permission identity beside its compact avatar', () => {
    const markup =
      '<section class="staff-permissions"><div class="staff-permissions-context-card__identity"><div class="staff-permissions-context-card__avatar-shell"></div></div></section>'
    expect(
      styles(markup, '.staff-permissions-context-card__identity')['grid-template-columns']
    ).toBe('56px minmax(0, 1fr)')
    expect(styles(markup, '.staff-permissions-context-card__avatar-shell').height).toBe('56px')
  })
  it('never ellipsizes dashboard money', () => {
    const value = styles(
      '<div class="dashboard"><div class="cardBox"><div class="cardBox__amount"><span class="amount">123456789012345</span></div></div></div>',
      '.amount'
    )
    expect(value.overflow).toBe('visible')
    expect(value['overflow-wrap']).toBe('anywhere')
    expect(value['white-space']).toBe('normal')
    expect(value['font-variant-numeric']).toBe('tabular-nums')
  })
  it('removes header padding without shrinking the 44px controls', () => {
    const markup =
      '<div class="react-table-card"><div class="react-table-header"><div class="react-table-header-content"></div></div></div>'
    expect(styles(markup, '.react-table-header').padding).toBe('4px 12px')
    expect(styles(markup, '.react-table-header-content')['min-height']).toBe('44px')
  })
  it('keeps the collection approval switch input invisible over its full hitbox', () => {
    const input = styles(
      '<div class="collection-sheet"><table><thead><tr><th class="collection-sheet-bulk-approval"><span class="MuiSwitch-root"><input class="MuiSwitch-input" type="checkbox" /></span></th></tr></thead></table></div>',
      'input'
    )
    expect(input.opacity).toBe('0')
    expect(input['pointer-events']).not.toBe('none')
    expect(input.display).not.toBe('none')
  })
  it('keeps every compiled tablet/desktop rule byte-identical to the pre-repair baseline', () => {
    const wider = css.clone()
    wider.walkAtRules('media', (rule) => {
      const max = rule.params.match(/max-width:\s*([\d.]+)px/)
      if (max && Number(max[1]) < 768) rule.remove()
    })
    expect(createHash('sha256').update(wider.toString()).digest('hex')).toBe(
      '5a22dd69065838e2bf15fa16c2680c42a44c86d3146427a25f76031c28a409c1'
    )
  })
})
