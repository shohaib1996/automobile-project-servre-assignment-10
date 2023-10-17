const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

app.get("/", (req, res)=> {
    res.send("Hi Hello there")
})
// autoCareCategory
// GD3XDodlQuEvCsQg



const uri = "mongodb+srv://autoCareCategory:GD3XDodlQuEvCsQg@cluster0.lapzl7c.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("brandDB");
    const brandCollection = database.collection("brands");

    app.post("/brands", async(req, res)=> {
        const brads = req.body;
        const result = await brandCollection.insertOne(brads)
        res.send(result)
    })
    app.get("/brands", async(req, res) => {
        const cursor = brandCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, ()=> {
    console.log(`Hello world is running on ${port}`);
})