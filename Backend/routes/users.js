const express = require("express")
const users = express.Router()
const DB = require('../db/dbConn.js')


// TODO: implement sessions and cookies to keep the user logged in.
// TODO: implement a logout route 
// TODO: use encryption to store passwords (e.g., bcrypt)

// get all users (for testing purposes, not recommended for production)
users.get('/', async (req, res, next) => {
    try {
        const queryResult = await DB.allUsers();
        res.json(queryResult);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// LOGIN ROUTE
users.post('/signin', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            console.log("Please enter Username and Password!");
            return res.status(400).send({ error: "Username and password required." });
        }

        const queryResult = await DB.AuthUser(username);

        if (queryResult.length === 0) {
            console.log("USER NOT REGISTERED");
            return res.status(404).send({ error: "User not found." });
        }

        const user = queryResult[0];

        // FIXED: Correct field name for password is 'Password'
        if (password === user.Password) {
            console.log("Login successful:", user);
            return res.send({ logged: true, user });
        } else {
            console.log("INCORRECT PASSWORD");
            return res.status(401).send({ error: "Incorrect password." });
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
        next(err);
    }
});

// REGISTER ROUTE
users.post('/register', async (req, res, next) => {
    console.log("Registering user...");
    try {
        const { name, surname, username, email, password, phone, dob, address, city } = req.body;

        if (!name || !surname || !username || !password || !email || !phone || !dob || !address || !city) {
            console.log("A field is missing!");
            return res.status(400).send({ error: "All fields are required." });
        }

        const queryResult = await DB.AddUser(name, surname, username, password, email, phone, dob, address, city);

        if (queryResult.affectedRows) {
            console.log("New user added!!");
            return res.status(201).send({ message: "User registered successfully." });
        } else {
            return res.status(500).send({ error: "User registration failed." });
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
        next(err);
    }
});

module.exports = users;
