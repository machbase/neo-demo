'use strict';

const process = require('process');

const COMMANDS = {
	argv: {
		script: 'argv.js',
		description: 'argv index values',
		usage: 'demo argv [value]',
	},
	hello: {
		script: 'hello.js',
		description: 'greeting output',
		usage: 'demo hello [name]',
	},
	server: {
		script: 'server.js',
		description: 'HTTP server',
		usage: 'demo server --port <7575>',
	},
	'machcli-query': {
		script: 'machcli_query.js',
		description: 'Mach CLI query',
		usage: 'demo machcli-query',
	},
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

function padRight(value, width) {
	let result = value;

	while (result.length < width) {
		result += ' ';
	}

	return result;
}

function printCommands(heading) {
	const commandNames = Object.keys(COMMANDS);
	const maxCommandLength = commandNames.reduce((maxLength, command) => {
		return Math.max(maxLength, command.length);
	}, 0);

	console.println(heading);
	commandNames.forEach((command) => {
		const meta = COMMANDS[command];
		const label = padRight(command, maxCommandLength);

		console.println(`  ${label}  ${meta.description}`);
		console.println(`    usage: ${meta.usage}`);
	});
}

function printUsage() {
	console.println('Usage:');
	console.println('  demo <command> <flags...> <args...>');
	console.println('');
	printCommands('Commands:');
}

function resolveCommand(commandName) {
	const command = COMMANDS[commandName];

	if (!command) {
		return null;
	}

	return joinPath(dirname(process.argv[1]), command.script);
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
	console.println('');
	printCommands('Available commands:');
	process.exit(1);
}

const exitCode = process.exec(commandPath, ...argv.slice(1));
process.exit(exitCode);
