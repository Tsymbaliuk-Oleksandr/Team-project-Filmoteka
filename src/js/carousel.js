import { refs } from "./refs";
import { moviesListRenderByTopAndSearch } from "./moviesListRenderByTopAndSearch";
import { library } from "./library-render";
import { selectedGenre, filterMovie } from "./filter";

export function carouselListener() {
  refs.carousel.addEventListener("click", (event) => {
    switch (true) {
      case event.target.classList.contains("carousel__left") ||
        event.target.classList.contains("arrow__left"):
        if (refs.pageCurrent > 1) {
          refs.pageCurrent -= 1;
          detectWTFisGoingOn();
        }
        break;

      case event.target.classList.contains("carousel__right") ||
        event.target.classList.contains("arrow__right"):
        if (refs.pageCurrent < refs.pageMax) {
          refs.pageCurrent += 1;
          detectWTFisGoingOn();
        }
        break;

      case event.target.classList.contains("more__right"):
        if (refs.pageCurrent - 2 >= 97) {
          if (refs.pageCurrent <= refs.pageMax - 3) {
            refs.pageCurrent += 3;
            detectWTFisGoingOn();
          } else {
            refs.pageCurrent = refs.pageMax;
            detectWTFisGoingOn();
          }
        } else {
          if (refs.pageCurrent <= refs.pageMax - 5) {
            refs.pageCurrent += 5;
            detectWTFisGoingOn();
          } else {
            refs.pageCurrent = refs.pageMax;
            detectWTFisGoingOn();
          }
        }
        break;

      case event.target.classList.contains("more__left"):
        if (refs.pageCurrent - 2 >= 97) {
          if (refs.pageCurrent > 3) {
            refs.pageCurrent -= 3;
            detectWTFisGoingOn();
          } else {
            refs.pageCurrent = 1;
            detectWTFisGoingOn();
          }
        } else {
          if (refs.pageCurrent > 5) {
            refs.pageCurrent -= 5;
            detectWTFisGoingOn();
          } else {
            refs.pageCurrent = 1;
            detectWTFisGoingOn();
          }
        }
        break;

      case event.target.classList.contains("carousel__number"):
        let pageNumber = parseInt(event.target.textContent);
        refs.pageCurrent = pageNumber;
        detectWTFisGoingOn();

        break;
    }
  });
}

function detectWTFisGoingOn() {
  if (document.body.classList.contains("home")) {
    if (selectedGenre.length !== 0) {
      refs.pageMax = filterMovie.options.totalPages;
      filterMovie.options.page = refs.pageCurrent;
      filterMovie.renderByGenre();
      carouselRender(refs.pageCurrent, refs.pageMax);
    } else {
      moviesListRenderByTopAndSearch.options.page = refs.pageCurrent;
      moviesListRenderByTopAndSearch.render();
      carouselRender(refs.pageCurrent, refs.pageMax);
    }
  }
  if (document.body.classList.contains("library")) {
    if (document.body.classList.contains("watched")) {
      library.watchedRender();
      carouselRender(refs.pageCurrent, refs.pageMax);
    }

    if (document.body.classList.contains("queue")) {
      library.queueRender();
      carouselRender(refs.pageCurrent, refs.pageMax);
    }
  }
}

export function carouselResizing() {
  const onResize = (observerEntries) => {
    observerEntries.forEach(({ target }) => {
      carouselRender(refs.pageCurrent, refs.pageMax);
    });
  };

  const resizeObserver = new ResizeObserver(onResize);

  resizeObserver.observe(refs.carousel);
}

