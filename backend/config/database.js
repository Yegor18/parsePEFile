import sqlite3 from 'sqlite3';
import fs from 'node:fs';
var file = 'ksgmprh.db';
var exists = fs.existsSync(file);

if (!exists) {
    console.log("Creating DB file.");
    fs.openSync(file, 'w');
}
const db = new sqlite3.Database('./ksgmprh.db');
console.log("Database ", db)
export default db;