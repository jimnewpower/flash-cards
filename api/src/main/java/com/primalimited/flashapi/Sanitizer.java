package com.primalimited.flashapi;

public class Sanitizer {
    String sanitizeParameter(String parameter) {
        return org.apache.commons.text.StringEscapeUtils.escapeJava(parameter);
    }
}
