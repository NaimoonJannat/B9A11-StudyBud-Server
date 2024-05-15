const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;

// middleware 
app.use(cors({
    origin: ['http://localhost:5173','https://b9a11-studybud.web.app'],
    credentials: true
  }));
  app.use(express.json())

  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3ywizof.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

  
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
    //   await client.connect();

     const database = client.db('StudyBud');
     const assignmentCollection = database.collection("allAssignments");
     const pendingCollection = database.collection("pendingAssignments");
     const markingCollection = database.collection("markedAssignments");

      // to send marked assignments backend 
    app.post('/marked', async (req, res) => {
      const markedAssignment = req.body;
      console.log(markedAssignment);
      const result = await markingCollection.insertOne(markedAssignment);
      res.send(result);
    })

   
  app.get('/marked', async (req, res) => {
      const cursor = markingCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

      // to send pending assignments backend 
    app.post('/pending', async (req, res) => {
      const submittedAssignment = req.body;
      console.log(submittedAssignment);
      const result = await pendingCollection.insertOne(submittedAssignment);
      res.send(result);
    })

   
  app.get('/pending', async (req, res) => {
      const cursor = pendingCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

      // delete a card from pending
      app.delete('/pending/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await pendingCollection.deleteOne(query);
        res.send(result);
      })

       // to update cards 
    app.get('/pending/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await pendingCollection.findOne(query);
      res.send(result);
    })


     // to send assignments backend 
    app.post('/assignments', async (req, res) => {
        const newAssignment = req.body;
        console.log(newAssignment);
        const result = await assignmentCollection.insertOne(newAssignment);
        res.send(result);
      })

     
    app.get('/assignments', async (req, res) => {
        const cursor = assignmentCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      })

       // delete a card 
    app.delete('/assignments/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await assignmentCollection.deleteOne(query);
        res.send(result);
      })

      
    // to update cards 
    app.get('/assignments/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await assignmentCollection.findOne(query);
      res.send(result);
    })

    app.put('/assignments/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedTask = req.body;
      const task = {
        $set: {
        title: updatedTask.title,
        description: updatedTask.description,
        fullmark: updatedTask.fullmark,
        difficulty: updatedTask.difficulty,
        duedate: updatedTask.duedate,
        photo: updatedTask.photo
        }
      }
      const result = await assignmentCollection.updateOne(filter, task);
      res.send(result);
    })



      // // Send a ping to confirm a successful connection
      // await client.db("admin").command({ ping: 1 });
      // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.log);
  app.get('/', (req, res) => {
    res.send('All Assignments Server Running')
  })
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
  