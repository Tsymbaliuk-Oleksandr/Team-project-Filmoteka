const spinner = document.querySelector(".ids-grid");

// спрятать предзагрузчик
export function hideLoader() {
  spinner.classList.add("is-hidden");
}
// показать предзагрузчик
export function showLoader() {
  spinner.classList.remove("is-hidden");
}
