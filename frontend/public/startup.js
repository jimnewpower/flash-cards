const baseUrl = 'http://localhost:9090';
const apiBaseUrl = '/api/v1';
const containerPrefix = 'category-';
const categoryIdPrefix = 'category-id-';
const titleIdPrefix = 'title-id-';

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
                let parentID = containerPrefix + category;
                console.log('parentID: ' + parentID);
                let container = document.getElementById(parentID);
                console.log(container);
    
                let id = generateIdFromCategoryAndTitle(element.category, element.title);
                console.log('id: ' + id);

                console.log('category: ' + getCategoryFromIdString(id));
                console.log('title: ' + getTitleFromIdString(id));

                container.innerHTML += `<li><a href="#" id="${id}">${element.title}</a></li>`;
            });

            data.titles.forEach(element => {
                let id = generateIdFromCategoryAndTitle(element.category, element.title);
                console.log('id: ' + id);
                document.getElementById(id).addEventListener('click', function() {
                    console.log('clicked: Category: ' + getCategoryFromIdString(id) + ' Title: ' + getTitleFromIdString(id));
                });
            });
        })
        .catch(error => {
            showError(error);
            console.log(error);
        });
}

function generateIdFromCategoryAndTitle(category, title) {
    return categoryIdPrefix 
        + category.toLowerCase().replace(/ /g, '-') 
        + '-' 
        + titleIdPrefix
        + title.toLowerCase().replace(/ /g, '-');
}

function getCategoryFromIdString(id) {
    let start = categoryIdPrefix.length;
    let end = id.indexOf(titleIdPrefix) - 1;

    let str = id.substring(start, end).replace(/-/g, ' ');
    return capitalizeEachWord(str);
}

function getTitleFromIdString(id) {
    let str = id.substring(id.indexOf(titleIdPrefix) + titleIdPrefix.length).replace(/-/g, ' ');

    return capitalizeEachWord(str);
}

function capitalizeEachWord(str) {
    const words = str.split(" ");

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }

    return words.join(" ");
}