'use strict';

const http = require('http');
const Mustache = require('mustache');

const { loadTemplate } = require('../support');
const { SYSTEM_FORMAT_OPTIONS } = require('./system');

const HOME_TEMPLATE = loadTemplate('home.mustache.html');
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
        title: 'System info',
        description: 'Returns runtime and host information such as CPU, memory, disks, and network interfaces in multiple output formats.',
    },
    {
        path: '/todo',
        title: 'Mustache todo page',
        description: 'Interactive web todo example rendered with Mustache and updated through query actions.',
    },
];

function buildHomeView() {
    const linkedEndpoints = ENDPOINTS.filter((endpoint) => endpoint.path !== '/');

    return {
        pageTitle: 'Neo Demo Server',
        endpointCount: linkedEndpoints.length,
        endpoints: linkedEndpoints.map((endpoint) => {
            const hasGreetingQuery = endpoint.path === '/greeting';
            const hasFormatQuery = endpoint.path === '/system';
            const hasQueryForm = hasGreetingQuery || hasFormatQuery;

            return {
                path: endpoint.path,
                title: endpoint.title,
                description: endpoint.description,
                hasQueryForm,
                hasTextQuery: hasGreetingQuery,
                queryInputId: hasGreetingQuery ? 'greeting-name' : '',
                queryParamName: hasGreetingQuery ? 'name' : '',
                queryParamLabel: hasGreetingQuery ? 'name:' : '',
                queryPlaceholder: hasGreetingQuery ? 'world' : '',
                hasSelectQuery: hasFormatQuery,
                querySelectId: hasFormatQuery ? 'system-format' : '',
                querySelectName: hasFormatQuery ? 'format' : '',
                querySelectLabel: hasFormatQuery ? 'format:' : '',
                queryOptions: hasFormatQuery ? SYSTEM_FORMAT_OPTIONS.map((option) => ({
                    value: option.value,
                    label: option.label,
                    selected: option.value === 'json',
                })) : [],
            };
        }),
    };
}

function renderHomePage(ctx) {
    const html = Mustache.render(HOME_TEMPLATE, buildHomeView());

    ctx.setHeader('Content-Type', 'text/html; charset=utf-8');
    ctx.text(http.status.OK, html);
}

module.exports = renderHomePage;