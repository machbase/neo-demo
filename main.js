'use strict';

const process = require('process');

const COMMANDS = {
	hello: 'hello.js',
	'machcli-query': 'machcli_query.js',
};

function dirname(filePath) {
	if (!filePath) {
		return process.cwd();
	}

	const slashIndex = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'));

	if (slashIndex < 0) {
		return process.cwd();
	}

	if (slashIndex === 0) {
		return filePath.substring(0, 1);
	}

	return filePath.substring(0, slashIndex);
}

function joinPath(basePath, fileName) {
	if (!basePath || basePath === '.') {
		return fileName;
	}

	const lastChar = basePath.charAt(basePath.length - 1);

	if (lastChar === '/' || lastChar === '\\') {
		return `${basePath}${fileName}`;
	}

	return `${basePath}/${fileName}`;
}

function printUsage() {
	console.error('Usage: demo <command> <flags...> <args...>');
	console.error('');
	console.error('Commands:');
	console.error('  hello');
	console.error('  machcli-query');
}

function resolveCommand(commandName) {
	const scriptName = COMMANDS[commandName];

	if (!scriptName) {
		return null;
	}

	return joinPath(dirname(process.argv[1]), scriptName);
}

const argv = process.argv.slice(2);
const commandName = argv[0];

if (!commandName || commandName === '--help' || commandName === '-h') {
	printUsage();
	process.exit(commandName ? 0 : 1);
}

const commandPath = resolveCommand(commandName);

if (!commandPath) {
	console.error(`Unknown command: ${commandName}`);
	console.error('');
	printUsage();
	process.exit(1);
}

const exitCode = process.exec(commandPath, ...argv.slice(1));
process.exit(exitCode);
