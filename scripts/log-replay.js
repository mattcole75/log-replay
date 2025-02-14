const LogReplay = require('../class/log-replay');
const config = require('../config/config');
const logs = [];

const { options, logFiles } = config;

// set options
const mode = options.mode;
const timeSkip = options.timeSkip;

// load configured files
logFiles.forEach(log => {
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