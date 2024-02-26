import Save from '../../icons/Save'
import XCircle from '../../icons/XCircle'
import tsNumbers from '../../libs/tsNumbers'
import { auditPages } from '../../resources/staticData/auditPages'
import Button from '../utilities/Button'
import ModalPro from '../utilities/ModalPro'
import SelectBoxField from '../utilities/SelectBoxField'
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
  const pageConfig = {
    options: auditPages,
    value: defaultValues?.page || null,
    getOptionLabel: (option) => option.name,
    onChange: (e, option) => setChange(option, 'page_no'),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }
  const columnConfig = {
    options: ['1', '2'],
    value: tsNumbers(defaultValues?.column_no, true) || null,
    getOptionLabel: (option) => tsNumbers(option),
    onInputChange: (e, option) => setChange(option, 'column_no')
  }

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
                  <SelectBoxField
                    label={t('common.page')}
                    config={pageConfig}
                    isRequired={true}
                    error={error?.page_no}
                    disabled={loading?.metaForm}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <SelectBoxField
                    label={t('common.column')}
                    config={columnConfig}
                    isRequired={true}
                    error={error?.column_no}
                    disabled={loading?.metaForm}
                  />
                </div>
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
