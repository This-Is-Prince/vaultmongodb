# A secure vault of production-grade MongoDB patterns—schema blueprints, indexing tricks, and aggregation pipelines—all battle-tested and ready to drop into real projects. Fork modules or the whole scaffold to jump-start your next service.

## Overview

This repository contains two learning tracks with code examples that demonstrate how to use MongoDB from Go and Node.js (TypeScript):

- `aigomongodb` — Go examples (CRUD, cursor usage, simple patterns). Source: https://g.co/gemini/share/c47f503da1f8
- `aimongodb` — Node.js + TypeScript examples (CRUD, queries, aggregation, transactions, indexing). Source: https://g.co/gemini/share/c13aa67e9e62

Both tracks are educational: they show common MongoDB operations and patterns, intended for learning and quick experimentation.

## Quick checklist (what I'll cover in this README)

- Prerequisites (tools & environment)
- How to provide your MongoDB connection string (`.env` example)
- How to run the Go examples in `aigomongodb`
- How to run the Node/TypeScript examples in `aimongodb`
- What each folder does and a short map of example chapters
- Troubleshooting tips and common pitfalls

---

## Prerequisites

Install the following on your machine:

- Go (recommended >= 1.24) — https://go.dev
- Node.js (recommended >= 18) and npm — https://nodejs.org
- A MongoDB deployment accessible from your machine (MongoDB Atlas is recommended for cloud testing)
- A working terminal (this README uses macOS `zsh` examples)

Make sure `go`, `node`, and `npm` are available in your PATH:

```bash
go version
node --version
npm --version
```

---

## Environment variables (.env)

Both projects expect a single environment variable: `MONGO_URI`. Create a `.env` file at the repository root or inside each folder with the following content:

```env
MONGO_URI="mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/?retryWrites=true&w=majority"
```

Notes:
- Replace the URI with your Atlas connection string or local MongoDB connection.
- For local MongoDB you can use something like `mongodb://localhost:27017`.

---

## aigomongodb (Go) — what it does

Location: `./aigomongodb`

This folder contains small Go examples that demonstrate basic CRUD operations against a `university` database and a `students` collection.

Key behaviors (see source files):

- `main.go` — loads `.env`, connects to MongoDB, pings the server, and invokes example functions.
- `insert.go` — shows `InsertOne` and `InsertMany` using a `Student` struct
- `read.go` — `FindOne` and `Find` iterating over a cursor
- `update.go` — `UpdateOne` and `UpdateMany`
- `delete.go` — `DeleteOne` and (example) `DeleteMany`
- `cursor.go` — demonstrates cursor batching and iteration

Important details from the code:
- Example functions accept a `run bool` flag — this allows toggling which chapters run. In `main.go` the code currently calls these functions with booleans (e.g., `Insert(false, ...)`). Toggle those booleans to run the operations you want.
- The Go example uses modules (`go.mod`) and the official MongoDB Go driver.

How to run (recommended quick start):

1. Open a terminal.
2. Ensure `MONGO_URI` is set in a `.env` file in `aigomongodb` (or repository root).
3. Run from the `aigomongodb` folder:

```bash
cd aigomongodb
# download modules (optional; 'go run' auto-downloads)
go mod download
# run the example
go run .
```

To build a binary:

```bash
go build -o bin/aigomongodb .
./bin/aigomongodb
```

How to run a specific chapter

- Edit `aigomongodb/main.go` and change the boolean arguments when the example functions are called. For example, set `Insert(true, ctx, client)` to enable inserts.

---

## aimongodb (Node.js + TypeScript) — what it does

Location: `./aimongodb`

This folder contains a single, well-organized `src/index.ts` file that implements many MongoDB examples (each wrapped in its own async function). It demonstrates:

- Insert, find, update, delete (single & many)
- Cursor usage and batch iteration
- Comparison, logical, array, and element query operators
- Projection queries
- Index creation (single and compound)
- Explain plans
- Aggregation pipelines (match, group, project, sort, limit)
- Transactions using client sessions

The script organizes each task as a function named after the chapter (for example, `insertOne`, `findOne`, `groupAggregationAvg`, `transaction`, etc.). At the bottom of `src/index.ts` these functions are invoked with boolean flags so you can toggle which chapters run. The default code currently enables `transaction(true);` — edit those booleans to run different examples.

How to run:

1. Open a terminal.
2. From the project root:

```bash
cd aimongodb
npm install
```

3. Ensure `MONGO_URI` is present in a `.env` file (same format as above).
4. Start the examples:

```bash
npm start
```

`npm start` runs `tsc` to compile TypeScript into `dist/` then executes `node dist/index.js`.

If you'd rather run TypeScript directly for development, use `ts-node` (install it globally or as a dev dependency) and run `npx ts-node src/index.ts`.

NOTE: The default script runs multiple examples which open/close the MongoDB client for each function. If you run many examples in sequence you may see many connect/disconnect logs — that is expected.

---

## Mapping of examples (quick reference)

`aigomongodb` (Go)
- Insert: `insert.go` (InsertOne / InsertMany)
- Read: `read.go` (FindOne / Find)
- Update: `update.go` (UpdateOne / UpdateMany)
- Delete: `delete.go` (DeleteOne / DeleteMany)
- Cursor: `cursor.go` (cursor iteration, SetBatchSize)

`aimongodb` (Node/TS)
- CRUD: functions `insertOne`, `insertMany`, `findOne`, `findMany`, `updateOne`, `updateMany`, `deleteOne`, `deleteMany` in `src/index.ts`
- Cursor / sample data creation: `cursor`
- Query operators: `comparisonOperator`, `logicalOperator`, `arrayOperator`, `elementOperator` 
- Projection: `projectionOperator`
- Indexes: `index`, `compoundIndex`
- Explain plan: `explain`
- Aggregation: `matchAggregation`, `groupAggregationAvg`, `projectAggregation`, etc.
- Transactions: `transaction` (uses client sessions)

---

## Best practices & notes

- Never commit secrets. Keep your `.env` file out of version control.
- Use role-limited MongoDB users for examples, not admin users.
- For Atlas, ensure your IP is whitelisted or you use the appropriate network access settings.
- The examples are intentionally simple for learning; in production you should reuse the MongoDB client across requests and manage connection pooling carefully.

---

## Troubleshooting

Problem: "Error loading .env file" or "MONGO_URI not set"
- Ensure a `.env` file exists and is in the right directory (either repo root or the specific subfolder where you run the example).

Problem: "failed to connect" or network timeout
- Confirm your connection string is correct.
- If using Atlas, verify network access / IP whitelist and username/password.
- Make sure your cluster is running and accessible.

Problem: TypeScript compile errors in `aimongodb`
- Run `npx tsc --noEmit` to see TypeScript issues.
- Ensure Node and TypeScript versions are compatible with the syntax used.

---

## Contributing

If you'd like to add examples or fix an existing chapter:

1. Add a new function in `src/index.ts` (Node) or a new `.go` file (Go) and wire its invocation with a boolean in the runner.
2. Add tests where appropriate and keep examples small and focused.
3. Open a PR describing the new example and link to any learning resource or issue.

---

## License

This repository does not include a license file by default. Add a `LICENSE` if you want to make the code permissively or restrictively licensed.

---

If you want, I can also:
- Add a `.env.example` file to the repo with a placeholder `MONGO_URI`.
- Add `Makefile` or npm scripts to run single chapters easily.
- Add a short script to toggle and run specific examples without editing the sources.

Tell me which of those you'd like next.
