let flashCards = [];
let usedFlashCardIndexes = [];
let currentFlashCard = 0;

function startFlashCardQuiz(filename) {
    initializeFlashCardVariables();
    fetchFlashCardData(filename);
}

function fetchFlashCardData(filename) {
    fetch(filename)
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
            console.log('highlightLanguage: ' + highlightLanguage);
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

    hideSettingsElements();
    hideQuizTypeButtons();
    showFlashCardElements();
    hideMultipleChoiceElements();
    showNavigationElements();

    document.getElementById("flash-next-button").setAttribute("style", "display: content;");
}

function nextFlashCard() {
    showRandomFlashCard();
}

function showRandomFlashCard() {
    showFlashCardProgress();
    let cardIndex = getRandomFlashCardIndex();
    if (cardIndex == -1) {
        // No more cards to show
        document.getElementById("flash-question").innerHTML = "No more cards to show.";
        document.getElementById("flash-card-body").innerHTML = "Quiz complete.";
        document.getElementById("flash-next-button").setAttribute("style", "display: none;");
        return;
    } else {
        let card = flashCards[cardIndex];
        populateFlashCard(card);
    }
}

function populateFlashCard(card) {
    document.getElementById("flash-question").innerHTML = `<h5>${card.question}</h5>`;

    document.getElementById("flash-card-body").innerHTML = ``;
    let html = ``;
    let answer = card.answer;
    if (answer != null) {
        html += answer;
    }

    let bullets = card.bullets;
    if (bullets != null) {
        html += `<ul>`;
        bullets.forEach(bullet => {
            html += `<li>${bullet}</li>`;
        });
    }
    document.getElementById("flash-card-body").innerHTML = html;

    document.querySelectorAll('span.code').forEach(el => {
        el.classList.add(highlightLanguage);

        // Avoid “One of your code blocks includes unescaped HTML” error
        el.textContent = escape(el.textContent.trim());

        // then highlight each
        hljs.highlightElement(el);
      });

    // Use highlight.js to highlight code blocks.
    hljs.highlightAll();
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