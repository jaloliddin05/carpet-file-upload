const router = require('express').Router()
const RemoveController = require('../controllers/remove.controller.js')

const Controller = new RemoveController()

router.delete('/remove', Controller.removeFile)

module.exports = router