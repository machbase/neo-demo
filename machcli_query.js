'use strict';
// Load machbase client module.
const machcli = require('machcli');
const conf = require('./machcli.json');
// Create database client instance.
const db = new machcli.Client(conf);
var conn, rows;
try {
    // Create a database connection.
    conn = db.connect();
    // Execute query.
    rows = conn.query('SELECT NAME, TYPE, COLCOUNT FROM m$sys_tables LIMIT 5');
    // Iterates result set.
    for (const row of rows) {
        console.println(row.NAME, row.TYPE, row.COLCOUNT);
    }
} finally {
    // Release resources
    rows && rows.close();
    conn && conn.close();
}
