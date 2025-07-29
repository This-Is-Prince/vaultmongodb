package main

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func Delete(run bool, ctx context.Context, client *mongo.Client) {
	if !run {
		return
	}

	col := client.Database("university").Collection("students")

	// --- DELETE ONE DOCUMENT ---
	fmt.Println("\n--- Deleting one student ---")
	filter := bson.D{{"name", "Rohan Kumar"}}
	deleteOneResult, err := col.DeleteOne(ctx, filter)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Deleted %v document.\n", deleteOneResult.DeletedCount)

	// --- DELETE MANY DOCUMENTS ---
	fmt.Println("\n--- Deleting many students ---")
	filter = bson.D{{"college", "Mumbai University"}}
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Deleted %v documents.\n", deleteOneResult.DeletedCount)
}
