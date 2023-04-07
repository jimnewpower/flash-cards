# flash-cards

A simple flash card and quiz app for learning. Written in HTML/JavaScript. Bootstrap for CSS.

# Example Multiple Choice Quiz Card
![Example Multiple Choice Quiz Card](frontend/public/images/card-multi.png)

# Example Quiz Complete
![Example Quiz Complete](frontend/public/images/quiz-complete.png)

# JSON Schema
The `topic` is used as the Quiz Title. The `language` is used to determine the syntax highlighting for the code block. The `questions` are an array of objects with the `question`, `options`, and `answer`. The `options` are an array of strings. The `answer` is the index of the correct option.

If the `question` contains a code snippet, it will be in the `code` array. The code array is an array of strings. Each string is a line of code. The code will be syntax highlighted using the language specified in the `language` field.

```json
{
    "topic": "Python Programming Language",
    "language": "language-python",
    "questions": [
    {
      "question": "Which statement is true about lists and tuples in Python?",
      "options": [
        "Tuples are immutable and lists are mutable",
        "Tuples are mutable and lists are immutable",
        "Tuples are slower than lists",
        "Tuples consume more memory than lists"
      ],
      "answer": 0
    },
    {
      "question": "What is the output of the following Python code: ?",
      "code": ["print('hello' * 3)"],
      "options": ["hello", "hellohellohello", "hello hello hello", "3hello"],
      "answer": 1
    }
  ]
}
```

# AWS Dynamo DB
[JSON to DynamoDB](https://dynobase.dev/dynamodb-json-converter-tool/)  

Add AWS dependencies for go:
```bash
go get github.com/aws/aws-sdk-go-v2/aws
go get github.com/aws/aws-sdk-go-v2/config
go get github.com/aws/aws-sdk-go-v2/service/dynamodb
```

Add mux for routing:
```bash
go get -u github.com/gorilla/mux
```

Running the backend locally:
```bash
go build
./flash-cards
```

Requires ~/.aws/credentials file with the following:
```bash
[default]
aws_access_key_id=<key id>
aws_secret_access_key=<secret access key>
```
These are the credentials from an AWS user after creating an access key.
