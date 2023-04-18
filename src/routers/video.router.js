const router = require('express').Router()
const VideoController = require('../controllers/video.controller.js')

const Controller = new VideoController()

router.post('/upload/video', Controller.uploadVideo)

module.exports = router