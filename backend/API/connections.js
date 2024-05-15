// Data base connection
const {Client} = require("pg");
const express = require("express");
const app = express();

const client = new Client({
    user: "postgres",
    host : "localhost",
    database: "annapurna_db", //put db name
    password: "123@#post",  // put your own pass
    port: 5432
});
// client.connect();
client.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err);
    } else {
      console.log('Database connected successfully');
    }
  });

module.exports = client;

