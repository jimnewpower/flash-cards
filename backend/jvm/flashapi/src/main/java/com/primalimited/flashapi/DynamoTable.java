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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class DynamoTable {

    private final Settings settings;

    private AmazonDynamoDB client;

    public DynamoTable(Settings settings) {
        this.settings = settings;
    }

    AmazonDynamoDB getClient() {
        if (client == null)
            client = createClient();

        return client;
    }

    private AmazonDynamoDB createClient() {
        BasicAWSCredentials awsCredentials = new BasicAWSCredentials(settings.accessKey(), settings.secretKey());
        return AmazonDynamoDBClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                .withRegion(Regions.US_EAST_1)
                .build();
    }

    Table getDynamoDBTable() {
        return new DynamoDB(getClient()).getTable(settings.getTable());
    }

    List<String> getAllPartitionKeys(String tableName, String partitionKeyAttributeName) {
        List<String> partitionKeys = new ArrayList<>();

        ScanRequest scanRequest = new ScanRequest(tableName);
        scanRequest.setProjectionExpression(partitionKeyAttributeName);

        AmazonDynamoDB dynamoDbClient = getClient();

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
        } while (scanResult.getLastEvaluatedKey() != null && !scanResult.getLastEvaluatedKey().isEmpty());

        return partitionKeys;
    }

}
