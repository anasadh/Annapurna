// Data base services
const {response} = require("express");
const client = require("./connections");

const login = async(userid,pass,res) => {
client.query(`select * from users`,(err,result)=>{
    if(!err){
        res.send("database connected",result);
    }else{
        res.send(err.message);
    }
});
client.end;
};
