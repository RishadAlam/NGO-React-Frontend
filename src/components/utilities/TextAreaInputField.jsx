import ReactQuill from 'react-quill'
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useMediaQuery } from '@mui/material'
import { useTranslation } from 'react-i18next'
import 'react-quill/dist/quill.snow.css'
import './editorLocale.css'
import localizeEditor from './localizeEditor'
import ChevronDown from '../../icons/ChevronDown'

// Keep Quill's modules stable: opening formatting options must not recreate the
// editor, lose its selection, or emit a content change.
const modules = {
  toolbar: [
    [{ font: [] }],
    [{ size: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ['link', 'image']
  ]
}

export default function TextAreaInputField({
  label,
  defaultValue,
  error,
  setChange,
  isRequired = false,
  disabled = false
}) {
  const { t } = useTranslation()
  const editorRef = useRef(null)
  const mobile = useMediaQuery('(max-width:767.98px)')
  const [mobileToolbar, setMobileToolbar] = useState(null)
  const [formattingExpanded, setFormattingExpanded] = useState(false)
  const inputId = useId()
  const errorId = `${inputId}-error`
  useLayoutEffect(() => {
    const editor = editorRef.current?.getEditor()
    if (!mobile || !editor?.container.closest('.mobile-app-dialog')) {
      setMobileToolbar(null)
      return
    }

    const toolbar = editor.getModule('toolbar').container
    const groups = [...toolbar.querySelectorAll('.ql-formats')]
    const basicGroup = groups.find((group) => group.querySelector('.ql-bold'))
    const advanced = groups.filter((group) => group !== basicGroup)
    const strike = basicGroup?.querySelector('.ql-strike')
    if (strike) advanced.push(strike)
    advanced.forEach((group, index) => {
      group.id = `${inputId}-format-${index}`
      group.dataset.mobileAdvanced = 'true'
    })
    if (basicGroup) basicGroup.dataset.mobileBasic = 'true'
    setMobileToolbar({ toolbar, advanced })

    return () => {
      toolbar.hidden = false
      advanced.forEach((group) => {
        group.hidden = false
        group.removeAttribute('id')
        delete group.dataset.mobileAdvanced
      })
      if (basicGroup) delete basicGroup.dataset.mobileBasic
    }
  }, [inputId, mobile])

  useLayoutEffect(() => {
    if (!mobileToolbar) return
    mobileToolbar.toolbar.hidden = disabled
    mobileToolbar.advanced.forEach((group) => {
      group.hidden = !formattingExpanded
    })
  }, [mobileToolbar, formattingExpanded, disabled])

  useEffect(() => {
    if (!editorRef.current) return
    return localizeEditor(editorRef.current.getEditor(), t, label)
  }, [t, label])
  useEffect(() => {
    const editor = editorRef.current?.getEditor().root
    if (!editor) return
    editor.setAttribute('aria-invalid', String(Boolean(error)))
    editor.setAttribute('aria-required', String(isRequired))
    if (error) editor.setAttribute('aria-describedby', errorId)
    else editor.removeAttribute('aria-describedby')
  }, [error, errorId, isRequired])
  const requiredLabel = (
    <span>
      {label}
      <span className="text-danger">*</span>
    </span>
  )

  return (
    <>
      <label className="form-label mb-1">{isRequired ? requiredLabel : label}</label>
      <ReactQuill
        ref={editorRef}
        className={`quill-text-editor${mobileToolbar ? ' mobile-modal-editor' : ''}`}
        theme="snow"
        modules={modules}
        value={defaultValue}
        onChange={setChange}
        readOnly={disabled}
      />
      {mobileToolbar &&
        !disabled &&
        createPortal(
          <button
            type="button"
            className="mobile-editor-format-toggle"
            aria-label={t(
              `localization.shared.editor.${formattingExpanded ? 'less_formatting' : 'more_formatting'}`
            )}
            title={t(
              `localization.shared.editor.${formattingExpanded ? 'less_formatting' : 'more_formatting'}`
            )}
            aria-expanded={formattingExpanded}
            aria-controls={mobileToolbar.advanced.map((group) => group.id).join(' ')}
            onClick={() => setFormattingExpanded((expanded) => !expanded)}>
            <ChevronDown size={20} />
          </button>,
          mobileToolbar.toolbar
        )}
      {error && (
        <span id={errorId} className="text-danger my-3">
          {error}
        </span>
      )}
    </>
  )
}
