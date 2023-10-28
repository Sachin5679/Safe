const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: True,
        min: 8,
    },
    masterPwd: {
        type: String,
        required: True,
        min: 8,
    }
})

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;