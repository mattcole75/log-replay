const moment = require('moment');

const options = {
    // The program will have a number of modes:
    //      - 1. Realtime replication
    //      - 2. Speed up options waits .5 seconds between each line read
    //      - 3. Test mode: no pause between events
    mode: 3,
    // skip to current time Boolean
    //      - true: the process will skip to the current system time
    //      - false: the process will start at the beginning of the file
    timeSkip: true
}

const logFiles = [
    {
        log: {
            id: 'CNK',
            fileToReplicate: '../data/original-logs/CNK.2022-04-02.log',
            replicatedOutputPath: `../data/replicated-logs/CNK.${ moment().format('YYYY-MM-DD') }.log`
        }
    },
    {
        log: {
            id: 'DCF',
            fileToReplicate: '../data/original-logs/DCF.2022-04-02.log',
            replicatedOutputPath: `../data/replicated-logs/DCF.${ moment().format('YYYY-MM-DD') }.log`
        }
    }
]

module.exports = {
    options: options,
    logFiles: logFiles
}
