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
    private final DynamoTable dynamoTable;

    public CategoryController(Settings settings, DynamoTable dynamoTable) {
        this.settings = settings;
        this.dynamoTable = dynamoTable;
    }

    @CrossOrigin
    @GetMapping("/categories")
    public List<String> getCategories() {
        String partitionKeyName = "Category";
        List<String> categories = dynamoTable.getAllPartitionKeys(settings.getTable(), partitionKeyName);

        Table table = dynamoTable.getDynamoDBTable();

        List<String> result = new ArrayList<>();
        for (String category: categories) {
            QuerySpec querySpec = new QuerySpec()
                    .withKeyConditionExpression(partitionKeyName + " = :partitionKeyVal")
                    .withValueMap(new ValueMap()
                            .withString(":partitionKeyVal", category));

            ItemCollection<QueryOutcome> outcome = table.query(querySpec);
            outcome.forEach(item -> result.add(item.toJSONPretty()));
        }

        return result;
    }
}
