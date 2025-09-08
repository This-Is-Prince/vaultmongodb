import { Filter, MongoClient, ObjectId } from "mongodb";
import dotenv from 'dotenv';
import { searchIndexes } from "./search-indexes.js";

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
    category?: string;
    price: number;
    tags?: string[];
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

async function cursor(run: boolean) {
    if (!run) {
        return;
    }

    try {
        await client.connect();
        const database = client.db("myFirstDatabase");
        const products = database.collection<Product>("products");

        const deleteResult = await products.deleteMany({});
        console.log(`Delete Result:-`, deleteResult);

        // Create an array of 10 sample products
        const sampleProducts: Product[] = Array.from({ length: 10 }, (_, i) => ({
            name: `Product ${i + 1}`,
            category: `Category ${i % 2}`,
            price: (i + 1) * 10,
        }));

        const insertResult = await products.insertMany(sampleProducts);
        console.log('Insert Result:-', insertResult);

        console.log("✅ Inserted 10 sample products.");

        console.log("\n iterating through products with a cursor:");
        const cursor = products.find({});

        for await (let doc of cursor) {
            console.log(doc);
        }
    } catch (error) {
        console.error("🔥 Operation failed", error);
    } finally {
        await client.close();
    }
}

async function comparisonOperator(run: boolean) {
    if (!run) {
        return;
    }

    try {
        await client.connect();
        const database = client.db("myFirstDatabase");
        const products = database.collection<Product>("products");

        const query = { price: { $gt: 70 } }
        const result = await products.find(query).toArray();
        console.log(result);

    } catch (error) {
        console.log(error);
    } finally {
        await client.close();
    }
}

async function logicalOperator(run: boolean) {
    if (!run) {
        return;
    }

    try {
        await client.connect();
        const database = client.db("myFirstDatabase");
        const products = database.collection<Product>("products");

        const queryOr = {
            $or: [
                { price: { $lt: 30 } },
                { price: { $gte: 90 } },
            ]
        }

        const queryAnd = {
            $or: [
                { price: { $lte: 30 } },
                { price: { $gte: 90 } },
            ],
            $and: [
                { price: { $lte: 50 } },
                { name: 'Product 3' },
            ],
        }
        const result = await products.find(queryAnd).toArray();
        console.log(result);

    } catch(error) {
        console.log(error);
    } finally {
        await client.close();
    }
}

async function arrayOperator(run: boolean) {
    if (!run) {
        return;
    }

    try {
        await client.connect();
        const database = client.db("myFirstDatabase");
        const products = database.collection<Product>("products");
        // Let's create some new sample data with tags
        // await products.deleteMany({});
        // await products.insertMany([
        //     { name: "Laptop", price: 1200, tags: ["tech", "electronics", "gift"] },
        //     { name: "Headphones", price: 150, tags: ["tech", "audio"] },
        //     { name: "Coffee Maker", price: 80, tags: ["kitchen", "home", "gift"] },
        //     { name: "Book", price: 20, tags: ["reading"] }
        // ]);
        console.log("✅ Inserted new sample data.");

        const queryIn = {
            name: { $in: ["Book", "Laptop"] }
        }
        const queryAll = {
            tags: { $all: ["tech", "gift"] }
        }
        const querySize = {
            tags: { $size: 2 }
        }
        const result = await products.find(querySize).toArray();
        console.log(result);
    } catch(error) {
        console.log(error);
    } finally {
        await client.close();
    }
}

async function elementOperator(run: boolean) {
    if (!run) {
        return;
    }

    try {
        await client.connect();
        const database = client.db("myFirstDatabase");
        const products = database.collection<Product>("products");

        const queryExists = {
            name: { $exists: true }
        }
        const queryType: Filter<Product> = {
            name: { $type: 'string' }
        }
        const result = await products.find(queryType).toArray();
        console.log(result);
    } catch(error) {
        console.log(error);
    } finally {
        await client.close();
    }
}

async function projectionOperator(run: boolean) {
    if (!run) {
        return;
    }

    try {
        await client.connect();
        const database = client.db("myFirstDatabase");
        const products = database.collection<Product>("products");

        const query = {
            $and: [
                { price: { $lte: 50 } },
                { category: "Category 1" },
            ]
        }
        const result = await products.find(query).project({ _id: 0, price: 1, category: 1 }).toArray();
        console.log(result);
    } catch(error) {
        console.log(error);
    } finally {
        await client.close();
    }
}

async function index(run: boolean) {
    if (!run) {
        return;
    }

    try {
        await client.connect();
        const database = client.db("myFirstDatabase");
        const products = database.collection<Product>("products");

        const result = await products.createIndex({ price: 1 });
        console.log(result);
    } catch(error) {
        console.log(error);
    } finally {
        await client.close();
    }
}

