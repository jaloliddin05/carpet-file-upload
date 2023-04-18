const fs = require('fs');
const path = require('path')
const { v4: uuidv4 } = require('uuid');
const { fork } = require('child_process')
const createDirRecursively = require('../utils/recursiveDir');
const setFileExtension = require('../utils/setFileExtension');

class ImageController {
    async uploadImage(req, res, next) {
        try {
            const { folderName } = req.body
            const image = req.files?.image;
            var tempFilePath = image?.tempFilePath;
            const fileName = setFileExtension(uuidv4() + req.files?.image?.name.replace(/\s/g, ''), '.png')
            const outputDir = path.resolve(__dirname, '../../../uploads/image/', folderName || '')
            const outputPath = path.join(__dirname, '../../../uploads/image/', folderName || '', './')
            const url = (req.protocol + "://" + req.get("host") + path.join('/image', folderName || '', fileName))

            if (!fs.existsSync(outputDir)) {
                createDirRecursively(outputDir)
            }
        
            if (image && tempFilePath) {
                if (!['image/jpeg', 'image/jpg', 'image/png', 'image/svg', 'application/octet-stream'].includes(image?.mimetype)) {
                    if(fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath)
                    return res.status(409).send({
                        error: true,
                        message: 'Incorrect file type',
                        url: null
                    })
                } else {
                    const child = fork(path.resolve(__dirname, '../utils/compress-image.js'))
                    child.send({
                        inputPath: tempFilePath,
                        tempPath: path.resolve(__dirname, '../../temp/image', fileName).replace(/\\/g, '/'),
                        outputPath,
                        url
                    })
                    child.on('message', ({ statusCode, msg }) => {
                        res.status(statusCode).send(msg)
                    })
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

module.exports = ImageController