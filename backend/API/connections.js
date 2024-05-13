// Data base connection
const {Client} = require("pg");
const express = require("express");
const app = express();

const client = new Client({
    user: "postgres",
    host : "localhost",
    database: "annapurna", //put db name
    password: "123@#post",  // put your own pass
    port: 5432
});
