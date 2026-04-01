'use strict';

const process = require('process');
const Mustache = require('mustache');

const DEFAULT_TEMPLATE = 'Hello {{name}} from {{company}}. Topic: {{topic}}.';
const DEFAULT_VIEW = {
	name: 'Neo',
	company: 'Machbase',
	topic: 'Mustache templating in JSH',
};

function printUsage() {
	console.println('Usage: demo mustache [options]');
	console.println('');
	console.println('Options:');
	console.println('  --template <text>   Override the Mustache template');
	console.println('  --name <name>       Set name in the default view');
	console.println('  --company <name>    Set company in the default view');
	console.println('  --topic <text>      Set topic in the default view');
	console.println('  --view <json>       Replace the view with a JSON object');
	console.println('');
	console.println('Examples:');
	console.println('  demo mustache');
	console.println('  demo mustache --name Neo --topic "npm package demo"');
	console.println('  demo mustache --template "{{name}} likes {{topic}}" --view "{\"name\":\"Neo\",\"topic\":\"JSH\"}"');
}

function cloneDefaultView() {
	return {
		name: DEFAULT_VIEW.name,
		company: DEFAULT_VIEW.company,
		topic: DEFAULT_VIEW.topic,
	};
}

function readRequiredValue(argv, index, flag) {
	const value = argv[index + 1];

	if (!value) {
		throw new Error(`Missing value for ${flag}`);
	}

	return value;
}

function parseView(jsonText) {
	let parsed;

	try {
		parsed = JSON.parse(jsonText);
	} catch (error) {
		throw new Error(`Invalid JSON for --view: ${error.message}`);
	}

	if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
		throw new Error('--view expects a JSON object');
	}

	return parsed;
}

function parseArgs(argv) {
	const options = {
		template: DEFAULT_TEMPLATE,
		view: cloneDefaultView(),
	};

	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];

		if (arg === '--template') {
			options.template = readRequiredValue(argv, index, arg);
			index += 1;
			continue;
		}

		if (arg === '--view') {
			options.view = parseView(readRequiredValue(argv, index, arg));
			index += 1;
			continue;
		}

		if (arg === '--name') {
			options.view.name = readRequiredValue(argv, index, arg);
			index += 1;
			continue;
		}

		if (arg === '--company') {
			options.view.company = readRequiredValue(argv, index, arg);
			index += 1;
			continue;
		}

		if (arg === '--topic') {
			options.view.topic = readRequiredValue(argv, index, arg);
			index += 1;
			continue;
		}

		throw new Error(`Unknown option: ${arg}`);
	}

	return options;
}

const argv = process.argv.slice(2);

if (argv.includes('--help') || argv.includes('-h')) {
	printUsage();
	process.exit(0);
}

let options;

try {
	options = parseArgs(argv);
} catch (error) {
	console.println(error.message);
	console.println('');
	printUsage();
	process.exit(1);
}

console.println('Template:');
console.println(`  ${options.template}`);
console.println('');
console.println('View:');
console.println(`  ${JSON.stringify(options.view)}`);
console.println('');
console.println('Rendered:');
console.println(`  ${Mustache.render(options.template, options.view)}`);