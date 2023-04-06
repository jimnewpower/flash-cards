function startup() {
    showQuizTypeButtons();
    hideMultipleChoiceElements();
    hideFlashCardElements();
    hideAllFlashCardElements();
    hideSettingsElements();

    showNavigationElements();
    document.getElementById("home-button").disabled = true;

    document.getElementById("topic").innerHTML = "Select Quiz Type";
    document.getElementById("multiple-choice-button").setAttribute("style", "display: content;");
    document.getElementById("flash-card-button").setAttribute("style", "display: content;");
    document.getElementById("all-flash-cards-button").setAttribute("style", "display: content;");
    document.getElementById("multiple-choice-container").setAttribute("style", "display: none;");
    document.getElementById("flash-card-container").setAttribute("style", "display: none;");
 
    fetch('./metadata.json')
        .then(response => {
            if (!response.ok) {
                showErrorHtml(response);
                return Promise.reject(new Error(response.statusText));
            }
            return response.json();
        })
        .then(data => {
            // console.log(data);
        })
        .catch(error => {
            showError(error);
            console.log(error);
        });
}