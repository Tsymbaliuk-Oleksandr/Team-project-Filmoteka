import TmDbApi from "./services/fetchApi";
import genres from "./services/genres";
import { modalListener } from "./modal";
import { hideLoader, showLoader } from "./spinner";

import { markeringHomePage } from "./library-list";

import { refs } from "./refs";
import { carouselRender } from "./carousel";
import { library } from "./library-render";

const Api = new TmDbApi();
export const defaultPoster =
  "https://tn.fishki.net/26/upload/post/2018/04/20/2577020/afrikanskie-postery-k-gollivudskim-blokbasteram-6.jpg";

export const moviesListRenderByTopAndSearch = {
  movieList: document.querySelector(".gallery"),
  searchForm: document.querySelector(".js-search__form"),
  searchWarning: document.querySelector(".search__warning"),
  options: {
    query: "",
    page: 1,
    totalPages: null,
  },
  onSearchForm(event) {
    event.preventDefault();
    const { options } = this;
    const currentQuery = this.options.query;
    const form = event.currentTarget;
    const searchQuery = form.elements.searchQuery.value;
    if (!searchQuery) {
      this.searchWarning.classList.remove("hidden");
    }
    if (searchQuery === currentQuery || !searchQuery) {
      form.reset();
      return;
    }
    options.query = searchQuery;
    options.page = 1;
    form.reset();

    this.render();
  },

  async render() {
    const { options } = this;
    const { page, query } = this.options;

    if (query) {
      try {
        showLoader();
        const filmResponse = await Api.fetchSearchMovies(query, page);
        options.totalPages = filmResponse.total_pages;

        refs.pageMax = filmResponse.total_pages;
        refs.pageCurrent = options.page;
        carouselRender(refs.pageCurrent, refs.pageMax);
        library.resetLibrary();

        const films = filmResponse.results;
        if (!films.length) {
          this.searchWarning.classList.remove("hidden");
          refs.moviesContent.classList.add("movies-list__empty");
          carouselRender(1, 1);
        } else {
          this.searchWarning.classList.add("hidden");
          refs.moviesContent.classList.remove("movies-list__empty");
        }
        this.createMarkUp(this.preparingForMarkUp(films));
        setTimeout(() => {
          hideLoader();
        }, 300);
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } catch (error) {
        console.log(error, `Попробуйте перезагрузить страницу`);
      }
    } else {
      try {
        showLoader();
        const filmResponse = await Api.fetchTrendingMovies(page);
        options.totalPages = filmResponse.total_pages;

        refs.pageMax = filmResponse.total_pages;
        refs.pageCurrent = options.page;
        carouselRender(refs.pageCurrent, refs.pageMax);
        library.resetLibrary();

        const films = filmResponse.results;
        this.createMarkUp(this.preparingForMarkUp(films));
        setTimeout(() => {
          hideLoader();
        }, 300);
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } catch (error) {
        console.log(error, `Попробуйте перезагрузить страницу`);
      }
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
    markeringHomePage();
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

moviesListRenderByTopAndSearch.searchForm.addEventListener(
  "submit",
  moviesListRenderByTopAndSearch.onSearchForm.bind(
    moviesListRenderByTopAndSearch
  )
);
refs.logo.addEventListener("click", () => {
  (moviesListRenderByTopAndSearch.options.query = ""),
    (moviesListRenderByTopAndSearch.options.page = 1),
    moviesListRenderByTopAndSearch.searchWarning.classList.add("hidden");
  refs.moviesContent.classList.remove("movies-list__empty");
  moviesListRenderByTopAndSearch.render(),
    carouselRender(
      moviesListRenderByTopAndSearch.options.page,
      moviesListRenderByTopAndSearch.options.totalPages
    );
});
