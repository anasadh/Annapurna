// Data base services
const {response} = require("express.js");
const client = require("./connection.js");

const login = async(userid,pass, res) => {
client.query(`select * from users`,(err,result)=>{
    if(!err){
        res.send("database connected");
    }else{
        res.send(err.message);
    }
});
client.end;
};
