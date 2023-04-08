package com.primalimited.flashapi;

import java.util.Objects;

public class Category {
    private String category;

    public Category(String category) {
        this.category = category;
    }

    public String category() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    @Override
    public String toString() {
        return "Category{" +
                "category='" + category + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Category category1 = (Category) o;
        return category.equals(category1.category);
    }

    @Override
    public int hashCode() {
        return Objects.hash(category);
    }
}
