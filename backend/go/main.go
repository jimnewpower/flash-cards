package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

    "github.com/aws/aws-sdk-go/aws"
    "github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/gorilla/mux"
)

type Item struct {
	Category    string `json:"category_name"`
}

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/scan", scanHandler).Methods("GET")

	httpPort := "8080"
	fmt.Printf("Server listening on port %s\n", httpPort)
	log.Fatal(http.ListenAndServe(":"+httpPort, router))
}

func createDynamoDBClient() (*dynamodb.Client, error) {
    cfg, err := config.LoadDefaultConfig(context.TODO(), func(o *config.LoadOptions) error {
        o.Region = "us-east-1"
        return nil
    })

	return dynamodb.NewFromConfig(cfg), nil
}

func scanHandler(w http.ResponseWriter, r *http.Request) {
	dynamoDBClient, err := createDynamoDBClient()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	tableName := "flash-cards"

	items, err := scanTable(r.Context(), dynamoDBClient, tableName)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(items)
}

func scanTable(ctx context.Context, dynamoDBClient *dynamodb.Client, tableName string) ([]Item, error) {
	input := &dynamodb.ScanInput{
		TableName: aws.String(tableName),
	}

	paginator := dynamodb.NewScanPaginator(dynamoDBClient, input)

	var items []Item
	for paginator.HasMorePages() {
		page, err := paginator.NextPage(ctx)
		if err != nil {
			return nil, err
		}

		var pageItems []Item
		err = aws.UnmarshalListOfMaps(page.Items, &pageItems)
		if err != nil {
			return nil, err
		}

		items = append(items, pageItems...)
	}

	return items, nil
}
