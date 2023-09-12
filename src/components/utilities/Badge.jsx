import React from 'react'

export default function Badge({ name, className }) {
  return (
    <>
      <span className={`badge rounded-pill ${className}`}>{name}</span>
    </>
  )
}
