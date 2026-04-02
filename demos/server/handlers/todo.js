'use strict';

const http = require('http');
const Mustache = require('mustache');

const { loadTemplate } = require('../support');

const TODO_TEMPLATE = loadTemplate('todo.mustache.html');

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

function handleTodo(ctx) {
    const result = handleTodoMutation(ctx);

    if (result && result.redirected) {
        return;
    }

    renderTodoPage(ctx, result ? result.message : '');
}

module.exports = handleTodo;