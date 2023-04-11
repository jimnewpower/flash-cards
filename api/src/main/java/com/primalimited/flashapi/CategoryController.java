package com.primalimited.flashapi;

import com.amazonaws.services.dynamodbv2.document.ItemCollection;
import com.amazonaws.services.dynamodbv2.document.QueryOutcome;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.google.gson.Gson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@RestController
@RequestMapping("/api/v1")
public class CategoryController implements ErrorController {
    private static final String PARTITION_KEY_NAME = "Category";
    private static final String SORT_KEY_NAME = "Title";

    Logger logger = LoggerFactory.getLogger(CategoryController.class);

    private final Settings settings;
    private final DynamoTable dynamoTable;

    public CategoryController(Settings settings, DynamoTable dynamoTable) {
        this.settings = settings;
        this.dynamoTable = dynamoTable;
    }

    @RequestMapping("/error")
    public String error() {
        return "Error handling request";
    }

    @CrossOrigin
    @GetMapping("/categories")
    public String getCategories() {
        logger.info("getCategories()");

        Set<String> categoriesSet = dynamoTable.scanForUniquePartitionKeys(settings.getTable(), PARTITION_KEY_NAME);
        Categories categories = new Categories(categoriesSet);
        Gson gson = new Gson();
        return gson.toJson(categories);
    }

    @CrossOrigin
    @GetMapping("/titles")
    public String getTitles() {
        logger.info("getTitles()");

        Set<String> categoriesSet = dynamoTable.scanForUniquePartitionKeys(settings.getTable(), PARTITION_KEY_NAME);
        Set<CategoryTitle> categoryTitles = new HashSet<>();
        for (String category: categoriesSet) {
            Set<String> sortKeys = dynamoTable
                    .scanForUniqueSortKeys(settings.getTable(), PARTITION_KEY_NAME, category, SORT_KEY_NAME);
            for (String sortKey: sortKeys) {
                CategoryTitle categoryTitle = new CategoryTitle(category, sortKey);
                categoryTitles.add(categoryTitle);
            }
        }

        Titles titles = new Titles(categoryTitles);
        Gson gson = new Gson();
        return gson.toJson(titles);
    }

    @CrossOrigin
    @GetMapping("/flashcards")
    public String getFlashcards(
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "title", required = false) String title
    ) {
        logger.info("getFlashcards(" + category + ", " + title + ")");

        if (category == null || category.isEmpty())
            throw new IllegalArgumentException("Category and title parameters are required (e.g. /api/v1/flashcards?category=Math&title=Algebra)");
        if (title == null || title.isEmpty())
            throw new IllegalArgumentException("Category and title parameters are required (e.g. /api/v1/flashcards?category=Math&title=Algebra)");

        AttributeValue attributeValue = dynamoTable.getFlashcardsByPartitionAndSortKey(category, title);
        if (attributeValue == null)
            throw new IllegalArgumentException("No flashcards found for category " + category + " and title " + title);

        List<FlashCard> flashCards = new ArrayList<>();

        Gson gson = new Gson();

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

        return gson.toJson(flashCards);
    }

    @CrossOrigin
    @GetMapping("/all")
    public List<String> all() {
        logger.info("all()");

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

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

}
