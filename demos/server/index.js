'use strict';

const http = require('http');
const path = require('path');
const process = require('process');
const service = require('service');
const { parseServerOptions, resolveScriptDir } = require('./support');
const renderHomePage = require('./handlers/home');
const handleGreeting = require('./handlers/greeting');
const { handleSystem } = require('./handlers/system');
const handleTodo = require('./handlers/todo');

const STATIC_DIR = path.join(resolveScriptDir(), 'static');

let port;
let serverOptions;
let proxyRegistered = false;

try {
    serverOptions = parseServerOptions(process.argv.slice(2));
    port = serverOptions.port;
} catch (error) {
    console.println(`Error: ${error.message}`);
    console.println('Usage: server.js [--port <port>] [--no-proxy] [--service-name <name>] [--proxy-prefix <prefix>] [--neo-web-port <port>]');
    process.exit(1);
}

function directUrl() {
    return `http://127.0.0.1:${port}/`;
}

function proxyPublicPath() {
    return `/web/services/${serverOptions.serviceName}${serverOptions.proxyPrefix}`;
}

function proxyUrl() {
    return `http://127.0.0.1:${serverOptions.neoWebPort}${proxyPublicPath()}`;
}

function registerProxy() {
    service.proxy.register({
        service: serverOptions.serviceName,
        prefix: serverOptions.proxyPrefix,
        target: `http://127.0.0.1:${port}`,
        healthPath: '/healthz',
    }, (error) => {
        if (error) {
            console.println(`proxy register failed: ${error.message}`);
            return;
        }

        proxyRegistered = true;
        console.println(`proxy connection: ${proxyUrl()}`);
    });
}

function unregisterProxy() {
    if (!proxyRegistered) {
        return;
    }

    service.proxy.unregister(serverOptions.serviceName, serverOptions.proxyPrefix, (error) => {
        if (error) {
            console.println(`proxy unregister failed: ${error.message}`);
        }
    });
}

const server = new http.Server({
    network: 'tcp',
    address: `0.0.0.0:${port}`,
    env: process.env,
});

server.static('/static', STATIC_DIR);

server.get('/', (ctx) => {
    renderHomePage(ctx, {
        proxyEnabled: serverOptions.proxy,
        proxyPath: proxyPublicPath(),
    });
});

server.get('/healthz', (ctx) => {
    ctx.text(http.status.OK, 'ok');
});

server.get('/greeting', (ctx) => {
    handleGreeting(ctx);
});

server.get('/system', (ctx) => {
    handleSystem(ctx);
});

server.get('/todo', (ctx) => {
    handleTodo(ctx);
});

server.serve((result) => {
    console.println(`server started ${result.network} ${result.address}`);
    console.println(`direct connection: ${directUrl()}`);

    if (serverOptions.proxy) {
        registerProxy();
    } else {
        console.println('proxy connection: disabled');
    }
});

process.on('exit', () => {
    unregisterProxy();
});
