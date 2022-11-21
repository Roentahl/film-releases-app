// global const
const API_KEY = 'cda4fa97-c203-4818-b207-28de27eb0201';


// get query-params
const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop)
});

let queryParam = params.page;

if (!queryParam) {
  queryParam = 1;
  history.pushState(null, null, '?page=1');
};

// Month arrays
const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthRu = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const currentMonthText = month[currentMonth].toUpperCase();
const currentMonthTextRu = monthRu[currentMonth];

// DOM elements
const appList = document.querySelector('.app__list');
const spanMonth = document.querySelector('.month');
const spanYear = document.querySelector('.year');
const paginations = document.querySelectorAll('.app__pagination');
const errorEl = document.querySelector('.app__error');
const loaderEl = document.querySelector('.app__loader');

// declension of numbers
const seclOfNum = (number, titles) => {
  let cases = [2, 0, 1, 1, 1, 2];
  return titles[ (number%100>4 && number%100<20) ? 2 : cases[ (number%10<5) ? number%10:5 ] ];
};

// set month
spanMonth.textContent = currentMonthTextRu;

// set year
spanYear.textContent = currentYear;

const initApp = (page) => {
  const url = `https://kinopoiskapiunofficial.tech/api/v2.1/films/releases?year=${currentYear}&month=${currentMonthText}&page=${page}`;

  fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    }
  })
  .then((response) => {
    if (response.status === 404) {
      throw Error('По данному запросу ничего не найдено :(');
    } else if (response.status === 500) {
      throw Error('Произошла ошибка, пожалуйста, попробуйте обновить страницу позже');
    };

    return response.json();
  })
  .then((data) => {
    errorEl.style.display = 'none';
    loaderEl.style.display = 'none';

    //get num of pages for pagination
    const total = data.total;
    const pages = Math.ceil(total / 10);

    for (let i = pages; i >= 1; i--) {
      paginations.forEach(el => {
        el.insertAdjacentHTML('afterbegin', `
          <li class="app__pagination-item">
            <a href="?page=${i}" class="app__pagination-link ${i == queryParam ? 'app__pagination-link--current' : ''}">${i}</a>
          </li>
        `);
      });
    };

    return data;
  })
  .then((data) => {
    for (release of data.releases) {
      const rating = release.rating ? release.rating.toFixed(1) : 'Недостаточно голосов';
      const genres = release.genres.map(genre => Object.values(genre)[0]).toString().replace(/,/g, ', ');
      const duration = `${release.duration} ${seclOfNum(release.duration, ['минута', 'минуты', 'минут'])}`;
      const dateOptions = {
        month: 'long',
        day: 'numeric',
      };
      const date = new Date(release.releaseDate).toLocaleDateString('ru-Ru', dateOptions);

      appList.insertAdjacentHTML('beforeend', `
        <li class="app__list-item">
          <article class="app__card film-card">
            <a href="https://kinopoisk.ru/film/${release.filmId}" target="_blank" class="film-card__link">
              <div class="film-card__img-wrap">
                <img src="${release.posterUrlPreview}" alt="${release.nameRu ? release.nameRu : release.nameEn}" loading="lazy" class="film-card__img">
                <div class="film-card__details">
                  <div class="film-card__rating ${release.rating == null ? 'film-card__rating--null' : ''}">${rating}</div>
                  <div class="film-card__genres">${genres}</div>
                  <div class="film-card__duration ${release.duration == 0 ? 'film-card__duration--hidden' : ''}">${duration}</div>
                </div>
              </div>
              <h2 class="film-card__title">${release.nameRu ? release.nameRu : release.nameEn}</h2>
              <div class="film-card__release-date">${date}</div>
            </a>
          </article>
        </li>
      `);
    }
  })
  .catch((err) => {
    console.log(err.name)
    if (err.name === 'TypeError') {
      errorEl.textContent = 'Введен неверный адрес';
    } else {
      errorEl.textContent = err.message;
    }
    errorEl.style.display = 'block';
    loaderEl.style.display = 'none';
  })


};

initApp(queryParam);
