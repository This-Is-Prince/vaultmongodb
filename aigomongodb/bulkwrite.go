package main

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func BulkWrite(run bool, ctx context.Context, client *mongo.Client) {
	if !run {
		return
	}

	col := client.Database("university").Collection("students")

	// --- BULK WRITE OPERATION ---
	fmt.Println("\n--- Performing Bulk Write ---")

	operations := []mongo.WriteModel{
		mongo.NewInsertOneModel().SetDocument(Student{Name: "Isha Reddy", Age: 20, College: "JNU"}),
		mongo.NewUpdateOneModel().SetFilter(bson.D{{"name", "Priya Singh"}}).SetUpdate(bson.D{{"$set", bson.D{{"age", 21}}}}),
		mongo.NewDeleteOneModel().SetFilter(bson.D{{"name", "Aarav Sharma"}}),
	}

	bulkWriteResult, err := col.BulkWrite(ctx, operations)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Number of documents inserted: %d\n", bulkWriteResult.InsertedCount)
	fmt.Printf("Number of documents updated: %d\n", bulkWriteResult.ModifiedCount)
	fmt.Printf("Number of documents deleted: %d\n", bulkWriteResult.DeletedCount)
}
