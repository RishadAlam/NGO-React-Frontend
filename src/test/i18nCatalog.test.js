import { describe, expect, it } from 'vitest'
import { createInstance } from 'i18next'
import en from '../../public/lang/en/translations.json'
import bn from '../../public/lang/bn/translations.json'
import { auditProject, auditSource, flattenCatalog } from '../../scripts/audit-i18n.mjs'

const catalogs = { en: flattenCatalog(en), bn: flattenCatalog(bn) }

describe('EN/BN translation coverage', () => {
  it('provides both languages without silently falling back to English', () => {
    const unmatched = [
      ...new Set([...Object.keys(catalogs.en), ...Object.keys(catalogs.bn)])
    ].filter((key) => !(key in catalogs.en) || !(key in catalogs.bn))
    expect(unmatched).toEqual([])
  })
  it('resolves every literal translation reference from production code in both languages', async () => {
    const i18n = createInstance()
    await i18n.init({
      lng: 'bn',
      fallbackLng: false,
      resources: { en: { translation: en }, bn: { translation: bn } }
    })
    const missing = auditProject().references.filter(
      ({ key }) => !i18n.exists(key, { lng: 'en' }) || !i18n.exists(key, { lng: 'bn' })
    )
    expect(missing).toEqual([])
  })
  it('preserves every interpolated variable across languages', () => {
    const variables = (value) =>
      [...String(value).matchAll(/{{\s*([^},\s]+).*?}}/g)].map((match) => match[1]).sort()
    const mismatches = Object.entries(catalogs.en).filter(
      ([key, value]) =>
        JSON.stringify(variables(value)) !== JSON.stringify(variables(catalogs.bn[key]))
    )
    expect(mismatches).toEqual([])
  })
  it('keeps detected UI literals in catalogs, except documented proper names', () => {
    const properNames = {
      'src/components/_helper/AuthShell.jsx': ['আমার সমিতি'],
      'src/components/layouts/MainLayout.jsx': ['RISHAD ALAM']
    }
    expect(
      auditProject().literals.filter(({ file, text }) => !properNames[file]?.includes(text))
    ).toEqual([])
  })
  it('finds untranslated visible/accessibility text without flagging form field names', () => {
    const audit = auditSource(
      'const View = () => <><button title="Edit">Save</button><input name="email" aria-label="Email" />{t("common.cancel")}</>'
    )
    expect(audit.literals.map(({ text }) => text)).toEqual(['Edit', 'Save', 'Email'])
    expect(audit.references.map(({ key }) => key)).toEqual(['common.cancel'])
  })
  it('checks route titles and both branches of conditional translation keys', () => {
    const audit = auditSource(
      'const View = () => <Layout pageTitle="page_name.login">{t(enabled ? "common.active" : "common.inactive")}{t(`common.${ok ? "yes" : "no"}`)}</Layout>'
    )
    expect(audit.references.map(({ key }) => key)).toEqual([
      'page_name.login',
      'common.active',
      'common.inactive',
      'common.yes',
      'common.no'
    ])
  })
  it('ignores currency symbols and numbers, but still finds Bengali prose', () => {
    const audit = auditSource('const View = () => <><span>৳ ১২</span><span>অনুমোদন করুন</span></>')
    expect(audit.literals.map(({ text }) => text)).toEqual(['অনুমোদন করুন'])
  })
  it('finds expression text, conditional text, table headers and notification literals', () => {
    const audit = auditSource(
      'toast.error("Failed"); const col={Header:"Status"}; const View=()=> <span>{"Save"}{enabled ? "Active" : "Inactive"}</span>'
    )
    expect(audit.literals.map(({ text }) => text)).toEqual([
      'Failed',
      'Status',
      'Save',
      'Active',
      'Inactive'
    ])
  })
})
