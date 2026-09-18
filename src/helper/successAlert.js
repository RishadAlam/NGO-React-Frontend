import Swal from 'sweetalert2'
import i18n from 'i18next'

export default function successAlert(title, text, icon) {
  const requiresAcknowledgement =
    icon === 'error' && window.matchMedia('(max-width:767.98px)').matches

  return Swal.fire({
    title: title,
    text: text,
    icon: icon,
    showConfirmButton: requiresAcknowledgement,
    timer: requiresAcknowledgement ? undefined : 2000,
    ...(requiresAcknowledgement ? { confirmButtonText: i18n.t('localization.shared.close') } : {})
  })
}
