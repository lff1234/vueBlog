const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let userSchema = new Schema({
    username: {
        type: String,
    },
    userpwd: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
});
module.exports = mongoose.model('User', userSchema);