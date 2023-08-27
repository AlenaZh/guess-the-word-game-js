// Класс, описывающий игру
class Game {
  constructor(levelNum) {                                           // В конструктор передается номер уровня сложности
    this.level = LEVEL_NAME[levelNum];                              // Название уровня сложности
    this.words = WORDS[levelNum].slice();                           // Набор слов для игры, соответствующий уровню сложности
  }

  roundsResult = [];                                                // Раунды (массив объектов класса Round)
  winCount = 0;                                                     // Количество побед
  defCount = 0;                                                     // Количество поражений

  // Метод: сохраняет в массиве раунды; пересчитывает количество побед/поражений; сортирует массив раундов "от самого быстро угаданного слова до самого медленно не угаданного слова"
  saveRound(round) {                                               
    this.roundsResult.push(round);                                 // Помещаем в массив roundsResult объект round

    if (round.verdict) this.winCount++;                            // Если слово в раунде было отгадано (round.verdict - это true): увеличиваем количество побед на 1      
    else this.defCount++;                                          // Если слово в раунде не было отгадано (round.verdict - это false): увеличиваем количество поражений на 1 

    this.roundsResult.sort(function (a, b) {                       // Сортировка массива раундов по 2-ум признакам (результат раунда и время, потраченное на раунд)
      if (a.verdict == b.verdict) {                                // Если результаты двух раундов одинаковые (оба отгадано или оба не отгадано):
        return a.duration < b.duration ? -1 : 1;                      // 1. меньший индекс в массиве будет у раунда с мешьним временем
      } else {                                                     // Иначе, если результаты двух раундов различные:
        return a.verdict > b.verdict ? -1 : 1;                        // 1. меньший индекс в массиве будет у раунда с рзультатом true (отгадано) (true > false) 
      }
    });
  }
}

// Примечание: свойства, начинающиеся c префикса "_" будем считать "защищёнными", т.е. доступными только внутри класса

// Класс, описывающий раунд
class Round {
  constructor(game) {                                             // В конструктор передается объект игры
    this.word = getRandomArrayElement(game.words);                // Загаданное слово (Определяется случайно, с помощю вызова функции getRandomArrayElement)
    this._wordLetters = getSetStringLetters(this.word);           // Множество букв загаданного слова
    this.mask = this._getMask();                                  // Маска загаданного слова
    this._startTime = new Date().getTime();                       // Числовое значение даты начала раунда. Дата начала раунда - это дата создания объекта класса Round
  }

  lifes = LIFES_COUNT;                                            // Число "жизней"
  verdict = true;                                                 // Отгадано / не отгадано слово
  duration = 0;                                                   // Длительность раунда
  _endTime = "";                                                  // Дата окончания раунда
  _playerLetters = new Set();                                     // Множество букв, введенных игроком

  // Метод: проверяет совпадение буквы
  checkLetter(letter) {
    if (this._wordLetters.has(letter)) {                          // Если множество букв загаданного слова (_wordLetters) содержит указанную букву letter:
      this.verdict = true;                                            // 1. Обновляем статус на "Отгадано"
      this._addPlayerLetter(letter);                                  // 2. Добавляем букву letter в множество _playerLetters
      this.mask = this._getMask();                                    // 3. Обновляем маску загаданного слова
      return true;                                                    // 4. Возврат true
    } else {                                                      // Если множество букв загаданного слова (_wordLetters) не содержит указанную букву letter:
      this.verdict = false;                                           // 1. Обновляем статус на "Не отгадано"
      this._takeLife();                                               // 2. Отнимаем жизнь
      return false;                                                   // 3. Возврат false
    }
  }

  // Метод: проверяет совпадение слова
  checkFullWord(fullWord) {
    if (this.word == fullWord) {                                  // Если загаданное слово совпадает с указанным словом fullWord:
      this.verdict = true;                                            // 1. Обновляем статус на "Отгадано"
      this.mask = this.word;                                          // 2. Обновляем маску загаданного слова на загаданного слово (т.к. выявлено совпадение)
      return true;                                                    // 3. Возврат true
    } else {                                                      // Если загаданное слово не совпадает с указанным словом fullWord:
      this.verdict = false;                                           // 1. Обновляем статус на "Не отгадано"
      this._takeLife();                                               // 2. Отнимаем жизнь
      return false;                                                   // 3. Возврат false
    }
  }

  // Метод: окончание раунда
  endRound() {
    this._endTime = new Date().getTime();                             // Числовое значение даты на момент вызова метода endRound() - дата окончание раунда
    this.duration = this._endTime - this._startTime;                  // Вычисление длительности раунда, через разницу дат начала и окончания раунда
  }

  // Метод: формирование маски загаданного слова с учетом множества букв, введенных игроком
  _getMask() {
    let mask = "";
    for (let i = 0; i < this.word.length; i++) {                        // Перебор букв загаданного слова
      if (this._playerLetters.has(this.word[i])) mask += this.word[i];  // Если множество _playerLetters содержит i-ю букву загаданного слова: записываем в маску букву слова
      else mask += "*";                                                 // Иначе, если множество _playerLetters не содержит i-ю букву загаданного слова: записываем в маску символ "*"
    }
    return mask;                                                        // Возвращаем полученную маску
  }

  // Метод: добавление буквы во множенство _playerLetters
  _addPlayerLetter(letter) {
    this._playerLetters.add(letter);
  }

  // Метод: уменьшение количества "жизней" на 1
  _takeLife() {
    this.lifes--;
  }
}