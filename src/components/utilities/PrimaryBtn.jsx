import Button from '@mui/material/Button'
import LoaderSm from '../loaders/LoaderSm'

export default function PrimaryBtn({
  name,
  type,
  disabled,
  loading,
  style,
  size,
  onclick,
  variant,
  endIcon,
  classNames
}) {
  return (
    <>
      <Button
        className={classNames}
        variant={variant || 'contained'}
        endIcon={loading ? <LoaderSm size={20} clr="#1c3faa" className="ms-2" /> : endIcon}
        type={type || 'button'}
        disabled={disabled || false}
        style={style}
        size={size || 'lg'}
        onClick={onclick}>
        {name}
      </Button>
    </>
  )
}
