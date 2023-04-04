const quizTypeButtons = [
    'multiple-choice-button',
    'flash-card-button',
    'all-flash-cards-button'
];

const settingsElements = [
    'settings-container',
    'settings-text'
];

const multipleChoiceElements = [
    'multiple-choice-container', 
    'multiple-choice-results', 
    'multiple-choice-progress-success', 
    'multiple-choice-progress-fail', 
    'multiple-choice-progress-div', 
    'multiple-choice-progress-bar', 
    'multiple-choice-next-button', 
    'multiple-choice-card', 
    'multiple-choice-question', 
    'multiple-choice-code-block', 
    'multiple-choice-option1', 
    'multiple-choice-option2', 
    'multiple-choice-option3', 
    'multiple-choice-option4', 
    'multiple-choice-card-footer'
];

const flashCardElements = [
    'flash-card-container',
    'flash-progress-div',
    'flash-progress-bar',
    'flash-next-button',
    'flash-card',
    'flash-question',
    'flash-card-body'
];

const allFlashCardElements = [
    'all-flash-cards-container'
];

const navigationElements = [
    'home-button',
    'settings-button'
];

const styleAttribute = "style";
const displayContentValue = "display: content";
const displayNoneValue = "display: none";

function showSettingsElements() {
    applyAttributeToElements(settingsElements, styleAttribute, displayContentValue);
}

function hideSettingsElements() {
    applyAttributeToElements(settingsElements, styleAttribute, displayNoneValue);
}

function showQuizTypeButtons() {
    applyAttributeToElements(quizTypeButtons, styleAttribute, displayContentValue);
}

function hideQuizTypeButtons() {
    applyAttributeToElements(quizTypeButtons, styleAttribute, displayNoneValue);
}

function showMultipleChoiceElements() {
    applyAttributeToElements(multipleChoiceElements, styleAttribute, displayContentValue);
}

function hideMultipleChoiceElements() {
    applyAttributeToElements(multipleChoiceElements, styleAttribute, displayNoneValue);
}

function showFlashCardElements() {
    applyAttributeToElements(flashCardElements, styleAttribute, displayContentValue);
}

function hideFlashCardElements() {
    applyAttributeToElements(flashCardElements, styleAttribute, displayNoneValue);
}

function showAllFlashCardElements() {
    applyAttributeToElements(allFlashCardElements, styleAttribute, displayContentValue);
}

function hideAllFlashCardElements() {
    applyAttributeToElements(allFlashCardElements, styleAttribute, displayNoneValue);
}

function showNavigationElements() {
    document.getElementById("home-button").disabled = false;
    document.getElementById("settings-button").disabled = false;
    applyAttributeToElements(navigationElements, styleAttribute, displayContentValue);
}

function hideNavigationElements() {
    applyAttributeToElements(navigationElements, styleAttribute, displayNoneValue);
}

function applyAttributeToElements(elements, attribute, value) {
    for (let i = 0; i < elements.length; i++) {
        document.getElementById(elements[i]).setAttribute(attribute, value);
    }
}

// Avoid “One of your code blocks includes unescaped HTML” error
function escape(string) {
    let lookup = {
        '&': "&amp;",
        '"': "&quot;",
        '\'': "&apos;",
        '<': "&lt;",
        '>': "&gt;"
    };
    return string.replace( /[&"'<>]/g, c => lookup[c] );
}