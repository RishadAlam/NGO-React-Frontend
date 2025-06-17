import toast from 'react-hot-toast'
import xFetch from '../utilities/xFetch'
import { permanentDeleteAlert } from './deleteAlert'

export const collectionDelete = (action, id, t, accessToken, mutate, loading, setLoading) => {
  permanentDeleteAlert(t).then((result) => {
    if (result.isConfirmed) {
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
    }
  })
}
