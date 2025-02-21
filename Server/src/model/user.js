const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email:{type:String,required: true,trim: true,unique:true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format']},
    password: {type: String,required: true,minlength: [6, 'Password must be at least 6 characters']},
    role: {type: String,required: true,
        enum: ['Admin', 'Master' , 'Parent'], 
        default: 'Admin'},
    active: {type: Boolean,default: true},
    lastLogin: {type: Date,default: null},
    mustChangePassword: {
        type: Boolean,
        default: false // Default to false for general users
    },
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

const User = mongoose.model('User',userSchema)
module.exports = User



    // phoneNumber:{type:String,required:true,    match: [/^\d{10}$/, 'Phone number must be 10 digits']},
    // storeImage: {
    //     type: String,  // This will store the image URL/path
    //     required: false // Set to true if you want it to be mandatory
    // },