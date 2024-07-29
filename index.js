import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import { setupMaster, fork } from 'cluster';
import { watchFile, unwatchFile } from 'fs';
import { createInterface } from 'readline';
import Helper from './lib/helper.js';

const rl = createInterface(process.stdin, process.stdout);
const __dirname = dirname(fileURLToPath(import.meta.url));
const args = [join(__dirname, 'main.js'), ...process.argv.slice(2)];

let isRunning = false;

/**
 * Start a js file
 * @param {String} file `path/to/file`
 */
function start(file) {
  if (isRunning) return;
  isRunning = true;
  setupMaster({
    exec: args[0],
    args: args.slice(1),
  });
  let p = fork();
  p.on('message', data => {
    console.log('[RECEIVED]', data);
    switch (data) {
      case 'reset':
        p.process.kill();
        isRunning = false;
        start.apply(this, arguments);
        break;
      case 'uptime':
        p.send(process.uptime());
        break;
    }
  });
  p.on('exit', (_, code) => {
    isRunning = false;
    console.error('Exited with code:', code);
    if (code === 0) return;
    watchFile(args[0], () => {
      unwatchFile(args[0]);
      start(file);
    });
  });
  if (!Helper.opts['test'])
    if (!rl.listenerCount()) rl.on('line', line => {
      p.emit('message', line.trim());
    });
}

start('main.js');

// Create HTTP server for Koyeb
const server = createServer((req, res) => {
  const parsedUrl = parse(req.url, true);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, Koyeb!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});