import React from 'react'

export default function Badge({ name, classs }) {
  return (
    <>
      <span className={`badge rounded-pill ${classs}`}>{name}</span>
    </>
  )
}
