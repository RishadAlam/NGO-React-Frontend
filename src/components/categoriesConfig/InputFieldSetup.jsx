import React from 'react'
import AndroidSwitch from '../utilities/AndroidSwitch'
import TextInputField from '../utilities/TextInputField'

export default function InputFieldSetup({ val, name, index, setChange, disabled, error }) {
  return val === 0 || val === false ? (
    <AndroidSwitch value={val} toggleStatus={(e) => setChange(e.target.checked, name, index)} />
  ) : (
    <TextInputField
      type="number"
      autoFocus={true}
      defaultValue={val}
      setChange={(val) => setChange(val, name, index)}
      disabled={disabled}
      error={error}
    />
  )
}
