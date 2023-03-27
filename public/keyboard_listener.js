function checkKey(e) {
    e = e || window.event;

    switch (e.keyCode) {
        case 49://keyboard 1
        case 97://keypad 1
            // 1
            checkMultipleChoiceAnswer(0);
            break;
        case 50://keyboard 2
        case 98://keypad 2
            // 2
            checkMultipleChoiceAnswer(1);
            break;
        case 51://keyboard 3
        case 99://keypad 3
            // 3
            checkMultipleChoiceAnswer(2);
            break;
        case 52://keyboard 4
        case 100://keypad 4
            // 4
            checkMultipleChoiceAnswer(3);
            break;
        case 13://enter
        case 39://right arrow
            // enter
            nextMultipleChoiceQuestion();
            break;
    }
}
