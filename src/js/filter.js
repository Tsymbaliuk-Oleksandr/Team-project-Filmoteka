import genres from "./services/genres";
import { moviesListRenderByTopAndSearch } from "./moviesListRenderByTopAndSearch";
import { Notify } from "notiflix";
import { modalListener } from "./modal";
import { carouselRender } from "./carousel";
import axios from "axios";

export const selectedGenre = [];
const tagsEl = document.querySelector(".tags");
const filterBtn = document.querySelector(".searchBtn");
const filterListEl = document.querySelector(".filter");
const libraryEl = document.querySelector(".navigation__library");
const searchForm = document.querySelector(".search__hourglass");
const logo = document.querySelector(".navigation__logo");
const homeBtn = document.querySelector(".navigation__home");

export function filterByGenre() {
  setGenre();
  function setGenre() {
    tagsEl.innerHTML = "";
    genres.forEach((genre) => {
      const el = document.createElement("div");
      el.classList.add("tag");
      el.id = genre.id;
      el.innerText = genre.name;
      el.addEventListener("click", () => {
        if (!selectedGenre.length) {
          selectedGenre.push(genre.id);
        } else {
          if (selectedGenre.includes(genre.id)) {
            selectedGenre.forEach((id, idx) => {
              if (id == genre.id) {
                selectedGenre.splice(idx, 1);
              }
            });
          } else {
            selectedGenre.push(genre.id);
          }
        }

        filterMovie.onGenreBtnClick();

        highlightSelection();
      });
      tagsEl.append(el);
    });
  }

  function highlightSelection() {
    const tags = document.querySelectorAll(".tag");
    tags.forEach((tag) => {
      tag.classList.remove("highlight");
    });
    if (selectedGenre.length) {
      selectedGenre.forEach((id) => {
        const highlightTag = document.getElementById(id);
        highlightTag.classList.add("highlight");

        clear.classList.remove("hidden");
      });
    }
  }

  let clearBtn = document.getElementById("clear");
  if (clearBtn) {
    clearBtn.classList.add("clean");
  } else {
    const clear = document.createElement("div");
    clear.classList.add("tag", "clear");
    clear.id = "clear";
    clear.innerText = "Clear";
    clear.classList.add("hidden");

    clear.addEventListener("click", () => {
      selectedGenre.length = 0;
      setGenre();
      moviesListRenderByTopAndSearch.render();
      clear.classList.add("hidden");
    });
    filterListEl.append(clear);
  }

  searchForm.addEventListener("input", reset);
  logo.addEventListener("click", reset);
  homeBtn.addEventListener("click", reset);

  function reset() {
    selectedGenre.length = 0;
    setGenre();
    clear.classList.add("hidden");
    filterListEl.classList.remove("active");
    filterBtn.classList.remove("active");
  }
}

//////////////////////////////////////////////////////////

axios.defaults.baseURL = "https://api.themoviedb.org/3/";
const API_KEY = "bef35a6880b17319422124db5bc1d407";

const params = {
  api_key: API_KEY,
  include_adult: false,
  page: 1,
};

async function fetchMovieByFilter(page) {
  const response = await axios.get(
    `discover/movie?with_genres=${selectedGenre.join(",")}`,
    {
      params: { ...params, page },
    }
  );
  if (response.data.total_results !== 0) {
    return response.data;
  } else {
    Notify.failure("No results found");
  }
}

////////////////////////////////////////////////////////////////

const defaultPoster =
  "https://tn.fishki.net/26/upload/post/2018/04/20/2577020/afrikanskie-postery-k-gollivudskim-blokbasteram-6.jpg";

export const filterMovie = {
  movieList: document.querySelector(".gallery"),
  paginationControlBtns: document.querySelectorAll(".js_pagination--btn"),
  genreBtn: document.querySelector(".tag"),
  options: {
    page: 1,
    totalPages: null,
  },

  onGenreBtnClick() {
    this.options.page = 1;
    this.renderByGenre();
  },

  changePage(event) {
    const action = event.currentTarget.dataset.page;
    const { options } = this;

    if (action === "prev" && this.options.page > 1) {
      options.page -= 1;

      this.renderByGenre();
    } else if (
      action === "next" &&
      this.options.page < this.options.totalPages
    ) {
      options.page += 1;

      this.renderByGenre();
    }
  },
  async renderByGenre() {
    const { options } = this;
    try {
      const filmResponse = await fetchMovieByFilter(options.page);
      options.totalPages = filmResponse.total_pages;
      const films = filmResponse.results;
      this.createMarkUp(this.preparingForMarkUp(films));
      carouselRender(this.options.page, this.options.totalPages);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.log(error, `Попробуйте перезагрузить страницу`);
    }
  },
  preparingForMarkUp(films) {
    return films.map(
      ({ id, title, poster_path, vote_average, release_date, genre_ids }) => ({
        id,
        title,
        poster_path: poster_path
          ? "https://image.tmdb.org/t/p/w500" + poster_path
          : defaultPoster,
        vote_average,
        release_date: release_date ? release_date.split("-") : "`2000",
        genre_ids: this.calculatingGenres(genre_ids),
      })
    );
  },

  createMarkUp(preparedMovies) {
    const { movieList } = this;
    const moviesMarkUp = preparedMovies
      .map(
        ({ id, title, poster_path, vote_average, release_date, genre_ids }) => {
          return `<li class="gallery__card" data-id=${id}>
          <img
            src=${poster_path}
            data-source=${poster_path}
            data-page="homepage"
            alt=${title}
            class="gallery__image"
          />
          <div class="gallery__data">
            <div class="gallery__name">${title}</div>
            <div class="gallery__stats">
              <p class="gallery__details">${genre_ids.join(", ")} | ${
            release_date[0]
          }</p>
         
              <p class="gallery__rating">${vote_average.toFixed(1)}</p>
            </div>
          </div>
        </li>
    `;
        }
      )
      .join("");
    movieList.innerHTML = "";
    movieList.insertAdjacentHTML("beforeend", moviesMarkUp);
    modalListener();
  },
  calculatingGenres(genre_ids) {
    const sortGenres = genres
      .filter((genre) => {
        for (const id of genre_ids) {
          if (id === genre.id) {
            return genre;
          }
        }
      })
      .map((genre) => genre.name);
    if (sortGenres.length > 2) {
      return [...sortGenres.slice(0, 2), "Other"];
    } else {
      return sortGenres;
    }
  },
};

filterMovie.paginationControlBtns.forEach((el) => {
  el.addEventListener("click", filterMovie.changePage.bind(filterMovie));
});

filterBtn.addEventListener("click", () => {
  filterListEl.classList.toggle("active");
  filterBtn.classList.toggle("active");
});

libraryEl.addEventListener("click", () => {
  filterListEl.classList.remove("active");
});
