package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var connectionString string

func init() {
	err := godotenv.Load()

	if err != nil {
		log.Fatal("Error loading .env file")
	}

	connectionString = os.Getenv("MONGO_URI")

	if connectionString == "" {
		log.Fatal("MONGO_URI not set in .env file")
	}
}

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(connectionString))
	if err != nil {
		log.Fatal(err)
	}

	defer func() {
		if err = client.Disconnect(ctx); err != nil {
			log.Fatal(err)
		}
	}()

	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatalf("Failed to ping cluster: %v", err)
	}

	fmt.Println("Successfully connected to MongoDB Atlas!")
}
