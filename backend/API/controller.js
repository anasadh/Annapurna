const express = require("express"); //api
const bodyParser = require("body-parser"); //api
const multer = require('multer'); // for handling image
const { login, signup, donate, getDonarData, receive, getNuOfRequests,volunteer} = require("./service.js"); //db
const client = require("./connections"); //db conn

const { Client } = require('pg');


const app = express(); //api


// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());


app.use(bodyParser.json()); //api

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.listen(8040, () => {
    console.log("server is now listening at 8040 port");
}); //api server calling

//client.connect(); //db

app.post('/signup', async(req, res) => {
    try {
      //  const { username, email, password, confirm_password, phone_num, address } = req.body;

      const username = req.body.username;
      const email = req.body.email;
      const password = req.body.password;
      const confirm_password = req.body.confirm_password;
      const phone_num = req.body.phone_num;
      const address = req.body.address;
      
            // Check if passwords match
            if (password !== confirm_password) {
                res.status(400).json({message: "password doesnt match"});
            }
        console.log("in API:", username, email, password, confirm_password, phone_num, address);
        //database connectiojn
    signup(username,email,password,confirm_password,phone_num,address,res);
         
        // console.log("s",signUp);
        //res.send("Signup successful"); // Assuming signup was successful
    } catch (err) {
        console.log(err);
        res.status(400).json({message: err.message});
    }
});

app.post('/login', (req, res) => {
    try {
        // const { email, password } = req.body;
        const email = req.body.email;
        const password = req.body.password;
        console.log(email, password);
        // Call login function from services
        login(email, password, res);
        // res.send("logged In successful"); 
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});


// donate POST API
app.post('/donate', async(req, res) => {
    console.log("donate API called");

    try {
      const username = req.body.username;
      const phone_num = req.body.phone_num;
      const city = req.body.city;
      const quantity = req.body.quantity;
      const food_items = req.body.food_items;
      const address = req.body.address;
      
    console.log("in API:", username, food_items, quantity, phone_num, address,city);
    
    //database connectiojn
    // Call donate function from services
    donate(username,phone_num,food_items,address,city,quantity,res);
         
    } catch (err) {
        console.log(err);
        res.status(400).json({message: err.message});
    }
});


// Get user by user ID route - not used currently
app.get('/getUser/:userId', (req, res) => {
    try {
        const userId = req.params.userId;
        res.send(`got user id ${userId}`);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// get donar data API
app.get('/getDonar', async (req, res) => {
    try {
        // calling db function
      getDonarData(res);
    } catch (err) {
        res.status(400).send(err.message);
    }
});


// receiver POST API
app.post('/receive', async(req, res) => {
    try {
      const username = req.body.username;
      const phone_num = req.body.phone_num;
      const quantity = req.body.quantity;
      const address = req.body.address;
      
    console.log("in API:", username, quantity, phone_num, address);
    
    //database connectiojn
    // Call receive function from services
    receive(username,phone_num,address,quantity,res);
         
    } catch (err) {
        console.log(err);
        res.status(400).json({message: err.message});
    }
});

// get number of receivers/requesters data API
app.get('/getNuOfRequests', async (req, res) => {
    try {
        // calling db function
      getNuOfRequests(res);
    } catch (err) {
        res.status(400).send(err.message);
    }
});


// volunteer POST API
// It is working

app.post('/volunteer', upload.single('id_proof'), async (req, res) => {
    console.log("inside API");
    try {
    //   if (!req.file) {
    //     return res.status(400).json({ message: 'No file uploaded' });
    //   }
    console.log(req.body.InputJson);
    console.log(req.file);
      const InputJson=  JSON.parse(req.body.InputJson);
      
      console.log(req.body.InputJson);
      console.log("input json :",InputJson);
      console.log(typeof(InputJson));
      console.log("Received file:", req.file);
       
      const { user_name, phone_num, email, address, id_type } = InputJson;
      const id_proof = req.file.buffer;
  
      console.log("Received data:", { user_name, phone_num, email, address, id_type, id_proof });
  
      // Call volunteer function
      await volunteer(user_name, phone_num, email, address, id_type, id_proof, res);
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  });