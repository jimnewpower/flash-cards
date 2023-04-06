package com.primalimited.flashapi;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CategoryController {

    @GetMapping("/categories")
    public List<String> getCategories() {
        return List.of("one", "two", "three");
    }
}
