const express = require('express')
const router = express.Router()
const adminDashController = require('../controller/adminDashController')

const {auth,authorizeRoles}= require('../middleware/auth')
router.get('/',auth,authorizeRoles('admin'),adminDashController.adminDashStats)

module.exports = router