async function compoundIndex(run: boolean) {
    if (!run) {
        return;
    }

    try {
        await client.connect();
        const database = client.db("myFirstDatabase");
        const products = database.collection<Product>("products");

        const result = await products.createIndex({ category: 1, price: -1 });
        console.log(result);
    } catch(error) {
        console.log(error);
    } finally {
        await client.close();
    }
}

async function explain(run: boolean) {
    if (!run) {
        return;
    }

    try {
        await client.connect();
        const database = client.db("myFirstDatabase");
        const products = database.collection<Product>("products");

        const query = {
            name: "one"
        };
        const result = await products.find(query).explain();
        console.log(result.queryPlanner.winningPlan);
    } catch(error) {
        console.log(error);
    } finally {
        await client.close();
    }
}

async function matchAggregation(run: boolean) {
    if (!run) {
        return;
    }

    try {
        await client.connect();
        const database = client.db("myFirstDatabase");
        const students = database.collection("students");

        // Insert our new student data
        await students.deleteMany({});
        await students.insertMany([
            { name: "Ravi", class: "5A", subject: "Math", score: 85 },
            { name: "Priya", class: "5A", subject: "Math", score: 92 },
            { name: "Ravi", class: "5A", subject: "Science", score: 78 },
            { name: "Priya", class: "5A", subject: "Science", score: 95 },
            { name: "Amit", class: "5B", subject: "Math", score: 88 },
            { name: "Sunita", class: "5B", subject: "Math", score: 72 },
            { name: "Amit", class: "5B", subject: "Science", score: 90 },
            { name: "Sunita", class: "5B", subject: "Science", score: 68 }
        ]);
        console.log("✅ Inserted student data.");

        const pipeline = [
            {
                $match: { subject: "Math" }
            }
        ];
        const result = await students.aggregate(pipeline).toArray();
        console.log(result);
    } catch(error) {
        console.log(error);
    } finally {
        await client.close();
    }
}

async function matchAggregation2(run: boolean) {
    if (!run) {
        return;
    }

    try {
        await client.connect();
        const database = client.db("myFirstDatabase");
        const students = database.collection("students");

        const pipeline = [
            {
                $match: { class: "5A", score: { $gt: 90 } }
            }
        ];
        const result = await students.aggregate(pipeline).toArray();
        console.log(result);
    } catch(error) {
        console.log(error);
    } finally {
        await client.close();
    }
}

async function groupAggregationAvg(run: boolean) {
    if (!run) {
        return;
    }

    try {
        await client.connect();
        const database = client.db("myFirstDatabase");
        const students = database.collection("students");

        const pipeline = [
            {
                $group: {
                    _id: "$subject",
                    averageScore: { $avg: "$score" }
                }
            }
        ];
        const result = await students.aggregate(pipeline).toArray();
        console.log(result);
    } catch(error) {
        console.log(error);
    } finally {
        await client.close();
    }
}

async function groupAggregationSum(run: boolean) {
    if (!run) {
        return;
    }

    try {
        await client.connect();
        const database = client.db("myFirstDatabase");
        const students = database.collection("students");

        const pipeline = [
            {
                $group: {
                    _id: "$subject",
                    sum: { $sum: "$score" }
                }
            }
        ];
        const result = await students.aggregate(pipeline).toArray();
        console.log(result);
    } catch(error) {
        console.log(error);
    } finally {
        await client.close();
    }
}

async function groupAggregationMax(run: boolean) {
    if (!run) {
        return;
    }

    try {
        await client.connect();
        const database = client.db("myFirstDatabase");
        const students = database.collection("students");

        const pipeline = [
            {
                $group: {
                    _id: "$subject",
                    maxScore: { $max: "$score" }
                }
            }
        ];
        const result = await students.aggregate(pipeline).toArray();
        console.log(result);
    } catch(error) {
        console.log(error);
    } finally {
        await client.close();
    }
}

async function projectAggregation(run: boolean) {
    if (!run) {
        return;
    }

    try {
        await client.connect();
        const database = client.db("myFirstDatabase");
        const students = database.collection("students");

        const pipeline = [
            {
                $group: {
                    _id: "$subject",
                    averageScore: { $avg: "$score" }
                }
            },
            {
                $project: {
                    _id: 0,
                    subject: "$_id",
                    averageScore: 1
                }
            }
        ];
        const result = await students.aggregate(pipeline).toArray();
        console.log(result);
    } catch(error) {
        console.log(error);
    } finally {
        await client.close();
    }
}

