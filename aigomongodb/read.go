package main

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func Read(run bool, ctx context.Context, client *mongo.Client) {
	if !run {
		return
	}

	col := client.Database("university").Collection("students")

	// --- FIND ONE DOCUMENT ---
	fmt.Println("\n--- Finding one student ---")
	var studentResult Student
	filter := bson.D{{"name", "Rohan Kumar"}}

	err := col.FindOne(ctx, filter).Decode(&studentResult)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			fmt.Println("No document was found with that filter")
		} else {
			log.Fatal(err)
		}
	} else {
		fmt.Printf("Found a single document: %+v\n", studentResult)
	}

	// --- FIND MULTIPLE DOCUMENTS ---
	fmt.Println("\n--- Finding all students ---")
	cursor, err := col.Find(ctx, bson.D{})
	if err != nil {
		log.Fatal(err)
	}

	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var student Student
		err := cursor.Decode(&student)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Printf("Found document: %+v\n", student)
	}

	if err := cursor.Err(); err != nil {
		log.Fatal(err)
	}
}
