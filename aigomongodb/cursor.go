package main

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func Cursor(run bool, ctx context.Context, client *mongo.Client) {
	if !run {
		return
	}

	col := client.Database("university").Collection("students")

	cursor, err := col.Find(ctx, bson.D{})
	if err != nil {
		log.Fatal(err)
	}
	defer cursor.Close(ctx)

	cursor.SetBatchSize(2)

	for cursor.Next(ctx) {
		var student Student
		err = cursor.Decode(&student)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println(student)
	}

	if err = cursor.Err(); err != nil {
		log.Fatal(err)
	}
}
