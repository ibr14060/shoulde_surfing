require('dotenv').config();

const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const uri = "mongodb+srv://seifibr753:seifbachelor1234@cluster0.gvq2wua.mongodb.net/"; // Retrieve the connection string from environment variables
//console.log(uri);
const client = new MongoClient(uri, { useUnifiedTopology: true });

let db;

const connectToDb = async () => {
  try {
    await client.connect();
    db = client.db('bachelor');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
};

const getDb = () => client.db('bachelor');

module.exports = { connectToDb, getDb };