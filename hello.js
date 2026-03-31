const process = require('process');

console.println(`Hello ${process.argv[2] ? process.argv[2] : 'World'}?`);
console.println("- argv[0]:", process.argv[0]);
console.println("- argv[1]:", process.argv[1]);
console.println("- argv[2]:", process.argv[2]);