// Data base services
const {response} = require("express");


const client = require("./connections");
let user_id = 0;

const signup = async (username, email, password, confirm_pass, phone_num, address, res) => {
    user_id++;
    console.log("userid:",user_id);
        console.log("db called");
    console.log("email_db",email);
    // if user is already exist
    const user = await client.query(`SELECT * FROM users WHERE email = '${email}'`);
    if (user.rows.length > 0) {
        return res.status(200).json({message: "User already exist"});
        
        }
        // if user is not exist
    else
    {
    client.query(
        `INSERT INTO users(user_id, password, confirm_pass, address, user_name, phone_num, email) VALUES ( '${user_id}', '${password}', '${confirm_pass}', '${address}', '${username}', '${phone_num}', '${email}')`,
        (err, result) => {
            if (!err) {
                console.log("r:",result);
                return res.status(200).json({message: "Signed in Successfully"}); // Assuming signup was successful
            } else {
                console.log("e:",err);
                return res.status(400).json({message: err.message});
            }
        }
    );
    }
    client.end;
};


const login = async (email, password, res) => {
    client.query(`SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`, (err, result) => {
        if (!err) {
            console.log(result);
            if (result.rows.length > 0) {
                // Assuming login was successful
                return res.status(200).json({message: "Login successful"});
            } else {
                return res.status(400).json({message: "Invalid credentials"});
            }
        } else {
            return res.status(400).json({message: err.message});
        }
    });
};

let donar_id = 0;
const donate = async (username,phone_num,food_items, quantity,address, city, res) => {
    donar_id++;
    console.log("donar_id:",donar_id);
    console.log("db called");

    client.query(
        `INSERT INTO donate( address, phone_num, quantity, food_items, donar_id,name,city) VALUES ( '${address}', '${phone_num}', '${quantity}', '${food_items}', '${donar_id}', '${username}', '${city}')`,
        (err, result) => {
            if (!err) {
                console.log("r:",result);
                return res.status(200).json({message: "Filled form successfully"}); 
            } else {
                console.log("e:",err);
                return res.status(400).json({message: err.message});
            }
        }
    );
    
    client.end;
};


// get donar data
const getDonarData = async(res) => {
  
    console.log("db called");

    client.query(
        `Select * from donate`,
        (err, result) => {
            if (!err) { 
                const donorData= result.rows;
                
                const aggregatedData = {};
            
                // Iterate over the donor data array
                donorData.forEach((donor) => {
                    // If the city is already in the aggregated data, add the quantity; otherwise, initialize it
                    if (aggregatedData.hasOwnProperty(donor.city)) {
                        aggregatedData[donor.city] += donor.quantity;
                    } else {
                        aggregatedData[donor.city] = donor.quantity;
                    }
                });

                console.log("str", aggregatedData)
                
                return res.send(aggregatedData)
                // res.send(aggregatedData);
            } else {
                console.log("e:",err);
                return res.status(400).json({message: err.message});
            }
        }
    );
    
    client.end;
};

module.exports = { signup, login , donate, getDonarData};
