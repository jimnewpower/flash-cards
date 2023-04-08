package com.primalimited.flashapi;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ScanRequest;
import com.amazonaws.services.dynamodbv2.model.ScanResult;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class DynamoTable {

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
        Set<String> partitionKeys = new HashSet<>();

        // Create a ScanRequest to retrieve the specified partition key attribute from the table
        ScanRequest scanRequest = new ScanRequest(tableName);
        scanRequest.setProjectionExpression(partitionKeyAttributeName);

        AmazonDynamoDB dynamoDbClient = getClient();

        // Loop through all the pages of the table
        ScanResult scanResult;
        do {
            // Execute the scan request
            scanResult = dynamoDbClient.scan(scanRequest);

            // Add the partition key attribute value to the list
            for (Map<String, AttributeValue> item : scanResult.getItems()) {
                AttributeValue partitionKeyAttributeValue = item.get(partitionKeyAttributeName);
                if (partitionKeyAttributeValue != null) {
                    partitionKeys.add(partitionKeyAttributeValue.getS());
                }
            }

            // Set the last evaluated key to the start of the next page of results
            if (scanResult.getLastEvaluatedKey() != null)
                scanRequest.setProjectionExpression(scanResult.getLastEvaluatedKey().toString());
        } while (scanResult.getLastEvaluatedKey() != null && !scanResult.getLastEvaluatedKey().isEmpty());

        return partitionKeys;
    }

}
