const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const port = 3000;
const url = 'mongodb://localhost:27017';
const app = express();

const client = new MongoClient(url);
const db = client.db('engine');
const collection = db.collection('pages');

app.use(bodyParser.json());

app.get('/search', async (req, res) => {

    const term = req.query.q;

    client.connect((err) => {
        if (err) {
            res.send(err);
        };
    });

    const page = await collection.find({ terms: term }).toArray();
    client.close();
    res.send(page);
});

app.post('/crowl', async (req, res) => {

    const { title, content } = req.body;
    if (!title || !content) {
        res.send('error');
    };
    const terms = mySplit(content);

    client.connect(() => {
        if (err) {
            res.send(err);
        };
    });

    const page = await collection.insertOne({ title, terms });

    client.close();
    res.send(page);
});

function mySplit(str) {
    if (typeof str != 'string') {
        return [];
    };
    return str.split(' ');
};

app.listen(port, () => {
    console.log(`Server is running on ${port} port!`);
});
