package com.primalimited.flashapi;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class FlashCardTest {
    @Test
    public void testFlashCard() {
        String q1 = "question:What is 2 + 2?";
        String a1 = "answer:4";

        String[] split = q1.split(":");
        assertEquals("question", split[0]);
        assertEquals("What is 2 + 2?", split[1]);


    }

}