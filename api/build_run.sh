#!/bin/bash
./gradlew build
rm ./Dockerfile
cp ./Dockerfile_Standard ./Dockerfile
docker build -t jimnewpower/flashapi .
docker run --env-file ./docker.env -p 9090:9090 jimnewpower/flashapi
