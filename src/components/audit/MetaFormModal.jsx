import Save from '../../icons/Save'
import XCircle from '../../icons/XCircle'
import Button from '../utilities/Button'
import ModalPro from '../utilities/ModalPro'
import TextInputField from '../utilities/TextInputField'

export default function MetaFormModal({
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
  // const { data: { data: fields = [] } = [] } = useFetch({ action: 'fields/active' })
  // const selectBoxConfig = {
  //   options: fields,
  //   value: defaultValues?.field || null,
  //   getOptionLabel: (option) => option.name,
  //   onChange: (e, option) => setChange(option, 'field'),
  //   isOptionEqualToValue: (option, value) => option.id === value.id
  // }

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
                <div className="col-md-6 mb-3">
                  <TextInputField
                    label={t('common.meta_key')}
                    isRequired={true}
                    defaultValue={defaultValues?.meta_key || ''}
                    setChange={(val) => setChange(val, 'meta_key')}
                    error={error?.meta_key}
                    autoFocus={true}
                    disabled={loading?.metaForm}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <TextInputField
                    label={t('common.meta_value')}
                    defaultValue={defaultValues?.meta_value || ''}
                    setChange={(val) => setChange(val, 'meta_value')}
                    error={error?.meta_value}
                    disabled={loading?.metaForm}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <TextInputField
                    label={t('common.page')}
                    isRequired={true}
                    defaultValue={defaultValues?.page_no || ''}
                    setChange={(val) => setChange(val, 'page_no')}
                    error={error?.page_no}
                    disabled={loading?.metaForm}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <TextInputField
                    label={t('common.column')}
                    isRequired={true}
                    defaultValue={defaultValues?.column_no || ''}
                    setChange={(val) => setChange(val, 'column_no')}
                    error={error?.column_no}
                    disabled={loading?.metaForm}
                  />
                </div>
                {/* <div className="col-md-6 mb-3">
                  <SelectBoxField
                    label={t('common.field')}
                    config={selectBoxConfig}
                    isRequired={true}
                    error={error?.field}
                    disabled={loading?.metaForm}
                  />
                </div> */}
              </div>
            </div>
            <div className="card-footer text-end">
              <Button
                type="submit"
                name={btnTitle}
                className={'btn-primary py-2 px-3'}
                loading={loading?.metaForm || false}
                endIcon={<Save size={20} />}
                disabled={Object.keys(error).length || loading?.metaForm}
              />
            </div>
          </form>
        </div>
      </ModalPro>
    </>
  )
}
