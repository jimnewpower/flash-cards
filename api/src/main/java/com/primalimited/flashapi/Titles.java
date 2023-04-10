package com.primalimited.flashapi;

import java.util.Set;

public class Titles {

    private Set<CategoryTitle> titles;

    public Titles(Set<CategoryTitle> titles) {
        this.titles = titles;
    }

    public Set<CategoryTitle> titles() {
        return titles;
    }
}
