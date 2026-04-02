'use strict';

const http = require('http');
const path = require('path');
const process = require('process');
const { parsePort, resolveScriptDir } = require('./support');
const renderHomePage = require('./handlers/home');
const handleGreeting = require('./handlers/greeting');
const { handleSystem } = require('./handlers/system');
const handleTodo = require('./handlers/todo');

const STATIC_DIR = path.join(resolveScriptDir(), 'static');

let port;

try {
    port = parsePort(process.argv.slice(2));
} catch (error) {
    console.println(`Error: ${error.message}`);
    console.println('Usage: server.js [--port <port>]');
    process.exit(1);
}

const server = new http.Server({
    network: 'tcp',
    address: `0.0.0.0:${port}`,
    env: process.env,
});

server.static('/static', STATIC_DIR);

server.get('/', (ctx) => {
    renderHomePage(ctx);
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
});
