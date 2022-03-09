import { results } from './results';

function getLocalStorage() {
  if (localStorage.getItem('results')) {
    const localStorageValue = localStorage.getItem('results');
    Object.assign(results, JSON.parse(localStorageValue));
  }
}

export function setLocalStorage() {
  if (!localStorage.getItem('results')) {
    localStorage.setItem('results', JSON.stringify(results));
  }
}

window.addEventListener('load', getLocalStorage);
window.addEventListener('beforeunload', setLocalStorage);