async function projectAggregationTest(run: boolean) {
    if (!run) {
        return;
    }

    try {
        await client.connect();
        const database = client.db("myFirstDatabase");
        const students = database.collection("students");

        const pipeline = [
            {
                $group: {
                    _id: "$subject",
                    averageScore: { $avg: "$score" }
                }
            },
            {
                $project: {
                    _id: 0,
                    subject: "$_id",
                    averageScore: 1,
                    status: "Completed"
                }
            }
        ];
        const result = await students.aggregate(pipeline).toArray();
        console.log(result);
    } catch(error) {
        console.log(error);
    } finally {
        await client.close();
    }
}

async function sortLimitSkipAggregation(run: boolean) {
    if (!run) {
        return;
    }

    try {
        await client.connect();
        const database = client.db("myFirstDatabase");
        const students = database.collection("students");

        const pipeline = [
            {
                $group: {
                    _id: "$name",
                    averageScore: { $avg: "$score" }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    averageScore: 1
                }
            },
            {
                $sort: {
                    averageScore: -1
                }
            },
            {
                $limit: 3
            }
        ]
        const group = [
            {
                _id: "jagmeet",
                averageScore: "70",
            },
            {
                _id: "jasmeet",
                averageScore: "60",
            },
            {
                _id: "monu",
                averageScore: "30",
            },
            {
                _id: "sonu",
                averageScore: "40",
            },
        ]
        const groupAfterProject = [
            {
                name: "jagmeet",
                averageScore: "70",
            },
            {
                name: "jasmeet",
                averageScore: "60",
            },
            {
                name: "monu",
                averageScore: "30",
            },
            {
                name: "sonu",
                averageScore: "40",
            },
        ];
        const groupAfterSort = [
            {
                name: "jagmeet",
                averageScore: "70",
            },
            {
                name: "jasmeet",
                averageScore: "60",
            },
            {
                name: "sonu",
                averageScore: "40",
            },
            {
                name: "monu",
                averageScore: "30",
            },
        ];
        const groupAfterLimit = [
            {
                name: "jagmeet",
                averageScore: "70",
            },
            {
                name: "jasmeet",
                averageScore: "60",
            },
            {
                name: "sonu",
                averageScore: "40",
            },
        ]
        const result = await students.aggregate(pipeline).toArray();
        console.log(result);
    } catch(error) {
        console.log(error);
    } finally {
        await client.close();
    }
}

async function transaction(run: boolean) {
    if (!run) {
        return;
    }

    const session = client.startSession();

    try {
        await client.connect();
        const accounts = client.db("myFirstDatabase").collection("accounts");

        // Prepare some sample accounts
        await accounts.deleteMany({});
        await accounts.insertMany([
            { name: "Account A", balance: 500 },
            { name: "Account B", balance: 1000 }
        ]);
        console.log("✅ Prepared sample accounts.");

        const initialAccounts = await accounts.find({}).toArray();
        console.log("\nInitial balances:", initialAccounts);

        const result = await session.withTransaction(async (session) => {
            console.log("All transactions start");

            const amount = 100;
            const sender = "Account A";
            const receiver = "Account B";

            const senderResult = await accounts.updateOne({ name: sender }, { $inc: { balance: -amount } }, { session });
            console.log(`Sender result->`, senderResult);

            const receiverResult = await accounts.updateOne({ name: receiver }, { $inc: { balance: amount } }, { session });
            console.log(`Receiver result->`, receiverResult);
            
            console.log('All transactions done');
        })

        console.log("Final Transactions result->", result);
        
        // Let's check the final balances
        const finalAccounts = await accounts.find({}).toArray();
        console.log("\nFinal balances:", finalAccounts);
    } catch (error) {
        console.log(error);
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
deleteMany(false);

// Chapter-9
cursor(false);

// Chapter-10
comparisonOperator(false);

// Chapter-11
logicalOperator(false);

// Chapter-12
arrayOperator(false);

// Chapter-13
elementOperator(false);

// Chapter-14
projectionOperator(false);

// Chapter-15
index(false);

// Chapter-16
compoundIndex(false);

// Chapter-17
explain(false);

// Chapter-18
matchAggregation(false);

// Chapter-20
matchAggregation2(false);

// Chapter-21
groupAggregationAvg(false);

// Chapter-22
groupAggregationSum(false);

// Chapter-23
groupAggregationMax(false);

// Chapter-24
projectAggregation(false);

// Chapter-25
projectAggregationTest(false);

// Chapter-26
sortLimitSkipAggregation(false);

// Chapter-26
transaction(false);

// Chapter-27 (Important)
searchIndexes(true, client);