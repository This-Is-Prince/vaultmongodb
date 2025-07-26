import { MongoClient, ObjectId } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
    throw new Error("MONGO_URI not found in the .env file");
}

const client = new MongoClient(uri);

interface User {
    _id?: ObjectId;
    name: string;
    email: string;
    signed_up_at: Date;
}

async function insertOne(run: boolean) {
    if (!run) {
        return;
    }

    try {
        await client.connect();
        console.log("✅ Connected successfully to MongoDB!");

        const database = client.db("myFirstDatabase");
        const users = database.collection<User>("users");

        const newUser: User = {
            name: "Sanjay Gupta",
            email: "sanjay.g@example.com",
            signed_up_at: new Date(),
        };

        const result = await users.insertOne(newUser);
        console.log(`➡️ A new user was inserted with the auto-generated _id: ${result.insertedId}`)
    } catch (error) {
        console.error("🔥 Failed to connect or insert document", error);
    } finally {
        await client.close();
    }
};

interface Product {
    _id?: ObjectId;
    name: string;
    category: string;
    price: number;
}

async function insertMany(run: boolean) {
    if (!run) {
        return;
    }

    try {
        await client.connect();
        console.log("✅ Connected successfully to MongoDB!");

        const database = client.db("myFirstDatabase");
        const products = database.collection<Product>("products");

        const newProducts: Product[] = [
            { name: "Wireless Keyboard", category: "Electronics", price: 4500 },
            { name: "Coffee Mug", category: "Kitchenware", price: 800 },
            { name: "Notebook", category: "Stationery", price: 250 }
        ];

        const result = await products.insertMany(newProducts);

        console.log(`➡️ Successfully inserted ${result.insertedCount} documents.`);

    } catch(error) {
        console.error("🔥 Failed to connect or insert documents", error);
    } finally {
        await client.close();
    }
}

async function findOne(run: boolean) {
    if (!run) {
        return;
    }

    try {
        await client.connect();
        console.log("✅ Connected successfully to MongoDB!");

        const database = client.db("myFirstDatabase");
        const products = database.collection<Product>("products");

        const query = { name: "Coffee Mug" };

        const product = await products.findOne(query);

        if (product) {
            console.log("➡️ Found one product:");
            console.log(product);
        } else {
            console.log("❌ No product found with that name.");
        }

    } catch (error) {
        console.error("🔥 Failed to find document", error);
    } finally {
        await client.close();
    }
}

async function findMany(run: boolean) {
    if (!run) {
        return;
    }

    try {
        await client.connect();
        console.log("✅ Connected successfully to MongoDB!");
        
        const database = client.db("myFirstDatabase");
        const products = database.collection<Product>("products");

        const query = { category: "Electronics" }

        const cursor = products.find(query);
        
        const results = await cursor.toArray();
        cursor.rewind();

        if (results.length > 0) {
            console.log(`➡️ Found ${results.length} product(s):`);
            console.log(results);
        } else {
            console.log("❌ No products found in that category.");
        }

    } catch (error) {
        console.error("🔥 Failed to find documents", error);
    } finally {
        await client.close();
    }
}

async function updateOne(run: boolean) {
    if (!run) {
        return;
    }

    try {
        await client.connect();
        console.log("✅ Connected successfully to MongoDB!");

        const database = client.db("myFirstDatabase");
        const products = database.collection<Product>("products");

        const filter = { name: "Wireless Keyboard" };

        const updateDoc = {
            $set: {
                price: 4200,
                stock: 50,
            }
        }

        const result = await products.updateOne(filter, updateDoc);
        console.log(`➡️ Matched ${result.matchedCount} document(s) and modified ${result.modifiedCount} document(s).`)

        console.log("\n🔍 Finding the updated document...");
        const updatedProduct = await products.findOne(filter);
        console.log(updatedProduct);

    } catch (error) {
        console.error("🔥 Failed to update document", error);
    } finally {
        await client.close();
    }
}

async function updateMany(run: boolean) {
    if (!run) {
        return;
    }

    try {
        await client.connect();
        console.log("✅ Connected successfully to MongoDB!");

        const database = client.db("myFirstDatabase");
        const products = database.collection<Product>("products");

        const filter = {};

        const updateDoc = {
            $set: {
                last_updated: new Date(),
            }
        }

        const result = await products.updateMany(filter, updateDoc);
        console.log(`➡️ Successfully updated ${result.modifiedCount} document(s).`);

    } catch (error) {
        console.error("🔥 Failed to update documents", error);
    } finally {
        await client.close();
    }
}

async function deleteOne(run: boolean) {
    if (!run) {
        return;
    }

    try {
        await client.connect();
        console.log("✅ Connected successfully to MongoDB!");

        const database = client.db("myFirstDatabase");
        const products = database.collection<Product>("products");

        const filter = { name: "Notebook" };

        const result = await products.deleteOne(filter);

        if (result.deletedCount === 1) {
            console.log("➡️ Successfully deleted one document.");
        } else {
            console.log("❌ No documents matched the filter. Deleted 0 documents.");
        }

    } catch (error) {
        console.error("🔥 Failed to delete document", error);
    } finally {
        await client.close();
    }
}

async function deleteMany(run: boolean) {
    if (!run) {
        return;
    }

    try {
        await client.connect();
        console.log("✅ Connected successfully to MongoDB!");

        const database = client.db("myFirstDatabase");
        const products = database.collection<Product>("products");

        const filter = { last_updated: { $exists: true } };

        const result = await products.deleteMany(filter);

        console.log(`➡️ Successfully deleted ${result.deletedCount} document(s).`);

    } catch (error) {
        console.error("🔥 Failed to run delete", error);
    } finally {
        await client.close();
    }
}

// Chapter-1
insertOne(false);

// Chapter-2
insertMany(false);

// Chapter-3
findOne(false);

// Chapter-4
findMany(false);

// Chapter-5
updateOne(false);

// Chapter-6
updateMany(false);

// Chapter-7
deleteOne(false);

// Chapter-8
deleteMany(true);