const express = require('express')
require('dotenv').config()
const app = express()
const cors = require("cors")
const path = require('path')
const port = process.env.PORT || 5006

const DB = require('./db/dbConn.js')

app.use(cors())
app.use(express.json())


app.get("/", (req, res) => {
    DB.query('SELECT * FROM User', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results);
    });
});


///App listening on port
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})
