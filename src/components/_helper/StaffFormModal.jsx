import useFetch from '../../hooks/useFetch'
import Save from '../../icons/Save'
import XCircle from '../../icons/XCircle'
import Button from '../utilities/Button'
import ModalPro from '../utilities/ModalPro'
import SelectDropdownField from '../utilities/SelectDropdownField'
import TextInputField from '../utilities/TextInputField'

export default function StaffFormModal({
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
  const { data: { data: roles } = [] } = useFetch({ action: 'roles' })
  const rolesOptions = roles && roles?.map((role) => ({ value: role.id, label: role.name }))

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
              {error?.message && error?.message !== '' && (
                <div className="alert alert-danger" role="alert">
                  <strong>{error?.message}</strong>
                </div>
              )}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <TextInputField
                    label={t('common.name')}
                    isRequired={true}
                    defaultValue={defaultValues?.name || ''}
                    setChange={(val) => setChange(val, 'name')}
                    error={error?.name}
                    autoFocus={true}
                    disabled={loading?.staffForm}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <TextInputField
                    label={t('common.email')}
                    type="email"
                    isRequired={true}
                    defaultValue={defaultValues?.email || ''}
                    setChange={(val) => setChange(val, 'email')}
                    error={error?.email}
                    disabled={loading?.staffForm}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <TextInputField
                    label={t('common.phone')}
                    type="number"
                    defaultValue={defaultValues?.phone || ''}
                    setChange={(val) => setChange(val, 'phone')}
                    error={error?.phone}
                    disabled={loading?.staffForm}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <SelectDropdownField
                    label={t('common.role')}
                    isRequired={true}
                    defaultValue={defaultValues?.role || ''}
                    placeholder={`${t('common.select')}...`}
                    options={rolesOptions}
                    setChange={(val) => setChange(val, 'role')}
                    error={error?.role}
                    disabled={loading?.staffForm}
                  />
                </div>
              </div>
            </div>
            <div className="card-footer text-end">
              <Button
                type="submit"
                name={btnTitle}
                className={'btn-primary py-2 px-3'}
                loading={loading?.staffForm || false}
                endIcon={<Save size={20} />}
                disabled={Object.keys(error).length || loading?.staffForm}
              />
            </div>
          </form>
        </div>
      </ModalPro>
    </>
  )
}
