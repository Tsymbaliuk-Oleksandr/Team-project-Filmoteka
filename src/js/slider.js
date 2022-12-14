import TmDbApi from "../js/services/fetchApi";

import Swiper from "../../node_modules/swiper/swiper-bundle";
import "../../node_modules/swiper/swiper-bundle.css";

const popularCinema = new TmDbApi();

async function addSliderCinema() {
  const sliderEl = document.querySelector(".slider");
  try {
    const dataCinemas = await popularCinema.fetchTrendingMovies();
    const cinemas = dataCinemas.results;

    const markup = cinemas
      .map((cinema) => {
        const { id, original_title, release_date, genre_ids, poster_path } =
          cinema;
        return `<div class="slider-item swiper-slide">
                <img src="https://image.tmdb.org/t/p/w500${poster_path}" data-source="https://image.tmdb.org/t/p/w500${poster_path}" data-page="homepage" alt="${original_title}" quiet="" on="" the="" western="" front=""/>
            
 </div>`
        }).join("") 
        sliderEl.innerHTML = markup;
        const swiper = new Swiper(".mySwiper", {
            slidesPerView: 7,
            spaceBetween: 10,
            speed: 250,
            autoplay: {
              delay: 2500,
              disableOnInteraction: false,
            },
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
            loop: true,
            breakpoints: {
              "@0.00": {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              "@0.75": {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              "@1.00": {
                slidesPerView: 7,
                spaceBetween: 10,
              },
              "@1.50": {
                slidesPerView: 7,
                spaceBetween: 10,
              },
            },
          });
    } catch (error) {

    console.log(error.message);
  }
}
export default addSliderCinema;
