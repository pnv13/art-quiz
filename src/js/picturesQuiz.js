import { hideAllPages } from './homePage';
import { loadHomePage } from './homePage';
import { results } from './results';

const PICTURES = document.querySelector('.pictures');
const BACK_BTN = document.querySelectorAll('.backBtnPic');
const QUESTION_CONTENT = document.querySelector('.questionContentPic');

const getData = async () => {
  const url = 'images.json';
  const response = await fetch(url);
  const data = await response.json();

  return data;
};

function loadPicturesQuiz() {
  hideAllPages();
  PICTURES.classList.remove('hide');
  QUESTION_CONTENT.childNodes.forEach((el, i) => {
    if (el.className === 'questionContent__wrapper') {
      QUESTION_CONTENT.childNodes[i].remove();
    }
  });
}

const loadQuestionsPage = () => {
  const QUESTIONS = document.querySelector('.questionsPic');

  hideAllPages();
  QUESTIONS.classList.remove('hide');
};

function loadImgForQuestion(elem, index, questionNumber, answerOptions) {
  const img = new Image();
  const IMG = elem;
  img.src = `https://raw.githubusercontent.com/pnv13/image-data/master/full/${
    answerOptions[questionNumber][index][2] + 'full'
  }.jpg`;
  img.onload = () => {
    IMG.style.backgroundImage = `url(${img.src})`;
  };
}

function loadImgForAnswer(arrIndex, itemIndex) {
  const img = new Image();
  const ARTISTS_PICTURE = document.querySelector('.artistsPicture');
  img.src = `https://raw.githubusercontent.com/pnv13/image-data/master/full/${
    arrIndex + itemIndex + 'full'
  }.jpg`;
  img.onload = () => {
    ARTISTS_PICTURE.style.backgroundImage = `url(${img.src})`;
  };
}

const drawCategoriesContent = (categories, index, posterIndex) => {
  let json;
  let obj;
  if (localStorage.getItem('results')) {
    json = localStorage.getItem('results');
    obj = JSON.parse(json);
  } else {
    obj = results;
  }
  let count = obj[posterIndex].filter(item => item === true).length;
  const categoryContent = `
      <div class="category__header">
        <span>${categories[index]}</span>
        <div class="category__results">
          <span class="current-result">${count}</span>
          <span>|</span>
          <span>10</span>
        </div>
      </div>
      <div class="category__img"></div>
      <div class="category__score hide"></div>
    `;
  return [categoryContent, count];
};

const checkAnswer = async (answer, arrIndex, itemIndex) => {
  const data = await getData();
  let result;
  let current = arrIndex + itemIndex;

  const popup = `
    <div class="popup">
      <div class="overlay"></div>
      <div class="popup__content">
        <div class="answerImg"></div>
        <div class="artistsPicture"></div>
        <div class="pictureName">${data[current].name}</div>
        <div class="pictureAuthor">${data[current].author}</div>
        <div class="pictureYear">${data[current].year}</div>
        <div class="okBtn">Ok</div>
      </div>
    </div>
  `;

  QUESTION_CONTENT.insertAdjacentHTML('beforeend', popup);

  const answerImg = document.querySelector('.answerImg');
  loadImgForAnswer(arrIndex, itemIndex);

  const audioWin = new Audio('./assets/sounds/yes.mp3');
  const audioLose = new Audio('./assets/sounds/no.mp3');
  const audioEndGame = new Audio('./assets/sounds/end.mp3');

  if (answer === 'yes') {
    answerImg.style.backgroundImage = 'url(./assets/img/true.png)';
    results[arrIndex][itemIndex] = true;
    result = true;
    audioWin.play();
  } else {
    answerImg.style.backgroundImage = 'url(./assets/img/false.png)';
    results[arrIndex][itemIndex] = false;
    result = false;
    audioLose.play();
  }

  const exit = document.querySelector('.okBtn');
  exit.addEventListener('click', () => {
    QUESTION_CONTENT.childNodes.forEach((el, i) => {
      if (el.className === 'popup') {
        QUESTION_CONTENT.childNodes[i].remove();
      }
    });
    if (itemIndex === 9) {
      audioEndGame.play();
      localStorage.setItem('results', JSON.stringify(results));

      let json;
      let obj;
      if (localStorage.getItem('results')) {
        json = localStorage.getItem('results');
        obj = JSON.parse(json);
      } else {
        obj = results;
      }
      let count = obj[arrIndex].filter(item => item === true).length;

      const finish = `
        <div class="popup">
          <div class="overlay"></div>
          <div class="popup__content">
            <div>Congratulations!</div>
            <div>${count} / 10</div>
            <div class="finish-cup"></div>
            <div class="finish-btns">
              <div class="backHome btn">home</div>
              <div class="nextQuiz btn">next</div>
            </div>
          </div>
        </div>
      `;

      QUESTION_CONTENT.insertAdjacentHTML('beforeend', finish);

      const finishCup = document.querySelector('.finish-cup');
      const nextQuiz = document.querySelector('.nextQuiz');
      const backHome = document.querySelector('.backHome');

      finishCup.style.backgroundImage = 'url(./assets/img/finish-cup.png)';
      nextQuiz.addEventListener('click', () => {
        loadPicturesQuiz();
        QUESTION_CONTENT.childNodes.forEach((el, i) => {
          if (el.className === 'popup') {
            QUESTION_CONTENT.childNodes[i].remove();
          }
        });
      });
      backHome.addEventListener('click', () => {
        loadHomePage();
        QUESTION_CONTENT.childNodes.forEach((el, i) => {
          if (el.className === 'popup') {
            QUESTION_CONTENT.childNodes[i].remove();
          }
        });
      });
    }
  });
  return result;
};

