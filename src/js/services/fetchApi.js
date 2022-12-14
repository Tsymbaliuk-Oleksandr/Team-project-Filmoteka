import axios from "axios";
axios.defaults.baseURL = "https://api.themoviedb.org/3/";
const API_KEY = "bef35a6880b17319422124db5bc1d407";
export default class TmDbApi {
  constructor() {
    this.options = {
      api_key: API_KEY,
      query: "",
      include_adult: false,
      page: 1,
    };
  }
  //в констракторе базовые параметры
  fetchTrendingMovies = async (page) => {
    const response = await axios.get(`/trending/movie/week`, {
      params: { ...this.options, page },
    });
    return response.data;
  };
  //fetchTrendingMovies возвращает массив объектов с топ фильмами на этой неделе
  fetchSearchMovies = async (query, page) => {
    const response = await axios.get("/search/movie", {
      params: { ...this.options, query, page },
    });
    return response.data;
  };
  //fetchSearchMovies возвращает массив объектов которые мы ищем
  fetchMovieDetail = async (movieId) => {
    const response = await axios.get(`/movie/${movieId}}`, {
      params: this.options,
    });
    return response.data;
  };
  //fetchMovieDetail возвращает объект с детальной информацией о фильме
  fetchMovieCast = async (movieId) => {
    const response = await axios.get(`/movie/${movieId}/credits`, {
      params: this.options,
    });
    return response.data;
  };
  //fetchMovieDetail возвращает масив объектов с информацией о актерах которые снимались в этом кино (ВНИМАНИЕ НЕ НА ВСЕ ФИЛЬМЫ ЕСТЬ ТАКАЯ ИНФА + НЕ ВЕЗДЕ ЕСТЬ АВАТРКИ АКТЕРОВ === НУЖНО ЗАДАВАТЬ СТАНТАРТНЫЙ АВАТАР)
  fetchMovieReviews = async (movieId) => {
    const response = await axios.get(`/movie/${movieId}/reviews`, {
      params: this.options,
    });
    return response.data;
  };
  //fetchMovieDetail возвращает масив объектов с ревьюхами пользователей на этом кино (ВНИМАНИЕ НЕ НА ВСЕ ФИЛЬМЫ ЕСТЬ ТАКАЯ ИНФА)
  fetchMovieTrailer = async (movieId) => {
    const response = await axios.get(
      `/movie/${movieId}/videos?language=en-US`,
      {
        params: this.options,
      }
    );
    const key = response.data.results[0].key;
    const src = `https://www.youtube.com/embed/${key}?autoplay=1`;
    return src;
  };
  // НЕ ЗАБЫВАЕМ ЧТО ПО УМОЛЧАНИЮ СЮДА ПЕРЕДАЕТЬСЯ СТРОКА, перед тем как передать сюда id преобразуйте ее к намберу (Number('id'))
  // Возвращает ссылку на ролик
  fetchMoviesByGenres = async (page, genres_ids) => {
    const response = await axios.get(
      `discover/movie?with_genres=${genres_ids}`,
      {
        params: { ...this.options, page },
      }
    );
    return response.data;
  };
  // genres_ids === строка в которую вписываем жанры по id (в genres.js есть все доступные жанры по id)
  // пример фетч запроса, вначале указываем пейдж для пагинации, а потом передаем строку с жанрами (от 1го до .... жанра)
  // Api.fetchMoviesByGenres(1, "27, 18, 16")
}
