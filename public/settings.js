function showSettings() {
    hideQuizTypeButtons();
    hideFlashCardElements();
    hideMultipleChoiceElements();
    showSettingsElements();

    document.getElementById("home-button").disabled = false;
    document.getElementById("settings-button").disabled = true;
    document.getElementById("topic").innerHTML = "Settings";

    document.getElementById("settings-container").setAttribute("style", "display: content;");
    document.getElementById("settings-text").innerHTML = 
        `
        <h4>Keyboard Shortcuts</h4>
        <table padding="18">
            <tr><th>Key</th><th>Action</th></tr>
            <tr><td>Enter</td><td>Next question</td></tr>
            <tr><td>Right Arrow</td><td>Next question</td></tr>
            <tr><td>1</td><td>Select answer '1'</td></tr>
            <tr><td>2</td><td>Select answer '2'</td></tr>
            <tr><td>3</td><td>Select answer '3'</td></tr>
            <tr><td>4</td><td>Select answer '4'</td></tr>
        </table>
        `;
}