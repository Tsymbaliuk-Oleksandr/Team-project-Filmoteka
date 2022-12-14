const team = document.querySelector('.footer-text__link');
const backdropTeam = document.querySelector('.backdrop-team');
const closeTeam = document.querySelector('.modal-team__button');
const body = document.querySelector('body');
const modalTeam = document.querySelector('.modal-team__container');
const heartIcon = document.querySelector('.footer-text__icon');

// 

team.addEventListener('click', onTeamClick);
closeTeam.addEventListener('click', onCloseTeamClick);
backdropTeam.addEventListener('click', onCloseClickBackdrop);

function onTeamClick(e) {
  e.preventDefault();
  backdropTeam.classList.remove('is-hidden');
  body.classList.add('modal-open');

  if (e.target !== e.currentTarget) {
    window.addEventListener('keydown', onEscKeyPress);
    body.classList.add('modal-open');
    backdropTeam.classList.remove('is-hidden');
  }
}

function onCloseTeamClick(e) {
  window.removeEventListener('keydown', onEscKeyPress);
  backdropTeam.classList.add('is-hidden');
  body.classList.remove('modal-open');
  heartIcon.classList.add('animate__heartBeat');
}

function onCloseClickBackdrop(e) {
  if (e.target == e.currentTarget) {
    body.classList.remove('modal-open');
    backdropTeam.classList.add('is-hidden');
  }
}

function onEscKeyPress(e) {
  if (e.code === 'Escape') {
    onCloseTeamClick();
  }
}
