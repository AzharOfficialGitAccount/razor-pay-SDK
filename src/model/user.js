const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true
    },
    firstName: {
        type: String,
        trim: true,
        required: true,
    },
    lastName: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    userStatus: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Inactive'
    },
    country: {
        type: String,
    },
    otp: {
        type: Number,
    },
    isVerify: {
        type: Boolean,
        default: false
    },
    department_name: {
        type: String
    },
    primaryResearchArea: {
        type: String
    },
    secondaryResearchArea: {
        type: String
    },
    token: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("user", userSchema);