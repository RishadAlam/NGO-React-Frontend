import React from 'react'
import AndroidSwitch from '../utilities/AndroidSwitch'
import TextInputField from '../utilities/TextInputField'

export default function InputFieldSetup({ val, name, index, setChange, disabled }) {
  return val === 0 ? (
    <AndroidSwitch value={val} toggleStatus={(e) => setChange(e.target.checked, name, index)} />
  ) : (
    <TextInputField
      type="number"
      autoFocus={true}
      defaultValue={val}
      setChange={(val) => setChange(val, name, index)}
      disabled={disabled}
    />
  )
}
