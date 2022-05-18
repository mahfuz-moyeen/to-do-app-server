const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();

const port = process.env.PORT || 5000;

//middleware
app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z2jpk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

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
            const query = {};
            const result = listsCollection.find(query).toArray();
            res.send(result);
        });


    }
    finally {
    }

}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('server is running');
})

app.listen(port, () => {
    console.log('listening port :', port);
})