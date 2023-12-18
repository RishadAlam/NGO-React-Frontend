import AndroidSwitch from '../utilities/AndroidSwitch'
import TextInputField from '../utilities/TextInputField'

export default function InputFieldSetup({ val, name, index, setChange, disabled, error }) {
  return Number(val) === 0 || val === false ? (
    <AndroidSwitch
      value={Number(val)}
      toggleStatus={(e) => setChange(e.target.checked, name, index)}
    />
  ) : (
    <div style={{ maxWidth: '80px' }}>
      <TextInputField
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
