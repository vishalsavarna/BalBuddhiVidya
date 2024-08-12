const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSW0RD}@cluster0.fcrwqy0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();

    // Create a DATABASE & Collections
    const database = client.db("BalBuddhiVidya");
    const userCollection = database.collection("users");
    const classesCollection = database.collection("classes");
    const cartCollection = database.collection("cart");
    const enrolledCollection = database.collection("enrolled");
    const paymentCollection = database.collection("payments");
    const appliedCollection = database.collection("applied");

    // Classes routes
    app.post('/new-class', async (req, res) => {
      const newClass = req.body;
      try {
        const result = await classesCollection.insertOne(newClass);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: 'Error inserting class', error });
      }
    });

    app.get('/classes', async (req, res) => {
      const query = { status: 'approved' };
      const result = await classesCollection.find(query).toArray();
      res.send(result);
    })

    //get classes by instructor's email address
    app.get('/classes/:email', async (req, res) => {
      const email = req.params.email;
      const query = { instructorEmail: email };
      const result = await classesCollection.find(query).toArray();
      res.send(result);
    })

    //managing classes 
    app.get('/classes-manage', async (req, res) => {
      const result = await classesCollection.find().toArray();
      res.send(result);
    })
    
    //update classes status & reason
    app.put('/change-status/:id', async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      console.log(req.body)
      const reason = req.body.reason;
      const filter = { _id: new ObjectId(id) };
      console.log("🚀 ~ file: index.js:180 ~ app.put ~ reason:", reason)
      const options = { upsert: true };
      const updateDoc = {
          $set: {
              status: status,
              reason: reason
          }
      }
      const result = await classesCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })

    // GET APPROVED CLASSES
    app.get('/approved-classes', async (req, res) => {
      const query = { status: 'approved' };
      const result = await classesCollection.find(query).toArray();
      res.send(result);
    })

    // Get single class by id for details page
    app.get('/class/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await classesCollection.findOne(query);
      res.send(result);
    })

    // Update a class
    app.put('/update-class/:id', async (req, res) => {
      const id = req.params.id;
      const updatedClass = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
          $set: {
              name: updatedClass.name,
              description: updatedClass.description,
              price: updatedClass.price,
              availableSeats: parseInt(updatedClass.availableSeats),
              videoLink: updatedClass.videoLink,
              status: 'pending'
          }
      }
      const result = await classesCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })


    // ******ADD TO CART*****
    app.post('/add-to-cart', async (req, res) => {
      const newCartItem = req.body;
      const result = await cartCollection.insertOne(newCartItem);
      res.send(result);
    })
    // Get cart item id for checking if a class is already in cart
    app.get('/cart-item/:id', async (req, res) => {
        const id = req.params.id;
        const email = req.query.email;
        const query = { classId: id, userMail: email };
        const projection = { classId: 1 };
        const result = await cartCollection.findOne(query, { projection: projection });
        res.send(result);
    })

    app.get('/cart/:email', async (req, res) => {
        const email = req.params.email;
        const query = { userMail: email };
        const projection = { classId: 1 };
        const carts = await cartCollection.find(query, { projection: projection }).toArray();
        const classIds = carts.map(cart => new ObjectId(cart.classId));
        const query2 = { _id: { $in: classIds } };
        const result = await classesCollection.find(query2).toArray();
        res.send(result);
    })

    // Delete a item form cart
    app.delete('/delete-cart-item/:id', async (req, res) => {
        const id = req.params.id;
        const query = { classId: id };
        const result = await cartCollection.deleteOne(query);
        res.send(result);
    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

run().catch(console.dir);

// Default route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
