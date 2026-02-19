import React from 'react'
import LoaderSm from '../loaders/LoaderSm'

export default function Button({
  name,
  type = 'button',
  disabled,
  loading,
  style,
  className,
  onclick,
  endIcon
}) {
  return (
    <>
      <button
        className={`btn btn-block ${className || 'btn-primary'}`}
        type={type}
        disabled={disabled}
        style={style}
        onClick={onclick}>
        <div className="d-flex justify-content-center">
          {name}
          &nbsp;
          {loading ? <LoaderSm size={20} clr="var(--primary-color)" className="ms-2" /> : endIcon}
        </div>
      </button>
    </>
  )
}
