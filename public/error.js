function showErrorHtml(response) {
    let status = response.status;
    let message = 'HTTP error ' + status + ' - ' + response.statusText;
    showError(message);
}

function showError(text) {
    let element = document.getElementById('main-container');
    // use bootstrap alert
    let html = '<div class=\"alert alert-warning\">'
        + 'Loading questions failed: ' + text + '.'
        + '</div>';
    element.innerHTML = html;
}

