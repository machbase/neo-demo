'use strict';

const process = require('process');
const { ReadLine } = require('readline');

function parseAutoInput(argv) {
	for (let index = 0; index < argv.length; index += 1) {
		if (argv[index] === '--auto') {
			return argv[index + 1] ? argv[index + 1] : '';
		}
	}

	return null;
}

function printUsage() {
	console.println('Usage: demo readline [--auto <text>]');
	console.println('');
	console.println('Examples:');
	console.println('  demo readline');
	console.println('  demo readline --auto "hello neo"');
}

const argv = process.argv.slice(2);

if (argv.includes('--help') || argv.includes('-h')) {
	printUsage();
	process.exit(0);
}

const autoText = parseAutoInput(argv);
const readerOptions = {
	history: 'neo-demo-readline',
	prompt: () => 'input> ',
};

if (autoText !== null) {
	readerOptions.autoInput = [autoText, ReadLine.Enter];
}

const reader = new ReadLine(readerOptions);

console.println('Enter one line of text.');

const line = reader.readLine();

if (line instanceof Error) {
	reader.close();
	console.println(`readline failed: ${line.message}`);
	process.exit(1);
}

reader.addHistory(line);
reader.close();

console.println(`You entered: ${line}`);
