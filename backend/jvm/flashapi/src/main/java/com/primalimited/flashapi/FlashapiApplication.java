package com.primalimited.flashapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@ConfigurationPropertiesScan
@SpringBootApplication
public class FlashapiApplication {

    public static void main(String[] args) {
        SpringApplication.run(FlashapiApplication.class, args);
    }

}
