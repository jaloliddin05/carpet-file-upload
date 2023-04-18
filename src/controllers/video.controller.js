const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid'); 
const { fork } = require('child_process');
const createDirRecursively = require('../utils/recursiveDir');
const setFileExtension = require('../utils/setFileExtension');

class VideoController {
    async uploadVideo(req, res, next) {
        try {
            const { folderName } = req.body
            const video = req.files?.video;
            var tempFilePath = video?.tempFilePath;
            const fileName =  setFileExtension(uuidv4() + req.files?.video?.name.replace(/\s/g, ''), '.mp4')
            const outputDir = path.resolve(__dirname, '../../../uploads/video/', folderName || '')
            const url = (req.protocol + "://" + req.get("host") + path.join('/video', folderName || '', fileName))

            if (!fs.existsSync(outputDir)) {
                createDirRecursively(outputDir)
            }

            if (video && tempFilePath) {
                if (!['video/mp4', 'video/mov', 'video/quicktime', 'application/octet-stream'].includes(video?.mimetype)) {
                    if(fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath)
                    return res.status(409).send({
                        error: true,
                        message: 'Incorrect file type',
                        url: null
                    })
                } else {
                    const child = fork(path.resolve(__dirname, '../utils/compress-video.js'));
                    child.send({ tempFilePath, outputPath: path.resolve(outputDir, fileName), url });
                    child.on("message", (message) => {
                        if(fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath)
                        const { statusCode, msg } = message;
                        res.status(statusCode).send(msg);
                    });
                }
            } else {
                res.status(400).send({
                    error: true,
                    message: 'No file uploaded',
                    url: null
                });
            }
        } catch (error) {
            if(fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath)
            next(error)
        }
    }
}

module.exports = VideoController