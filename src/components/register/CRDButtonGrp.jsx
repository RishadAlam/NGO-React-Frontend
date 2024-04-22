import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import Edit from '../../icons/Edit'
import ActionBtnGroup from '../utilities/ActionBtnGroup'
import Button from '../utilities/Button'
import AccNoUpdateModal from './AccNoUpdateModal'
import CenterUpdateModal from './CenterUpdateModal'
import FieldFormModal from './FieldUpdateModal'

export default function CRDButtonGrp({ data = {}, mutate }) {
  const [isFUModalOpen, setIsFUModalOpen] = useState(false)
  const [isCUModalOpen, setIsCUModalOpen] = useState(false)
  const [isANUModalOpen, setIsANUModalOpen] = useState(false)
  const { permissions: authPermissions } = useAuthDataValue()
  const { t } = useTranslation()

  return (
    <>
      {isFUModalOpen && (
        <FieldFormModal
          open={isFUModalOpen}
          setOpen={setIsFUModalOpen}
          defaultField={data?.field || null}
          mutate={mutate}
        />
      )}
      {isCUModalOpen && (
        <CenterUpdateModal
          open={isCUModalOpen}
          setOpen={setIsCUModalOpen}
          defaultField={data?.center || null}
          mutate={mutate}
        />
      )}
      {isANUModalOpen && (
        <AccNoUpdateModal
          open={isANUModalOpen}
          setOpen={setIsANUModalOpen}
          defaultField={data?.acc_no || null}
          mutate={mutate}
        />
      )}
      <div className="pt-3">
        <ActionBtnGroup>
          {authPermissions.includes('field_data_update') && (
            <Button
              type="button"
              name={`${t('common.register_account')} ${t('common.edit')}`}
              className={'btn-warning text-black py-2 px-3 form-control rounded-start-4'}
              loading={false}
              endIcon={<Edit size={20} />}
              disabled={false}
            />
          )}
          {authPermissions.includes('field_data_update') && (
            <Button
              type="button"
              name={`${t('common.field')} ${t('common.edit')}`}
              className={'btn-warning text-black py-2 px-3 form-control'}
              loading={false}
              endIcon={<Edit size={20} />}
              onclick={() => setIsFUModalOpen(true)}
              disabled={false}
            />
          )}
          {authPermissions.includes('field_data_update') && (
            <Button
              type="button"
              name={`${t('common.center')} ${t('common.edit')}`}
              className={'btn-warning text-black py-2 px-3 form-control'}
              loading={false}
              endIcon={<Edit size={20} />}
              onclick={() => setIsCUModalOpen(true)}
              disabled={false}
            />
          )}
          {authPermissions.includes('field_data_update') && (
            <Button
              type="button"
              name={`${t('common.acc_no')} ${t('common.edit')}`}
              className={'btn-warning text-black py-2 px-3 form-control rounded-end-4'}
              loading={false}
              endIcon={<Edit size={20} />}
              onclick={() => setIsANUModalOpen(true)}
              disabled={false}
            />
          )}
        </ActionBtnGroup>
      </div>
    </>
  )
}
