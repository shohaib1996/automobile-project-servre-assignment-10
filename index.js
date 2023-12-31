const express = require('express');
const cors = require('cors');
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000;


// middleware
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hi Hello there")
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lapzl7c.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
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
app.put("/brand/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const options = { upsert: true }
  const updateProduct = req.body;
  const newProduct = {
    $set: {
      product_name: updateProduct.product_name,
      img: updateProduct.img,
      brand_name: updateProduct.brand_name,
      short_desc: updateProduct.short_desc,
      price: updateProduct.price,
      rating: updateProduct.rating,
      vehicle_type: updateProduct.vehicle_type,
    },
  }
  const result = await productCollection.updateOne(query, newProduct, options)
  res.send(result)
})

// cart related APIs
app.post("/cart", async (req, res) => {
  const cart = req.body;
  const result = await cartCollection.insertOne(cart)
  res.send(result)

})
app.get("/cart", async (req, res) => {
  // const currentId = req.query.currentId;
  const email = req.query.email;

  const filter = {
    $and: [
      // { currentId: currentId },
      { email: email }
    ]
  };

  const cursor = cartCollection.find(filter);
  const result = await cursor.toArray();
  res.send(result);
});

app.delete("/cart/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await cartCollection.deleteOne(query)
  console.log(id);
  res.send(result)
})
run().catch(console.dir);



app.listen(port, () => {
  console.log(`Hello world is running on ${port}`);
})