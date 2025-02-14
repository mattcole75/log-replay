const moment = require('moment');

module.exports = logFiles = [
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
