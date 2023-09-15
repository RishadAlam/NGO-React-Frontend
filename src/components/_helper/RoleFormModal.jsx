import Save from '../../icons/Save'
import XCircle from '../../icons/XCircle'
import Button from '../utilities/Button'
import ModalPro from '../utilities/ModalPro'
import TextInputField from '../utilities/TextInputField'

export default function RoleFormModal({
  open,
  setOpen,
  error,
  modalTitle,
  btnTitle,
  t,
  defaultValue,
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
                  endIcon={<XCircle size={30} />}
                  onclick={() => setOpen(false)}
                />
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-12 mb-3">
                  {error?.message && error?.message !== '' && (
                    <div className="alert alert-danger" role="alert">
                      <strong>{error?.message}</strong>
                    </div>
                  )}
                  <TextInputField
                    label={t('common.name')}
                    isRequired={true}
                    defaultValue={defaultValue}
                    setChange={setChange}
                    error={error?.name}
                    autoFocus={true}
                    disabled={loading?.roleName}
                  />
                </div>
              </div>
            </div>
            <div className="card-footer text-end">
              <Button
                name={btnTitle}
                className={'btn-primary py-2 px-3'}
                loading={loading?.roleName || false}
                endIcon={<Save size={20} />}
                type="submit"
                disabled={Object.keys(error).length || loading?.roleName}
              />
            </div>
          </form>
        </div>
      </ModalPro>
    </>
  )
}
