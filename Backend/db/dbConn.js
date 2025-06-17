const mysql = require('mysql2')

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
})

conn.connect((err) => {
  if (err) {
    console.log("ERROR: " + err.message);
    return;
  }
  console.log('Connection established');
})

let dataPool = {}

// GET A USER
dataPool.AuthUser=(username)=>
{
  return new Promise ((resolve, reject)=>{
    conn.query('SELECT * FROM User WHERE Name = ?', [username], (err,res, fields)=>{
      if(err){return reject(err)}
      return resolve(res)
    })
  })  
	
}

// ADD A USER
dataPool.AddUser=(name,surname,username,email,password,phone,dob,address,city)=>{
  return new Promise ((resolve, reject)=>{
    conn.query(`INSERT INTO User (Name,Surname,Username,Password, City, Email, DOB, Address, PhoneNo) VALUES (?,?,?,?,?,?,?,?,?)`, [name,surname,username,password, city, email, dob, address, phone], (err,res)=>{
      console.log("Adding user: " + name);
      if(err){return reject(err);
        console.log("ERROR: " + err.message);
      }
      return resolve(res)
    })
  })
}

// get all users
dataPool.allUsers = () => {
  return new Promise((resolve, reject) => {
    conn.query('SELECT * FROM User', (err, res) => {
      if (err) {
        return reject(err);
      }
      return resolve(res);
    });
  });
};

module.exports = dataPool;