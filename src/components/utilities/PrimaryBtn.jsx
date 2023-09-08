import Button from '@mui/material/Button'
import LoaderSm from '../loaders/LoaderSm'

export default function PrimaryBtn({
  name,
  type,
  disabled,
  loading,
  style,
  onclick,
  variant,
  endIcon
}) {
  return (
    <>
      <Button
        variant={variant || 'contained'}
        endIcon={loading ? <LoaderSm size={20} clr="#1c3faa" className="ms-2" /> : endIcon}
        type={type || 'button'}
        disabled={disabled || false}
        style={style}
        onClick={onclick}>
        {name}
      </Button>
    </>
  )
}