const multipleChoiceFile = './python.json';
const unAnsweredClass = "list-group-item list-group-item-action";
const correctAnswerClass = "list-group-item list-group-item-action list-group-item-success";
const incorrectAnswerClass = "list-group-item list-group-item-action list-group-item-danger";
const infoClass = "list-group-item list-group-item-info";

let currentMultipleChoiceCard = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let multipleChoiceCards = [];
let usedMultipleChoiceCardIndexes = [];
// highlight.js language for code blocks: read from the json files
let highlightLanguage = 'language-plaintext';

function startMultipleChoiceQuiz() {
    initializeMultipleChoiceVariables();

    fetch('./metadata.json')
        .then(response => {
            if (!response.ok) {
                showErrorHtml(response);
                return Promise.reject(new Error(response.statusText));
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            fetchMultipleChoiceQuestions();
        })
        .catch(error => {
            showError(error);
            console.log(error);
        });

}

function fetchMultipleChoiceQuestions() {
    fetch(multipleChoiceFile)
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
            multipleChoiceCards = data.questions;
            showRandomMultipleChoiceCard();
        })
        .catch(error => {
            showError(error);
            console.log(error);
        });
}

function initializeMultipleChoiceVariables() {
    currentMultipleChoiceCard = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    multipleChoiceCards = [];
    usedMultipleChoiceCardIndexes = [];

    showMultipleChoiceElements();
    hideFlashCardElements();

    document.getElementById("multiple-choice-button").setAttribute("style", "display: none;");
    document.getElementById("flash-card-button").setAttribute("style", "display: none;");

    document.getElementById("multiple-choice-card").setAttribute("style", "display: content;");
    document.getElementById("multiple-choice-code-block").innerHTML = ``;

    document.getElementById("multiple-choice-card").setAttribute("style", "display: content;");
    document.getElementById("multiple-choice-progress-div").setAttribute("style", "display: content;");
    document.getElementById("multiple-choice-progress-bar").setAttribute("style", "display: content;");

    document.getElementById("multiple-choice-results").setAttribute("style", "display: none;");

    document.getElementById("multiple-choice-next-button").setAttribute("style", "display: content;");
    document.getElementById("multiple-choice-new-quiz-button").setAttribute("style", "display: none;");
}

function nextMultipleChoiceQuestion() {
    showRandomMultipleChoiceCard();
}

function getRandomMultipleChoiceCardIndex(max) {
    if (usedMultipleChoiceCardIndexes.length == max) {
        return -1;
    }

    // Generate a random number between 0 and max
    let cardIndex = Math.floor(Math.random() * Math.floor(max));
    if (usedMultipleChoiceCardIndexes.includes(cardIndex)) {
        return getRandomMultipleChoiceCardIndex(max);
    } else {
        usedMultipleChoiceCardIndexes.push(cardIndex);
        return cardIndex;
    }
}

// Define the function to show a flash card
function showRandomMultipleChoiceCard() {
    currentMultipleChoiceCard = getRandomMultipleChoiceCardIndex(multipleChoiceCards.length);
    if (currentMultipleChoiceCard == -1) {
        endMultipleChoiceQuiz();
    } else {
        var card = multipleChoiceCards[currentMultipleChoiceCard];
        showMultipleChoiceCard(card);
    }
}

function showMultipleChoiceCard(card) {
    document.getElementById("multiple-choice-question").innerHTML = `<h3>${card.question}</h3>`;

    let elements = ['multiple-choice-option1', 'multiple-choice-option2', 'multiple-choice-option3', 'multiple-choice-option4'];

    document.getElementById("multiple-choice-code-block").innerHTML = ``;
    if (card.code != null) {
        let codeHtml = `<pre><code class="${highlightLanguage}">`;
        card.code.forEach(element => {
            codeHtml += element + '\n';
        });
        codeHtml += '</code></pre>';
        document.getElementById("multiple-choice-code-block").innerHTML = codeHtml;

        // Use highlight.js to highlight code blocks.
        hljs.highlightAll();
    }

    let choices = ['1)', '2)', '3)', '4)'];

    for (let i = 0; i < elements.length; i++) {
        document.getElementById(elements[i]).innerHTML = choices[i] + ' ' + card.options[i];
        document.getElementById(elements[i]).className = unAnsweredClass;
    }

    document.getElementById("multiple-choice-card-footer").innerHTML = `Question ${usedMultipleChoiceCardIndexes.length} of ${multipleChoiceCards.length}`;

    showMultipleChoiceProgress();
}

