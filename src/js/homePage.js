const HOME = document.querySelector('.home');
const ARTISTS = document.querySelector('.artists');
const PICTURES = document.querySelector('.pictures');
const SETTINGS = document.querySelector('.settings');
const PAGES = document.querySelectorAll('.page');
const QUESTION_CONTENT = document.querySelectorAll('.questionContent');

export function hideAllPages() {
  PAGES.forEach(el => {
    el.classList.add('hide');
  });
}

function loadArtistsQuiz() {
  hideAllPages();
  ARTISTS.classList.remove('hide');
}

function loadPicturesQuiz() {
  hideAllPages();
  PICTURES.classList.remove('hide');
}

function loadSettings() {
  hideAllPages();
  SETTINGS.classList.remove('hide');
}

export function loadHomePage() {
  hideAllPages();
  HOME.classList.remove('hide');
  QUESTION_CONTENT.forEach(el => {
    if (el.childNodes[1]) {
      el.childNodes[1].remove();
    }
  });
}

const checkClick = () => {
  const HOME_LOGO = document.querySelectorAll('.homeLogo');

  HOME.addEventListener('click', e => {
    let targetItem = e.target;
    if (targetItem.closest('.artistsBtn')) {
      loadArtistsQuiz();
    }
    if (targetItem.closest('.picturesBtn')) {
      loadPicturesQuiz();
    }
    if (targetItem.closest('.settingsBtn')) {
      loadSettings();
    }
  });

  HOME_LOGO.forEach(el => {
    el.addEventListener('click', loadHomePage);
  });
};
checkClick();
