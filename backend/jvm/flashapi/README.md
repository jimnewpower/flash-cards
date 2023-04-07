# Flash Cards Backend

# Spring Boot Configuration
Add dependency:
`implementation 'org.springframework.boot:spring-boot-configuration-processor:3.0.4'`  

Add annotation `@ConfigurationPropertiesScan` to Application class to instruct the application
to process configuration properties.

Add `@ConfigurationProperties` annotation to class that will read the application.properties. e.g.
```java
@ConfigurationProperties(prefix = "aws")
class AWSConnect {
    private String accessKey;
    private String secretKey;
}
```


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

Set the environment variables [see](#run-locally):
```bash
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
```

CLI Reference:
- [AWS DynamoDB CLI Command Reference](https://docs.aws.amazon.com/cli/latest/reference/dynamodb/index.html)
- [Query](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/dynamodb/query.html)

Guides: 
- [Use DynamoDB with AWS SDK for Java](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/sdk-general-information-section.html)
- [AWS SDK for Java](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/setup-basics.html)
- [Query Table Java](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.ReadItem.html)
- [GitHub Examples](https://github.com/awsdocs/aws-doc-sdk-examples/tree/main/javav2/usecases/creating_first_project)
- [Javadoc](https://sdk.amazonaws.com/java/api/latest/software/amazon/awssdk/services/dynamodb/DynamoDbClient.html)

# Build
`./gradlew build`

# Run Locally
To pick up the AWS credentials from the **system environment variables**, in a terminal, run:  
`java -jar ./build/libs/flashapi-0.0.1-SNAPSHOT.jar`  

Go to the endpoint in a browser:  
`http://localhost:9090/categories`

# Endpoints
`/categories` - list the categories available in the DynamoDB database.

# Spring Boot [Actuator](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html)
`curl localhost:9090/actuator/health`

