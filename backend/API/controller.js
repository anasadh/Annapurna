const express = require("express"); //api
const bodyParser = require("body-parser"); //api
const { login, signup, donate, getDonarData } = require("./service.js"); //db
const client = require("./connections"); //db conn

const app = express(); //api

app.use(bodyParser.json()); //api

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080'); // Update to match your frontend URL
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
    try {
      const username = req.body.username;
      const phone_num = req.body.phone_num;
      const food_items = req.body.food_items;
      const quantity = req.body.quantity;
      const address = req.body.address;
      const city = req.body.city;
      
    console.log("in API:", username, food_items, quantity, phone_num, address,city);
    
    //database connectiojn
    // Call donate function from services
    donate(username,phone_num,food_items, quantity,address,city,res);
         
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


