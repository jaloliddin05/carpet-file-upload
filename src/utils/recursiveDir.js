const fs = require('fs')
const path = require('path')

function createDirRecursively(dir) {
    if (!fs.existsSync(dir)) {        
        createDirRecursively(path.join(dir, ".."));
        fs.mkdirSync(dir);
    }
}

module.exports = createDirRecursively