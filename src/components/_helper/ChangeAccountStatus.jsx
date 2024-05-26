import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { passwordCheckAlert } from '../../helper/deleteAlert'
import Refresh from '../../icons/Refresh'
import xFetch from '../../utilities/xFetch'
import PrimaryBtn from '../utilities/PrimaryBtn'

export default function ChangeAccountStatus({ prefix, status, mutate }) {
  const { id } = useParams()
  const { t } = useTranslation()
  const { accessToken } = useAuthDataValue()
  const [isLoading, setIsLoading] = useState()

  const onSubmit = (event) => {
    event.preventDefault()

    passwordCheckAlert(t, accessToken).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true)
        xFetch(
          `client/registration/${prefix}/change-status/${id}`,
          { status: !status },
          null,
          accessToken,
          null,
          'PUT'
        )
          .then((response) => {
            setIsLoading(false)
            if (response?.success) {
              toast.success(response.message)
              mutate()
            } else {
              toast.error(response.message)
            }
          })
          .catch((errResponse) => {
            setIsLoading(false)
            toast.error(errResponse?.message)
          })
      }
    })
  }

  return (
    <PrimaryBtn
      classNames="mx-1"
      color="error"
      name={status ? t('common.hold') : t('common.active')}
      loading={false}
      endIcon={<Refresh size={20} />}
      onclick={onSubmit}
      disabled={isLoading}
    />
  )
}
