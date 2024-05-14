const {login} = require('./service');
const {response} = require("express");
const express = require("express");
const app = express();

const client = require("./connections");
var bodyParser = require("body-parser");

app.use(bodyParser.json());

app.listen(8040,()=>{
    console.log("server is now listeing at 8040 port");
})

client.connect();

app.post('/signup',(req,res)=>{
    try{
        const username = req.body.username;
        const pass = req.body.password;
        const confirm_pass = req.body.confirm_password;
        const phone_number = req.body.phone_num;
        const address = req.body.addrress;
        console.log(username,pass,confirm_pass,phone_number,address);
        res.send("api called");
    }catch(err){
        res.send(err);
    }
})
