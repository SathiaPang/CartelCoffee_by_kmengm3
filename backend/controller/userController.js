const express = require("express");
const path = require("path");
const { upload } = require("../multer");
const router = express.Router();
const User = require("../model/user");

router.post("/create-user", upload.single("file"), async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const userEmail = await User.findOne({ email });

        if (userEmail) {
            return next(new ErrorHandler("User already exists!!", 400));
        }

        const filename = req.file.filename;
        const fileUrl = path.join(filename);
        const user = {
            name: name,
            email: email,
            password: password,
            avatar: {
                public_id: "some_public_id", // replace with actual public_id
                url: fileUrl,
            },
        };
        console.log(user);

        // Continue with other processing or response logic here.

        // Example: save the user to the database
        const newUser = new User(user);
        await newUser.save();

        // Send a success response
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: newUser,
        });
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
});

module.exports = router;
