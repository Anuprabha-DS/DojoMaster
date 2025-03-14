const express = require('express')
const {createDojo,viewDojo,viewDojoById,updateDojo,deleteDojo, assignDojo } = require("../controller/dojoController")
const {createMaster,viewMaster,viewMasterById,updateMaster,deleteMaster} = require('../controller/masterController')
const {auth,authorize} = require('../middleware/userMiddleware')
const { addNotification,adminViewNotify } = require('../controller/notification')
const {getStudents,getStudentById,filterStudByDojo,filtereStudentsAge} = require('../controller/adminStudent')
const router = express.Router()

// router.post('/addDojo',createDojo)
router.post('/addDojo', auth, authorize('Admin'), createDojo);
router.get('/viewDojo',auth,authorize('Admin'),viewDojo);
router.get('/assignDojo',auth,authorize('Admin'),assignDojo);

router.get('/getDojos/:id',auth,authorize('Admin'),viewDojoById);
router.patch('/updateDojo/:id',auth,authorize('Admin'),updateDojo);
router.delete('/deleteDojo/:id',auth,authorize('Admin'),deleteDojo);
router.post('/addMaster', auth, authorize('Admin'), createMaster);
router.get('/viewMasters',auth,authorize('Admin'),viewMaster);
router.get('/getMaster/:id',auth,authorize('Admin'),viewMasterById);
router.patch('/updateMaster/:id',auth,authorize('Admin'),updateMaster);
router.delete('/deleteMaster/:id',auth,authorize('Admin'),deleteMaster);
router.post('/addNotify', auth, authorize('Admin'),addNotification)
router.get('/viewNotification', auth, authorize('Admin'),adminViewNotify)


router.get('/viewStudents',auth,authorize('Admin'),getStudents)
router.get('/viewStudent/:id',auth,authorize('Admin'),getStudentById)
router.get('/StudentsDojoFilter',auth,authorize('Admin'),filterStudByDojo)
// router.get('/StudentsAgeFilter',auth,authorize('Admin'),filtereStudentsAge)



module.exports = router