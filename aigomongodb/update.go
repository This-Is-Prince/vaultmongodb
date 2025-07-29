package main

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func Update(run bool, ctx context.Context, client *mongo.Client) {
	if !run {
		return
	}

	col := client.Database("university").Collection("students")

	// --- UPDATE ONE DOCUMENT ---
	fmt.Println("\n--- Updating one student ---")
	filter := bson.D{{"name", "Aarav Sharma"}}
	update := bson.D{
		{
			"$set", bson.D{
				{"age", 22},
			},
		},
	}

	updateResult, err := col.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Matched %v documents adn updated %v documents.\n", updateResult.MatchedCount, updateResult.ModifiedCount)

	// --- UPDATE MANY DOCUMENTS ---
	fmt.Println("\n--- Updating many students ---")
	filter = bson.D{}
	update = bson.D{
		{
			"$set", bson.D{
				{"status", "active"},
			},
		},
	}

	updateManyResult, err := col.UpdateMany(ctx, filter, update)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Matched %v documents and updated %v documents. \n", updateManyResult.MatchedCount, updateManyResult.ModifiedCount)
}
