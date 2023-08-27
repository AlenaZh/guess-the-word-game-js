let game, round;                                                          // Переменные для объектов игры и раунда(-ов)

const greetingGameScreen = document.getElementById("greetingGameScreen");
const btnOpenGameYes = document.getElementById("btnOpenGameYes");
const btnOpenGameNo = document.getElementById("btnOpenGameNo");

const selectLevelGameScreen = document.getElementById("selectLevelGameScreen");
const levelList = document.getElementById("levelList");

const roundScreen = document.getElementById("roundScreen");
const roundMask = document.getElementById("roundMask");
const roundCountLetter = document.getElementById("roundCountLetter");
const roundCountLife = document.getElementById("roundCountLife");
const fieldRound = document.getElementById("fieldRound");
const btnRound = document.getElementById("btnRound");

const statsScreen = document.getElementById("statsScreen");
const statsDifficulty = document.getElementById("statsDifficulty");
const statsWin = document.getElementById("statsWin");
const statsDef = document.getElementById("statsDef");
const statsTable = document.getElementById("statsTable");
const btnStats = document.getElementById("btnStats");

const newRoundScreen = document.getElementById("newRoundScreen");
const btnNewRoundYes = document.getElementById("btnNewRoundYes");
const btnNewRoundNo = document.getElementById("btnNewRoundNo");

const gameResultsScreen = document.getElementById("gameResultsScreen");
const gameResultText = document.getElementById("gameResultText");
const roundResult = document.getElementById("roundResult");

//Приветствие "Хотите сыграть?"
document.addEventListener("DOMContentLoaded", function () {
  greetingGameScreen.classList.toggle("screen--shown");                     // Отрображение экрана "Хотите сыграть?"
  fillLevelList(LEVEL_NAME);                                                // Заполнение списка доступных для выбора уровней сложности
});

//Если игрок отвечает "да", игрок может выбрать уровень сложности
btnOpenGameYes.addEventListener("click", function () {
  greetingGameScreen.classList.toggle("screen--shown");                     // Скрытие экрана "Хотите сыграть?"
  selectLevelGameScreen.classList.toggle("screen--shown");                  // Отрображение экрана "Выберите уровень сложности"
});

//Если игрок отвечает "нет", игра заканчивается
btnOpenGameNo.addEventListener("click", function () {
  greetingGameScreen.classList.toggle("screen--shown");                     // Скрытие экрана "Хотите сыграть?"
  gameResultText.textContent = "Возвращайтесь!";                            // Итог игры
  gameResultsScreen.classList.toggle("screen--shown");                      // Отрображение экрана "Конец игры"
});

// Выбор уровня (клик по элементу списка)
levelList.addEventListener("click", function (e) {
  if (e.target && e.target.nodeName == "LI") {
    startGame(Number(e.target.dataset.level));                              // Начало игры с выбранным уровнем сложности (номер уровня сложности получаем из data-аттрибута "level")
  }
});

// Ввод предполагаемой буквы / предполагаемого слова
// (нажатие на кнопку "Проверить")
btnRound.addEventListener("click", function () {
  let inputString = fieldRound.value.trim().toLowerCase();                  // Получение строки из поля ввода, удаление пробельных символов с начала и конца строки, преобразованние в нижний регистр
  fieldRound.classList.remove("round__field--error");                       // Удаление у элемента поля ввода класса "round__field--error"
  if (checkValidity(inputString)) {                                         // Проверка на валидность введенной строки. Если строка соответсвует условиям:
    fieldRound.value = "";                                                      // 1. Очистка поля ввода
    if (tryGuess(inputString)) showMaskWord(round);                             // 2. Проверка введенной строки на совпадение с загаданным словом (буквами слова). Если есть совпадение обновляем на экране маску слова
    else roundCountLife.textContent = round.lifes;                              // 3. Если совпадения нет, обновляем на экране количество жизней
  } else {                                                                  // Если строка не соответсвует условиям:
    void fieldRound.offsetWidth;                                                // 1. Запускаем перекомпоновку(reflow) DOM. Это нужно, чтобы после того, как мы удалили и вновь добавили класс "round__field--error" применились стили
    fieldRound.classList.add("round__field--error");                            // 2. Добавление к элементу поля ввода класса "round__field--error", который нужен для сообщения пользователю, что введена строка содержащая недопустимые символы
  }
  checkRoundState(round);                                                   // Определение текущего состояния раунда (отгадано / не отгадано слово)
});

