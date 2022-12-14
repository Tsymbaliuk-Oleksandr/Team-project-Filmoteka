import { refs } from "./refs";
import { library } from "./library-render";

export function checkStorage() {
  if (!localStorage.getItem("storage")) {
    const LOCAL_STORAGE_DATA = {
      watched: [],
      que: [],
    };
    localStorage.setItem("storage", JSON.stringify(LOCAL_STORAGE_DATA));
  }
}

checkStorage();

const savedStorage = localStorage.getItem("storage");
let parsedStorage = JSON.parse(savedStorage);

export function addToWatch(e) {
  let filmId = refs.modalImg.dataset.img;

  if (!parsedStorage.watched.includes(filmId)) {
    parsedStorage.watched.push(filmId);
    localStorage.setItem("storage", JSON.stringify(parsedStorage));
    refs.modalWatch.textContent = "remove from watched";

    if (
      document.body.classList.contains("library") &&
      document.body.classList.contains("watched")
    ) {
      library.watchedRender();
    }
    return;
  }

  parsedStorage.watched.splice(parsedStorage.watched.indexOf(filmId), 1);
  refs.modalWatch.textContent = "Add to watched";
  localStorage.setItem("storage", JSON.stringify(parsedStorage));
  if (
    document.body.classList.contains("library") &&
    document.body.classList.contains("watched")
  ) {
    library.watchedRender();
  }
}

export function addToQue(e) {
  markeringHomePage();
  let filmId = refs.modalImg.dataset.img;
  refs.modalQueue.textContent = "remove from queue";
  if (!parsedStorage.que.includes(filmId)) {
    parsedStorage.que.push(filmId);
    localStorage.setItem("storage", JSON.stringify(parsedStorage));

    if (
      document.body.classList.contains("library") &&
      document.body.classList.contains("queue")
    ) {
      library.queueRender();
    }

    return;
  }

  parsedStorage.que.splice(parsedStorage.que.indexOf(filmId), 1);
  localStorage.setItem("storage", JSON.stringify(parsedStorage));
  refs.modalQueue.textContent = "Add to queue";
  if (
    document.body.classList.contains("library") &&
    document.body.classList.contains("queue")
  ) {
    library.queueRender();
  }
}

refs.modalQueue.addEventListener("click", addToQue);
refs.modalWatch.addEventListener("click", addToWatch);

export function checkWatchedFilm() {
  let filmId = refs.modalImg.dataset.img;

  return parsedStorage.watched.includes(filmId)
    ? (refs.modalWatch.textContent = "remove from watched")
    : (refs.modalWatch.textContent = "Add to watched");
}

export function checkQueue() {
  let filmId = refs.modalImg.dataset.img;

  return parsedStorage.que.includes(filmId)
    ? (refs.modalQueue.textContent = "remove from queue")
    : (refs.modalQueue.textContent = "Add to queue");
}

export function markeringHomePage() {
  const liba = [...document.querySelectorAll(".gallery__card")];
  liba.map((item) => {
    if (parsedStorage.watched.includes(item.dataset.id)) {
      item.lastElementChild.classList.add("label-w");
    }
    if (parsedStorage.que.includes(item.dataset.id)) {
      item.lastElementChild.firstElementChild.classList.add("label-q");
    }
    return;
  });
}
