import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createInstance } from 'i18next'
import { I18nextProvider, useTranslation } from 'react-i18next'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import en from '../../public/lang/en/translations.json'
import bn from '../../public/lang/bn/translations.json'
import Button from '../components/utilities/Button'
import SelectBoxField from '../components/utilities/SelectBoxField'
import PasswordInputField from '../components/utilities/PasswordInputField'
import DatePickerInputField from '../components/utilities/DatePickerInputField'
import DateRangePickerInputField from '../components/utilities/DateRangePickerInputField'
import TextAreaInputField from '../components/utilities/TextAreaInputField'
import EventCalender from '../components/utilities/EventCalender'
import PageOptions from '../components/utilities/tables/PageOptions'
import LoaderSm from '../components/loaders/LoaderSm'
import ErrorFallback from '../components/_helper/errorFallback/ErrorFallback'

vi.unmock('react-i18next')

let i18n
beforeEach(async () => {
  i18n = createInstance()
  await i18n.init({
    lng: 'en',
    fallbackLng: 'en',
    resources: { en: { translation: en }, bn: { translation: bn } },
    interpolation: { escapeValue: false }
  })
  document.execCommand = vi.fn(() => false)
})

async function renderLanguage(component, language) {
  await i18n.changeLanguage(language)
  return render(<I18nextProvider i18n={i18n}>{component}</I18nextProvider>)
}

function TranslatedSelectFields() {
  const { t } = useTranslation()
  return (
    <>
      <SelectBoxField label={t('common.field')} config={{ options: [] }} />
      <SelectBoxField label={t('common.center')} config={{ options: [] }} />
      <SelectBoxField label={t('common.category')} config={{ options: [] }} />
    </>
  )
}

it.each([
  ['en', ['Field', 'Center', 'Category']],
  ['bn', ['ফিল্ড', 'কেন্দ্র', 'ক্যাটাগরি']]
])('keeps each select independently named in %s', async (language, names) => {
  await renderLanguage(<TranslatedSelectFields />, language)
  const inputs = names.map((name) => screen.getByRole('combobox', { name, exact: true }))
  expect(new Set(inputs.map((input) => input.id)).size).toBe(3)
})

it('preserves an explicitly configured select input ID', async () => {
  await renderLanguage(
    <SelectBoxField label="Member" config={{ id: 'member-filter', options: [] }} />,
    'en'
  )
  expect(screen.getByRole('combobox', { name: 'Member' }).id).toBe('member-filter')
})

