// libraries
const fs = require('fs');
const es = require('event-stream');
const moment = require('moment');
const WriteToFile = require('./write-to-file');

class App2LogSim {

    constructor (area, fileToReplicate, replicatedOutputPath, logSyncStartTime, mode) {
        this.area = area;
        this.fileToReplicate = fileToReplicate;
        this.replicatedOutputPath = replicatedOutputPath;
        this.logSyncStartTime = logSyncStartTime;
        this.mode = mode;
        this.writeToFile = new WriteToFile(replicatedOutputPath);
        this.time = null;
        this.lineNo = 0;
        this.time = null;
        this.fileToReplicatepreviousLogEntryTime = moment(this.time, "HH:mm:ss:SSS");
        this.currentLogEntryTime = moment(this.time, "HH:mm:ss:SSS");
        this.bst = false;
        // this.skip = false;
        this.skip = true;
    }

    // The program will have a number of modes:
    //      - 1. Realtime replication
    //      - 2. Speed up options
    //      - 3. Test mode: no pause between events

    start = () => {

        const stream = fs.createReadStream(this.fileToReplicate)
            .pipe(es.split())
            .pipe(es.mapSync(line => {

                const writeToLog = (entry) => {

                    // write line to log file
                    this.writeToFile.write(entry + '\n');
                    console.log(entry);
                    
                    // resume the readstream, possibly from a callback
                    stream.resume();

                    // update previousLogEntryTime with currentLogEntryTime
                    this.previousLogEntryTime = moment(this.time, "HH:mm:ss:SSS");
                }

                // pause stream for processing
                stream.pause();

                // store the time of the current log file line
                this.time = line.slice(0, 12);

                // one set of files is not using BST correctly and so start at 23:00:00! adding an hour to those files
                // look for files that start at 23h
                let bstime = null;
                if(this.skip && (this.time.slice(0, 2) === '23')) {
                    this.bst = true;
                }
                if(this.bst) {
                    // add an hour to the line time
                    bstime = moment(this.time, "HH:mm:ss:SSS");
                    bstime = moment(bstime).add(1, 'hour');

                    // replace the time in the line
                    line = moment(bstime, "HH:mm:ss:SSS").format("HH:mm:ss:SSS") + line.slice(12);
                    this.time = line.slice(0, 12);
                }

                // increment the line number
                this.lineNo += 1;

                // check if the time is roughly equal to now then start
                if(this.skip) {

                    this.skip = (this.time <= moment().format("HH:mm:ss:SSS"));
                    // resume the readstream, possibly from a callback
                    stream.resume();

                } else {
                    // check if this is the first line... if it is then skip the moment calculation
                    if(this.lineNo !== 1) {

                        switch (this.mode) {
                            
                            case 1:
                                this.currentLogEntryTime = moment(this.time, "HH:mm:ss:SSS");
                                let timeInterval = moment.duration(this.currentLogEntryTime.diff(this.previousLogEntryTime));
                                setTimeout(writeToLog, timeInterval, line);
                                break;
                            case 2:
                                setTimeout(writeToLog, 25, line);
                                break;
                            case 3:
                                setTimeout(writeToLog, 0, line);
                                break;
                        }
                    } else {
                        writeToLog(line);  // first line
                    }
                }
            })
            .on('error', (err) => {
                console.log('Error while reading file.', err);
            })
            .on('end', () => {
                console.log('Read entire file');
            })
        );
    };
};

module.exports = App2LogSim;