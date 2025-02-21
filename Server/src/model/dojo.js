const mongoose = require('mongoose');

const dojoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: {
        place: String,
        city: String,
        state: String,
        pincode: String
    },
    contact: {
        phone: String,
        email: String 
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    active: {type: Boolean,default: true},
    assign: {type: Boolean,default: false},


}, { timestamps: true });

const Dojo = mongoose.model('Dojo', dojoSchema);
module.exports = Dojo;
//Dojo is creted by admin only



