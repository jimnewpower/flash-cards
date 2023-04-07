package com.primalimited.flashapi;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.ItemCollection;
import com.amazonaws.services.dynamodbv2.document.QueryOutcome;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@Component
@RestController
public class CategoryController {

    private final Settings settings;

    public CategoryController(Settings settings) {
        this.settings = settings;
    }

    @GetMapping("/categories")
    public List<String> getCategories() {
        Table table = getDynamoDBTable();

        String partitionKeyName = "Category";
        String partitionKeyValue = "Math";

        QuerySpec querySpec = new QuerySpec()
                .withKeyConditionExpression(partitionKeyName + " = :partitionKeyVal")
                .withValueMap(new ValueMap()
                        .withString(":partitionKeyVal", partitionKeyValue));

        List<String> result = new ArrayList<>();
        result.add(table.getTableName());

        ItemCollection<QueryOutcome> outcome = table.query(querySpec);
        outcome.forEach(item -> result.add(item.toJSONPretty()));

        return result;
    }

    private Table getDynamoDBTable() {
        BasicAWSCredentials awsCredentials = new BasicAWSCredentials(settings.accessKey(), settings.secretKey());
        AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                .withRegion(Regions.US_EAST_1)
                .build();
        DynamoDB dynamoDB = new DynamoDB(client);
        return dynamoDB.getTable(settings.getTable());
    }
}
