'use strict';
// Load machbase client module.
const machcli = require('machcli');
const pretty = require('pretty');
const conf = require('./machcli.json');
// Create database client instance.
const db = new machcli.Client(conf);
const sql = 'SELECT NAME, TYPE, COLCOUNT FROM m$sys_tables LIMIT 5';
var conn, rows;
try {
    // Create a database connection.
    conn = db.connect();
    console.println('SQL:');
    console.println(sql);
    console.println('');
    // Execute query.
    rows = conn.query(sql);
    const table = pretty.Table({ boxStyle: 'light' });
    table.appendHeader(['NAME', 'TYPE', 'COLCOUNT']);

    // Iterates result set.
    for (const row of rows) {
        table.appendRow(table.row(row.NAME, row.TYPE, row.COLCOUNT));
    }

    console.println(table.render());
} finally {
    // Release resources
    rows && rows.close();
    conn && conn.close();
}
