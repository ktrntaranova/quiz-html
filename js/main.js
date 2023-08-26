/* 1. Функционал перемещения по карточкам, вперед и назад 
   2. проверка на ввод данных
   3. Получение(сбор) данных с карточек
   4. Записывать все введенные данные
   5. Реализовать работу прогресс бара
   6. Подсветка рамки для радио и чекбоксов */ 


const answers = {
    2: null,
    3: null,
    4: null,
    5: null,
};

// Движение вперед
const btnNext = document.querySelectorAll('[data-nav="next"]');
btnNext.forEach(function(button) {
    button.addEventListener("click", function() {
        const thisCard = this.closest("[data-card]");
        const thisCardNumber = parseInt(thisCard.dataset.card) // возвращает число, а не строчку

        if ( thisCard.dataset.validate == "novalidate") {
            navigate("next", thisCard);
            updateProgressBar("next", thisCardNumber);
        } else {
            // При движении вперед сохраняем данные в объекте
            saveAnswer(thisCardNumber, gatherCardData(thisCardNumber));

           // валидация на заполненность:
        if (isFilled(thisCardNumber) && checkOnRequired(thisCardNumber)) {
            navigate("next", thisCard);
            thisCard.classList.add("completed");
            updateProgressBar("next", thisCardNumber);           
        } else {
            alert("Сделайте ответ, прежде чем переходить далее.");
        }
       }   
    });
});

// Движение назад
const btnPrev = document.querySelectorAll('[data-nav="prev"]');
btnPrev.forEach(function(button) {
    button.addEventListener("click", function() {
        const thisCard = this.closest("[data-card]");
        const thisCardNumber = parseInt(thisCard.dataset.card)
        navigate("prev", thisCard);
        document.querySelector(`[data-card="${thisCard.dataset.card - 1}"]`)
        .classList.remove("completed");
        
      //  thisCard.classList.remove("completed");
        updateProgressBar("prev", thisCardNumber);
    });
});

// Функция для навигации вперед и назад
function navigate(direction, thisCard) {
    const thisCardNumber = parseInt(thisCard.dataset.card);
    let nextCard;

    if (direction == "next") {
        nextCard = thisCardNumber + 1;
    } else if (direction == "prev") {
        nextCard = thisCardNumber - 1;
    }

    thisCard.classList.add("hidden");
    document.querySelector(`[data-card="${nextCard}"]`).classList.remove("hidden");
}

// Функция сбора заполненных данных с карточки
function gatherCardData(number) {

    let result = [];

    // Находим карточку по номеру и data-атрибуту
    let currentCard = document.querySelector(`[data-card="${number}"]`);

    // Находим главный вопрос карточки
    const question = currentCard.querySelector("[data-question]").innerText;

    // 1. Находим все заполненные значения из радио кнопок
    const radioValues = currentCard.querySelectorAll('[type="radio"]');
   
    radioValues.forEach(function(item) {
        if (item.checked) {
            result.push({
                name: item.name,
                value: item.value
            });
        }
    });

    // 2. Находим все заполненные значения из чекбоксов
    const checkBoxValues = currentCard.querySelectorAll('[type="checkbox"]')
    checkBoxValues.forEach(function(item) {
        console.dir(item);
        if (item.checked) {
            result.push({
                name: item.name,
                value: item.value
            });
        }
    }) //

    // 3. Находим все заполненные значения из инпутов

    const inputValues = currentCard.querySelectorAll('[type="text"], [type="email"], [type="number"]'
        );
    inputValues.forEach(function(item) {
        itemValue = item.value;
        if ( itemValue.trim() !="" ) {
            result.push({
                name: item.name,
                value: item.value
            });
        }
    })

    const data = {
        question: question,
        answer: result
    };

    return data;
}

// Функция записи ответа в объект с ответами
function saveAnswer(number, data){
    answers[number] = data
}

// Функция проверки на заполненность
function isFilled(number) {
    if (answers[number].answer.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Ф-я для проверки email
function validateEmail(email) {
    const pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    return pattern.test(email);
}
// Проверка на заполненность required чекбоксов и инпутов с email
function checkOnRequired(number){
    const currentCard = document.querySelector(`[data-card="${number}"]`);
    const requiredFields = currentCard.querySelectorAll("[required]");

    const isValidArray = [];

    requiredFields.forEach(function(item) {

        if ( item.type == "checkbox" && item.checked == false) {
            isValidArray.push(false);
        } else if (item.type == "email") {
            if (validateEmail(item.value)) {
                isValidArray.push(true);
            } else {
                isValidArray.push(false);
            }
        }
    });

    if (isValidArray.indexOf(false) == -1) {
        return true;
    } else {
        return false
    }
}

// подсвечиваем рамку у радио кнопок
document.querySelectorAll(".radio-group").forEach(function (item) {
    item.addEventListener("click", function(e) {
        // Проверяем где произошел клик - внутри тега label или нет
        const label = e.target.closest("label");
        if ( label ) {
            // Отменяем активный класс у всех тегов label
            label.closest(".radio-group").querySelectorAll("label").forEach(function(item) {
                item.classList.remove("radio-block--active");
            })
            // Добавляем активный класс к label по которому был клик
            label.classList.add("radio-block--active");
        }
    })
})

// Подсвечиваем рамку у чекбоксов
document.querySelectorAll('label.checkbox-block input[type="checkbox"]').forEach(function(item) {
    item.addEventListener('change', function() {
       // Если чекбокс проставлен, то
       if ( item.checked) {
            // добавляем активный класс к тегу label в котором он лежит
            item.closest("label").classList.add("checkbox-block--active")
       } else {
            // в ином случае убираем активный класс
            item.closest("label").classList.remove("checkbox-block--active")
       }
    })
})

    // Отображение прогресс бара
function updateProgressBar(direction, cardNumber) {
     
    // Расчет всего кол-ва карточек
    const cards = document.querySelectorAll("[data-progress]");
    const totalCards = cards.length;
    let count = 0;

    cards.forEach((card) => {
        if (card.classList.contains("completed")) {
            count++;
        }
    });

    // Проверка направления перемещения
    if (direction == "next") {
        cardNumber = cardNumber + 1; 
    } else if (direction == "prev") {
        cardNumber = cardNumber - 1;
    }
  
        // Находим и обновляем прогресс бар
let progressBar = document.querySelector(`[data-card="${cardNumber}"]`).querySelector(".progress");

let progress = ((count /totalCards) * 100).toFixed();

if (progressBar) {
    // обновить число прогресс бара
    progressBar.querySelector(".progress__label strong").innerText = `${progress}%`;
    // обновить полоску прогресс бара
    progressBar.querySelector(".progress__line-bar").style = `width: ${progress}%`;
}

}

