package main

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
)

type Student struct {
	Name    string `bson:"name"`
	Age     int    `bson:"age"`
	College string `bson:"college"`
	Status  string `bson:"status,omitempty"`
}

func Insert(run bool, ctx context.Context, client *mongo.Client) {
	if !run {
		return
	}

	col := client.Database("university").Collection("students")

	// --- INSERT ONE DOCUMENT ---
	fmt.Println("\n--- Inserting one student ---")
	newStudent := Student{Name: "Aarav Sharma", Age: 21, College: "IIT Delhi"}

	insertOneResult, err := col.InsertOne(ctx, newStudent)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Inserted a single document with ID: %v\n", insertOneResult.InsertedID)

	// --- INSERT MULTIPLE DOCUMENT ---
	fmt.Println("\n--- Inserting multiple students ---")
	students := []interface{}{
		Student{Name: "Priya Singh", Age: 20, College: "Mumbai University"},
		Student{Name: "Rohan Kumar", Age: 22, College: "IIT Bombay"},
	}

	insertManyResult, err := col.InsertMany(ctx, students)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Inserted multiple documents with IDs: %v\n", insertManyResult.InsertedIDs)
}
