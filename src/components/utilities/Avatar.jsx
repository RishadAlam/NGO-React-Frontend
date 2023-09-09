import { Avatar as AvatarComp } from '@mui/material'
import React from 'react'

export default function Avatar({ name, img, size, variant }) {
  return (
    <>
      <AvatarComp alt={name} src={img} size={size || 'lg'} variant={variant || 'outlined'} />
    </>
  )
}
