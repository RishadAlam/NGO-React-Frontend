import React from 'react'
import LoaderSm from '../loaders/LoaderSm'

export default function Button({ name, type, disabled, loading, style, onclick }) {
  return (
    <>
      <button
        className="btn btn-primary btn-block"
        type={type}
        disabled={disabled}
        style={style}
        onClick={onclick}>
        <div className="d-flex">
          {name}
          {loading && <LoaderSm size={20} clr="#1c3faa" className="ms-2" />}
        </div>
      </button>
    </>
  )
}
