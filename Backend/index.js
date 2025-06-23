const express = require('express')
require('dotenv').config()
const app = express()
const cors = require("cors")
const path = require('path')
const port = process.env.PORT || 5006

// Import custom modules-controllers
const users = require("./routes/users")
//const listings = require("./routes/listings")
const forum = require("./routes/forum")

// Configurations
app.use(cors()) // change later to cors({ methods: ["GET", "POST"] })
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(express.static(path.join(__dirname, "build")))

// app.use(session({
//     secret: 'super-secret-key',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       httpOnly: true,
//       secure: false, // Set true on production with HTTPS!
//       sameSite: 'lax',
//       maxAge: 24 * 60 * 60 * 1000, // 1 day
//     }
//   }));
  
// // Fake user data
// const fakeUser = { id: 1, username: 'user', password: 'pass' };

// app.post('/login', (req, res) => {
//   const { username, password } = req.body;
//   if (username === fakeUser.username && password === fakeUser.password) {
//     req.session.userId = fakeUser.id;
//     return res.json({ message: 'Logged in' });
//   }
//   res.status(401).json({ error: 'Invalid credentials' });
// });

// app.get('/profile', (req, res) => {
//   if (!req.session.userId) {
//     return res.status(401).json({ error: 'Not authenticated' });
//   }
//   res.json({ id: fakeUser.id, username: fakeUser.username });
// });

// app.post('/logout', (req, res) => {
//   req.session.destroy(() => {
//     res.clearCookie('connect.sid'); // default cookie name
//     res.json({ message: 'Logged out' });
//   });
// });
app.use('/users', users)
app.use('/forum', forum) 

// Routes
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"))
})

//app.use('/listings', listings)
//app.use('/forum', forum)

// app.get("/", (req, res) => {
//     DB.query('SELECT * FROM User', (err, results) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).json({ error: "Database query error" });
//         }
//         res.json(results);
//     });
//     res.send("hola")
// });


//App listening on port
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})
