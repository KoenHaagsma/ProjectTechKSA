const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
    {
        email: String,
        password: String,
        matched: [String],
        ignored: [String],
        genres: [String],
        firstName: String,
        lastName: String
    },
    { timestamps: true, typeKey: '$type' },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
