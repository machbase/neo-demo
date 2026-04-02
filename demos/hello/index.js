const process = require('process');

console.println(`Hello ${process.argv[2] ? process.argv[2] : 'World'}?`);
