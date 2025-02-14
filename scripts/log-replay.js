const LogReplay = require('../class/log-replay');
const config = require('../config/config');
const logs = [];

// The program will have a number of modes:
//      - 1. Realtime replication
//      - 2. Speed up options
//      - 3. Test mode: no pause between events

const mode = 1;

// skip to current time Boolean
//      - true: the process will skip to the current system time
//      - false: the process will start at the beginning of the file

const timeSkip = false;

// load config
config.forEach(log => {
    const { id,  fileToReplicate, replicatedOutputPath } = log.log;
    const logReplay = new LogReplay(id, fileToReplicate, replicatedOutputPath, mode, timeSkip);
    logs.push(logReplay);

    console.log('ok - ' + id + ' replay is ready.');
});

// start replay
logs.forEach(log => {
    log.start();
    console.log('ok - ' + log.id + ' replay started.');
});