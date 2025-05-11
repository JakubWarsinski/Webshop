const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../../sklep.db');
const helper = require('../utils/queryHelper');

exports.singInUser = async (email) => {
    const sql = `SELECT id_uzytkownika, login, email, haslo FROM uzytkownik WHERE email = ?`;

    return await helper.getSingleData(sql, email);
}