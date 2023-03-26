const unAnsweredClass = "list-group-item list-group-item-action";
const correctAnswerClass = "list-group-item list-group-item-action list-group-item-success";
const incorrectAnswerClass = "list-group-item list-group-item-action list-group-item-danger";

let currentCard = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let flashCards = [];
let usedCardIndexes = [];

console.log('currentCard: ' + currentCard);
console.log('fetching data...');

fetch('./java.json')
	.then(response => {
		if (!response.ok) {
			console.log('error: ' + response);
			showErrorHtml(response);
			return Promise.reject(new Error(response.statusText));
		}
		return response.json();
	})
	.then(data => {
		// Set up the initial flash card
		console.log('data: ' + data);
        if (data.topic != null) {
            document.getElementById("topic").innerHTML = data.topic;
        }
        flashCards = data.questions;
		showRandomFlashCard();
	})
	.catch(error => {
		console.log(error);
	});

function showErrorHtml(response) {
	console.log('error: ' + response);
    let status = response.status;
    let message = 'HTTP error ' + status + ' - ' + response.statusText + '. For ' + githubApiUrl;
    console.log(message);
    let element = document.getElementById('main_content');
    // use bootstrap alert
    let html = '<div class=\"alert alert-warning\">'
        + 'Load projects failed: ' + message + '.'
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

    let cardIndex = Math.floor(Math.random() * Math.floor(max));
    console.log('cardIndex: ' + cardIndex);
    if (usedCardIndexes.includes(cardIndex)) {
        console.log('cardIndex already used: ' + cardIndex);
        return getRandomCardIndex(max);
    } else {
        usedCardIndexes.push(cardIndex);
        return cardIndex;
    }
}

// Define the function to show a flash card
function showRandomFlashCard() {
    console.log('showRandomFlashCard()');
    currentCard = getRandomCardIndex(flashCards.length);
    console.log('currentCard index: ' + currentCard);
    console.log('usedCardIndexes: ' + usedCardIndexes);

    document.getElementById("result").innerHTML = "";

    if (currentCard == -1) {
        let totalQuestions = correctAnswers + incorrectAnswers;
        document.getElementById("option1").className = correctAnswerClass;
        document.getElementById("option2").className = incorrectAnswerClass;
        document.getElementById("option3").className = unAnsweredClass;
        document.getElementById("option4").className = unAnsweredClass;

        document.getElementById("question").innerHTML = "End of quiz";
        document.getElementById("option1").innerHTML = `Correct: ${correctAnswers} of ${totalQuestions}`;
        document.getElementById("option2").innerHTML = `Incorrect: ${incorrectAnswers} of ${totalQuestions}`;
        document.getElementById("option3").innerHTML = `Percentage: ${Math.round(correctAnswers / (correctAnswers + incorrectAnswers) * 100)}%`;
        document.getElementById("option4").innerHTML = "";
        document.querySelector('button[type="button"]').disabled = true;
    } else {
        var card = flashCards[currentCard];

        console.log('card: ' + card);

        document.getElementById("question").innerHTML = `<h3>${card.question}</h3>`;

        let elements = ['option1', 'option2', 'option3', 'option4'];
        for (let i = 0; i < elements.length; i++) {
            document.getElementById(elements[i]).innerHTML = card.options[i];
            document.getElementById(elements[i]).className = unAnsweredClass;
        }
    }
}

// Define the function to check the answer
function checkAnswer(selectedAnswer) {
    console.log('selectedAnswer: ' + selectedAnswer);
    console.log('currentCard question: ' + flashCards[currentCard].question);
    console.log('flashCards[currentCard].answer: ' + flashCards[currentCard].answer);
    // var selectedAnswer = document.querySelector('input[name="answer"]:checked').value;

    if (selectedAnswer == flashCards[currentCard].answer) {
        correctAnswers++;
        document.getElementById("result").innerHTML = "Correct!";
    } else {
        incorrectAnswers++;
        document.getElementById("result").innerHTML = "Incorrect!";
    }

    let elements = ['option1', 'option2', 'option3', 'option4'];
    let classes = [incorrectAnswerClass, incorrectAnswerClass, incorrectAnswerClass, incorrectAnswerClass];
    classes[flashCards[currentCard].answer] = correctAnswerClass;

    for (let i = 0; i < elements.length; i++) {
        document.getElementById(elements[i]).className = classes[i];
    }
}