import Swal from 'sweetalert2'
import xFetch from '../utilities/xFetch'

export default function deleteAlert(t) {
  return Swal.fire({
    title: t('common_validation.Are_you_sure'),
    text: t('common_validation.you_can_bring_it_back'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: 'var(--accent-color)',
    cancelButtonColor: '#d33',
    confirmButtonText: t('common_validation.Yes_delete_it'),
    cancelButtonText: t('common.cancel')
  })
}

export function permanentDeleteAlert(t) {
  return Swal.fire({
    title: t('common_validation.Are_you_sure_to_delete_permanently'),
    text: t('common_validation.You_wont_be_able_to_revert_this'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: 'var(--accent-color)',
    cancelButtonColor: '#d33',
    confirmButtonText: t('common_validation.Yes_delete_it'),
    cancelButtonText: t('common.cancel')
  })
}

export function passwordCheckAlert(t, accessToken) {
  return Swal.fire({
    title: t('common_validation.enter_password'),
    input: 'password',
    inputAttributes: {
      autocapitalize: 'off'
    },
    showCancelButton: true,
    confirmButtonText: t('common.submit'),
    cancelButtonText: t('common.cancel'),
    showLoaderOnConfirm: true,
    preConfirm: async (login) => {
      try {
        const response = await xFetch(
          'verify-user',
          { password: login },
          null,
          accessToken,
          null,
          'POST'
        )
        if (!response?.success) {
          return Swal.showValidationMessage(`
            ${JSON.stringify(await response.json())}
          `)
        }
        return true
      } catch (error) {
        Swal.showValidationMessage(`${error?.errors?.message || error?.message}`)
      }
    },
    allowOutsideClick: () => !Swal.isLoading()
  })
}