// Закрытие экрана "Рейтинг"
btnStats.addEventListener("click", function () {
  statsScreen.classList.toggle("screen--shown");                            // Скрытие экрана "Рейтинг"
  if (game.words.length !== 0) {                                            // Если список слов не закончился:
    newRoundScreen.classList.toggle("screen--shown");                           // 1. Отрображение экрана "Хотите сыграть еще раз?"
  }
  else {                                                                    // Если список слов закончился, подводится итог игры
    showGameResult(game);                                                       // 1. Подведение итогов игры
  }
});

//Если игрок соглашается сыграть ещё раз, начинается новый раунд
btnNewRoundYes.addEventListener("click", function () {
  newRoundScreen.classList.toggle("screen--shown");                         // Скрытие экрана "Хотите сыграть еще раз?"    
  startRound(game);                                                         // Начало нового раунда
});

//Если игрок отказывается сыграть ещё раз, подводится итог игры
btnNewRoundNo.addEventListener("click", function () {
  newRoundScreen.classList.toggle("screen--shown");                         // Скрытие экрана "Хотите сыграть еще раз?" 
  showGameResult(game);                                                     // Подведение итогов игры
});



// Заполнить список уровней
function fillLevelList(obj) {
  let lis = "";
  for (let key in obj) {
    lis += `<li data-level="${key}">${obj[key]}</li>`;                       // Формирование HTML-строки, содержащей элементы li с данными об уровнях сложности
  }
  levelList.innerHTML = lis;                                                 // Замена содержимого списка levelList HTML-разметкой, содержащейся в строке "lis"
} 

// Начало игры
function startGame(numLevel) {
  game = new Game(numLevel);                                                // Создание объекта игры (Game)
  selectLevelGameScreen.classList.toggle("screen--shown");                  // Скрытие экрана "Выберите уровень сложности"
  startRound(game);                                                         // Начало раунда
}

// Начало раунда
function startRound(game) {
  round = new Round(game);                                                  // Создание объекта раунда (Round)
  roundCountLetter.textContent = round.word.length;                         // Вывод количества букв в загаданном слове
  roundCountLife.textContent = round.lifes;                                 // Вывод количества жизней
  showMaskWord(round);                                                      // Отображение маски слова (неизвестные буквы заменены *)
  //console.log(round.word);
  roundScreen.classList.toggle("screen--shown");                            // Отображение экрана "Текущий раунд"
}

// Отображение маски загаданного слова текущего раунда (вывод в таблицу)
function showMaskWord(round) {
  roundMask.rows[0].replaceChildren();                                     // Удаление всех дочерних элементов первой строки таблицы roundMask
  for (let i = 0; i < round.mask.length; i++) {                            // Перебор символов маски слова
    let td = document.createElement("td");                                 // Создание элемента td (ячейка таблицы)
    let text = document.createTextNode(round.mask[i]);                     // Создание текстового узла с символом из маски
    td.appendChild(text);                                                  // Вставка текстового узла в конец элемента td
    roundMask.rows[0].appendChild(td);                                     // Вставка элемента td в конец первой строки таблицы roundMask
  }
}

// Проверка совпадения строки с загаданным словом (буквами слова)
function tryGuess(string) { 
  if (string.length == 1) {                                                // Если введена буква:
    if (!round.checkLetter(string)) {                                         // 1. Если нет совпадения среди букв загаданного слова:
      return false;                                                             // 1.1 возврат false
    }
  } else if (string.length > 1) {                                          // Иначе если введено слово:
    if (!round.checkFullWord(string)) {                                       // 1. Если нет совпадения с загаданным словом:
      return false;                                                             // 1.1 возврат false
    }
  }
  return true;                                                             // В других случаях возврат true
}

