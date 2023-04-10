#!/bin/bash
./gradlew build
docker build -t jimnewpower/flashapi .
docker run --env-file ./docker.env -p 9090:9090 jimnewpower/flashapi
