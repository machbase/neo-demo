'use strict';

const fs = require('fs');
const path = require('path');
const process = require('process');

const DEFAULT_PORT = 7575;
const DEFAULT_PROXY_SERVICE = 'github.com/machbase/neo-demo/server';
const DEFAULT_PROXY_PREFIX = '/demo/';

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

function normalizeProxyService(value) {
    if (typeof value !== 'string' || value.trim() === '') {
        throw new Error('missing value for --service-name');
    }

    return value.trim();
}

function normalizeProxyPrefix(value) {
    if (typeof value !== 'string' || value.trim() === '') {
        throw new Error('missing value for --proxy-prefix');
    }

    let prefix = value.trim();

    if (prefix.charAt(0) !== '/') {
        prefix = `/${prefix}`;
    }

    if (prefix.charAt(prefix.length - 1) !== '/') {
        prefix = `${prefix}/`;
    }

    return prefix;
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

function readOptionValue(argv, index, optionName) {
    const value = argv[index + 1];

    if (value === undefined || value === null || value === '' || value.indexOf('--') === 0) {
        throw new Error(`missing value for ${optionName}`);
    }

    return value;
}

function parseServerOptions(argv) {
    const options = {
        port: DEFAULT_PORT,
        proxy: false,
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

        if (arg === '--proxy') {
            options.proxy = true;
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
            continue;
        }
    }

    return options;
}

module.exports = {
    DEFAULT_PORT,
    DEFAULT_PROXY_PREFIX,
    DEFAULT_PROXY_SERVICE,
    loadTemplate,
    normalizeProxyPrefix,
    normalizeProxyService,
    parsePort,
    parseServerOptions,
    resolveScriptDir,
};