const router = require('express').Router()
const ImageController = require('../controllers/image.controller')

const Controller = new ImageController()

router.post('/upload/image', Controller.uploadImage)

module.exports = router