// Определение текущего состояния раунда (отгадано / не отгадано слово на данный момент)
function checkRoundState(round) {
  if (round.mask.indexOf("*") == -1 || round.lifes == 0) {                                    // Если маска слова не содержит "*" или количество жизней 0:
    round.endRound();                                                                             // 1. Конец раунда
    game.saveRound(round);                                                                        // 2. Сохранение раунда (результатов)

    if (round.verdict) {                                                                      // Проверка результата раунда (отгадано ли слово). Если отгадано:
      roundResult.classList.replace("round-result--def", "round-result--win");                    // 1. Отображение на экране "Результат раунда" надписи "ПОБЕДА"
    } else {                                                                                  //Если не отгадано :
      roundResult.classList.replace("round-result--win", "round-result--def");                    // 1. Отображение на экране "Результат раунда" надписи "ПОРАЖЕНИЕ"
    }

    setTimeout(function () {
      roundResult.classList.toggle("round-result--shown");                                    // Отображение экрана "Результат раунда" 
    }, 400);                                                                                  // с задержкой 400ms

    setTimeout(function () {
      roundScreen.classList.toggle("screen--shown");                                          // 1. Скрытие экрана "Текущий раунд"
      showStats(game);                                                                            // 2. Отображение рейтинга
    }, 2200);                                                                                 // с задержкой 2200ms

    setTimeout(function () {
      roundResult.classList.toggle("round-result--shown");                                    // Скрытие экрана "Результат раунда" 
    }, 2700);                                                                                 // с задержкой 2700ms
  }
}

// Отображение рейтинга раундов (вывод в таблицу statsTable)
function showStats(game) {
  statsDifficulty.innerHTML = game.level;                                                     // Вывод на экран сложности уровня
  statsWin.innerHTML = game.winCount;                                                         // Вывод на экран количества побед
  statsDef.innerHTML = game.defCount;                                                         // Вывод на экран количества поражений

  let headerTable = statsTable.tBodies[0].children[0].cloneNode(true);                        // Клонируем первую строку таблицы (в ней содержатся названия столбцов th)
  statsTable.tBodies[0].replaceChildren();                                                    // Удаляем дочерние элементы tbody таблицы
  statsTable.tBodies[0].appendChild(headerTable);                                             // Вставка клонированной ранее строки таблицы
  for (let i = 0; i < game.roundsResult.length; i++) {                                        // Перебор всех прошедших раундов игры
    let tr = document.createElement("tr");                                                    // Создание элемента tr (строка таблицы)
    tr.innerHTML = `<td>${game.roundsResult[i].word}</td> <td> ${game.roundsResult[i].verdict ? "Да" : "Нет"}</td> <td> ${convertTime(game.roundsResult[i].duration)}</td>`;  // Формирование ячеек строки: загаданное слово | Угадано слово или нет | время потраченное на раунд 
    statsTable.tBodies[0].appendChild(tr);                                                    // Вставка элемента tr в конец tbody таблицы statsTable
  }
  statsScreen.classList.toggle("screen--shown");                                              // Отображение экрана "Рейтинг" 
}

// Отображение итогов игры
let showGameResult = function (game) {
  if (game.winCount > game.defCount) {                                                                                                        // Если побед больше, чем поражений
    gameResultText.innerHTML = `Побед было больше, чем поражений! <br> Молодец!`;
  } else {                                                                                                                                    // Если побед меньше, чем поражений
    gameResultText.innerHTML = `Побед было меньше, чем поражений! <br> Но Вы всё равно молодец! <br>  В следующий раз получится лучше!`;
  }
  gameResultsScreen.classList.toggle("screen--shown");                                                                                        // Отрображение экрана "Конец игры"
};