async function getOptions(baseIndex) {
  const data = await getData(baseIndex);

  let answerOptions = [];
  for (let i = baseIndex; i <= baseIndex + 9; i += 1) {
    let stack = [];
    let saveImgNum = [];
    saveImgNum.push(data[i].imageNum);
    stack.push(data[i].author);
    while (stack.length < 4) {
      let randomAuthor = data[Math.floor(Math.random() * data.length)];
      if (!stack.includes(randomAuthor.author)) {
        stack.push(randomAuthor.author);
        saveImgNum.push(randomAuthor.imageNum);
      }
    }
    stack = stack.map((item, index) => {
      if (index === 0) {
        return [item, 'yes', saveImgNum[index]];
      }
      return [item, 'no', saveImgNum[index]];
    });
    let result = [...stack].sort(() => Math.random() - 0.5);
    answerOptions.push(result);
  }
  return answerOptions;
}

const drawQuestions = async (baseIndex, questionNumber = 0, arr = []) => {
  let number = questionNumber + 1;
  let stack = [''];

  if (questionNumber === 10) {
    return;
  }

  if (arr.length > 0) {
    stack = arr.map(item => (item === true ? 'green' : 'red'));
  }

  const data = await getData();

  const QUESTION = document.querySelector('.questionPic');
  QUESTION.textContent = `Какую картину написал ${data[baseIndex + questionNumber].author}?`;

  let answerOptions = await getOptions(baseIndex);

  const questionContent = `
    <div class="questionContent__wrapper">
      <ul class="pagination">
        <li class="${stack[0]}"></li>
        <li class="${stack[1]}"></li>
        <li class="${stack[2]}"></li>
        <li class="${stack[3]}"></li>
        <li class="${stack[4]}"></li>
        <li class="${stack[5]}"></li>
        <li class="${stack[6]}"></li>
        <li class="${stack[7]}"></li>
        <li class="${stack[8]}"></li>
        <li class="${stack[9]}"></li>
      </ul>
      <ul class="pictures__quiz">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  `;
  QUESTION_CONTENT.insertAdjacentHTML('afterbegin', questionContent);

  const PICTURES__QUIZ = document.querySelectorAll('.pictures__quiz > li');

  PICTURES__QUIZ.forEach((elem, index) => {
    loadImgForQuestion(elem, index, questionNumber, answerOptions);

    elem.addEventListener('click', async () => {
      let chosenAnswer = answerOptions[questionNumber][index];
      QUESTION_CONTENT.childNodes[1].remove();
      let res = await checkAnswer(chosenAnswer[1], baseIndex, questionNumber);
      arr.push(res);
      drawQuestions(baseIndex, number, arr);
    });
  });
};

