// Data base connection
const {Client} = require("pg");
const express = require("express");
const app = express();

const client = new Client({
    user: "postgres",
    host : "localhost",
    database: "mydb", //put db name
    password: "",  // put your own pass
    port: 8000
});
