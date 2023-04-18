function setFileExtension(fileName, defaultExtension) {
    const [name, extension] = fileName.split('.');
    return extension ? fileName : `${name}.${defaultExtension}`
}

module.exports = setFileExtension