const express = require('express')
const router = express.Router()
const parentDashController = require('../controller/parentDashController')

const {auth,authorizeRoles}= require('../middleware/auth')
router.get('/',auth,authorizeRoles('parent'),parentDashController.parentDash)
router.get('/:id',parentDashController.getClassAssignments)

module.exports = router