import AndroidSwitch from '../utilities/AndroidSwitch'
import TextInputField from '../utilities/TextInputField'

export default function InputFieldSetup({
  val,
  name,
  index,
  setChange,
  disabled,
  error,
  ariaLabel
}) {
  return Number(val) === 0 || val === false ? (
    <AndroidSwitch
      ariaLabel={ariaLabel}
      value={Number(val)}
      toggleStatus={(e) => setChange(e.target.checked, name, index)}
    />
  ) : (
    <div className="input-field-setup" style={{ maxWidth: '80px' }}>
      <TextInputField
        ariaLabel={ariaLabel}
        type="number"
        autoFocus={true}
        defaultValue={val}
        setChange={(val) => setChange(val, name, index)}
        disabled={disabled}
        error={error}
      />
    </div>
  )
}
