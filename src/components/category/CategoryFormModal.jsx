import { useTranslation } from 'react-i18next'
import useFetch from '../../hooks/useFetch'
import Save from '../../icons/Save'
import XCircle from '../../icons/XCircle'
import Button from '../utilities/Button'
import CheckboxInputField from '../utilities/CheckboxInputField'
import ModalPro from '../utilities/ModalPro'
import SelectBoxField from '../utilities/SelectBoxField'
import TextAreaInputField from '../utilities/TextAreaInputField'
import TextInputField from '../utilities/TextInputField'

export default function CategoryFormModal({
  open,
  setOpen,
  error,
  modalTitle,
  btnTitle,
  defaultValues,
  setChange,
  loading,
  onSubmit
}) {
  const { t } = useTranslation()
  const { data: { data: groups = [] } = [] } = useFetch({ action: 'categories/groups' })

  const selectBoxConfig = {
    options: groups,
    value: defaultValues?.group || null,
    freeSolo: true,
    onInputChange: (e, option) => setChange(option, 'group')
  }

  return (
    <>
      <ModalPro open={open} handleClose={() => setOpen(false)}>
        <div className="card">
          <form onSubmit={onSubmit}>
            <div className="card-header">
              <div className="d-flex align-items-category justify-content-between">
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
                    label={t('common.name')}
                    isRequired={true}
                    defaultValue={defaultValues?.name || ''}
                    setChange={(val) => setChange(val, 'name')}
                    error={error?.name}
                    autoFocus={true}
                    disabled={loading?.categoryForm}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <SelectBoxField
                    label={t('common.group')}
                    config={selectBoxConfig}
                    isRequired={true}
                    error={error?.group}
                    disabled={loading?.categoryForm}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <div
                    className="border rounded-2 mt-3 px-2"
                    ref={(el) => {
                      if (el) {
                        el.style.setProperty('border-color', '#8884d8', 'important')
                      }
                    }}>
                    <CheckboxInputField
                      label={t('common.saving')}
                      isRequired={true}
                      isChecked={defaultValues?.saving || false}
                      setChange={(e) => setChange(e.target.checked, 'saving')}
                      error={error?.saving}
                      disabled={loading?.categoryForm}
                    />
                    <CheckboxInputField
                      label={t('common.loan')}
                      isRequired={true}
                      isChecked={defaultValues?.loan || false}
                      setChange={(e) => setChange(e.target.checked, 'loan')}
                      error={error?.loan}
                      disabled={loading?.categoryForm}
                    />
                  </div>
                </div>
                <div className="col-md-12 mb-3 text-start">
                  <TextAreaInputField
                    label={t('common.description')}
                    defaultValue={defaultValues?.description}
                    setChange={(val) => setChange(val, 'description')}
                    error={error?.description}
                    disabled={loading?.categoryForm}
                  />
                </div>
              </div>
            </div>
            <div className="card-footer text-end">
              <Button
                type="submit"
                name={btnTitle}
                className={'btn-primary py-2 px-3'}
                loading={loading?.categoryForm || false}
                endIcon={<Save size={20} />}
                disabled={Object.keys(error).length || loading?.categoryForm}
              />
            </div>
          </form>
        </div>
      </ModalPro>
    </>
  )
}
