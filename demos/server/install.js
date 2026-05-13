'use strict';

const process = require('process');
const service = require('service');
const {
	DEFAULT_PROXY_PREFIX,
	DEFAULT_PROXY_SERVICE,
	normalizeProxyPrefix,
	normalizeProxyService,
} = require('./support');

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

function readOptionValue(argv, index, optionName) {
	const value = argv[index + 1];

	if (value === undefined || value === null || value === '' || value.indexOf('--') === 0) {
		throw new Error(`missing value for ${optionName}`);
	}

	return value;
}

function parseOptions(argv) {
	const options = {
		port: null,
		serviceName: DEFAULT_PROXY_SERVICE,
		proxyPrefix: DEFAULT_PROXY_PREFIX,
	};

	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];

		if (arg === '--port') {
			options.port = normalizePort(readOptionValue(argv, index, '--port'));
			index += 1;
			continue;
		}

		if (arg.indexOf('--port=') === 0) {
			options.port = normalizePort(arg.substring('--port='.length));
			continue;
		}

		if (arg === '--service-name') {
			options.serviceName = normalizeProxyService(readOptionValue(argv, index, '--service-name'));
			index += 1;
			continue;
		}

		if (arg.indexOf('--service-name=') === 0) {
			options.serviceName = normalizeProxyService(arg.substring('--service-name='.length));
			continue;
		}

		if (arg === '--proxy-prefix') {
			options.proxyPrefix = normalizeProxyPrefix(readOptionValue(argv, index, '--proxy-prefix'));
			index += 1;
			continue;
		}

		if (arg.indexOf('--proxy-prefix=') === 0) {
			options.proxyPrefix = normalizeProxyPrefix(arg.substring('--proxy-prefix='.length));
		}
	}

	if (options.port === null) {
		throw new Error('missing required --port <num>');
	}

	return options;
}

function usage() {
	console.println('Usage: server_install.js --port <num> [--service-name <name>] [--proxy-prefix <prefix>]');
}

let options;

try {
	options = parseOptions(process.argv.slice(2));
} catch (error) {
	console.println(`Error: ${error.message}`);
	usage();
	process.exit(1);
}

const client = new service.Client();
const serverPath = joinPath(dirname(process.argv[1]), 'index.js');

client.install({
	name: 'demo-server',
	enable: false,
	executable: serverPath,
	args: [
		'--port', String(options.port),
		'--proxy',
		'--service-name', options.serviceName,
		'--proxy-prefix', options.proxyPrefix,
	],
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
