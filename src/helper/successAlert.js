import Swal from 'sweetalert2'

export default function successAlert(title, text, icon) {
  return Swal.fire({
    title: title,
    text: text,
    icon: icon,
    showConfirmButton: false,
    timer: 1500
  })
}
