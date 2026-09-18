import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { compileString } from 'sass'
import SavingTable from '../components/collection/SavingCollectionTable'
import LoanTable from '../components/collection/LoanCollectionTable'
import { authDataState } from '../atoms/authAtoms'

const require = createRequire(import.meta.url)
const postcss = createRequire(require.resolve('vite'))('postcss')
const css = postcss.parse(
  compileString(readFileSync('src/scss/_mobile.scss', 'utf8'), {
    loadPaths: ['src/scss'],
    silenceDeprecations: ['import', 'global-builtin']
  }).css
)

function declarations(element, width) {
  expect(element).not.toBeNull()
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

function mount(Table, kind, accounts) {
  window.innerWidth = 390
  return render(
    <RecoilRoot initializeState={({ set }) => set(authDataState, { permissions: [] })}>
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="mobile-page-grid">
          <div className="collection-sheet">
            <Table
              center={{ name: 'Center 21', [`${kind}_account`]: accounts }}
              columnList={{}}
              mutate={() => {}}
            />
          </div>
        </div>
      </MemoryRouter>
    </RecoilRoot>
  )
}

describe.each([
  ['saving', SavingTable],
  ['loan', LoanTable]
])('empty %s centers', (kind, Table) => {
  it('retains center identity and no-data while removing only redundant phone totals/progress', () => {
    const { container } = mount(Table, kind, [])
    const title = container.querySelector('.collection-sheet-mobile-center-header h2')
    const message = container.querySelector('.collection-sheet-empty-cell')
    const summary = container.querySelector('.collection-sheet-mobile-summary-row')
    const progress = container.querySelector('[role="progressbar"]')
    expect(title.textContent).toBe('Center 21')
    expect(message.textContent).toBe('common.No_Records_Found')
    for (const width of [320, 390, 414, 667]) {
      expect(declarations(summary, width).display).toBe('none')
      expect(declarations(progress, width).display).toBe('none')
      expect(declarations(title, width).display).not.toBe('none')
      expect(declarations(message, width)['min-height']).toBe('44px')
    }
    for (const width of [768, 1440]) {
      expect(declarations(summary, width).display).not.toBe('none')
      expect(declarations(progress, width).display).not.toBe('none')
      expect(declarations(message, width)['min-height']).toBeUndefined()
    }
  })

  it('does not compact missing data or members with zero collected transactions', () => {
    const accounts = [
      { id: 1, acc_no: 21, client_registration: { name: 'Member' }, [`${kind}_collection`]: [] }
    ]
    const { container } = mount(Table, kind, accounts)
    const summary = container.querySelector('.collection-sheet-mobile-summary-row')
    expect(declarations(summary, 390).display).not.toBe('none')
    expect(declarations(container.querySelector('[role="progressbar"]'), 390).display).not.toBe(
      'none'
    )
    const unknown = mount(Table, kind, undefined)
    expect(
      declarations(unknown.container.querySelector('.collection-sheet-mobile-summary-row'), 390)
        .display
    ).not.toBe('none')
  })
})
