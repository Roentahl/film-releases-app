// global const
const API_KEY = 'cda4fa97-c203-4818-b207-28de27eb0201';

const url = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/releases?year=2022&month=NOVEMBER&page=1';

// Month arrays
const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const monthRu = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

const currentYear = new Date().getFullYear();

// declension of numbers
const seclOfNum = (number, titles) => {
  let cases = [2, 0, 1, 1, 1, 2];
  return titles[ (number%100>4 && number%100<20) ? 2 : cases[ (number%10<5) ? number%10:5 ] ];
};
