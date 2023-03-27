const file = './python.json';
const unAnsweredClass = "list-group-item list-group-item-action";
const correctAnswerClass = "list-group-item list-group-item-action list-group-item-success";
const incorrectAnswerClass = "list-group-item list-group-item-action list-group-item-danger";
const infoClass = "list-group-item list-group-item-info";

let currentCard = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let flashCards = [];
let usedCardIndexes = [];
// highlight.js language for code blocks: read from the json files
let highlightLanguage = 'language-plaintext';

function startQuiz() {
    initializeVariables();
    fetchQuestions();
}

function fetchQuestions() {
    fetch(file)
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
            flashCards = data.questions;
            showRandomFlashCard();
        })
        .catch(error => {
            showError(error);
            console.log(error);
        });
}

function initializeVariables() {
    currentCard = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    flashCards = [];
    usedCardIndexes = [];

    document.getElementById("card").setAttribute("style", "display: content;");
    document.getElementById("code-block").innerHTML = ``;

    document.getElementById("card").setAttribute("style", "display: content;");
    document.getElementById("progress-div").setAttribute("style", "display: content;");
    document.getElementById("progress-bar").setAttribute("style", "display: content;");

    document.getElementById("results").setAttribute("style", "display: none;");

    document.getElementById("next-button").setAttribute("style", "display: content;");
    document.getElementById("new-quiz-button").setAttribute("style", "display: none;");
}

function showErrorHtml(response) {
    let status = response.status;
    let message = 'HTTP error ' + status + ' - ' + response.statusText;
    showError(message);
}

function showError(text) {
    let element = document.getElementById('main_content');
    // use bootstrap alert
    let html = '<div class=\"alert alert-warning\">'
        + 'Loading questions failed: ' + text + '.'
        + '</div>';
    element.innerHTML = html;
}

function nextQuestion() {
    showRandomFlashCard();
}

function getRandomCardIndex(max) {
    if (usedCardIndexes.length == max) {
        return -1;
    }

    // Generate a random number between 0 and max
    let cardIndex = Math.floor(Math.random() * Math.floor(max));
    if (usedCardIndexes.includes(cardIndex)) {
        return getRandomCardIndex(max);
    } else {
        usedCardIndexes.push(cardIndex);
        return cardIndex;
    }
}

// Define the function to show a flash card
function showRandomFlashCard() {
    currentCard = getRandomCardIndex(flashCards.length);
    if (currentCard == -1) {
        endQuiz();
    } else {
        var card = flashCards[currentCard];
        showCard(card);
    }
}

function showCard(card) {
    document.getElementById("question").innerHTML = `<h3>${card.question}</h3>`;

    let elements = ['option1', 'option2', 'option3', 'option4'];

    document.getElementById("code-block").innerHTML = ``;
    if (card.code != null) {
        let codeHtml = `<pre><code class="${highlightLanguage}">`;
        card.code.forEach(element => {
            codeHtml += element + '\n';
        });
        codeHtml += '</code></pre>';
        document.getElementById("code-block").innerHTML = codeHtml;

        // Use highlight.js to highlight code blocks.
        hljs.highlightAll();
    }

    let choices = ['1)', '2)', '3)', '4)'];

    for (let i = 0; i < elements.length; i++) {
        document.getElementById(elements[i]).innerHTML = choices[i] + ' ' + card.options[i];
        document.getElementById(elements[i]).className = unAnsweredClass;
    }

    document.getElementById("card-footer").innerHTML = `Question ${usedCardIndexes.length} of ${flashCards.length}`;

    let progress = document.getElementById("progress-bar");
    let percentComplete = Math.round(usedCardIndexes.length / flashCards.length * 100);
    console.log('percentComplete: ' + percentComplete);
    progress.innerHTML = `${percentComplete}%`;
    progress.style.width = `${percentComplete}%`;
    progress.setAttribute("aria-valuenow", percentComplete);
    progress.setAttribute("aria-min", 0);
    progress.setAttribute("aria-max", flashCards.length);
}

function endQuiz() {
    let totalQuestions = correctAnswers + incorrectAnswers;
    let percentCorrect = Math.round(correctAnswers / totalQuestions * 100);
    let percentIncorrect = Math.round(incorrectAnswers / totalQuestions * 100);

    document.getElementById("card").setAttribute("style", "display: none;");
    document.getElementById("progress-div").setAttribute("style", "display: none;");
    document.getElementById("progress-bar").setAttribute("style", "display: none;");

    document.getElementById("results").setAttribute("style", "display: content;");
    document.getElementById("text").innerHTML = `
        <h3>Quiz Complete</h3>
        You answered ${correctAnswers} out of ${totalQuestions} correctly (${percentCorrect}%).<br>
    `;

    document.getElementById("progress-success").setAttribute("style", "width: " + percentCorrect + "%;");
    document.getElementById("progress-success").innerHTML = `${percentCorrect}%`;
    document.getElementById("progress-fail").setAttribute("style", "width: " + percentIncorrect + "%;");
    document.getElementById("progress-fail").innerHTML = `${percentIncorrect}%`;

    document.getElementById("next-button").setAttribute("style", "display: none;");
    document.getElementById("new-quiz-button").setAttribute("style", "display: content;");
}

// Define the function to check the answer
function checkAnswer(selectedAnswer) {
    let elements = ['option1', 'option2', 'option3', 'option4'];

    // If user has already answered this question, do nothing
    for (let i = 0; i < elements.length; i++) {
        if (document.getElementById(elements[i]).className.includes(correctAnswerClass)
            || document.getElementById(elements[i]).className.includes(incorrectAnswerClass)) {
            return;
        }
    }

    let icon = 'check';
    let feedbackText = '';
    if (selectedAnswer == flashCards[currentCard].answer) {
        correctAnswers++;
        feedbackText = 'Correct';
        icon = 'check';
    } else {
        incorrectAnswers++;
        feedbackText = 'Incorrect';
        icon = 'close';
    }

    let classes = [incorrectAnswerClass, incorrectAnswerClass, incorrectAnswerClass, incorrectAnswerClass];
    classes[flashCards[currentCard].answer] = correctAnswerClass;

    for (let i = 0; i < elements.length; i++) {
        document.getElementById(elements[i]).className = classes[i];

        if (i === selectedAnswer) {
            document.getElementById(elements[i]).className += ' user-selection';
            let html = document.getElementById(elements[i]).innerHTML;
            document.getElementById(elements[i]).innerHTML = `<i class="material-icons">${icon}</i><b>${html}</b>`;
        }
    }
}