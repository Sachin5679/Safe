const dotenv = require('dotenv');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userModel = require('../models/UserModel');
dotenv.config({ path: "../../.env" });

exports.signup = async(req, res) => {
    try {
        const { username, masterPwd } = req.body;
        const hashedPassword = await bcrypt.hash(masterPwd, 10);
        const newUser = new userModel({username, masterPwd:hashedPassword});
        await newUser.save();
        res.status(201).json({ message: 'User created successfully!' });
    } catch(err){
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.login = async(req, res) => {
    try {
        const { username, masterPwd } = req.body;
        const user = await userModel.findOne({ username });
        console.log(user);
    
        if (!user) {
          return res.status(401).json({ message: 'Invalid username or password' });
        }
    
        console.log(masterPwd); 
        console.log(user.masterPwd);
    
        const isMatch = await bcrypt.compare(masterPwd, user.masterPwd);
        console.log(isMatch);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const payload = { userId: user._id }
        console.log(payload);
        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(payload, secret, {expiresIn: '1h'});
        console.log(token);
        res.status(200).json({ token, message: 'Login successful!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });      
    }
}

