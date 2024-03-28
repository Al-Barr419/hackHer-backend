const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const MongoClient = require("mongodb").MongoClient;
const port = 3000;
const app = express();
app.use(cors());
app.use(express.json());
// Retrieve the MongoDB URL from the .env file
dotenv.config();
// Access the database and collection
// MongoDB connection URL
const url = process.env.MONGODB_URI;
const dbName = "Cluster0";

let dbClient;

// Function to connect to MongoDB
async function connectToMongoDB() {
  if (!dbClient || !dbClient.isConnected()) {
    dbClient = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  }
  return dbClient.db(dbName);
}

app.get("/getAllCaptions", async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const collection = db.collection("captions");
    const result = await collection.find().toArray();
    res.send({ result });
  } catch (error) {
    console.error("Scheduled task failed:", error);
  }
});

app.get("/generate", async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const collection = db.collection("captions");
    // Get one random document from the collection.
    const result = await collection.aggregate([{ $sample: { size: 1 } }]);

    res.send({ result });
  } catch (error) {
    console.error("Scheduled task failed:", error);
  }
});

app.delete("/deleteCaption", async (req, res) => {
  const { captionID } = req.body;
  try {
    const db = await connectToMongoDB();
    const collection = db.collection("captions");
    const result = await collection.deleteOne({ _id: captionID });

    res.send(`deleted caption: ${captionID}`);
  } catch (error) {
    console.error("Scheduled task failed:", error);
  }
});

app.post("/addCaption", async (req, res) => {
  const { caption } = req.body;
  try {
    const db = await connectToMongoDB();
    const collection = db.collection("captions");
    const result = await collection.insertOne({ caption });

    res.send(`Added caption: ${caption}`);
  } catch (error) {
    console.error("Scheduled task failed:", error);
  }
});

app.get("/", async (req, res) => {
  res.send(`Welcome to the backend!`);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
