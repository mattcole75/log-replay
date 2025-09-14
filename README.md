# Signalling Log Replayer

This Node.js application replays historical signalling logs as if they were being generated in **real time**.  
It simulates continuous signalling activity for adjacent areas (**Cornbrook – CNK** and **Deansgate Castlefield – DCF**) by reading archived logs and writing them out line-by-line into new daily files.

---

## Features

- 📂 **Multi-area replay**  
  Handles Cornbrook (CNK) and Deansgate Castlefield (DCF) logs together, replayed in chronological order.

- ⏱ **Wall-clock synchronisation**  
  Starts at the **current system time-of-day** and streams events as they would occur live.  
  Example: If started at `14:32:00`, replay begins at the first event at/after `14:32:00` in the logs.

- 🔄 **Continuous cycle**  
  Once the end of the 4-day archive is reached, replay loops back and continues indefinitely.

- 🕒 **Millisecond precision**  
  Supports timestamps in the format `HH:mm:ss.SSS`.

- ⚡ **Speed multiplier**  
  Run faster or slower than real time with `--speed` (default = `1`).

- 🖥 **Console output (optional)**  
  Mirror events to the console for monitoring/debugging (`--console` / `--no-console`).

- 📑 **Daily log rotation**  
  Creates new output logs each day using the format:  

---


## Usage
### Realtime with console output
```bash 
node replay.js
```

### Replay at 10× speed with console output
```bash 
node replay.js --speed=10
```

### Replay at 5× speed, disable console output
```bash 
node replay.js --speed=5 --no-console
```