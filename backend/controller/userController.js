const express = require("express");
const path = require("path");
const { upload } = require("../multer");
const router = express.Router();
const User = require("../model/user");
const fs = require("fs");

router.post("/create-user", upload.single("file"), async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const userEmail = await User.findOne({ email });

        if (userEmail) {
            const filename = req.file.filename;
            const filePath = `uploads/${filename}`;
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(err)
                    res.status(500).json({ message: "Error in deleting file" })
                } else {
                    res.json({ message: "File Delete successfully" })
                }
            })

            const error = new Error("User already exists!!");
            // error.statusCode = 400;
            // throw error;
        }

        const filename = req.file.filename;
        const fileUrl = path.join(filename);
        const user = {

            name: name,
            email: email,
            password: password,
            avatar: {
                url: fileUrl,
            },
        };
        console.log(user);

        const newUser = new User(user);
        await newUser.save();

        // Send a success response
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: newUser,
        });
    } catch (error) {
        console.error(error.message);
    }
});

module.exports = router; 