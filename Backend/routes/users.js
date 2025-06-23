const express = require("express")
const users = express.Router()
const DB = require('../db/dbConn.js')
const jwt = require('jsonwebtoken')
const authenticate = require('./authMiddleware.js')
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';


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
        const queryResult = await DB.AuthUser(username);

        if (queryResult.length === 0) {
            console.log("USER NOT REGISTERED");
            return res.status(404).send({ error: "User not found." });
        }

        const user = queryResult[0];
        if (password === user.Password) {
            const token = jwt.sign( { id: user.Id, username: user.Username },
                ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }) //change the secret key for github put it in env
            console.log("Login successful:", token);
            return res.json({success: true, token: token}); //
        } else {
            console.log("INCORRECT PASSWORD");
            return res.json({success: false, message: "incorrect password"});
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
        next(err);
    }
});

// REGISTER ROUTE DONE?
users.post('/register', async (req, res, next) => {
    console.log("Registering user...");
    try {
        const { name, surname, username, email, password, phone, dob, address, city } = req.body;
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
