package main

import (
    "context"
    "fmt"

    "github.com/aws/aws-sdk-go-v2/aws"
    "github.com/aws/aws-sdk-go-v2/config"
    "github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

func main() {
    cfg, err := config.LoadDefaultConfig(context.TODO(), func(o *config.LoadOptions) error {
        o.Region = "us-east-1"
        return nil
    })
    if err != nil {
        panic(err)
    }

    svc := dynamodb.NewFromConfig(cfg)

    out, err := svc.Scan(context.TODO(), &dynamodb.ScanInput{
        TableName: aws.String("flash-cards"),
    })
    if err != nil {
        panic(err)
    }

    fmt.Println(out.Items)
}
