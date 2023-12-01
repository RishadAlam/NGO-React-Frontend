import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SignaturePad from 'react-signature-canvas'
import ActionBtnGroup from '../../components/utilities/ActionBtnGroup'
import Pen from '../../icons/Pen'
import Save from '../../icons/Save'
import Trash from '../../icons/Trash'
import XCircle from '../../icons/XCircle'
import SignaturePlaceholder from '../../resources/img/SignaturePlaceholder.png'
import Button from './Button'
import ModalPro from './ModalPro'

export default function SignaturePadField({
  label,
  open,
  setOpen,
  setChange,
  isRequired = false,
  error = false,
  disabled = false
}) {
  const [imageURL, setImageURL] = useState(SignaturePlaceholder)
  const { t } = useTranslation()
  const sigCanvas = useRef({})

  const clear = (e) => {
    e.preventDefault()
    sigCanvas.current.clear()
    setOpen(false)
  }
  const save = (e) => {
    e.preventDefault()
    const signature = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png')

    setImageURL(signature)
    setChange(signature)
    setOpen(false)
  }

  const requiredLabel = (
    <span>
      {label}
      <span className="text-danger">*</span>
    </span>
  )

  return (
    <div className="text-center">
      <label className="form-label mb-3">{isRequired ? requiredLabel : label}</label>
      <ModalPro open={open} handleClose={() => setOpen(false)}>
        <div className="card" style={{ width: '100vw', height: '100vh' }}>
          <div className="card-header">
            <div className="d-flex align-items-category justify-content-between">
              <b className="text-uppercase">{label}</b>
              <Button
                className={'text-danger p-0'}
                loading={false}
                endIcon={<XCircle size={24} />}
                onclick={() => setOpen(false)}
              />
            </div>
          </div>
          <div className="card-body" style={{ background: '#fff' }}>
            <SignaturePad
              ref={sigCanvas}
              backgroundColor="#fff"
              canvasProps={{
                className: 'signatureCanvas',
                style: { width: '-webkit-fill-available', height: '100%' }
              }}
            />
          </div>
          <div className="card-footer text-center">
            <div className="d-inline-block">
              <ActionBtnGroup>
                <Tooltip TransitionComponent={Zoom} title="Save" arrow followCursor>
                  <IconButton className="text-primary" onClick={(e) => save(e)}>
                    {<Save size={20} />}
                  </IconButton>
                </Tooltip>
                <Tooltip TransitionComponent={Zoom} title="Delete" arrow followCursor>
                  <IconButton className="text-danger" onClick={(e) => clear(e)}>
                    {<Trash size={20} />}
                  </IconButton>
                </Tooltip>
              </ActionBtnGroup>
            </div>
          </div>
        </div>
      </ModalPro>
      <img
        src={imageURL}
        alt="my signature"
        style={{
          border: '1px solid black',
          width: '100%',
          maxWidth: '600px'
        }}
      />
      {error && <span className="text-danger my-3">{error}</span>}
      <br />
      <Button
        type="button"
        name={t('common.open_signature_pad')}
        className={`btn-primary py-2 mt-3 px-3 ${disabled ? 'd-none' : ''}`}
        onclick={() => setOpen(true)}
        loading={error ? true : false}
        endIcon={<Pen size={20} />}
        disabled={disabled}
      />
    </div>
  )
}
