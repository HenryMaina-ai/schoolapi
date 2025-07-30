const express = require('express')
const router = express.Router()
const teacherDashController = require('../controller/teacherDashController')

const {auth,authorizeRoles}= require('../middleware/auth')
router.get('/',auth,authorizeRoles('teacher'),teacherDashController.teacherDash)

module.exports = router