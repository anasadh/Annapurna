// Data base services
const {response} = require("express");


const client = require("./connections");
let user_id = 0;

// signup api
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

// login api
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

// donar api
// let donar_id = 0;
// const donate = async (username,phone_num,food_items,address, city, quantity,res) => {
//     donar_id++;
//     console.log("donar_id:",donar_id);
//     console.log("db called");
//     console.log("donar function called");

//     client.query(
//         `INSERT INTO donate(donar_id,name,city,quantity,food_items,address,phone_num) VALUES ('${donar_id}', '${username}', '${city}','${quantity}','${food_items}','${address}','${phone_num}')`,
//         (err, result) => {
//             if (!err) {
//                 console.log("r:",result);
//                 return res.status(200).json({message: "donated form Successfully"}); // Assuming signup was successful
//             } else {
//                 console.log("e:",err);
//                 return res.status(400).json({message: err.message});
//             }
//         }
//     );
    
//     client.end;
// };
// Donar API function
const donate = async (username, phone_num, food_items, address, city, quantity, res) => {
    // Fetch the last donar_id from the database
    client.query(
        `SELECT MAX(donar_id) AS max_donar_id FROM donate`,
        (err, result) => {
            if (!err) {
                // Get the maximum donar_id
                const maxDonarId = result.rows[0].max_donar_id || 0;
                // Increment the max donar_id to generate the new donar_id
                const newDonarId = maxDonarId + 1;

                // Insert the new data with the new donar_id
                client.query(
                    `INSERT INTO donate(donar_id, name, city, quantity, food_items, address, phone_num) VALUES ('${newDonarId}', '${username}', '${city}', '${quantity}', '${food_items}', '${address}', '${phone_num}')`,
                    (err, result) => {
                        if (!err) {
                            console.log("Donated form Successfully");
                            return res.status(200).json({ message: "Donated form Successfully" });
                        } else {
                            console.log("Error:", err.message);
                            return res.status(400).json({ message: err.message });
                        }
                    }
                );
            } else {
                console.log("Error:", err.message);
                return res.status(400).json({ message: err.message });
            }
        }
    );
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


// Receiver api function
const receive = async (username, phone_num, address, quantity, res) => {
    // Fetch the last receiver_id from the database
    client.query(
        `SELECT MAX(receiver_id) AS max_receiver_id FROM receiver`,
        (err, result) => {
            if (!err) {
                // Get the maximum receiver_id
                const maxReceiverId = result.rows[0].max_receiver_id || 0;
                // Increment the max receiver_id to generate the new receiver_id
                const newReceiverId = maxReceiverId + 1;

                // Insert the new data with the new receiver_id
                client.query(
                    `INSERT INTO receiver(receiver_id, rec_name, phone_num, quantity, address) VALUES ('${newReceiverId}', '${username}', '${phone_num}', '${quantity}', '${address}')`,
                    (err, result) => {
                        if (!err) {
                            console.log("Filled form successfully");
                            return res.status(200).json({ message: "Filled form successfully" });
                        } else {
                            console.log("Error:", err.message);
                            return res.status(400).json({ message: err.message });
                        }
                    }
                );
            } else {
                console.log("Error:", err.message);
                return res.status(400).json({ message: err.message });
            }
        }
    );
};




// get requests data
const getNuOfRequests = async(res) => {
    console.log("db called");
    try {
        const result = await client.query(`SELECT COUNT(*) AS num_of_requests FROM receiver`);
        const num_of_requests = result.rows[0].num_of_requests;
        console.log("Number of requests:", num_of_requests);
        return res.status(200).json({ num_of_requests });
    } catch (err) {
        console.log("Error:", err);
        return res.status(400).json({ message: err.message });
    }
};


// Volunteer api function
// const volunteer = async (username,phone_num,email, address,id_type,id_proof, res) => {
//     // Fetch the last donar_id from the database
   
//     client.query(
//         `SELECT MAX(volunteer_id) AS max_volunteer_id FROM volunteer`,
//         (err, result) => {
//             if (!err) {
//                 // Get the maximum donar_id
//                 const maxVolunteerId= result.rows[0].max_volunteer_id || 0;
//                 // Increment the max donar_id to generate the new donar_id
//                 const newVolunteerId = maxVolunteerId + 1;

//                 // Insert the new data with the new donar_id
//                 client.query(
//                     `INSERT INTO volunteer(volunteer_id, volunteer_name, phone_num ,email, address,id_type,id_proof) VALUES ( '${newVolunteerId}', '${username}', '${phone_num}', '${email}', '${address}', '${id_type}', '${id_proof}')`,
//                     (err, result) => {
//                         if (!err) {
//                             console.log("Volunteered form filled Successfully");
//                             return res.status(200).json({ message: "Volunteered form filled Successfully" });
//                         } else {
//                             console.log("Error:", err.message);
//                             return res.status(400).json({ message: err.message });
//                         }
//                     }
//                 );
//             } else {
//                 console.log("Error:", err.message);
//                 return res.status(400).json({ message: err.message });
//             }
//         }
//     );
// };

const volunteer = async (username, phone_num, email, address, id_type, id_proof, res) => {
    try {
      const result = await client.query(`SELECT MAX(volunteer_id) AS max_volunteer_id FROM volunteer`);
      const maxVolunteerId = result.rows[0].max_volunteer_id || 0;
      const newVolunteerId = maxVolunteerId + 1;
  
      const query = `
        INSERT INTO volunteer(volunteer_id, volunteer_name, phone_num, email, address, id_type, id_proof)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
  
      const values = [newVolunteerId, username, phone_num, email, address, id_type, id_proof];
  
      await client.query(query, values);
      console.log("Volunteered form filled Successfully");
      return res.status(200).json({ message: "Volunteered form filled Successfully" });
    } catch (err) {
      console.log("Error:", err.message);
      return res.status(400).json({ message: err.message });
    }
  };
  


module.exports = { signup, login , donate, getDonarData,receive,getNuOfRequests,volunteer};
