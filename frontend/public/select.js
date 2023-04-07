function selectMultipleChoice() {
    console.log('selectMultipleChoice()');
    startMultipleChoiceQuiz('./java.json');
}

function selectFlashCards() {
    console.log('selectFlashCards()');
    startFlashCardQuiz('./devsecops-flash.json');
}

function selectAllFlashCards() {
    console.log('selectAllFlashCards()');
    showAllFlashCards('./devsecops-flash.json');
}