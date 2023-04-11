package com.primalimited.flashapi;

import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.google.gson.Gson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class FlashCardsHandler implements RequestHandler<CategoryTitle, String> {
    Logger logger = LoggerFactory.getLogger(FlashCardsHandler.class);

    private final Settings settings;
    private final DynamoTable dynamoTable;

    public FlashCardsHandler(Settings settings, DynamoTable dynamoTable) {
        this.settings = settings;
        this.dynamoTable = dynamoTable;
    }

    @Override
    public String handleRequest(CategoryTitle input, Context context) {
        String category = input.category();
        String title = input.title();

        logger.info("getFlashcards(" + category + ", " + title + ")");

        if (category == null || category.isBlank())
            throw new IllegalArgumentException("Category and title parameters are required (e.g. /api/v1/flashcards?category=Math&title=Algebra)");
        if (title == null || title.isBlank())
            throw new IllegalArgumentException("Category and title parameters are required (e.g. /api/v1/flashcards?category=Math&title=Algebra)");

        Sanitizer sanitizer = new Sanitizer();
        category = sanitizer.sanitizeParameter(category);
        title = sanitizer.sanitizeParameter(title);

        logger.info("sanitized(" + category + ", " + title + ")");

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
}
