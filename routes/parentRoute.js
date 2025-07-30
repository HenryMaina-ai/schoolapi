const express = require('express')
const router = express.Router()
const parentController = require('../controller/parentController')

const {auth,authorizeRoles} = require('../middleware/auth')

router.post('/add',auth,parentController.addParent)
router.get('/',parentController.getAllParents)
router.put('/:id',parentController.updateParent)
router.delete('/:id',parentController.deleteParent)
module.exports = router