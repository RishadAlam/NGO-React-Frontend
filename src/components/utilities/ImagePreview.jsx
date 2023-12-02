import { useEffect, useState } from 'react'
import Camera from '../../icons/Camera'
import profilePlaceholder from '../../resources/img/UserPlaceholder.jpg'

export default function ImagePreview({
  label,
  src = null,
  setChange = null,
  error,
  style = { width: 'max-content' },
  disabled = false,
  isRequired = false,
  reset = false
}) {
  const [imageUri, setImageUri] = useState(src || profilePlaceholder)
  const requiredLabel = (
    <span>
      {label}
      <span className="text-danger">*</span>
    </span>
  )

  const save = (val) => {
    setImageUri(URL.createObjectURL(val))
    if (setChange) {
      setChange(val)
    }
  }

  useEffect(() => {
    if (reset) {
      setImageUri(profilePlaceholder)
    }
  }, [reset])

  return (
    <>
      <label className="form-label mb-3">{isRequired ? requiredLabel : label}</label>
      <div
        className={`image-preview border shadow rounded-4 p-3 ${error && 'border-danger'}`}
        style={style}>
        <div className="img" style={{ width: '250px', height: '250px' }}>
          <img
            className="rounded-2"
            alt="image"
            src={imageUri}
            style={{ width: 'inherit', height: 'inherit', objectFit: 'cover' }}
            loading="lazy"
          />
        </div>
        <div className={`mx-auto position-relative mt-3 ${disabled ? 'd-none' : ''}`}>
          <label htmlFor="image" className="btn btn-primary form-control">
            <Camera />
          </label>
          <input
            type="file"
            id="image"
            className="top-0 start-0 position-absolute opacity-0 cursor-pointer"
            onChange={(event) => save(event.target.files[0])}
            accept="image/*"
            disabled={disabled}
          />
        </div>
      </div>
      {error && <span className="text-danger my-3">{error}</span>}
    </>
  )
}
