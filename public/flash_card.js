const flashCardFile = './java-flash.json';

let flashCards = [];
let usedFlashCardIndexes = [];
let currentFlashCard = 0;

function startFlashCardQuiz() {
    initializeFlashCardVariables();
    fetchFlashCardData();
}

function fetchFlashCardData() {
    fetch(flashCardFile)
    .then(response => {
        if (!response.ok) {
            showErrorHtml(response);
            return Promise.reject(new Error(response.statusText));
        }
        return response.json();
    })
    .then(data => {
        // Set up the initial flash card
        if (data.topic != null) {
            document.getElementById("topic").innerHTML = data.topic;
        }
        if (data.language != null) {
            highlightLanguage = data.language;
        }
        flashCards = data.flashcards;
        showRandomFlashCard();
    })
    .catch(error => {
        showError(error);
        console.log(error);
    });
}

function initializeFlashCardVariables() {
    flashCards = [];
    usedFlashCardIndexes = [];
    currentFlashCard = 0;

    showFlashCardElements();
    hideMultipleChoiceElements();

    document.getElementById("multiple-choice-button").setAttribute("style", "display: none;");
    document.getElementById("flash-card-button").setAttribute("style", "display: none;");

    document.getElementById("flash-next-button").setAttribute("style", "display: content;");
    document.getElementById("flash-new-quiz-button").setAttribute("style", "display: none;");
}

function nextFlashCard() {
    showRandomFlashCard();
}

function showRandomFlashCard() {
    showFlashCardProgress();
    let cardIndex = getRandomFlashCardIndex();
    if (cardIndex == -1) {
        // No more cards to show
        document.getElementById("flash-question").innerHTML = "No more cards to show";
        document.getElementById("flash-card-body").innerHTML = "Quiz complete";
        document.getElementById("flash-next-button").setAttribute("style", "display: none;");
        document.getElementById("flash-new-quiz-button").setAttribute("style", "display: content;");
        return;
    } else {
        document.getElementById("flash-question").innerHTML = `<h4>${flashCards[cardIndex].question}</h4>`;
        document.getElementById("flash-card-body").innerHTML = `<h4>${flashCards[cardIndex].answer}</h4>`;
    }
}

function showFlashCardProgress() {
    let progress = document.getElementById("flash-progress-bar");
    let percentComplete = Math.round((usedFlashCardIndexes.length) / flashCards.length * 100);
    progress.innerHTML = `${percentComplete}%`;
    progress.style.width = `${percentComplete}%`;
    progress.setAttribute("aria-valuenow", percentComplete);
    progress.setAttribute("aria-min", 0);
    progress.setAttribute("aria-max", flashCards.length);
}

function getRandomFlashCardIndex() {
    let max = flashCards.length;

    if (usedFlashCardIndexes.length == max) {
        return -1;
    }

    // Generate a random number between 0 and max
    let cardIndex = Math.floor(Math.random() * Math.floor(max));
    if (usedFlashCardIndexes.includes(cardIndex)) {
        return getRandomFlashCardIndex(max);
    } else {
        usedFlashCardIndexes.push(cardIndex);
        return cardIndex;
    }
}