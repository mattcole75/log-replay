const App1LogReplay = require('../class/app1-log-replay');
const config = require('../config/app1-logs');
const logs = [];

// The program will have a number of modes:
//      - 1. Realtime replication
//      - 2. Speed up options
//      - 3. Test mode: no pause between events
const mode = 1;

// load config
config.forEach(lc => {
    const { area, log } = lc.localController;
    const app1LogReplay = new App1LogReplay(area, log.fileToReplicate, log.replicatedOutputPath, null, mode);
    logs.push(app1LogReplay);

    console.log('ok - ' + area + ' replay is ready.');
});

// start replay
logs.forEach(log => {
    log.start();
    console.log('ok - ' + log.area + ' replay started.');
});