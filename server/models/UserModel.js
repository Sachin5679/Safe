const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 8,
    },
    masterPwd: {
        type: String,
        required: true,
        min: 8,
    }
})

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;