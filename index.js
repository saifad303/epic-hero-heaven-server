const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zwagdnz.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();

    const toysCollection = client.db("epicHeroHavenDB").collection("toys");
    const categoryCollection = client
      .db("epicHeroHavenDB")
      .collection("categories");

    //Category APIs

    app.get("/sub-categories", async (req, res) => {
      const result = await categoryCollection.find().toArray();
      res.send(result);
    });

    //Toy APIs
    app.get("/toys", async (req, res) => {
      const result = await toysCollection.find().limit(20).toArray();
      res.send(result);
    });

    app.get("/toy/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const filter = { _id: new ObjectId(id) };
      const result = await toysCollection.findOne(filter);
      res.send(result);
    });

    app.post("/toys", async (req, res) => {
      const body = req.body;
      const result = await toysCollection.insertOne(body);
      res.send(result);
    });

    // subcategory fetching
    app.get("/toy-subcategory", async (req, res) => {
      const marvelQuery = { subcategory: "Marvel" };
      const dcQuery = { subcategory: "DC" };
      const transformersQuery = { subcategory: "Transformers" };
      const options = {
        projection: { name: 1, imageURL: 1, price: 1, rating: 1 },
      };
      const marvelResult = await toysCollection
        .find(marvelQuery, options)
        .limit(2)
        .toArray();
      const dcResult = await toysCollection
        .find(dcQuery, options)
        .limit(2)
        .toArray();
      const transformersResult = await toysCollection
        .find(transformersQuery, options)
        .limit(2)
        .toArray();
      // console.log({ marvelResult, dcResult });
      res.send({ marvelResult, dcResult, transformersResult });
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("welcome api...");
});

app.listen(port, () => {
  console.log(`This port is running on port = ${port}`);
});
