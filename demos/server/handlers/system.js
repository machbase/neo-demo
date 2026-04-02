'use strict';

const http = require('http');
const os = require('os');

const SYSTEM_FORMAT_OPTIONS = [
    { value: 'json', label: 'JSON' },
    { value: 'ndjson', label: 'NDJSON' },
    { value: 'yaml', label: 'YAML' },
    { value: 'toml', label: 'TOML' },
    { value: 'xml', label: 'XML' },
];

function normalizeSystemFormat(value) {
    if (typeof value !== 'string') {
        return 'json';
    }

    const format = value.trim().toLowerCase();
    const isSupported = SYSTEM_FORMAT_OPTIONS.some((option) => option.value === format);

    return isSupported ? format : 'json';
}

function serializeNdjson(value) {
    return Object.keys(value).map((key) => JSON.stringify({
        key,
        value: value[key],
    })).join('\n');
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

function handleSystem(ctx) {
    const format = normalizeSystemFormat(ctx.query('format'));
    const systemInfo = buildSystemInfo();

    if (format === 'ndjson') {
        ctx.text(http.status.OK, serializeNdjson(systemInfo));
        return;
    }

    if (format === 'yaml') {
        ctx.yaml(http.status.OK, systemInfo);
        return;
    }

    if (format === 'toml') {
        ctx.toml(http.status.OK, systemInfo);
        return;
    }

    if (format === 'xml') {
        ctx.xml(http.status.OK, systemInfo, { root: 'system' });
        return;
    }

    ctx.json(http.status.OK, systemInfo, { space: 2 });
}

module.exports = {
    SYSTEM_FORMAT_OPTIONS,
    handleSystem,
};