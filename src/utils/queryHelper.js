const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../../sklep.db');

exports.getSingleQuery = (sql, input) => {
    return new Promise((resolve, reject) => {
        db.get(sql, input, (err, rows) => {
            if (err) {
                reject(err.message);
            } else {
                resolve(rows);
            }
        });
    });
}

exports.getAllQuery = (sql, input) => {
    return new Promise((resolve, reject) => {
        db.all(sql, input, (err, rows) => {
            if (err) {
                reject(err.message);
            } else {
                resolve(rows);
            }
        });
    });
}

exports.runQuery = (sql, input) => {
    return new Promise((resolve, reject) => {
        db.run(sql, input, function(err) {
            if (err) {
                reject(err.message);
            } else {
                resolve(this.lastID);
            }
        });
    });
}