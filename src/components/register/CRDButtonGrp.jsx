import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import deleteAlert from '../../helper/deleteAlert'
import successAlert from '../../helper/successAlert'
import Edit from '../../icons/Edit'
import Trash from '../../icons/Trash'
import xFetch from '../../utilities/xFetch'
import ActionBtnGroup from '../utilities/ActionBtnGroup'
import Button from '../utilities/Button'
import AccNoUpdateModal from './AccNoUpdateModal'
import CenterUpdateModal from './CenterUpdateModal'
import FieldFormModal from './FieldUpdateModal'

export default function CRDButtonGrp({ data = {}, mutate }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isFUModalOpen, setIsFUModalOpen] = useState(false)
  const [isCUModalOpen, setIsCUModalOpen] = useState(false)
  const [isANUModalOpen, setIsANUModalOpen] = useState(false)
  const { permissions: authPermissions, accessToken } = useAuthDataValue()
  const { t } = useTranslation()

  const accountDelete = () => {
    deleteAlert(t).then((result) => {
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
            successAlert(t('common.deleted'), response?.message, 'error')
          })
          .catch((errResponse) => {
            setIsLoading(false)
            successAlert(t('common.deleted'), errResponse?.message, 'error')
          })
      }
    })
  }

  return (
    <>
      {isFUModalOpen && (
        <FieldFormModal
          open={isFUModalOpen}
          setOpen={setIsFUModalOpen}
          id={data?.id}
          defaultField={data?.field || null}
          mutate={mutate}
        />
      )}
      {isCUModalOpen && (
        <CenterUpdateModal
          open={isCUModalOpen}
          setOpen={setIsCUModalOpen}
          id={data?.id}
          defaultField={data?.center || null}
          mutate={mutate}
        />
      )}
      {isANUModalOpen && (
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
          {authPermissions.includes('client_register_account_update') && (
            <Button
              type="button"
              name={`${t('common.register_account')} ${t('common.edit')}`}
              className={'text-black py-2 px-3 form-control rounded-start-4'}
              style={{ background: 'chocolate' }}
              loading={false}
              endIcon={<Edit size={20} />}
              disabled={false}
            />
          )}
          {authPermissions.includes('client_register_account_field_update') && (
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
          {authPermissions.includes('client_register_account_center_update') && (
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
          {authPermissions.includes('client_register_account_acc_no_update') && (
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
          {authPermissions.includes('client_register_account_delete') && (
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
