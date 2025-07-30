const express = require('express')
const router = express.Router()
const studentController = require('../controller/studentController')
const {auth,authorizeRoles} = require('../middleware/auth')

router.post('/register',auth,authorizeRoles('admin'),studentController.uploadStudentPhoto,studentController.addStudent)
router.get('/',studentController.getAllStudents)
router.get('/:id',auth,studentController.getOneStudent)
router.put('/:id',auth,authorizeRoles('admin'),studentController.updateStudent)
router.delete('/:id',auth,authorizeRoles('admin'),studentController.deleteStudent)

module.exports = router