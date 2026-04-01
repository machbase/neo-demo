'use strict';

const http = require('http');
const os = require('os');
const process = require('process');

const DEFAULT_PORT = 7575;

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
});

server.get('/greeting', (ctx) => {
    ctx.json(http.status.OK, { message: 'hello world' });
});

server.get('/system', (ctx) => {
    ctx.json(http.status.OK, buildSystemInfo());
});

server.serve((result) => {
    console.println(`server started ${result.network} ${result.address}`);
});