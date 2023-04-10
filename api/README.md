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
1. Ensure that you have set the AWS credentials environment variables in the terminal in which you're going to run:
```bash
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
```
2. To pick up the AWS credentials from the **system environment variables**, in a terminal, run:  
`java -jar ./build/libs/flashapi-0.0.1-SNAPSHOT.jar`  

3. Go to the endpoint in a browser:  
`http://localhost:9090/categories`

4. Troubleshooting this message:
```bash
Identify and stop the process that's listening on port 9090 or configure this application to listen on another port.
```

Run `ss` to find the process listening on the port in question (e.g. `9090`):
```bash
ss -tunap | grep :9090
tcp   LISTEN     0      100                          *:9090                       *:*     users:(("java",pid=202200,fd=11)) 
```
then use `kill -9 <pid>` on that pid.

# Endpoints
`/categories` - list the categories available in the DynamoDB database.

# Spring Boot [Actuator](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html)
`curl localhost:9090/actuator/health`

# Docker Image
Build the docker image:  
`docker build -t jimnewpower/flashapi .`

Run the docker image as a container:  
`docker run -p 9090:9090 jimnewpower/flashapi`

Or, to set **environment variables** (e.g. AWS credentials) in the Docker container:  
`docker run --env-file ./docker.env -p 9090:9090 jimnewpower/flashapi`  
In this case, you would add definitions for `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` to 
a local file named `docker.env`.

To build and run, use the local shell script `build_run.sh`.