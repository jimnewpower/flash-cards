#!/bin/bash
mvn compile dependency:copy-dependencies -DincludeScope=runtime -U
rm ./Dockerfile
cp ./Dockerfile_AWS_Lambda ./Dockerfile
docker build -t jimnewpower/flashapi .
