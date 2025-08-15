const express = require('express')
require('dotenv').config()
require('./scheduler')
const app = express()
const cors = require("cors")
const path = require('path')
const port = process.env.PORT || 5006

const users = require("./routes/users")
const listings = require("./routes/listings")
const forum = require("./routes/forum")
const deals = require("./routes/deals")

app.use(cors()) // change later to cors({ methods: ["GET", "POST"] })
app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.use('/users', users)
app.use('/forum', forum) 
app.use('/listings', listings)
app.use('/deals', deals)

app.use(express.static(path.join(__dirname, "build")))
app.use('/public', express.static(__dirname + '/public'));
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"))
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})
