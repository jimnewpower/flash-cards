package com.primalimited.flashapi;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

@DynamoDBTable(tableName = "flash-cards")
public class Content {
    private String categoryName;
    private String language;


}
