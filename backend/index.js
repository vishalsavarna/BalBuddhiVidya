const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 3000
//console.log("db_user: "+process.env.DB_USER)


//mongodb-connection

const { MongoClient, ServerApiVersion } = require('mongodb');
 const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSW0RD}@cluster0.fcrwqy0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
 
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
     
     // Send a ping to confirm a successful connection
     await client.db("admin").command({ ping: 1 });
     console.log("Pinged your deployment. You successfully connected to MongoDB!");
   } finally {
     // Ensures that the client will close when you finish/error
     await client.close();
   }
 }
 run().catch(console.dir);

 //ends the connection code



 
 


app.get('/', (req, res) => {
  res.send('Hello World wtf!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})