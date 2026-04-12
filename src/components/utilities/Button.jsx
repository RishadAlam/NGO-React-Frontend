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
  const trailingIcon = loading ? (
    <LoaderSm size={20} clr="var(--primary-color)" className="ms-2" />
  ) : (
    endIcon
  )

  return (
    <>
      <button
        className={`btn btn-block ${className || 'btn-primary'}`}
        type={type}
        disabled={disabled}
        style={style}
        onClick={onclick}>
        <div className="d-inline-flex align-items-center justify-content-center">
          {name}
          {trailingIcon ? <span className="ms-2 d-inline-flex align-items-center">{trailingIcon}</span> : null}
        </div>
      </button>
    </>
  )
}
