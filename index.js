const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
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

    const brandCollection = client.db("brandDB").collection("brands");
    const productCollection = client.db("brandDB").collection("products")
    const cartCollection = client.db("brandDB").collection("cart")

    app.post("/brands", async (req, res) => {
      const brads = req.body;
      const result = await brandCollection.insertOne(brads)
      res.send(result)
    })
    app.get("/brands", async (req, res) => {
      const cursor = brandCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get("/brands/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await brandCollection.findOne(query)
      res.send(result)
    })

    // Product related APIs

    app.post("/brand", async (req, res) => {
      const brand = req.body;
      const result = await productCollection.insertOne(brand)
      res.send(result)
    })
    app.get("/brand", async (req, res) => {
      const cursor = productCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get("/brand/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productCollection.findOne(query)
      res.send(result)
    })
    // app.put("/brand/:id" async(req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) }
    //   const options = { upsert: true };
    // })

    // cart related APIs

    app.post("/cart", async (req, res) => {
      const cart = req.body;
      const result = await cartCollection.insertOne(cart);
      res.send(result)
    })
    app.get("/cart", async (req, res) => {
      const cursor = cartCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.delete("/cart/:id", async(req, res) => {
      const id = req.params.id;
      const query = {_id: id}
      const result = await cartCollection.deleteOne(query)
      console.log(id);
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


app.listen(port, () => {
  console.log(`Hello world is running on ${port}`);
})