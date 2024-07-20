
import Swal from "sweetalert2";

const swalToast = (icon = "success", title = "Done successfully", position = "top", timer = 1500) => {
  const Toast = Swal.mixin({
    toast: true,
    position,
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });
  Toast.fire({
    icon,
    title
  });
}

export default swalToast



