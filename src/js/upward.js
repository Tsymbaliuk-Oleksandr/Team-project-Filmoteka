export function upwardEl() {
  window.addEventListener("scroll", function () {
    const scroll = document.querySelector(".upward");
    scroll.classList.toggle("active", window.scrollY > 500);
  });
}

export function scrollTop() {
  const scroll = document.querySelector(".upward");
  scroll.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}