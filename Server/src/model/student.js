const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    dojoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dojo', required: true },
    masterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Master', required: true },
    Name: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
    contact: {
        parentName: { type: String, required: true },
        phone: { type: String, required: true,match: [/^\d{10}$/, 'Phone number must be 10 digits'] },
        email: {
            type: String,
            required: true,
            match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
        },
        address: { type: String, required: false }
    },
   
    physicalInfo: {
        height: { type: Number, required: true }, // in cm
        weight: { type: Number, required: true }, // in kg
    },
    beltInfo: {
        currentBelt: { type: String, required: false },
        beltHistory: [
            {
                belt: { type: String, required: false },
                dateAwarded: { type: Date, required: false },
            }
        ]
    },
    image: {
        type: String,  // This will store the image URL/path
        required: false // Set to true if you want it to be mandatory
    },
    achievements: [
        {
            title: { type: String, required: true },
            date: { type: Date, required: true },
            description: { type: String },
            category: { type: String, enum: ['tournament', 'belt-test', 'other'], required: true }
        }
    ],
    active: {type: Boolean, default: true }
});

const Student = mongoose.model('Student',studentSchema)
module.exports = Student
// students created by master only