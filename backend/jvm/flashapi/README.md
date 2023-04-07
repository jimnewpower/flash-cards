# Flash Cards Backend

# Database
AWS DynamoDB. Access with the AWS Java SDK.

# AWS CLI
Configure user with appropriate access. Get credentials.

AWS config files (`config` and `credentials`) live in the `~/.aws` directory.

Install/update the AWS CLI.

Configure AWS Single Sign-on (use credentials for `jim-dev`)
```bash
aws configure
AWS Access Key ID [****************MGHS]: ************LH4Z
AWS Secret Access Key [****************KprN]: ************************VGg2
Default region name [us-east-1]: 
Default output format [json]: 

aws dynamodb list-tables
{
    "TableNames": [
        "Locations",
        "Music",
        "flash-cards"
    ]
}
```

CLI Reference:
- [AWS DynamoDB CLI Command Reference](https://docs.aws.amazon.com/cli/latest/reference/dynamodb/index.html)
- [Query](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/dynamodb/query.html)

Guides: 
- [Use DynamoDB with AWS SDK for Java](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/sdk-general-information-section.html)
- [AWS SDK for Java](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/setup-basics.html)


# Build
`./gradlew build`

# Run Locally
- `./gradlew bootRun`
- or `java -jar ./build/libs/flashapi-0.0.1-SNAPSHOT.jar`

# Endpoints
`/categories` - list the categories available in the DynamoDB database.

# Spring Boot [Actuator](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html)
`curl localhost:9090/actuator/health`

