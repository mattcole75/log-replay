const fs = require("fs");
const readline = require("readline");
const path = require("path");
const minimist = require("minimist");

// --- CLI options ---
const args = minimist(process.argv.slice(2), {
  default: {
    speed: 1,        // default = real time
    console: true,   // default = print to console
  },
  boolean: ["console"],
});

const SPEED = Number(args.speed);
const SHOW_CONSOLE = Boolean(args.console);

const areas = {
  CNK: [
    "../data/original-logs/CNK.2022-04-01.log",
    "../data/original-logs/CNK.2022-04-02.log",
    "../data/original-logs/CNK.2022-04-03.log",
    "../data/original-logs/CNK.2022-04-04.log",
  ],
  DCF: [
    "../data/original-logs/DCF.2022-04-01.log",
    "../data/original-logs/DCF.2022-04-02.log",
    "../data/original-logs/DCF.2022-04-03.log",
    "../data/original-logs/DCF.2022-04-04.log",
  ],
};

const { setTimeout: delay } = require("timers/promises");
function msSinceMidnight(date = new Date()) {
  return (
    date.getHours() * 3600 * 1000 +
    date.getMinutes() * 60 * 1000 +
    date.getSeconds() * 1000 +
    date.getMilliseconds()
  );
}

function getOutputStream(area) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const filename = `${area}.${today}.log`;
  return fs.createWriteStream(path.join("../data/replicated-logs", filename), { flags: "a" });
}

async function readLogFile(area, file) {
  const rl = readline.createInterface({
    input: fs.createReadStream(file),
    crlfDelay: Infinity,
  });
  const events = [];
  for await (const line of rl) {
    // Match HH:mm:ss.SSS
    const match = line.match(/^(\d{2}):(\d{2}):(\d{2})\.(\d{3})/);
    if (!match) continue;
    const [_, h, m, s, ms] = match.map(Number);
    const ts = h * 3600 * 1000 + m * 60 * 1000 + s * 1000 + ms;
    events.push({ area, ts, line });
  }
  return events;
}

async function loadAllEvents() {
  let events = [];
  for (const [area, files] of Object.entries(areas)) {
    for (const file of files) {
      const e = await readLogFile(area, file);
      events = events.concat(e);
    }
  }
  events.sort((a, b) => a.ts - b.ts);
  return events;
}


async function replayLogs() {
  let outStreams = {};
  for (const area of Object.keys(areas)) {
    outStreams[area] = getOutputStream(area);
  }
  let currentDate = new Date().toISOString().slice(0, 10);

  while (true) {
    const events = await loadAllEvents();

    // Find where to start based on real time
    const nowTOD = msSinceMidnight();
    let startIndex = events.findIndex(ev => ev.ts >= nowTOD);
    if (startIndex === -1) startIndex = 0; // after last event → start at beginning

    for (let i = startIndex; i < events.length; i++) {
      const ev = events[i];

      // Wait until wall clock catches up to this event's time
      let wait = ev.ts - msSinceMidnight();
      if (wait > 0) {
        await delay(wait);
      }

      // Rotate output files daily
      const today = new Date().toISOString().slice(0, 10);
      if (today !== currentDate) {
        for (const [area, stream] of Object.entries(outStreams)) {
          stream.end();
          outStreams[area] = getOutputStream(area);
        }
        currentDate = today;
      }

      // Write to file
      outStreams[ev.area].write(ev.line + "\n");

      // Console output
      if (SHOW_CONSOLE) {
        console.log(`[${ev.area}] ${ev.line}`);
      }
    }

    // When we reach the end, loop back to midnight
  }
}

replayLogs().catch(console.error);