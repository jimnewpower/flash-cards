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
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ScanRequest;
import com.amazonaws.services.dynamodbv2.model.ScanResult;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
@RestController
public class CategoryController {

    private final Settings settings;

    public CategoryController(Settings settings) {
        this.settings = settings;
    }

    @CrossOrigin
    @GetMapping("/categories")
    public List<String> getCategories() {

        String partitionKeyName = "Category";
        String partitionKeyValue = "Math";

        AmazonDynamoDB dynamoDBClient = getClient();
        Table table = getDynamoDBTable(dynamoDBClient);
        return getAllPartitionKeys(dynamoDBClient, settings.getTable(), partitionKeyName);

//        QuerySpec querySpec = new QuerySpec()
//                .withKeyConditionExpression(partitionKeyName + " = :partitionKeyVal")
//                .withValueMap(new ValueMap()
//                        .withString(":partitionKeyVal", partitionKeyValue));
//
//        List<String> result = new ArrayList<>();
//        result.add(table.getTableName());
//
//        ItemCollection<QueryOutcome> outcome = table.query(querySpec);
//        outcome.forEach(item -> result.add(item.toJSONPretty()));
//
//        return result;
    }

    private AmazonDynamoDB getClient() {
        BasicAWSCredentials awsCredentials = new BasicAWSCredentials(settings.accessKey(), settings.secretKey());
        AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                .withRegion(Regions.US_EAST_1)
                .build();
        return client;
    }

    private Table getDynamoDBTable(AmazonDynamoDB client) {
        return new DynamoDB(client).getTable(settings.getTable());
    }

    public static List<String> getAllPartitionKeys(AmazonDynamoDB dynamoDbClient, String tableName, String partitionKeyAttributeName) {
        List<String> partitionKeys = new ArrayList<>();

        ScanRequest scanRequest = new ScanRequest(tableName);
        scanRequest.setProjectionExpression(partitionKeyAttributeName);

        ScanResult scanResult;
        do {
            scanResult = dynamoDbClient.scan(scanRequest);
            for (Map<String, AttributeValue> item : scanResult.getItems()) {
                AttributeValue partitionKeyAttributeValue = item.get(partitionKeyAttributeName);
                if (partitionKeyAttributeValue != null) {
                    partitionKeys.add(partitionKeyAttributeValue.getS());
                }
            }

            if (scanResult.getLastEvaluatedKey() != null)
                scanRequest.setProjectionExpression(scanResult.getLastEvaluatedKey().toString());
//            scanRequest = scanRequest.toBuilder().exclusiveStartKey(scanResponse.lastEvaluatedKey()).build();
        } while (scanResult.getLastEvaluatedKey() != null && !scanResult.getLastEvaluatedKey().isEmpty());

        return partitionKeys;
    }

}
