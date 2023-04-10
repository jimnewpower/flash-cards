package com.primalimited.flashapi;

import java.util.Set;

public class Categories {

    private Set<String> categories;

    public Categories(Set<String> categories) {
        this.categories = categories;
    }

    public Set<String> categories() {
        return categories;
    }
}
