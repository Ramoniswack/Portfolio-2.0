const child_process = require('child_process');
const path = require('path');

process.env.NODE_OPTIONS = (process.env.NODE_OPTIONS || '') + ' --require "' + path.resolve(__dirname, 'patch-fs.js').replace(/\\/g, '/') + '"';

const args = process.argv.slice(2);
const nextBin = path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next');
const result = child_process.spawnSync('node', [nextBin, ...args], { stdio: 'inherit', shell: true });
process.exit(result.status || 0);
