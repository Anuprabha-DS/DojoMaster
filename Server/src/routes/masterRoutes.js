const express = require('express')
const{createStudent,getStudents,getStudentById,updateBelt,addAchievements,deleteStudent}= require('../controller/studentController')
const {Attendance,viewAttendance,viewStudAttendance} = require('../controller/attendance')
const {viewNotification}=require('../controller/notification')
const {auth,authorize} = require('../middleware/userMiddleware')
const router = express.Router()

router.post('/addStudent',auth,authorize('Master'),createStudent)
router.get('/viewStudents',auth,authorize('Master'),getStudents)
router.get('/viewStudent/:id',auth,authorize('Master'),getStudentById)
router.put('/updateBelt/:id',auth,authorize('Master'),updateBelt)
router.patch('/Achievements/:id',auth,authorize('Master'),addAchievements)
router.delete('/deleteStud/:id',auth,authorize('Master'),deleteStudent)
router.post('/StudAttendance',auth,authorize('Master'),Attendance)
router.get('/getAttendance',auth,authorize('Master'),viewAttendance)
router.get('/getStudAttendance',auth,authorize('Master'),viewStudAttendance)
router.get('/getNotification',auth,authorize('Master'),viewNotification)















module.exports = router

