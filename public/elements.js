const multipleChoiceElements = [
    'multiple-choice-container', 
    'multiple-choice-results', 
    'multiple-choice-progress-success', 
    'multiple-choice-progress-fail', 
    'multiple-choice-progress-div', 
    'multiple-choice-progress-bar', 
    'multiple-choice-next-button', 
    'multiple-choice-new-quiz-button', 
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
    'flash-new-quiz-button',
    'flash-card',
    'flash-question',
    'flash-card-body'
];

function showMultipleChoiceElements() {
    const attribute = "style";
    const value = "display: content";
    applyAttributeToElements(multipleChoiceElements, attribute, value);
}

function hideMultipleChoiceElements() {
    const attribute = "style";
    const value = "display: none";
    applyAttributeToElements(multipleChoiceElements, attribute, value);
}

function showFlashCardElements() {
    const attribute = "style";
    const value = "display: content";
    applyAttributeToElements(flashCardElements, attribute, value);
}

function hideFlashCardElements() {
    const attribute = "style";
    const value = "display: none";
    applyAttributeToElements(flashCardElements, attribute, value);
}

function applyAttributeToElements(elements, attribute, value) {
    for (let i = 0; i < elements.length; i++) {
        document.getElementById(elements[i]).setAttribute(attribute, value);
    }
}

