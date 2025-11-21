import toast from 'react-hot-toast'
import xFetch from '../utilities/xFetch'
import { passwordCheckAlert, permanentDeleteAlert } from './deleteAlert'
import successAlert from './successAlert'

export const collectionDelete = (action, id, t, accessToken, mutate, loading, setLoading) => {
  permanentDeleteAlert(t).then((result) => {
    if (!result.isConfirmed) {
      return
    }

    passwordCheckAlert(t, accessToken).then((result) => {
      if (!result.isConfirmed) {
        return
      }

      const toasterLoading = toast.loading(`${t('common.delete')}...`)
      setLoading({ ...loading, collectionDelete: true })
      xFetch(`collection/${action}/force-delete/${id}`, null, null, accessToken, null, 'DELETE')
        .then((response) => {
          toast.dismiss(toasterLoading)
          setLoading({ ...loading, collectionDelete: false })
          if (response?.success) {
            toast.success(response?.message)
            mutate()
            return
          }
          toast.error(response?.message)
        })
        .catch((errResponse) => {
          toast.error(errResponse?.message)
          setLoading({ ...loading, collectionDelete: false })
        })
    })
  })
}

export const deleteWithdrawal = (endpoint, id, t, accessToken, mutate, loading, setLoading) => {
  permanentDeleteAlert(t).then((result) => {
    if (!result.isConfirmed) {
      return
    }

    passwordCheckAlert(t, accessToken).then((result) => {
      if (!result.isConfirmed) {
        return
      }

      setLoading({ ...loading, withdrawalDelete: true })
      const toasterLoading = toast.loading(`${t('common.delete')}...`)
      xFetch(`${endpoint}/${id}`, null, null, accessToken, null, 'DELETE')
        .then((response) => {
          toast.dismiss(toasterLoading)
          setLoading({ ...loading, withdrawalDelete: false })
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
          setLoading({ ...loading, withdrawalDelete: false })
          successAlert(t('common.deleted'), errResponse?.message, 'error')
        })
    })
  })
}

export const deleteTransaction = (endpoint, t, accessToken, mutate, loading, setLoading) => {
  permanentDeleteAlert(t).then((result) => {
    if (!result.isConfirmed) {
      return
    }

    passwordCheckAlert(t, accessToken).then((result) => {
      if (!result.isConfirmed) {
        return
      }

      setLoading({ ...loading, transactionDelete: true })
      const toasterLoading = toast.loading(`${t('common.delete')}...`)
      xFetch(endpoint, null, null, accessToken, null, 'DELETE')
        .then((response) => {
          toast.dismiss(toasterLoading)
          setLoading({ ...loading, transactionDelete: false })
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
          setLoading({ ...loading, transactionDelete: false })
          successAlert(t('common.deleted'), errResponse?.message, 'error')
        })
    })
  })
}

export const approveTransaction = (endpoint, t, accessToken, mutate, loading, setLoading) => {
  setLoading({ ...loading, transactionApprove: true })
  const toasterLoading = toast.loading(`${t('common_validation.Are_you_sure_to_approve_it')}...`)

  xFetch(endpoint, null, null, accessToken, null, 'GET')
    .then((response) => {
      toast.dismiss(toasterLoading)
      setLoading({ ...loading, transactionApprove: false })
      if (response?.success) {
        successAlert(
          t('common.approved_at'),
          response?.message || t('common_validation.data_has_been_deleted'),
          'success'
        )
        mutate()
        return
      }
      successAlert(t('common.approved_at'), response?.message, 'error')
    })
    .catch((errResponse) => {
      setLoading({ ...loading, transactionApprove: false })
      successAlert(t('common.approved_at'), errResponse?.message, 'error')
    })
}
