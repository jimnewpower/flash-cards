package com.primalimited.flashapi;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.model.*;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class DynamoTable {
    private static final String PARTITION_KEY_NAME = "Category";
    private static final String SORT_KEY_NAME = "Title";

    private final Settings settings;

    private AmazonDynamoDB client;

    public DynamoTable(Settings settings) {
        this.settings = settings;
    }

    AmazonDynamoDB getClient() {
        // Lazy initialization
        if (client == null)
            client = createClient();

        return client;
    }

    // Create a DynamoDB client
    private AmazonDynamoDB createClient() {
        // Create a BasicAWSCredentials object and pass it the access key and secret key
        BasicAWSCredentials awsCredentials = new BasicAWSCredentials(settings.accessKey(), settings.secretKey());

        // Create a DynamoDB client
        return AmazonDynamoDBClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                .withRegion(Regions.US_EAST_1)
                .build();
    }

    /**
     * Creates a DynamoDB table object.
     * @return A DynamoDB table object.
     */
    Table getDynamoDBTable() {
        // Create a DynamoDB table object
        return new DynamoDB(getClient()).getTable(settings.getTable());
    }

    /**
     * Scans a DynamoDB table and retrieves a list of all (unique) partition keys.
     *
     * @param tableName The name of the DynamoDB table to scan.
     * @param partitionKeyAttributeName The name of the partition key attribute.
     * @return A list of strings containing the partition keys.
     */
    Set<String> scanForUniquePartitionKeys(String tableName, String partitionKeyAttributeName) {
        // Create a ScanRequest to retrieve the specified partition key attribute from the table
        ScanRequest scanRequest = new ScanRequest(tableName);
        scanRequest.setProjectionExpression(partitionKeyAttributeName);

        return scan(scanRequest, partitionKeyAttributeName);
    }

    /**
     * Scans a DynamoDB table and retrieves a list of all (unique) sort keys.
     *
     * @param tableName The name of the DynamoDB table to scan.
     * @param partitionKeyAttributeName The name of the partition key attribute.
     * @param partitionKeyAttributeValue The value of the partition key attribute.
     * @param sortKeyAttributeName The name of the sort key attribute.
     * @return A list of strings containing the sort keys.
     */
    Set<String> scanForUniqueSortKeys(String tableName, String partitionKeyAttributeName, String partitionKeyAttributeValue, String sortKeyAttributeName) {
        // Create a ScanRequest to retrieve the specified partition key attribute from the table
        ScanRequest scanRequest = new ScanRequest(tableName);
        scanRequest.setProjectionExpression(partitionKeyAttributeName + ", " + sortKeyAttributeName);
        scanRequest.setFilterExpression(partitionKeyAttributeName + " = :partitionKeyAttributeValue");
        scanRequest.setExpressionAttributeValues(Collections.singletonMap(":partitionKeyAttributeValue", new AttributeValue(partitionKeyAttributeValue)));

        return scan(scanRequest, sortKeyAttributeName);
    }

    private Set<String> scan(ScanRequest scanRequest, String key) {
        AmazonDynamoDB dynamoDbClient = getClient();

        Set<String> sortKeys = new HashSet<>();

        // Loop through all the pages of the table
        ScanResult scanResult;
        do {
            // Execute the scan request
            scanResult = dynamoDbClient.scan(scanRequest);

            // Add the partition key attribute value to the list
            for (Map<String, AttributeValue> item : scanResult.getItems()) {
                AttributeValue sortKeyAttributeValue = item.get(key);
                if (sortKeyAttributeValue != null) {
                    sortKeys.add(sortKeyAttributeValue.getS());
                }
            }

            // Set the last evaluated key to the start of the next page of results
            if (scanResult.getLastEvaluatedKey() != null)
                scanRequest.setProjectionExpression(scanResult.getLastEvaluatedKey().toString());
        } while (scanResult.getLastEvaluatedKey() != null && !scanResult.getLastEvaluatedKey().isEmpty());

        return sortKeys;
    }

    public AttributeValue getFlashcardsByPartitionAndSortKey(String partitionKeyValue, String sortKeyValue) {
        // Create a QueryRequest with the partition key-value pair and sort key-value pair
        QueryRequest queryRequest = new QueryRequest();
        queryRequest.setTableName(settings.getTable());
        queryRequest.setKeyConditionExpression(PARTITION_KEY_NAME + " = :pk AND " + SORT_KEY_NAME + " = :sk");
        queryRequest.setExpressionAttributeValues(Map.of(
                ":pk", new AttributeValue(partitionKeyValue),
                ":sk", new AttributeValue(sortKeyValue)
        ));
        queryRequest.setProjectionExpression("flashcards");

        // Execute the query request
        QueryResult queryResult = getClient().query(queryRequest);

        // Check if the response contains an item with the flashcards attribute
        if (!queryResult.getItems().isEmpty()) {
            Map<String, AttributeValue> item = queryResult.getItems().get(0);
            return item.get("flashcards");
        } else {
            return null;
        }
    }

}
