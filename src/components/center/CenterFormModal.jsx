import Save from '../../icons/Save'
import XCircle from '../../icons/XCircle'
import Button from '../utilities/Button'
import ModalPro from '../utilities/ModalPro'
import TextAreaInputField from '../utilities/TextAreaInputField'
import TextInputField from '../utilities/TextInputField'

export default function CenterFormModal({
  open,
  setOpen,
  error,
  modalTitle,
  btnTitle,
  t,
  defaultValues,
  setChange,
  loading,
  onSubmit
}) {
  return (
    <>
      <ModalPro open={open} handleClose={() => setOpen(false)}>
        <div className="card">
          <form onSubmit={onSubmit}>
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between">
                <b className="text-uppercase">{modalTitle}</b>
                <Button
                  className={'text-danger p-0'}
                  loading={false}
                  endIcon={<XCircle size={24} />}
                  onclick={() => setOpen(false)}
                />
              </div>
            </div>
            <div className="card-body">
              {error?.message && error?.message !== '' && (
                <div className="alert alert-danger" role="alert">
                  <strong>{error?.message}</strong>
                </div>
              )}
              <div className="row">
                <div className="col-md-12 mb-3">
                  <TextInputField
                    label={t('common.name')}
                    isRequired={true}
                    defaultValue={defaultValues?.name || ''}
                    setChange={(val) => setChange(val, 'name')}
                    error={error?.name}
                    autoFocus={true}
                    disabled={loading?.centerForm}
                  />
                </div>
                <div className="col-md-12 mb-3 text-start">
                  <TextAreaInputField
                    label={t('common.description')}
                    defaultValue={defaultValues?.description}
                    setChange={(val) => setChange(val, 'description')}
                    error={error?.description}
                    disabled={loading?.centerForm}
                  />
                </div>
              </div>
            </div>
            <div className="card-footer text-end">
              <Button
                type="submit"
                name={btnTitle}
                className={'btn-primary py-2 px-3'}
                loading={loading?.centerForm || false}
                endIcon={<Save size={20} />}
                disabled={Object.keys(error).length || loading?.centerForm}
              />
            </div>
          </form>
        </div>
      </ModalPro>
    </>
  )
}
