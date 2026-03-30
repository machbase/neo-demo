'use strict';
// Load machbase client module.
const machcli = require('machcli');
// Create database client instance.
const db = new machcli.Client({
    host: '127.0.0.1',
    port: 5656, // machbase native port
    username:'sys',
    password: 'manager'
})
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
