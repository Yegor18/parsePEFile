import db from "../config/database.js";

export const getTables = (result) => {
    db.all('SELECT * FROM sqlite_master where type="table"', (err, rows) => {
        if (err) {
        console.error(err);
        result(err, null);
        } else {
        result(null, rows);
        }
        });  
}

export const getFiles = (result,tableName) => {
    db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
        if (err) {
        console.error(err);
        result(err, null);
        } else {
        result(null, rows);
        }
        });  
}
