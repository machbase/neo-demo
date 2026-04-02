'use strict';

const fs = require('fs');
const path = require('path');
const process = require('process');

const DEFAULT_PORT = 7575;

function resolveScriptDir() {
    if (!process.argv[1]) {
        return process.cwd();
    }

    return path.dirname(process.argv[1]);
}

function loadTemplate(fileName) {
    const templatePath = path.join(resolveScriptDir(), fileName);
    return fs.readFileSync(templatePath, 'utf-8');
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
            const value = argv[index + 1];
            return normalizePort(value);
        }

        if (arg.indexOf('--port=') === 0) {
            return normalizePort(arg.substring('--port='.length));
        }
    }

    return DEFAULT_PORT;
}

module.exports = {
    DEFAULT_PORT,
    loadTemplate,
    parsePort,
    resolveScriptDir,
};