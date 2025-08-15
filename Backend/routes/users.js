const express = require("express")
const users = express.Router()
const DB = require('../db/dbConn.js')
const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const sendMail = require('../utils/sendMail'); // Your email utility
const multer = require("multer");
const upload = multer();
const authenticate = require('./authMiddleware.js')
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';
const path = require('path');
const API_URL = process.env.REACT_APP_API_URL;

users.get('/me', authenticate, async (req, res) => {
    try {
        // req.user is set by authMiddleware (contains id and username)
        console.log("Fetching user profile for user ID:", req.user.id);
        const userId = req.user.id;
        // Adjust the query to match your User table columns
        const [user] = await DB.getUser(userId);
        console.log("User fetched from database:", user);


        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.Role === 'petsitter') {
            //fetch petsitter rating
            //const rating = await DB.getPetsitterRating(userId);
            const reviews = await DB.getPetsitterReviews(userId);
            console.log("Petsitter reviews fetched from database:", reviews);
            user.reviews = reviews; //attach reviews to user object

            //console.log("Petsitter rating fetched from database:", rating);
            //user.rating = rating[0] ? rating[0].rating : 0; //attach rating to user object
        }
        if (user.Role === 'petowner') {
            const pets = await DB.getPetsByUser(user.Id);
            console.log("Pets fetched from database:", pets);

            if (pets.length > 0) {
                user.pets = pets;
            }
        }

        console.log("User profile fetched successfully:", user);
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch user profile" });
    }
});

users.put('/me/pets', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const petsForm = req.body; // Expecting an array of pet objects
       
        // Validate and update each pet
        for (const pet of petsForm) {
            const { Id, Name, Type, Breed, Description, DOB, UserId } = pet;
            if (!Id || !Name || !Type || !Breed || !Description || !DOB || !UserId) {
                return res.status(400).json({ message: "Invalid pet data" });
            }
            await DB.updatePet(Id, { Name, Type, Breed, Description, DOB: DOB.split("T")[0], UserId });
        }

        res.json({ message: "Pets updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update pets" });
    }
});

users.put('/me', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const profileForm = req.body;
        //         const profileForm: {
        //     Name: string;
        //     Surname: string;
        //     Username: string;
        //     Email: string;
        //     PhoneNo: string;
        //     DOB: string;
        //     Address: string;
        //     City: string;
        //     Role: string;
        // }

        // Update user information in the database
        const result = await DB.updateUser(userId, profileForm);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update user" });
    }
});

users.delete('/me', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        //check if there is a deal with this user
        const hasActiveDeals = await DB.checkUserHasActiveDeals(userId);
        if (hasActiveDeals) {
            return res.status(400).json({ message: "User has active deals and cannot be deleted" });
        }
        const result = await DB.deleteUser(userId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete user" });
    }
});

// get all users (for testing purposes, not recommended for production)
// users.get('/', async (req, res, next) => {
//     try {
//         const queryResult = await DB.allUsers();
//         res.json(queryResult);
//     } catch (err) {
//         console.log(err);
//         res.sendStatus(500);
//     }
// });

users.post('/forgotpassword', async (req, res) => {
    const { email } = req.body;
    try {

        const [user] = await DB.FindUser(email);
        if (!user) {
            return res.json({ message: 'There is not an account with this email please try again.' });
        }

        console.log(user);
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 1000 * 60 * 30; // 30 minutes

        console.log("Generated reset token:", resetToken);
        await DB.StoreResetToken(user.Id, resetToken, resetTokenExpiry);


        console.log(user);
        //await user.save(); 
        const resetUrl = `${API_URL}/resetpassword/${resetToken}`;
        await sendMail({
            to: email,
            subject: 'Petsitter Password Reset',
            text: `To reset your password, click this link: ${resetUrl}`,
            html: `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <img src="${API_URL}/logo.png" alt="Petsitter Logo" style="width: 120px; margin-bottom: 12px;" />
        <h2 style="color: #4a90e2;">Petsitter Password Reset</h2>
      </div>
      <p>Hello,</p>
      <p>We received a request to reset your password for your Petsitter account.</p>
      <p style="text-align: center;">
        <a href="${resetUrl}" style="display: inline-block; background: #4a90e2; color: #fff; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold;">
          Reset Password
        </a>
      </p>
      <p>If you did not request this, you can safely ignore this email.</p>
      <p style="color: #888; font-size: 13px; margin-top: 32px;">The Petsitter Team</p>
    </div>
  `
    });

        res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
    } catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json({ message: 'Server error.' });
    }
});

