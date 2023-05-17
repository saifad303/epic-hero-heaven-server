const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ----------

app.get("/", (req, res) => {
  res.send("welcome api...");
});

app.listen(port, () => {
  console.log(`This port is running on port = ${port}`);
});
