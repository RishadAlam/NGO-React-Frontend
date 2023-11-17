import Swal from 'sweetalert2'

export default function deleteAlert(t) {
  return Swal.fire({
    title: t('common_validation.Are_you_sure'),
    text: t('common_validation.you_can_bring_it_back'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
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
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: t('common_validation.Yes_delete_it'),
    cancelButtonText: t('common.cancel')
  })
}
