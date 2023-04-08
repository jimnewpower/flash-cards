package com.primalimited.flashapi;

import com.amazonaws.services.dynamodbv2.document.ItemCollection;
import com.amazonaws.services.dynamodbv2.document.QueryOutcome;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.google.gson.Gson;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
@RestController
public class CategoryController {
    private static final String PARTITION_KEY_NAME = "Category";
    private static final String SORT_KEY_NAME = "Title";

    private final Settings settings;
    private final DynamoTable dynamoTable;

    public CategoryController(Settings settings, DynamoTable dynamoTable) {
        this.settings = settings;
        this.dynamoTable = dynamoTable;
    }

    @CrossOrigin
    @GetMapping("/categories")
    public Set<String> getCategories() {
        return dynamoTable.scanForUniquePartitionKeys(settings.getTable(), PARTITION_KEY_NAME);
    }

    @CrossOrigin
    @GetMapping("/titles")
    public List<String> getTitles() {
        Set<String> categories = dynamoTable.scanForUniquePartitionKeys(settings.getTable(), PARTITION_KEY_NAME);
        List<String> result = new ArrayList<>();
        for (String category: categories) {
            Set<String> sortKeys = dynamoTable
                    .scanForUniqueSortKeys(settings.getTable(), PARTITION_KEY_NAME, category, SORT_KEY_NAME);
            for (String sortKey: sortKeys)
                result.add(category + " - " + sortKey);
        }

        return result;
    }

    @CrossOrigin
    @GetMapping("/flashcards")
    public String getFlashcards() {
        AttributeValue attributeValue = dynamoTable.getFlashcardsByPartitionAndSortKey("Math", "Basic Arithmetic");

        List<FlashCard> flashCards = new ArrayList<>();

        attributeValue.getL().forEach(value -> {
            final FlashCard flashCard = new FlashCard("", "");

            value.getM().forEach((k, v) -> {
                if (k.startsWith("question"))
                    flashCard.setQuestion(v.getS());
                else if (k.startsWith("answer"))
                    flashCard.setAnswer(v.getS());
            });
            
            if (!flashCard.question().isEmpty() && !flashCard.answer().isEmpty())
                flashCards.add(flashCard);
        });

        Gson gson = new Gson();
        return gson.toJson(flashCards);
    }

    @CrossOrigin
    @GetMapping("/all")
    public List<String> all() {
        String partitionKeyName = "Category";
        Set<String> categories = dynamoTable.scanForUniquePartitionKeys(settings.getTable(), partitionKeyName);

        Table table = dynamoTable.getDynamoDBTable();

        Gson gson = new Gson();

        List<String> result = new ArrayList<>();
        for (String category: categories) {
            QuerySpec querySpec = new QuerySpec()
                    .withKeyConditionExpression(partitionKeyName + " = :partitionKeyVal")
                    .withValueMap(new ValueMap()
                            .withString(":partitionKeyVal", category));

            ItemCollection<QueryOutcome> outcome = table.query(querySpec);
            outcome.forEach(item -> {
                result.add(gson.toJson(item));
//                item.attributes().forEach(value -> result.add(gson.toJson(value)));
//                result.add(item.toJSON());
            });
        }

        return result;
    }
}