function loadPoster(category, posterIndex, count) {
  const img = new Image();
  const IMG = category.querySelector('.category__img');
  const CATEGORY__SCORE = category.querySelector('.category__score');
  img.src = `https://raw.githubusercontent.com/pnv13/image-data/master/img/${posterIndex}.jpg`;
  img.onload = () => {
    IMG.style.backgroundImage = `url(${img.src})`;
    if (count > 0) {
      CATEGORY__SCORE.classList.remove('hide');
      IMG.style.filter = 'none';
    } else {
      CATEGORY__SCORE.classList.add('hide');
      IMG.style.filter = 'grayscale(100%)';
    }
  };
}

function loadScoreImg(el, index, baseIndex) {
  let json;
  let obj;
  if (localStorage.getItem('results')) {
    json = localStorage.getItem('results');
    obj = JSON.parse(json);
  } else {
    obj = results;
  }

  const currentImg = baseIndex + index;
  const IMG = el;
  const img = new Image();
  img.src = `https://raw.githubusercontent.com/pnv13/image-data/master/img/${currentImg}.jpg`;
  img.onload = () => {
    IMG.style.backgroundImage = `url(${img.src})`;
    if (obj[baseIndex][index]) {
      IMG.style.filter = 'none';
    } else {
      IMG.style.filter = 'grayscale(100%)';
    }
  };
}

async function loadScorePage(baseIndex) {
  const SCORE = document.querySelector('.scorePic');
  const SCORE__LIST = document.querySelectorAll('.scoreListPic > li');

  const data = await getData();

  hideAllPages();
  SCORE.classList.remove('hide');
  SCORE__LIST.forEach((el, index) => {
    const currentImg = baseIndex + index;
    const content = `
      <ul class="scoreImgInfo hide">
        <li>${data[currentImg].name}</li>
        <li>${data[currentImg].author}</li>
        <li>${data[currentImg].year}</li>
      </ul>
    `;
    el.insertAdjacentHTML('afterbegin', content);

    loadScoreImg(el, index, baseIndex);
    el.addEventListener('click', e => {
      e.target.childNodes[1].classList.toggle('hide');
    });
  });
}

const drawCategories = () => {
  const PICTURES_ITEMS = document.querySelectorAll('.categories-pictures-item');
  const categories = [
    'Portrait',
    'Landscape',
    'Still Life',
    'Graphic',
    'Antique',
    'Avant-Garde',
    'Renaissance',
    'Surrealism',
    'Kitsch',
    'Minimalism',
    'Avangard',
    'Industrial'
  ];

  PICTURES_ITEMS.forEach((category, index) => {
    const posterIndex = (index + 12) * 10;

    const [categoryContent, count] = drawCategoriesContent(categories, index, posterIndex);

    category.insertAdjacentHTML('afterbegin', categoryContent);
    loadPoster(category, posterIndex, count);

    category.addEventListener('click', async e => {
      const targetItem = e.target;
      if (targetItem.closest('.category__score')) {
        loadScorePage(posterIndex);
      } else {
        await loadQuestionsPage();
        await drawQuestions(posterIndex);
      }
    });
  });

  function categoryUpdater() {
    PICTURES_ITEMS.forEach((artItem, artIndex) => {
      const posterIndex = (artIndex + 12) * 10;

      const CURRENT_RESULT = artItem.querySelector('.current-result');

      let json;
      let obj;
      if (localStorage.getItem('results')) {
        json = localStorage.getItem('results');
        obj = JSON.parse(json);
      } else {
        obj = results;
      }
      let currentValue = obj[posterIndex].filter(item => item === true).length;
      CURRENT_RESULT.innerHTML = currentValue;
      loadPoster(artItem, posterIndex, currentValue);
    });

    setTimeout(categoryUpdater, 1000);
  }
  categoryUpdater();
};
drawCategories();

BACK_BTN.forEach(button => {
  button.addEventListener('click', loadPicturesQuiz);
});
