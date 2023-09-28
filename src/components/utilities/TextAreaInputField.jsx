import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export default function TextAreaInputField({
  label,
  defaultValue,
  error,
  setChange,
  isRequired = false,
  disabled = false
}) {
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
        className="quill-text-editor"
        theme="snow"
        modules={modules}
        value={defaultValue}
        onChange={setChange}
        readOnly={disabled}
      />
      {error && <span className="text-danger my-3">{error}</span>}
    </>
  )
}
