function showSettings() {
    hideFlashCardElements();
    hideMultipleChoiceElements();

    document.getElementById("home-button").disabled = false;
    document.getElementById("settings-button").disabled = true;
    document.getElementById("topic").innerHTML = "Settings";
}