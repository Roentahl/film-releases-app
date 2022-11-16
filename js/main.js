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
  .then((response) => response.json())
  .then((data) => {
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
  });


};

initApp(queryParam);
