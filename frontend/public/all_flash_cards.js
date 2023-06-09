let allFlashCards = [];

function showAllFlashCards(filename) {
    hideCategoriesAndTitles();
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
    let html = '<div class="row justify-content-center">';
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

        let spanner = '';
        if (i > 0 && i % 3 == 0) {
            spanner = '</div><div class="row justify-content-center">';
        }

        html += `${spanner}
        <div class="col-auto mb-3 d-flex align-items-stretch">
        <div class="card" style="width: 24rem;">
            <div class="card-header">
            ${card.question}
            </div>

            <div class="card-body d-flex flex-column">
            ${answer}
            </div>
        </div></div>`;
    }
    html += '</div>';
    document.getElementById("all-flash-cards-container").innerHTML = html;
}