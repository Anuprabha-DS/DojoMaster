const mongoose = require('mongoose')

// const userSchema = new mongoose.Schema({
//     email:{type:String,required: true,trim: true,unique:true,
//         match: [/^\S+@\S+\.\S+$/, 'Invalid email format']},
//     password: {type: String,required: true,minlength: [6, 'Password must be at least 6 characters']},
//     phoneNumber:{type:String,required:true,    match: [/^\d{10}$/, 'Phone number must be 10 digits']},
//     storeImage: {
//         type: String,  // This will store the image URL/path
//         required: false // Set to true if you want it to be mandatory
//     },
//     role: {type: String,required: true,
//         enum: ['Admin', 'Master' , 'Parent'], 
//         default: 'Admin'},
//     active: {type: Boolean,default: false},
//     lastLogin: {type: Date,default: null},
// }, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

// const User = mongoose.model('User',userSchema)
// module.exports = User



const masterSchema = new mongoose.Schema({
    
    name: {type:String,required:true},
    email:{type:String,required: true,trim: true,unique:true,
               match: [/^\S+@\S+\.\S+$/, 'Invalid email format']},
    number:{type:String,required:true,match: [/^\d{10}$/, 'Phone number must be 10 digits']},
    belt: {
        color:{ type:String},
        degree:{type: Number}
    },
    image: {
        type: String,  // This will store the image URL/path
        required: false // Set to true if you want it to be mandatory
    },
    assignedDojoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dojo' },
    active: {type: Boolean,default: true},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},{ timestamps: true });

const Master = mongoose.model('Master',masterSchema)
module.exports = Master