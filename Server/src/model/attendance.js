const mongoose= require('mongoose')
const attendanceSchema = new mongoose.Schema({
    dojoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dojo', required: true },
    date: { type: Date, required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
});

const Attendance = mongoose.model('Attendance',attendanceSchema)
module.exports = Attendance

