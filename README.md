# Time based log replay application

## Introduction
Welcome! ***log-replay*** is a utility application that can read a log file and recreate the original file in real-time. There are also options to speed through the log file giving a specified interval or just going as quickly as the host can manage.

The application solved a particular issue whilst developing a log file monitoring application. It was not possible to connect to the live system producing the log files which meant there was a requirement to develop a log file replay application to speed up the development process.

The application has proven useful when replaying log files for specific events being able to slow the replay down and watch each event unfold.

The application can replay multiple log files at once by setting up the config file. This is particularly useful when you have multiple log files being generated at the same time.

## Requirements
1. Node.Js.
2. Linux or Apple OS only, this has not been tested with windows.
3. The log file must contain a timestamp on each line.
4. The configuration file must be set up with valid file locations. for example:

## Concepts
1. The system reads the configuration file and starts a replay process for each of the configured entries.
2. Any previous replicated log files are deleted at start-up.
3. The replicated files are created in the configured location and are ready to be written to as the process runs.
4. The output from all configured replicated log files are displayed in the console.

## Quick Start
There is an example configuration file and sample log files from a light railway system included to get you started.

```
npm install
npm run start
```

## Detailed Guide
This section aims to give detailed instructions on how to set up the system to replay your log files.

1. Start by copying the log file(s) to the /data/original-logs directory.
    > It makes life easier if there are no spaces in the file name
2. update the configuration file:
```
module.exports = logFiles = [
    {
        log: {
            id: 'CNK',
            fileToReplicate: '../data/original-logs/[yourFilesName].log',
            replicatedOutputPath: `../data/replicated-logs/[yourFilesName].${ moment().format('YYYY-MM-DD') }.log`
        }
    },
    {
        ... add as many file configurations as you like
    }
]
```
    > The above configuration will create a new log file in the replicated-logs directory using the name of your file and then appending the current date.
3. Update the code to match the given log file.
 - open the /class/log-replay.js file
 - find the following entry (note: there are two entries):
```
this.time = line.slice(0, 11);
```
- the code takes the first 10 chars (0 to 11). 
- this is the first line out of the CNK file, the first 10 character is the time element: "23:59:58.949 Dig I/P 0.4 changed from 0 to 1".
- change the slice to suite the given log file.
4. Start the application and test the configuration.

## FAQ
No FAQ yet

## Change Log
2025/02/2025 - Updated the make the system more generic. Included the README.md file and GNU license
