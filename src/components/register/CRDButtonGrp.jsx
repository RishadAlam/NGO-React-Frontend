import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { setLoanAccFields, setSavingFields } from '../../helper/RegFormFieldsData'
import deleteAlert, { passwordCheckAlert } from '../../helper/deleteAlert'
import { setProfileDataObj } from '../../helper/setProfileDataObj'
import successAlert from '../../helper/successAlert'
import Edit from '../../icons/Edit'
import Trash from '../../icons/Trash'
import xFetch from '../../utilities/xFetch'
import EditClientProfileModal from '../pendingReg/EditClientProfileModal'
import EditLoanAccountModal from '../pendingReg/EditLoanAccountModal'
import EditSavingAccountModal from '../pendingReg/EditSavingAccountModal'
import ActionBtnGroup from '../utilities/ActionBtnGroup'
import Button from '../utilities/Button'
import AccNoUpdateModal from './AccNoUpdateModal'
import CategoryUpdateModal from './CategoryUpdateModal'
import CenterUpdateModal from './CenterUpdateModal'
import FieldFormModal from './FieldUpdateModal'

export default function CRDButtonGrp({ module, data = {}, mutate }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false)
  const [isEditSavingModalOpen, setIsEditSavingModalOpen] = useState(false)
  const [isEditLoanModalOpen, setIsEditLoanModalOpen] = useState(false)
  const [isFUModalOpen, setIsFUModalOpen] = useState(false)
  const [isCUModalOpen, setIsCUModalOpen] = useState(false)
  const [isANUModalOpen, setIsANUModalOpen] = useState(false)
  const [isCATModalOpen, setIsCATModalOpen] = useState(false)
  const { permissions: authPermissions, accessToken } = useAuthDataValue()
  const { t } = useTranslation()

  const accountDelete = () => {
    deleteAlert(t).then((result) => {
      if (result.isConfirmed) {
        passwordCheckAlert(t, accessToken).then((result) => {
          if (result.isConfirmed) {
            setIsLoading(true)
            const toasterLoading = toast.loading(`${t('common.delete')}...`)
            xFetch(`client/registration/${data.id}`, null, null, accessToken, null, 'DELETE')
              .then((response) => {
                setIsLoading(false)
                toast.dismiss(toasterLoading)
                if (response?.success) {
                  successAlert(
                    t('common.deleted'),
                    response?.message || t('common_validation.data_has_been_deleted'),
                    'success'
                  )
                  mutate()
                  return
                }
                successAlert(
                  t('common.delete'),
                  response?.errors?.message || response?.message,
                  'error'
                )
              })
              .catch((errResponse) => {
                setIsLoading(false)
                toast.dismiss(toasterLoading)
                toast.error(errResponse?.errors?.message || errResponse?.message)
                successAlert(
                  t('common.delete'),
                  errResponse?.errors?.message || errResponse?.message,
                  'error'
                )
              })
          }
        })
      }
    })
  }

  return (
    <>
      {isFUModalOpen && module === 'register_account' && (
        <FieldFormModal
          open={isFUModalOpen}
          setOpen={setIsFUModalOpen}
          id={data?.id}
          defaultField={data?.field || null}
          mutate={mutate}
        />
      )}
      {isEditClientModalOpen && module === 'register_account' && (
        <EditClientProfileModal
          open={isEditClientModalOpen}
          setOpen={setIsEditClientModalOpen}
          profileData={setProfileDataObj(data)}
          mutate={mutate}
        />
      )}
      {isEditSavingModalOpen && module === 'saving_account' && (
        <EditSavingAccountModal
          open={isEditSavingModalOpen}
          setOpen={setIsEditSavingModalOpen}
          accountData={setSavingFields(data)}
          mutate={mutate}
        />
      )}
      {isEditLoanModalOpen && module === 'loan_account' && (
        <EditLoanAccountModal
          open={isEditLoanModalOpen}
          setOpen={setIsEditLoanModalOpen}
          accountData={setLoanAccFields(data)}
          mutate={mutate}
        />
      )}
      {isCUModalOpen && module === 'register_account' && (
        <CenterUpdateModal
          open={isCUModalOpen}
          setOpen={setIsCUModalOpen}
          id={data?.id}
          defaultField={data?.center || null}
          mutate={mutate}
        />
      )}
      {isCATModalOpen && (module === 'saving_account' || module === 'loan_account') && (
        <CategoryUpdateModal
          open={isCATModalOpen}
          setOpen={setIsCATModalOpen}
          id={data?.id}
          defaultField={data?.category || null}
          module={module}
          mutate={mutate}
        />
      )}
      {isANUModalOpen && module === 'register_account' && (
        <AccNoUpdateModal
          open={isANUModalOpen}
          setOpen={setIsANUModalOpen}
          id={data?.id}
          defaultField={data?.acc_no || null}
          mutate={mutate}
        />
      )}
      <div className="pt-3 btn-grp">
        <ActionBtnGroup>
          {authPermissions.includes('client_register_account_update') &&
            module === 'register_account' && (
              <Button
                type="button"
                name={`${t('common.register_account')} ${t('common.edit')}`}
                className={'btn-warning text-black py-2 px-3 form-control rounded-start-4'}
                loading={false}
                endIcon={<Edit size={20} />}
                onclick={() => setIsEditClientModalOpen(true)}
                disabled={false}
              />
            )}
          {authPermissions.includes('client_register_account_field_update') &&
            module === 'register_account' && (
              <Button
                type="button"
                name={`${t('common.field')} ${t('common.edit')}`}
                className={'text-dark py-2 px-3 form-control'}
                loading={false}
                style={{ background: 'tomato' }}
                endIcon={<Edit size={20} />}
                onclick={() => setIsFUModalOpen(true)}
                disabled={false}
              />
            )}
          {authPermissions.includes('client_register_account_center_update') &&
            module === 'register_account' && (
              <Button
                type="button"
                name={`${t('common.center')} ${t('common.edit')}`}
                className={'text-dark py-2 px-3 form-control'}
                loading={false}
                style={{ background: 'tomato' }}
                endIcon={<Edit size={20} />}
                onclick={() => setIsCUModalOpen(true)}
                disabled={false}
              />
            )}
          {authPermissions.includes('client_register_account_acc_no_update') &&
            module === 'register_account' && (
              <Button
                type="button"
                name={`${t('common.acc_no')} ${t('common.edit')}`}
                className={'text-dark py-2 px-3 form-control'}
                loading={false}
                style={{ background: 'tomato' }}
                endIcon={<Edit size={20} />}
                onclick={() => setIsANUModalOpen(true)}
                disabled={false}
              />
            )}

          {authPermissions.includes('client_saving_account_update') &&
            module === 'saving_account' && (
              <Button
                type="button"
                name={`${
                  data.category.is_default
                    ? t(`category.default.${data.category.name}`)
                    : data.category.name
                } ${t('common.saving_account')} ${t('common.edit')}`}
                className={'btn-warning text-black py-2 px-3 form-control rounded-start-4'}
                loading={false}
                endIcon={<Edit size={20} />}
                onclick={() => setIsEditSavingModalOpen(true)}
                disabled={false}
              />
            )}
          {authPermissions.includes('client_loan_account_update') && module === 'loan_account' && (
            <Button
              type="button"
              name={`${
                data.category.is_default
                  ? t(`category.default.${data.category.name}`)
                  : data.category.name
              } ${t('common.loan_account')} ${t('common.edit')}`}
              className={'btn-warning text-black py-2 px-3 form-control rounded-start-4'}
              loading={false}
              endIcon={<Edit size={20} />}
              onclick={() => setIsEditLoanModalOpen(true)}
              disabled={false}
            />
          )}

          {((authPermissions.includes('client_saving_account_category_update') &&
            module === 'saving_account') ||
            (authPermissions.includes('client_loan_account_category_update') &&
              module === 'loan_account')) && (
            <Button
              type="button"
              name={`${t('common.category')} ${t('common.edit')}`}
              className={'text-dark py-2 px-3 form-control rounded-end-4'}
              loading={false}
              style={{ background: 'tomato' }}
              endIcon={<Edit size={20} />}
              onclick={() => setIsCATModalOpen(true)}
              disabled={false}
            />
          )}
          {authPermissions.includes('client_register_account_delete') &&
            module === 'register_account' && (
              <Button
                type="button"
                name={`${t('common.account')} ${t('common.delete')}`}
                className={'btn-danger text-dark py-2 px-3 form-control rounded-end-4'}
                loading={isLoading}
                endIcon={<Trash size={20} />}
                onclick={accountDelete}
                disabled={isLoading}
              />
            )}
        </ActionBtnGroup>
      </div>
    </>
  )
}
