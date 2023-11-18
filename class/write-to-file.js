const fs = require('fs');

class WriteToFile {

    constructor (outputPath) {
        this.outputPath = outputPath;
        this.writeStream = fs.createWriteStream(this.outputPath, { flags: 'a' })
            .on('finish', () => {
                writeStream.end();
            })
            .on('error', (err) => {
                console.log(err.stack);
            });
    }
    
    write = (line) => {
        this.writeStream.write(line, () => {});
    };
}

module.exports = WriteToFile;