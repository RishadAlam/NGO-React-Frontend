import ReactQuill from 'react-quill'
import { useEffect, useId, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import 'react-quill/dist/quill.snow.css'
import './editorLocale.css'
import localizeEditor from './localizeEditor'

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
  const inputId = useId()
  const errorId = `${inputId}-error`
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

  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ size: [] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],

      // [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ direction: 'rtl' }], // text direction

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ align: [] }],

      ['link', 'image'] // remove formatting button
    ]
  }

  return (
    <>
      <label className="form-label mb-1">{isRequired ? requiredLabel : label}</label>
      <ReactQuill
        ref={editorRef}
        className="quill-text-editor"
        theme="snow"
        modules={modules}
        value={defaultValue}
        onChange={setChange}
        readOnly={disabled}
      />
      {error && (
        <span id={errorId} className="text-danger my-3">
          {error}
        </span>
      )}
    </>
  )
}
