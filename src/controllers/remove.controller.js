const path = require('path')
const fs = require('fs')

class RemoveController{
    async removeFile(req, res, next) {
        try {
            const pathName = new URL(req.body.url)?.pathname || ''
            if (pathName) {
                fs.unlink(path.join(__dirname, '../../../uploads', pathName), (err) => {
                    if(err) {
                        console.log("Remove file error :", err);
                    }
                })
            }
            res.status(204).send('deleted')
        } catch (error) {
            next(error)
        }
    }
}

module.exports = RemoveController