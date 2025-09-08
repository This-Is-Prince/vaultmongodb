import { Collection, MongoClient } from "mongodb";

const sampleMovies = [
    {
        title: "The Matrix",
        plot: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
        genres: ["Action", "Sci-Fi"],
        year: 1999
    },
    {
        title: "Inception",
        plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        genres: ["Action", "Sci-Fi", "Thriller"],
        year: 2010
    },
    {
        title: "Blade Runner 2049",
        plot: "A young Blade Runner's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who's been missing for thirty years.",
        genres: ["Sci-Fi", "Thriller", "Mystery"],
        year: 2017
    },
    {
        title: "The Martian",
        plot: "An astronaut becomes stranded on Mars after his team presumes him dead, and must rely on his ingenuity to find a way to signal to Earth that he is alive.",
        genres: ["Adventure", "Drama", "Sci-Fi"],
        year: 2015
    },
    {
        title: "Interstellar",
        plot: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        genres: ["Adventure", "Drama", "Sci-Fi"],
        year: 2014
    }
];

async function loadData(run: boolean, movies: Collection<Document>) {
    if (!run) {
        return;
    }

    try {
        await movies.deleteMany({})
        const result = await movies.insertMany(sampleMovies as any);
        console.log("Data saved: ", result.insertedIds);
    } catch (error) {
        console.log("Error while Saving data", error);
    }
}

async function runSearchNormal(run: boolean, movies: Collection<Document>) {
    if (!run) {
        return;
    }

    try {
        const pipeline = [
            {
                $search: {
                    index: "default",
                    text: {
                        query: "survival in space",
                        path: "plot",
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    plot: 1,
                    score: { $meta: "searchScore" },
                },
            },
        ];

        const results = await movies.aggregate(pipeline).toArray();
        console.log("Search results are: ", results);
    } catch (error) {
        console.log("Error while searching: ", error);
    }
}

async function runSearchTypos(run: boolean, movies: Collection<Document>) {
    if (!run) {
        return;
    }

    try {
        const pipeline = [
            {
                $search: {
                    index: "default",
                    text: {
                        query: "Interstelar",
                        path: "title",
                        fuzzy: {
                            maxEdits: 1
                        }
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    score: { $meta: "searchScore" },
                },
            },
        ];

        const results = await movies.aggregate(pipeline).toArray();
        console.log("Search results are: ", results);
    } catch (error) {
        console.log("Error while searching: ", error);
    }
}

async function runSearchAutocomplete(run: boolean, movies: Collection<Document>) {
    if (!run) {
        return;
    }

    try {
        const pipeline = [
            {
                $search: {
                    index: "default",
                    autocomplete: {
                        query: "Ma",
                        path: "title",
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    title: 1
                }
            },
            {
                $limit: 5
            }
        ];
        const results = await movies.aggregate(pipeline).toArray();
        console.log("Search results are: ", results);
    } catch (error) {
        console.log("Error while searching: ", error);
    }
}

async function runSearchMoreLikeThis(run: boolean, movies: Collection<Document>) {
    if (!run) {
        return;
    }

    try {
        const referenceMovie = await movies.findOne({ title: "The Matrix" });

        if (!referenceMovie) {
            console.log("Could not find the reference movie.")
            return;
        }

        const pipeline = [
            {
                $search: {
                    index: "default",
                    moreLikeThis: {
                        like: referenceMovie
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    plot: 1,
                    score: { $meta: "searchScore" }
                }
            },
            {
                $limit: 3
            }
        ];
        const results = await movies.aggregate(pipeline).toArray();
        console.log("Search results are: ", results);
    } catch (error) {
        console.log("Error while searching: ", error);
    }
}

async function searchIndexes(run: boolean, client: MongoClient) {
    if (!run) {
        return;
    }

    try {
        await client.connect();
        const movies = client.db("myFirstDatabase").collection("movies");
        await loadData(false, movies as any);
        await runSearchNormal(false, movies as any);
        await runSearchTypos(false, movies as any);
        await runSearchAutocomplete(false, movies as any);
        await runSearchMoreLikeThis(true, movies as any);
    } catch (error) {
        console.log("Error in search indexes: ", error);
    } finally {
        await client.close();
    }

}

export {
    searchIndexes
}