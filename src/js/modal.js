import { refs } from "./refs";
import TmDbApi from "./services/fetchApi";

import { hideLoader, showLoader } from "./spinner";
import { checkQueue, checkWatchedFilm } from "./library-list";

const Api = new TmDbApi();

async function render(id) {
  try {
    showLoader();
    const filmResponse = await Api.fetchMovieDetail(id);
    renderMovie(filmResponse);
    hideLoader();
    checkWatchedFilm();
  } catch (error) {
    console.log(error);
  }
  checkQueue();
}

// For adding listeners for closing modals:
function modalCloser() {
  const backgroundClose = (event) => {
    if (event.target == event.currentTarget) {
      document.body.classList.toggle("modal-on");
      document.querySelector(".js-trailer").innerHTML = "";
      document.querySelector(".modal").classList.remove("is-hidden");
      refs.modalClose.removeEventListener("click", crossClose);
      window.removeEventListener("keydown", modalEsc);
      refs.modalBackground.removeEventListener("click", backgroundClose);
    }
  };

  const crossClose = (event) => {
    document.body.classList.toggle("modal-on");
    document.querySelector(".js-trailer").innerHTML = "";
    document.querySelector(".modal").classList.remove("is-hidden");
    refs.modalBackground.removeEventListener("click", backgroundClose);
    window.removeEventListener("keydown", modalEsc);
    refs.modalClose.removeEventListener("click", crossClose);
  };

  const modalEsc = (event) => {
    if (event.key === "Escape") {
      if (document.body.classList.contains("modal-on")) {
        document.body.classList.toggle("modal-on");
        document.querySelector(".js-trailer").innerHTML = "";
        document.querySelector(".modal").classList.remove("is-hidden");
        refs.modalBackground.removeEventListener("click", backgroundClose);
        refs.modalClose.removeEventListener("click", crossClose);
        window.removeEventListener("keydown", modalEsc);
      }
    }
  };

  refs.modalBackground.addEventListener("click", backgroundClose);
  refs.modalClose.addEventListener("click", crossClose);
  window.addEventListener("keydown", modalEsc);
}

// Adding listeners to modal cards::
export function modalListener() {
  const modalOpener = (event) => {
    let dataSource = event.currentTarget.dataset.id;
    render(dataSource);
    renderMovie(dataSource);

    document.body.classList.toggle("modal-on");

    modalCloser();
  };

  refs.galleryCards = document.querySelectorAll(".gallery__card");

  refs.galleryCards.forEach((element) => {
    element.addEventListener("click", modalOpener);
  });
}

// Refs for modal revalue
const modalPoster = document.querySelector(".modal__poster");
const modalTitle = document.querySelector(".modal__title");
const modalTextAbout = document.querySelector(".modal__text");
const modalPopularity = document.querySelector(".modal__popularity .value");
const modalTextGenres = document.querySelector(".modal__genre .value");
const modalOriginalTitle = document.querySelector(".modal__original .value");
const modalRating = document.querySelector(".rating");
const modalVotes = document.querySelector(".rating.rating__votes");

// For renderMovie with Api
function renderMovie(response) {
  const {
    id,
    genres,
    title,
    vote_average,
    vote_count,
    poster_path,
    popularity,
    original_title,
    overview,
  } = response;

  // Feature for genre map
  let preparedGenres = null;
  if (genres) {
    preparedGenres = genres.map((g) => g.name).join(", ");
  }
  
  // For poster set
  if (!poster_path) {
    modalPoster.src =
      "https://tn.fishki.net/26/upload/post/2018/04/20/2577020/afrikanskie-postery-k-gollivudskim-blokbasteram-6.jpg";
  } else {
    (modalPoster.src = `https://image.tmdb.org/t/p/w300${poster_path}`),
      (modalPoster.alt = `${title}`);
  }

  modalPoster.setAttribute("data-img", `${id}`);
  modalTitle.textContent = `${title}`;
  modalTextAbout.textContent = `${overview}`;
  modalTextGenres.textContent = `${preparedGenres}`;
  modalPopularity.textContent = `${popularity}`;
  modalOriginalTitle.textContent = `${original_title}`;
  modalRating.textContent = `${Number(vote_average).toFixed(1)}`;
  modalVotes.textContent = `${vote_count}`;
  return;
}
