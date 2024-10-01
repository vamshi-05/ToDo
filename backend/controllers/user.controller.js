const userModel = require('../model/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');  
require('dotenv').config();
const secret = process.env.SECRET;

const checkUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ "email": email });
        if (user) {
            const username = user.username;
            const role = user.role;

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                jwt.sign({ user }, secret, (err, token) => {
                    if (!err) {
                        res.json({ status: "success", token, username, email, role });
                    } else {
                        res.json({ status: "fail", message: "JWT error" });
                    }
                });
            } else {
                res.json({ status: "fail", message: "Invalid Credentials" });
            }
        } else {
            res.json({ status: "fail", message: "Invalid Credentials" });
        }
    } catch (error) {
        res.status(404).json({ status: "fail", message: "Internal error" });
    }
}

const saveUser = async (req, res) => {
    const user = req.body;
    try {
        const existingUser = await userModel.findOne({ "email": user.email });

        if (existingUser) {
            res.json({ status: "fail", message: "User already exists! Please login" });
        } else {
        
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);

            await userModel.create(user);
            res.json({ status: "success", message: "Registered Successfully" });
        }
    } catch (error) {
        res.status(404).json({ status: "fail", message: "Internal Error" });
    }
}

module.exports = {
    checkUser,
    saveUser
}
