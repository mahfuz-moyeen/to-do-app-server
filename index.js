const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();

const port = process.env.PORT || 5000;

//middleware
app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z2jpk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const listsCollection = client.db("to-do-list").collection("lists");

        // add to-do new list or note
        // http://localhost:5000/list
        app.post("/list", async (req, res) => {
            const data = req.body;
            const result = await listsCollection.insertOne(data);
            res.send(result);
        });

        // get all to-do lists data or notes
        // http://localhost:5000/lists
        app.get("/lists", async (req, res) => {
            const email = req.query.email
            const query = { email: email };
            const result = await listsCollection.find(query).toArray();
            res.send(result);
        });

        //delete item to lists 
        // http://localhost:5000/list/:id
        app.delete("/list/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await listsCollection.deleteOne(filter);
            res.send(result);
        });

        // update notesTaker
        // http://localhost:5000/list/:id
        app.put("/list/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    taskComplete: true
                }
            }
            const result = await listsCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

    } finally {
    }

}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('server is running');
})

app.listen(port, () => {
    console.log('listening port :', port);
})