let allFlashCards = [];

function showAllFlashCards(filename) {
    hideQuizTypeButtons();
    showAllFlashCardElements();
    showNavigationElements();

    fetch(filename)
    .then(response => {
        if (!response.ok) {
            showErrorHtml(response);
            return Promise.reject(new Error(response.statusText));
        }
        return response.json();
    })
    .then(data => {
        if (data.topic != null) {
            document.getElementById("topic").innerHTML = data.topic;
        }
        if (data.language != null) {
            highlightLanguage = data.language;
            console.log('highlightLanguage: ' + highlightLanguage);
        }
        allFlashCards = data.flashcards;
        showCards();
    })
    .catch(error => {
        showError(error);
        console.log(error);
    });
}

function showCards() {
    let html = '';
    for (let i = 0; i < allFlashCards.length; i++) {
        let card = allFlashCards[i];

        let answer = card.answer;
        if (answer == null) {
            answer = '';
        }

        let bullets = card.bullets;
        if (bullets != null) {
            answer += `<ul>`;
            bullets.forEach(bullet => {
                answer += `<li>${bullet}</li>`;
            });
        }

        html += `
        <div class="card">
            <div class="card-header">
            ${card.question}
            </div>

            <div class="card-body" id="flash-card-body">
            ${answer}
            </div>
        </div><br>`;

    }
    document.getElementById("all-flash-cards-container").innerHTML = html;
}