'use strict';

const process = require('process');
const service = require('service');

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

function normalizePort(value) {
	if (value === undefined || value === null || value === '') {
		throw new Error('missing value for --port');
	}

	const port = Number(value);

	if (!Number.isInteger(port) || port < 1 || port > 65535) {
		throw new Error(`invalid port: ${value}`);
	}

	return port;
}

function parsePort(argv) {
	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];

		if (arg === '--port') {
			return normalizePort(argv[index + 1]);
		}
	}

	throw new Error('missing required --port <num>');
}

function usage() {
	console.println('Usage: server_install.js --port <num>');
}

let port;

try {
	port = parsePort(process.argv.slice(2));
} catch (error) {
	console.println(`Error: ${error.message}`);
	usage();
	process.exit(1);
}

const client = new service.Client();
const serverPath = joinPath(dirname(process.argv[1]), 'server.js');

client.install({
	name: 'demo-server',
	enable: false,
	executable: serverPath,
	args: ['--port', String(port)],
}, (error, snapshot) => {
	if (error) {
		console.println(`Error: ${error.message}`);
		process.exit(1);
		return;
	}

	console.println(`installed ${snapshot.config.name}`);
	console.println(`executable: ${snapshot.config.executable}`);
	console.println(`args: ${snapshot.config.args.join(' ')}`);
	console.println(`enable: ${snapshot.config.enable}`);
});
