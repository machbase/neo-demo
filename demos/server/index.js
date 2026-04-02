'use strict';

const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');
const process = require('process');
const Mustache = require('mustache');

const DEFAULT_PORT = 7575;
const HOME_TEMPLATE = loadTemplate('home.mustache.html');
const TODO_TEMPLATE = loadTemplate('todo.mustache.html');
const STATIC_DIR = path.join(resolveScriptDir(), 'static');
const ENDPOINTS = [
    {
        path: '/',
        title: 'Endpoint index',
        description: 'HTML landing page with links to the server features exposed by this demo.',
    },
    {
        path: '/greeting',
        title: 'Greeting JSON',
        description: 'Small JSON response used as the simplest HTTP handler example, with an optional name query parameter.',
    },
    {
        path: '/system',
        title: 'System info JSON',
        description: 'Returns runtime and host information such as CPU, memory, disks, and network interfaces.',
    },
    {
        path: '/todo',
        title: 'Mustache todo page',
        description: 'Interactive web todo example rendered with Mustache and updated through query actions.',
    },
];

let nextTodoId = 4;
let todoItems = [
    {
        id: 1,
        title: 'Review Machbase Neo JSH server APIs',
        completed: true,
    },
    {
        id: 2,
        title: 'Render a web todo page with Mustache',
        completed: false,
    },
    {
        id: 3,
        title: 'Try the /todo endpoint in a browser',
        completed: false,
    },
];

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

function buildHomeView() {
    const linkedEndpoints = ENDPOINTS.filter((endpoint) => endpoint.path !== '/');

    return {
        pageTitle: 'Neo Demo Server',
        endpointCount: linkedEndpoints.length,
        endpoints: linkedEndpoints.map((endpoint) => {
            const hasQueryForm = endpoint.path === '/greeting';

            return {
                path: endpoint.path,
                title: endpoint.title,
                description: endpoint.description,
                hasQueryForm,
                queryInputId: hasQueryForm ? 'greeting-name' : '',
                queryParamName: hasQueryForm ? 'name' : '',
                queryParamLabel: hasQueryForm ? 'name:' : '',
                queryPlaceholder: hasQueryForm ? 'world' : '',
            };
        }),
    };
}

function renderHomePage(ctx) {
    const html = Mustache.render(HOME_TEMPLATE, buildHomeView());

    ctx.setHeader('Content-Type', 'text/html; charset=utf-8');
    ctx.text(http.status.OK, html);
}

function normalizeGreetingName(value) {
    if (typeof value !== 'string') {
        return '';
    }

    return value.trim();
}

function normalizeTodoTitle(value) {
    if (typeof value !== 'string') {
        return '';
    }

    return value.trim();
}

function parseTodoId(value) {
    if (value === undefined || value === null || value === '') {
        return null;
    }

    const todoId = Number(value);

    if (!Number.isInteger(todoId) || todoId < 1) {
        return null;
    }

    return todoId;
}

function addTodoItem(title) {
    todoItems.unshift({
        id: nextTodoId,
        title,
        completed: false,
    });
    nextTodoId += 1;
}

function toggleTodoItem(todoId) {
    const todoItem = todoItems.find((item) => item.id === todoId);

    if (!todoItem) {
        return false;
    }

    todoItem.completed = !todoItem.completed;
    return true;
}

function removeTodoItem(todoId) {
    const nextItems = todoItems.filter((item) => item.id !== todoId);

    if (nextItems.length === todoItems.length) {
        return false;
    }

    todoItems = nextItems;
    return true;
}

function buildTodoView(message) {
    const completedCount = todoItems.filter((item) => item.completed).length;
    const remainingCount = todoItems.length - completedCount;

    return {
        pageTitle: 'Neo Todo Demo',
        message,
        hasMessage: Boolean(message),
        totalCount: todoItems.length,
        completedCount,
        remainingCount,
        hasItems: todoItems.length > 0,
        emptyState: todoItems.length === 0,
        items: todoItems.map((item) => ({
            id: item.id,
            title: item.title,
            completed: item.completed,
            toggleLink: `/todo?toggle=${item.id}`,
            removeLink: `/todo?remove=${item.id}`,
            toggleActionText: item.completed ? 'Mark open' : 'Complete',
            statusText: item.completed ? 'Done' : 'Open',
        })),
    };
}

function renderTodoPage(ctx, message) {
    const html = Mustache.render(TODO_TEMPLATE, buildTodoView(message));

    ctx.setHeader('Content-Type', 'text/html; charset=utf-8');
    ctx.text(http.status.OK, html);
}

function handleTodoMutation(ctx) {
    const titleQuery = ctx.query('title');

    if (titleQuery !== undefined) {
        const title = normalizeTodoTitle(titleQuery);

        if (!title) {
            return { message: 'Enter a todo title before adding a new item.' };
        }

        addTodoItem(title);
        ctx.redirect(http.status.Found, '/todo');
        return { redirected: true };
    }

    const toggleId = parseTodoId(ctx.query('toggle'));

    if (toggleId !== null) {
        if (!toggleTodoItem(toggleId)) {
            return { message: `Todo item ${toggleId} was not found.` };
        }

        ctx.redirect(http.status.Found, '/todo');
        return { redirected: true };
    }

    const removeId = parseTodoId(ctx.query('remove'));

    if (removeId !== null) {
        if (!removeTodoItem(removeId)) {
            return { message: `Todo item ${removeId} was not found.` };
        }

        ctx.redirect(http.status.Found, '/todo');
        return { redirected: true };
    }

    return null;
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

function buildSystemInfo() {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const cpuList = os.cpus();

    return {
        hostname: os.hostname(),
        platform: os.platform(),
        type: os.type(),
        release: os.release(),
        arch: os.arch(),
        uptimeSeconds: os.uptime(),
        bootTime: os.bootTime(),
        loadAverage: os.loadavg(),
        memory: {
            totalBytes: totalMemory,
            freeBytes: freeMemory,
            usedBytes: usedMemory,
            usedPercent: totalMemory > 0 ? Number(((usedMemory / totalMemory) * 100).toFixed(2)) : 0,
        },
        cpu: {
            logicalCount: os.cpuCounts(true),
            physicalCount: os.cpuCounts(false),
            usagePercent: os.cpuPercent(0, false),
            perCpuUsagePercent: os.cpuPercent(0, true),
            models: cpuList.map((cpu, index) => ({
                index,
                model: cpu.model,
                speed: cpu.speed,
                cores: cpu.cores,
                times: cpu.times,
            })),
        },
        networkInterfaces: os.networkInterfaces(),
        hostInfo: os.hostInfo(),
        disk: os.diskUsage('.'),
    };
}

let port;

try {
    port = parsePort(process.argv.slice(2));
} catch (error) {
    console.error(`Error: ${error.message}`);
    console.error('Usage: server.js [--port <port>]');
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
    const name = normalizeGreetingName(ctx.query('name')) || 'world';

    ctx.json(http.status.OK, {
        message: `hello ${name}`,
        name,
    });
});

server.get('/system', (ctx) => {
    ctx.json(http.status.OK, buildSystemInfo());
});

server.get('/todo', (ctx) => {
    const result = handleTodoMutation(ctx);

    if (result && result.redirected) {
        return;
    }

    renderTodoPage(ctx, result ? result.message : '');
});

server.serve((result) => {
    console.println(`server started ${result.network} ${result.address}`);
});