users.get('/pets', authenticate, async (req, res) => {
    try {
        //get userId from authMiddleware
        console.log("Fetching pets for user ID:", req.user.id);
        const pets = await DB.getUserPets(req.user.id);
        res.json(pets);
    } catch (err) {
        console.error('Error fetching user pets:', err);
        res.status(500).json({ message: 'Server error.' });
    }
});

users.post('/resetpassword', async (req, res) => {
    const { token } = req.body;
    const { password } = req.body;
    console.log("Reset password request for token:", token);

    const user = await DB.FindUserByResetToken(token);
    console.log("Reset password request for token:", token);
    console.log("User found for reset token:", user);
    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }

    // Update user's password (hash it in production!)
    await DB.UpdateUserPassword(user.Id, password);

    // Delete the token so it can't be reused
    await DB.DeleteResetToken(token);

    res.json({ message: 'Password has been successfully reset.' });
});

// LOGIN ROUTE
users.post('/signin', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const queryResult = await DB.AuthUser(email);
        console.log(email);

        if (queryResult.length === 0) {
            console.log("USER NOT REGISTERED");
            return res.status(404).send({ error: "User not found." });
        }

        const user = queryResult[0];
        if (password === user.Password) {
            const token = jwt.sign({ id: user.Id, username: user.Username },
                ACCESS_TOKEN_SECRET,
                { expiresIn: '20m' }) //change the secret key for github put it in env
            console.log("Login successful:", token);
            return res.json({ success: true, token: token, userRole: user.Role, username: user.Username }); //
        } else {
            console.log("INCORRECT PASSWORD");
            return res.json({ success: false, message: "incorrect password" });
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
        next(err);
    }
});

// REGISTER ROUTE DONE?
users.post('/register', upload.single("vetProof"), async (req, res, next) => {
    console.log("Registering user...");
    const photoBuffer = req.file ? req.file.buffer : null;
    //     FormData:
    //   name: "John"
    //   surname: "Doe"
    //   username: "johndoe"
    //   password: "Password123"
    //   confirmPassword: "Password123"
    //   email: "john@example.com"
    //   phone: "123456789"
    //   dob: "2000-01-01"
    //   address: "123 Main St"
    //   city: "Athens"
    //   isVeterinarian: true
    //   vetClinic: "Animal Care Clinic"
    //   vetProof: [File object]   // The uploaded file
    //   userType: "petowner" or "petsitter"
    try {
        console.log("Received registration data:", req.body);
        const { name, surname, username, password, email, phone, dob, address, city, isVeterinarian, vetClinic, userType, pets } = req.body;
        const queryResult = await DB.AddUser(name, surname, username, password, email, phone, dob, address, city, userType);
        if (isVeterinarian === true || isVeterinarian === "true") {
            console.log(isVeterinarian);
            const queryVetResult = await DB.AddVet(vetClinic, photoBuffer, email);
            if (!queryVetResult.affectedRows) {
                console.log("Failed to add veterinarian details.");
                return res.status(500).send({ error: "Failed to add veterinarian details." });
            }
        }
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

users.get('/checkifvet', authenticate, async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await DB.getUser(userId);
        console.log("Checking if user is vet for user ID:", userId, "Email:", user[0].Email);
        const isVet = await DB.checkIfVet(user[0].Email);
        res.status(200).send(isVet);
    } catch (err) {
        console.error('Error checking if user is vet:', err);
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = users;
