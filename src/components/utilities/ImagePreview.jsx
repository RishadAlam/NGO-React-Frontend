import React from 'react'
import Camera from '../../icons/Camera'

export default function ImagePreview({ label, src, setChange, error, disabled = false }) {
  return (
    <>
      <label className="form-label mb-3">{label}</label>
      <div
        className={`border border-secondary shadow rounded-4 p-3 ${error && 'border-danger'}`}
        style={{ width: 'max-content' }}>
        <div className="img" style={{ width: '250px', height: '250px' }}>
          <img
            className="rounded-2"
            alt="image"
            src={src}
            style={{ width: 'inherit', height: 'inherit', objectFit: 'cover' }}
          />
        </div>
        <div className="mx-auto position-relative mt-3">
          <label htmlFor="image" className="btn btn-primary form-control" disabled={disabled}>
            <Camera />
          </label>
          <input
            type="file"
            id="image"
            className="top-0 start-0 position-absolute opacity-0 cursor-pointer"
            onChange={(event) => setChange(event.target.files[0])}
            accept="image/*"
            disabled={disabled}
          />
        </div>
      </div>
      {error && <span className="text-danger my-3">{error}</span>}
    </>
  )
}
