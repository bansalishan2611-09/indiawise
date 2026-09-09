require('./banner');
const { spawn } = require('child_process');

const command = process.argv[2]; // 'dev' or 'build'
if (!command) {
  console.error("Please specify 'dev' or 'build'");
  process.exit(1);
}

// Windows needs npx.cmd, Linux/Mac needs npx
const isWindows = /^win/.test(process.platform);
const npxCmd = isWindows ? 'npx.cmd' : 'npx';

const child = spawn(`${npxCmd} next ${command}`, [], {
  stdio: ['inherit', 'pipe', 'pipe'],
  env: process.env,
  shell: true
});

const RED = '\x1b[31m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';
const DOTS = '---------------------------------------------------------------------------';
const SEPARATOR = `${RED}${DOTS}${RESET}`;

const ERROR_ART = [
  "●●●●●  ●●●●   ●●●●    ●●●   ●●●● ",
  "●      ●   ●  ●   ●  ●   ●  ●   ●",
  "●●●●   ●●●●   ●●●●   ●   ●  ●●●● ",
  "●      ●  ●   ●  ●   ●   ●  ●  ● ",
  "●●●●●  ●   ●  ●   ●   ●●●   ●   ●"
];

// Center the art in 75 characters (the length of the separator)
const HEADER = ERROR_ART.map(line => {
  const pad = Math.floor((75 - line.length) / 2);
  return `${RED}${BOLD}${' '.repeat(pad)}${line}${RESET}`;
}).join('\n');

let isErrorActive = false;
let errorTimeout = null;

function triggerErrorState() {
  if (!isErrorActive) {
    isErrorActive = true;
    process.stdout.write(`\n${SEPARATOR}\n${HEADER}\n${SEPARATOR}\n\n`);
  }
  // Extend the timeout every time we get more error data
  clearTimeout(errorTimeout);
  errorTimeout = setTimeout(() => {
    if (isErrorActive) {
      process.stdout.write(`\n${SEPARATOR}\n\n`);
      isErrorActive = false;
    }
  }, 500); // 500ms of silence marks the end of the error block
}

// Process stdout
child.stdout.on('data', (data) => {
  const str = data.toString();
  
  // Detect Next.js errors that might be printed to stdout instead of stderr
  const hasErrorIndicator = 
    str.includes('⨯ Error:') || 
    str.includes('[browser] Error:') || 
    str.includes('[browser] A tree hydrated') ||
    str.includes('Failed to compile') || 
    str.includes('Failed to type check') ||
    str.includes('error TS');

  if (hasErrorIndicator) {
    triggerErrorState();
  }

  process.stdout.write(data);
  
  if (isErrorActive && !hasErrorIndicator) {
    // Keep extending if we are in an error state to capture the full stack trace
    triggerErrorState();
  }
});

// Process stderr (all stderr is treated as an error block)
child.stderr.on('data', (data) => {
  triggerErrorState();
  process.stderr.write(data);
});

child.on('close', (code) => {
  if (isErrorActive) {
    process.stdout.write(`\n${SEPARATOR}\n\n`);
  }
  process.exit(code);
});
