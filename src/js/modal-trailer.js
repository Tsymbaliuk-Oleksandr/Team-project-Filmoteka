import { fetchYoutubeApi } from "./services/fetchYoutubeApi";
import { hideLoader, showLoader } from "./spinner";
const fetchYoutube = new fetchYoutubeApi();
const modalEl = document.querySelector(".modal");
const modalPoster = document.querySelector(".modal__poster");
const modalTrailerEl = document.querySelector(".js-trailer");

//По кліку на постер  ховаєм модалку  завантажуємо і показуємо трейлер
export const handleClick = (event) => {
  event.preventDefault();
  showLoader();
  const title = event.currentTarget.alt.trim().toLowerCase();
  modalEl.classList.add("is-hidden");

  fetchYoutube
    .getTrailer(title)
    .then((items) =>
      items.map((item) => {
        const trailerName = item.snippet.title.trim().toLowerCase();
        if (trailerName.includes("official trailer")) {
          const trailerId = item.id.videoId;
          const markup = `
    <iframe class="iframe" width="854" height="480"  src="https://www.youtube.com/embed/${trailerId}"
      title="YouTube video player" frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
    </iframe>`;
          modalTrailerEl.innerHTML = markup;
        }
      })
    )
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      hideLoader();
    });
};
modalPoster.addEventListener("click", handleClick);