function showMultipleChoiceProgress() {
    let progress = document.getElementById("multiple-choice-progress-bar");
    let percentComplete = Math.round((usedMultipleChoiceCardIndexes.length-1) / multipleChoiceCards.length * 100);
    progress.innerHTML = `${percentComplete}%`;
    progress.style.width = `${percentComplete}%`;
    progress.setAttribute("aria-valuenow", percentComplete);
    progress.setAttribute("aria-min", 0);
    progress.setAttribute("aria-max", multipleChoiceCards.length);
}

function endMultipleChoiceQuiz() {
    let totalQuestions = multipleChoiceCards.length;
    let percentCorrect = Math.round(correctAnswers / totalQuestions * 100);
    let percentIncorrect = Math.round(incorrectAnswers / totalQuestions * 100);

    document.getElementById("multiple-choice-card").setAttribute("style", "display: none;");
    document.getElementById("multiple-choice-progress-div").setAttribute("style", "display: none;");
    document.getElementById("multiple-choice-progress-bar").setAttribute("style", "display: none;");

    document.getElementById("multiple-choice-results").setAttribute("style", "display: content;");
    document.getElementById("multiple-choice-text").innerHTML = `
        <h3>Quiz Complete</h3>
        You answered ${correctAnswers} out of ${totalQuestions} correctly (${percentCorrect}%).<br>
    `;

    document.getElementById("multiple-choice-progress-success").setAttribute("style", "width: " + percentCorrect + "%;");
    document.getElementById("multiple-choice-progress-success").innerHTML = `${percentCorrect}%`;
    document.getElementById("multiple-choice-progress-fail").setAttribute("style", "width: " + percentIncorrect + "%;");
    document.getElementById("multiple-choice-progress-fail").innerHTML = `${percentIncorrect}%`;

    document.getElementById("multiple-choice-next-button").setAttribute("style", "display: none;");
    document.getElementById("multiple-choice-new-quiz-button").setAttribute("style", "display: content;");
}

// Define the function to check the answer
function checkMultipleChoiceAnswer(selectedAnswer) {
    let elements = ['multiple-choice-option1', 'multiple-choice-option2', 'multiple-choice-option3', 'multiple-choice-option4'];

    // If user has already answered this question, do nothing
    for (let i = 0; i < elements.length; i++) {
        if (document.getElementById(elements[i]).className.includes(correctAnswerClass)
            || document.getElementById(elements[i]).className.includes(incorrectAnswerClass)) {
            return;
        }
    }

    let icon = 'check';
    let feedbackText = '';
    if (selectedAnswer == multipleChoiceCards[currentMultipleChoiceCard].answer) {
        correctAnswers++;
        feedbackText = 'Correct';
        icon = 'check';
    } else {
        incorrectAnswers++;
        feedbackText = 'Incorrect';
        icon = 'close';
    }

    let classes = [incorrectAnswerClass, incorrectAnswerClass, incorrectAnswerClass, incorrectAnswerClass];
    classes[multipleChoiceCards[currentMultipleChoiceCard].answer] = correctAnswerClass;

    for (let i = 0; i < elements.length; i++) {
        document.getElementById(elements[i]).className = classes[i];

        if (i === selectedAnswer) {
            document.getElementById(elements[i]).className += ' user-selection';
            let html = document.getElementById(elements[i]).innerHTML;
            document.getElementById(elements[i]).innerHTML = `<i class="material-icons">${icon}</i><b>${html}</b>`;
        }
    }
}