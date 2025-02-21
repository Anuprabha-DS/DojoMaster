const mongoose = require('mongoose')

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