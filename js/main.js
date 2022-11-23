// declension of numbers
const seclOfNum = (number, titles) => {
  let cases = [2, 0, 1, 1, 1, 2];
  return titles[ (number%100>4 && number%100<20) ? 2 : cases[ (number%10<5) ? number%10:5 ] ];
};

function createPagination(totalPages, queryParam) {
  const pagination = document.createElement('ul');
  pagination.classList.add('list-reset', 'app__pagination');

  const pages = Math.ceil(totalPages / 10);

  for (let i = 1; i <= pages; i++) {
    const paginationItem = document.createElement('li');
    const paginationLink = document.createElement('a');

    paginationItem.classList.add('app__pagination-item');
    paginationLink.classList.add('app__pagination-link');
    paginationLink.href = `?page=${i}`;
    paginationLink.textContent = i;

    if (i == queryParam) {
      paginationLink.classList.add('app__pagination-link--current');
    }

    paginationItem.append(paginationLink);

    pagination.append(paginationItem);
  };

  return pagination;
};

function createFilmCard({ filmId, nameRu, nameEn, rating, genres, duration, releaseDate, posterUrlPreview }) {
  const filmCard = document.createElement('article');
  const filmLink = document.createElement('a');
  const filmImgWrap = document.createElement('div');
  const filmPoster = document.createElement('img');
  const filmDetails = document.createElement('div');
  const filmRating = document.createElement('div');
  const filmGenres = document.createElement('div');
  const filmDuration = document.createElement('div');
  const filmTitle = document.createElement('h2');
  const filmReleaseDate = document.createElement('div');

  filmCard.classList.add('app__card', 'film__card');
  filmLink.classList.add('film-card__link');
  filmImgWrap.classList.add('film-card__img-wrap');
  filmPoster.classList.add('film-card__img');
  filmDetails.classList.add('film-card__details');
  filmRating.classList.add('film-card__rating');
  filmGenres.classList.add('film-card__genres');
  filmDuration.classList.add('film-card__duration');
  filmTitle.classList.add('film-card__title');
  filmReleaseDate.classList.add('film-card__release-date');

  if (rating == null) {
    filmRating.classList.add('film-card__rating--null');
  }

  filmLink.href = `https://kinopoisk.ru/film/${filmId}`;
  filmLink.target = '_blank';

  filmPoster.src = posterUrlPreview;
  filmPoster.alt = nameRu ? nameRu : nameEn;
  filmPoster.loading = 'lazy';

  filmRating.textContent = rating ? rating.toFixed(1) : 'Недостаточно голосов';

  filmGenres.textContent = genres.map(genre => Object.values(genre)[0]).toString().replace(/,/g, ', ');

  if (duration == 0) {
    filmDuration.classList.add('film-card__duration--hidden')
  } else {
    filmDuration.textContent = `${duration} ${seclOfNum(duration, ['минута', 'минуты', 'минут'])}`;
  }

  filmTitle.textContent = nameRu ? nameRu : nameEn;

  const dateOptions = {
    month: 'long',
    day: 'numeric',
  };
  const date = new Date(releaseDate).toLocaleDateString('ru-Ru', dateOptions);

  filmReleaseDate.textContent = date;

  filmCard.append(filmLink);
  filmLink.append(filmImgWrap, filmTitle, filmReleaseDate);
  filmImgWrap.append(filmPoster, filmDetails);
  filmDetails.append(filmRating, filmGenres, filmDuration);

  return filmCard;
};

async function createApp() {
  // get query-params
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop)
  });

  let queryParam = params.page;

  if (!queryParam) {
    queryParam = 1;
    history.pushState(null, null, '?page=1');
  };

  const monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthRu = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

  const container = document.querySelector('.app__container');
  const appTitle = document.createElement('h1');
  const month = document.createElement('span');
  const year = document.createElement('span');
  const list = document.createElement('ul');
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentMonthText = monthArr[currentMonth].toUpperCase();
  const currentMonthTextRu = monthRu[currentMonth];

  appTitle.classList.add('app__title');
  appTitle.textContent = 'Цифровые релизы фильмов ';
  list.classList.add('list-reset', 'app__list');
  month.classList.add('month');
  month.textContent = `${currentMonthTextRu} `;
  year.classList.add('year');
  year.textContent = currentYear;

  appTitle.append(month, year);

  container.append(appTitle, list);

  const data = await getFilmsData(currentMonthText, currentYear, queryParam);

  list.before(createPagination(data.total, queryParam));
  list.after(createPagination(data.total, queryParam));

  data.releases.forEach(item => {
    const filmCard = createFilmCard(item);
    list.append(filmCard)
  });
};

async function getFilmsData(month, year, page) {
  const API_KEY = 'cda4fa97-c203-4818-b207-28de27eb0201';
  const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.1/films/releases?year=${year}&month=${month}&page=${page}`, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    }
  });
  return await response.json();
};

createApp();
