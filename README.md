# flash-cards

A simple flash card and quiz app for learning.

# Example Multiple Choice Quiz Card
![Example Multiple Choice Quiz Card](public/images/card-multi.png)

# Example Quiz Complete
![Example Quiz Complete](public/images/quiz-complete.png)

# JSON Schema
The topic is used as the Quiz Title. The language is used to determine the syntax highlighting for the code block. The questions are an array of objects with the question, options, and answer. The options are an array of strings. The answer is the index of the correct option.

```json
{
    "topic": "Python Programming Language",
    "language": "language-python",
    "questions": [
    {
      "question": "What is the difference between a tuple and a list in Python?",
      "options": [
        "Tuples are immutable and lists are mutable",
        "Tuples are mutable and lists are immutable",
        "Tuples are faster than lists",
        "Tuples can contain elements of different types, while lists cannot"
      ],
      "answer": 0
    },
    ]
}
```