const mongoose = require('mongoose');

// Mongoose connection
mongoose.connect("mongodb+srv://harshitbahety41:hYHJX0zsxKqyUDPA@cluster0.sjfxrdo.mongodb.net/");


// Define user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
 
    },
    first_name:{
        type: String,
   
    },
    last_name:{
        type: String,

    }
});

// Define account schema
const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Referring to the 'user' collection
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

// Define models
const user = mongoose.model('user', userSchema);
const account = mongoose.model('account', accountSchema);

module.exports = {
    user,
    account
};
