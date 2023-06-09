const baseUrl = 'http://localhost:9090';
const apiBaseUrl = '/api/v1';
const containerPrefix = 'category-';
const categoryIdPrefix = 'category-id-';
const titleIdPrefix = 'title-id-';

// Preserve the category names read from the database, and map them to the element id's
const categoryNameMap = new Map();
// Preserve the title names read from the database, and map them to the element id's
const titleNameMap = new Map();

function buildURL(endpoint) {
    return baseUrl + apiBaseUrl + endpoint;
}

function startup() {
    showCategoriesAndTitles();
    hideQuizTypeButtons();
    hideMultipleChoiceElements();
    hideFlashCardElements();
    hideAllFlashCardElements();
    hideSettingsElements();

    showNavigationElements();
    document.getElementById("home-button").disabled = true;

    document.getElementById("topic").innerHTML = "Flash Cards";

    document.getElementById("categories").setAttribute("style", "display: content;");
    document.getElementById("titles").setAttribute("style", "display: content;");

    document.getElementById("multiple-choice-container").setAttribute("style", "display: none;");
    document.getElementById("flash-card-container").setAttribute("style", "display: none;");
 
    let categoriesUrl = buildURL('/categories');

    document.getElementById("categories").innerHTML = "Loading...";

    fetch(categoriesUrl)
        .then(response => {
            if (!response.ok) {
                showErrorHtml(response);
                return Promise.reject(new Error(response.statusText));
            }
            return response.json();
        })
        .then(data => {
            let html = '';
            data.categories.forEach(element => {
                let category = element.toLowerCase().replace(/ /g, '-');
                let id = containerPrefix + category;
                // console.log('id: ' + id);
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
            // console.log(data);

            data.titles.forEach(element => {
                let category = element.category.toLowerCase().replace(/ /g, '-');
                let parentID = containerPrefix + category;
                // console.log('parentID: ' + parentID);
                let container = document.getElementById(parentID);
                // console.log(container);
    
                let id = generateIdFromCategoryAndTitle(element.category, element.title);
                // console.log('id: ' + id);
                // console.log('category: ' + getCategoryFromIdString(id));
                // console.log('title: ' + getTitleFromIdString(id));

                categoryNameMap.set(id, element.category);
                titleNameMap.set(id, element.title);

                container.innerHTML += `<li><a href="#" id="${id}">${element.title}</a></li>`;
            });

            data.titles.forEach(element => {
                let id = generateIdFromCategoryAndTitle(element.category, element.title);
                // console.log('id: ' + id);
                document.getElementById(id).addEventListener('click', function() {
                    let category = getCategoryFromIdString(id);
                    let title = getTitleFromIdString(id);
                    // console.log('clicked: Category: ' + category + ' Title: ' + title);
                    fetchFromCategoryAndTitle(category, title);
                });
            });
        })
        .catch(error => {
            showError(error);
            console.log(error);
        });
}

function fetchFromCategoryAndTitle(category, title) {
    let url = buildURL('/flashcards?category=' + encodeURIComponent(category) + '&title=' + encodeURIComponent(title));
    // console.log('url:' + url);
    startFlashCardQuiz(url);
    document.getElementById("topic").innerHTML = `${category} - ${title}`;
}

function generateIdFromCategoryAndTitle(category, title) {
    return categoryIdPrefix 
        + category.toLowerCase().replace(/ /g, '-') 
        + '-' 
        + titleIdPrefix
        + title.toLowerCase().replace(/ /g, '-');
}

function getCategoryFromIdString(id) {
    return categoryNameMap.get(id);
}

function getTitleFromIdString(id) {
    return titleNameMap.get(id);
}

function capitalizeEachWord(str) {
    const words = str.split(" ");

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }

    return words.join(" ");
}