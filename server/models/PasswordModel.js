const mongoose = require("mongoose");

const PasswordSchema = new mongoose.Schema({
    password: {
        type: String,
        required: true,
        min: 6,
    }, 
    title: {
        type: String, 
        required: true,
        min:5
    },
    iv: {
        type: String,
        required: true,
    }
})

const PasswordModel = mongoose.model('password', PasswordSchema);

module.exports = PasswordModel;