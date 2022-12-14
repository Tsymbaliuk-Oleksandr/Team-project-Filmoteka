import TmDbApi from "./services/fetchApi";
import { modalListener } from "./modal";
import { refs } from "./refs";
import { carouselRender } from "./carousel";
const Api = new TmDbApi();

export const library = {
  movieList: refs.gallery,
  options: {
    page: 1,
  },

  watchedRender() {
    this.resetLibrary();
    const { movieList } = this;
    const watchedMoviesID = JSON.parse(localStorage.getItem("storage")).watched;
    if (!watchedMoviesID.length) {
      this.createEmptyGalleryMarkUp();
    }
    const movies = [];

    var iterator = 0;
    const moviesAmount = watchedMoviesID.length;
    refs.pageMax = Math.ceil(moviesAmount / refs.moviesPerPage);
    if (!refs.pageMax) {
      refs.pageMax = 1;
    }
    if (refs.pageCurrent > refs.pageMax) {
      refs.pageCurrent = refs.pageMax;
    }
    carouselRender(refs.pageCurrent, refs.pageMax);

    refs.moviesRemaining = watchedMoviesID;
    if (refs.pageCurrent > 1) {
      refs.moviesRemaining = watchedMoviesID.slice(
        (refs.pageCurrent - 1) * refs.moviesPerPage,
        watchedMoviesID.length
      );
    }
    if (refs.moviesPerPage <= refs.moviesRemaining.length) {
      refs.moviesRemaining.length = refs.moviesPerPage;
    }

    refs.moviesRemaining.map(async (movieId) => {
      try {
        const movie = await Api.fetchMovieDetail(movieId);
        iterator += 1;
        movies.push(movie);
        if (movies.length === refs.moviesRemaining.length) {
          movies.sort((e1, e2) => {
            return e1.title.localeCompare(e2.title);
          });
          this.createMarkUp(this.preparingForMarkUp(movies));
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      } catch (error) {
        console.log(error, `Попробуйте перезагрузить страницу`);
      }
    });
  },

  queueRender() {
    this.resetLibrary();
    const { movieList } = this;

    const queueMoviesID = JSON.parse(localStorage.getItem("storage")).que;
    const movies = [];

    if (!queueMoviesID.length) {
      this.createEmptyQueueMarkUp();
    }
    var iterator = 0;
    const moviesAmount = queueMoviesID.length;
    refs.pageMax = Math.ceil(moviesAmount / refs.moviesPerPage);
    if (!refs.pageMax) {
      refs.pageMax = 1;
    }
    if (refs.pageCurrent > refs.pageMax) {
      refs.pageCurrent = refs.pageMax;
    }
    carouselRender(refs.pageCurrent, refs.pageMax);

    refs.moviesRemaining = queueMoviesID;
    if (refs.pageCurrent > 1) {
      refs.moviesRemaining = queueMoviesID.slice(
        (refs.pageCurrent - 1) * refs.moviesPerPage,
        queueMoviesID.length
      );
    }
    if (refs.moviesPerPage <= refs.moviesRemaining.length) {
      refs.moviesRemaining.length = refs.moviesPerPage;
    }

    refs.moviesRemaining.map(async (movieId) => {
      try {
        const movie = await Api.fetchMovieDetail(movieId);
        iterator += 1;
        movies.push(movie);
        if (movies.length === refs.moviesRemaining.length) {
          movies.sort((e1, e2) => {
            return e1.title.localeCompare(e2.title);
          });
          this.createMarkUp(this.preparingForMarkUp(movies));
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      } catch (error) {
        console.log(error, `Попробуйте перезагрузить страницу`);
      }
    });
  },

  preparingForMarkUp(movies) {
    return movies.map(
      ({ id, title, poster_path, vote_average, release_date, genres }) => ({
        id,
        title,
        poster_path: "https://image.tmdb.org/t/p/w500" + poster_path,
        vote_average,
        genres: this.calculatingGenres(genres),
        release_date: release_date.split("-"),
      })
    );
  },

  createMarkUp(preparedMovies) {
    const moviesMarkUp = preparedMovies
      .map(({ id, title, poster_path, vote_average, release_date, genres }) => {
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

                <p class="gallery__details">${genres.join(", ")} | ${
          release_date[0]
        }</p>
                <p class="gallery__rating">${vote_average.toFixed(1)}</p>

            </div>
            </div>
        </li>`;
      })
      .join("");

    refs.gallery.innerHTML = "";
    refs.gallery.insertAdjacentHTML("beforeend", moviesMarkUp);
    modalListener();
  },

  createEmptyGalleryMarkUp() {
    refs.gallery.innerHTML = `<p class="library-message animate__bounceInDown">Your gallery is empty. <br>Choose your first movie!</p>`;
    refs.libraryContent.classList.add("library__empty");
    carouselRender(1, 1);
  },

  createEmptyQueueMarkUp() {
    refs.gallery.innerHTML = `<p class="library-message animate__bounceInDown">Your queue is empty. <br>Choose your first movie!</p>`;
    refs.libraryContent.classList.add("library__empty");
    carouselRender(1, 1);
  },

  calculatingGenres(genre_ids) {
    const sortGenres = genre_ids.map((genre) => genre.name);

    if (sortGenres.length > 2) {
      return [...sortGenres.slice(0, 2), "Other"];
    } else {
      return sortGenres;
    }
  },

  resetLibrary() {
    refs.libraryContent.classList.remove("library__empty");
  },
};