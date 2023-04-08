const baseUrl = 'http://localhost:9090';
const apiBaseUrl = '/api/v1';
const containerPrefix = 'category-';

function buildURL(endpoint) {
    return baseUrl + apiBaseUrl + endpoint;
}

function startup() {
    showQuizTypeButtons();
    hideMultipleChoiceElements();
    hideFlashCardElements();
    hideAllFlashCardElements();
    hideSettingsElements();

    showNavigationElements();
    document.getElementById("home-button").disabled = true;

    document.getElementById("topic").innerHTML = "Select Quiz Type";

    document.getElementById("categories").setAttribute("style", "display: content;");
    document.getElementById("titles").setAttribute("style", "display: content;");

    document.getElementById("multiple-choice-button").setAttribute("style", "display: content;");
    document.getElementById("flash-card-button").setAttribute("style", "display: content;");
    document.getElementById("all-flash-cards-button").setAttribute("style", "display: content;");
    document.getElementById("multiple-choice-container").setAttribute("style", "display: none;");
    document.getElementById("flash-card-container").setAttribute("style", "display: none;");
 
    let categoriesUrl = buildURL('/categories');

    fetch(categoriesUrl)
        .then(response => {
            if (!response.ok) {
                showErrorHtml(response);
                return Promise.reject(new Error(response.statusText));
            }
            return response.json();
        })
        .then(data => {
            console.log(data);

            let html = '';
            data.categories.forEach(element => {
                let category = element.toLowerCase().replace(/ /g, '-');
                let id = containerPrefix + category;
                console.log('id: ' + id);
                html += `<div class="container" id="${id}">${element}</div>`;
            });
            html += '';
            document.getElementById("categories").innerHTML = html;

            fetchTitles();
        })
        .catch(error => {
            showError(error);
            console.log(error);
        });
}

function fetchTitles() {
    let titlesUrl = buildURL('/titles');

    fetch(titlesUrl)
        .then(response => {
            if (!response.ok) {
                showErrorHtml(response);
                return Promise.reject(new Error(response.statusText));
            }
            return response.json();
        })
        .then(data => {
            console.log(data);

            data.titles.forEach(element => {
                let category = element.category.toLowerCase().replace(/ /g, '-');
                let id = containerPrefix + category;
                console.log('id: ' + id);
                let container = document.getElementById(id);
                console.log(container);
    
                container.innerHTML += '<li><a href="#">' + element.title + '</a></li>';
            });
        })
        .catch(error => {
            showError(error);
            console.log(error);
        });
}