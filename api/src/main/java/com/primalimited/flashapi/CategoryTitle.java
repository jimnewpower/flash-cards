package com.primalimited.flashapi;

import java.util.Objects;

public class CategoryTitle {
    private String category;
    private String title;

    public CategoryTitle(String category, String title) {
        this.category = category;
        this.title = title;
    }

    @Override
    public String toString() {
        return "CategoryTitle{" +
                "category='" + category + '\'' +
                ", title='" + title + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CategoryTitle that = (CategoryTitle) o;
        return category.equals(that.category) && title.equals(that.title);
    }

    @Override
    public int hashCode() {
        return Objects.hash(category, title);
    }

    public String category() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String title() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