export function carouselRender(page, totalPages) {
  refs.carouselLeft.classList.remove("disabled");
  refs.carouselRight.classList.remove("disabled");
  if (page === 1) {
    refs.carouselLeft.classList.add("disabled");
  }
  if (page === totalPages) {
    refs.carouselRight.classList.add("disabled");
  }
  if (page <= totalPages && page >= 1) {
    const carouselContent = document.querySelector(".carousel__content");
    const numberArray = [];
    const shortArray = [page - 2, page - 1, page, page + 1, page + 2];
    var cutOffLeft = null;
    var cutOffRight = null;
    var contentWidth = carouselContent.getBoundingClientRect().width;

    const numberPopulate = (number) => {
      let carouselNumber = document.createElement("div");
      carouselNumber.textContent = number;
      carouselNumber.classList.add("carousel__number");
      if (number == page) {
        carouselNumber.classList.add("selected");
      }
      carouselContent.appendChild(carouselNumber);
    };

    carouselContent.innerHTML = "";

    for (let i = 1; i <= totalPages; i += 1) {
      numberArray.push(i);
    }

    if (totalPages <= 5) {
      if (!refs.carouselLeft.classList.contains("hidden")) {
        refs.carouselLeft.classList.add("hidden");
        refs.carouselRight.classList.add("hidden");
      }
    } else {
      if (refs.carouselLeft.classList.contains("hidden")) {
        refs.carouselLeft.classList.remove("hidden");
        refs.carouselRight.classList.remove("hidden");
      }
    }

    if (contentWidth >= 290) {
      switch (true) {
        case totalPages <= 10:
          numberArray.forEach(numberPopulate);
          break;

        case page < 7:
          cutOffRight = numberArray.indexOf(9);
          numberArray.splice(cutOffRight, numberArray.length - 1);
          numberArray.forEach(numberPopulate);
          numberArray.length = totalPages - 3;
          carouselContent.insertAdjacentHTML(
            "beforeend",
            `<div class="carousel__number more__right">...</div>
      <div class="carousel__number corner">${totalPages}</div>`
          );
          break;

        case totalPages - page < 5:
          let toPad = 4 - (totalPages - page);
          cutOffLeft = numberArray.indexOf(page - (2 + toPad));
          numberArray.splice(0, cutOffLeft);
          if (numberArray[0] > 97) {
            numberArray.splice(0, 1);
          }
          carouselContent.insertAdjacentHTML(
            "beforeend",
            `<div class="carousel__number corner">1</div>
        <div class="carousel__number more__left">...</div>`
          );
          numberArray.forEach(numberPopulate);
          break;

        default:
          cutOffLeft = numberArray.indexOf(page - 2);
          numberArray.splice(0, cutOffLeft);
          cutOffRight = numberArray.indexOf(page + 3);
          numberArray.splice(cutOffRight, numberArray.length - 1);
          if (numberArray[0] > 97) {
            numberArray.splice(0, 1);
            numberArray.length = numberArray.length - 1;
          }
          carouselContent.insertAdjacentHTML(
            "beforeend",
            `<div class="carousel__number corner">1</div>
        <div class="carousel__number more__left">...</div>`
          );
          numberArray.forEach(numberPopulate);
          carouselContent.insertAdjacentHTML(
            "beforeend",
            `<div class="carousel__number more__right">...</div>
      <div class="carousel__number corner">${totalPages}</div>`
          );
          break;
      }
    } else {
      switch (true) {
        case totalPages < 6:
          numberArray.forEach(numberPopulate);
          break;

        case page < 3:
          cutOffLeft = 3 - page;
          shortArray.splice(0, cutOffLeft);
          for (let i = 1; i <= cutOffLeft; i += 1) {
            shortArray.push(shortArray[shortArray.length - 1] + 1);
          }
          shortArray.forEach(numberPopulate);
          break;

        case totalPages - page < 2:
          cutOffRight = 2 - 1 * (totalPages - page);
          for (let i = 1; i <= cutOffRight; i += 1) {
            shortArray.unshift(page - 2 - i);
          }
          shortArray.length = shortArray.length - cutOffRight;
          shortArray.forEach(numberPopulate);
          break;

        default:
          shortArray.forEach(numberPopulate);
          break;
      }
    }
  } else {
    console.error(
      `Requested page (${page}) is out of range (total pages: ${totalPages})`
    );
    return;
  }
}
