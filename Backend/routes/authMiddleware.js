const jwt = require("jsonwebtoken")
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';



function authenticate(req, res, next) {
    const authHeader = req.headers['authorization']
    if (!authHeader) {
        return res.status(401).json({ message: "No auth headers" });
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user;
        next();
    });

    // //veryfy the token
    // try {
    //     const decoded = JsonWebTokenError.verify(token, 'secretkey')
    //     if (decoded) {
    //         const username = decoded.username
    //         const persistedUser = users.find((user) => user.username == username)
    //         if (persistedUser) {
    //             next()
    //         }
    //         else {
    //             res.json({ success: false, message: "user doesnt exist" })
    //         }
    //     }
    //     else {
    //         res.status(401).json({ success: false, message: "no auth headers" })
    //     }
    // }
    // catch (error) {
    //     res.status(401).json({ success: false, message: "token has been tempered" })
    // }
}

module.exports = authenticate;