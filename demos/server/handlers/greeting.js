'use strict';

const http = require('http');

function normalizeGreetingName(value) {
    if (typeof value !== 'string') {
        return '';
    }

    return value.trim();
}

function handleGreeting(ctx) {
    const name = normalizeGreetingName(ctx.query('name')) || 'world';

    ctx.json(http.status.OK, {
        message: `hello ${name}`,
        name,
    });
}

module.exports = handleGreeting;