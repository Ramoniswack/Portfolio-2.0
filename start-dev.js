require('./patch-fs.js');
require('child_process').execSync('npx next dev', { stdio: 'inherit' });
