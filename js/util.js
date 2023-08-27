// Поиск случайного элемента в массиве
function getRandomArrayElement(array) {
  if (array.length !== 0) {
    let indexElement = Math.floor(Math.random() * array.length);
    return array.splice(indexElement, 1)[0];
  } else return -1;
}

// Получение множества символов строки
function getSetStringLetters(str) {
  let letters = new Set();
  str.toLowerCase()
     .split("")
     .map(function (element) {
       letters.add(element);
     });
  return letters;
}

// Перевод мс в формат hh:mm:ss
function convertTime(timeMs) {
  let seconds = Math.floor(timeMs / 1000),
    minutes = Math.floor(seconds / 60),
    hours = Math.floor(minutes / 60);

  seconds %= 60;
  minutes %= 60;
  hours %= 24;

  if (hours < 10) {
    hours = "0" + hours;
  }

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  return `${hours}:${minutes}:${seconds}`;
}

// Проверка строки на наличие только латинских символов
function checkValidity(str) {
  if (/^[A-Za-z]+$/i.test(str)) return true;
  return false;
}