describe.each([
  [
    'en',
    {
      open: 'Open',
      empty: 'No options available',
      show: 'Show password',
      hide: 'Hide password',
      next: 'Next',
      previous: 'Previous',
      date: 'Choose date',
      previousMonth: 'Previous month',
      nextMonth: 'Next month',
      range: 'Date range',
      bold: 'Bold',
      normal: 'Normal',
      agenda: 'Agenda',
      noEvents: 'There are no events in this range.',
      error: 'Something went wrong. Please try again.'
    }
  ],
  [
    'bn',
    {
      open: 'খুলুন',
      empty: 'কোনো বিকল্প পাওয়া যায়নি',
      show: 'পাসওয়ার্ড দেখুন',
      hide: 'পাসওয়ার্ড লুকান',
      next: 'পরেরটি',
      previous: 'আগেরটি',
      date: 'তারিখ নির্বাচন করুন',
      previousMonth: 'আগের মাস',
      nextMonth: 'পরের মাস',
      range: 'তারিখের পরিসর',
      bold: 'গাঢ়',
      normal: 'সাধারণ',
      agenda: 'সময়সূচি',
      noEvents: 'এই সময়ের মধ্যে কোনো কার্যক্রম নেই।',
      error: 'কোনো সমস্যা হয়েছে। আবার চেষ্টা করুন।'
    }
  ]
])('shared controls in %s', (language, labels) => {
  it('localizes select controls and their empty results', async () => {
    await renderLanguage(<SelectBoxField label="Member" config={{ options: [] }} />, language)
    fireEvent.click(screen.getByRole('button', { name: labels.open }))
    expect(await screen.findByText(labels.empty)).toBeTruthy()
  })

  it('announces the current password visibility action', async () => {
    await renderLanguage(<PasswordInputField label="Password" setChange={() => {}} />, language)
    fireEvent.click(screen.getByRole('button', { name: labels.show }))
    expect(screen.getByRole('button', { name: labels.hide })).toBeTruthy()
  })

  it('localizes date-picker accessible controls', async () => {
    await renderLanguage(
      <DatePickerInputField label="Date" defaultValue="2026-09-18" setChange={() => {}} />,
      language
    )
    fireEvent.click(screen.getByRole('textbox', { name: new RegExp(labels.date) }))
    expect(await screen.findByRole('button', { name: labels.previousMonth })).toBeTruthy()
    expect(screen.getByRole('button', { name: labels.nextMonth })).toBeTruthy()
  })

  it('localizes range-picker labels without changing its selected range', async () => {
    const onChange = vi.fn()
    await renderLanguage(
      <DateRangePickerInputField
        defaultValue={[new Date(2026, 8, 1), new Date(2026, 8, 18)]}
        setChange={onChange}
      />,
      language
    )
    fireEvent.click(screen.getByRole('textbox', { name: labels.range }))
    expect(await screen.findByRole('button', { name: labels.previousMonth })).toBeTruthy()
    expect(screen.getByRole('button', { name: labels.nextMonth })).toBeTruthy()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('localizes the real rich-text editor toolbar', async () => {
    const { container } = await renderLanguage(
      <TextAreaInputField label="Notes" defaultValue="" setChange={() => {}} />,
      language
    )
    expect(await screen.findByRole('button', { name: labels.bold })).toBeTruthy()
    expect(container.querySelector('.ql-size .ql-picker-label').getAttribute('data-label')).toBe(
      labels.normal
    )
  })

  it('localizes the calendar agenda and its empty state', async () => {
    await renderLanguage(<EventCalender />, language)
    fireEvent.click(screen.getByRole('button', { name: labels.agenda }))
    expect(screen.getByText(labels.noEvents)).toBeTruthy()
  })

  it('localizes the month calendar table name', async () => {
    await renderLanguage(<EventCalender />, language)
    expect(screen.getByRole('table', { name: language === 'bn' ? 'মাস' : 'Month' })).toBeTruthy()
  })

  it('localizes pagination navigation', async () => {
    await renderLanguage(
      <PageOptions
        pageCount={2}
        pageOptions={[0, 1]}
        pageIndex={0}
        previousPage={() => {}}
        nextPage={() => {}}
        gotoPage={() => {}}
        canNextPage
        canPreviousPage={false}
      />,
      language
    )
    expect(screen.getByRole('button', { name: labels.previous }).disabled).toBe(true)
    expect(screen.getByRole('button', { name: labels.next }).disabled).toBe(false)
  })

  it('localizes the generic error fallback', async () => {
    await renderLanguage(<ErrorFallback error={{}} />, language)
    expect(screen.getByRole('alert').textContent).toContain(labels.error)
  })
})

it('forwards localized accessible names to icon-only shared buttons', async () => {
  await renderLanguage(<Button aria-label="অনুসন্ধান করুন" name={<svg />} />, 'bn')
  expect(screen.getByRole('button', { name: 'অনুসন্ধান করুন' })).toBeTruthy()
})

it('updates editor and select labels when the language changes without remounting', async () => {
  const { container } = await renderLanguage(
    <>
      <SelectBoxField label="Member" config={{ options: [] }} />
      <TextAreaInputField label="Notes" defaultValue="" setChange={() => {}} />
    </>,
    'en'
  )
  expect(screen.getByRole('button', { name: 'Bold' })).toBeTruthy()
  await act(() => i18n.changeLanguage('bn'))
  await waitFor(() => expect(screen.getByRole('button', { name: 'গাঢ়' })).toBeTruthy())
  expect(screen.getByRole('button', { name: 'খুলুন' })).toBeTruthy()
  expect(container.querySelector('.ql-size .ql-picker-label').getAttribute('data-label')).toBe(
    'সাধারণ'
  )
})

it('announces loading in Bengali', async () => {
  await renderLanguage(<LoaderSm size={20} />, 'bn')
  expect(screen.getByRole('status').getAttribute('aria-label')).toBe(i18n.t('common.loading'))
  expect(i18n.t('common.loading')).not.toBe('common.loading')
})

it('changes language with a closed range-picker, then translates the reopened portal', async () => {
  const onChange = vi.fn()
  const { unmount } = await renderLanguage(
    <DateRangePickerInputField defaultValue={null} setChange={onChange} />,
    'en'
  )
  await act(() => i18n.changeLanguage('bn'))
  fireEvent.click(screen.getByRole('textbox', { name: 'তারিখের পরিসর' }))
  expect(await screen.findByRole('button', { name: 'আগের মাস' })).toBeTruthy()
  await act(() => i18n.changeLanguage('en'))
  expect(await screen.findByRole('button', { name: 'Previous month' })).toBeTruthy()
  unmount()
  expect(onChange).not.toHaveBeenCalled()
})

it('preserves rich-text content and default format values when its language changes', async () => {
  const onChange = vi.fn()
  const { container } = await renderLanguage(
    <TextAreaInputField label="Notes" defaultValue="<p>Member note</p>" setChange={onChange} />,
    'en'
  )
  onChange.mockClear()
  await act(() => i18n.changeLanguage('bn'))
  expect(container.querySelector('.ql-editor').innerHTML).toBe('<p>Member note</p>')
  expect(container.querySelector('select.ql-size').value).toBe('')
  expect(container.querySelector('select.ql-header').value).toBe('')
  expect(onChange).not.toHaveBeenCalled()
})
