const express = require('express')
const {createAdmin} = require('../controller/userController')
// const { getAdminDashboard, createDojo } = require('../controller/adminController');

// const {authUser, authorizeRole}=require('../middleware/userMiddleware')
const router = express.Router()

router.post('/addAdmin',createAdmin)


// router.post('/addAdmin',createAdmin)
// router.get('/admin/:id', getMasterById)
// router.post('/addMaster',createAdmin)
// router.get('/master/:id', getMasterById)
// router.post('/addDojo',createDojo)
// router.post('/login',login)

// // Admin dashboard route
// router.get('/dashboard', auth, adminOnly, getAdminDashboard);

// // Route to create a dojo
// router.post('/addDojo', auth, adminOnly, createDojo);
module.exports = router