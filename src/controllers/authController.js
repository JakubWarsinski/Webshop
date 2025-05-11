const authQuery = require('../querys/authQuery');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../../sklep.db');
const querys = require('../utils/queryHelper');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const render = {
    login : 'auth/login',
    register : 'auth/register',
    reset : 'auth/reset',
    code : 'auth/code'
};

const redirect = {
    login : '/auth/login',
    home : '/home',
    code : '/auth/code',
    reset : '/auth/reset'
}

/////////////////////
//     SING IN     //
/////////////////////

exports.loginPage = (req, res) => {
    return res.render(render.login);
};

exports.loginHandle = async (req, res) => {
    const { email, password } = req.body;

    const sql = `SELECT id_uzytkownika, login, email, haslo FROM uzytkownik WHERE email = ?`;

    try {
        const user = await querys.getSingleQuery(sql, [email]);

        if (!user) throw 'Podany użytkownik nie istnieje.';

        const isMatch = await bcrypt.compare(password, user.haslo);

        if (!isMatch) throw 'Podano błędny email lub hasło.';

        req.session.user = {
            id: user.id_uzytkownika,
            login: user.login,
        }

        return res.render(render.login);
    } catch(error) {
        return res.render(render.login, { error });   
    }
};

/////////////////////
//     SING UP     //
/////////////////////

exports.registerPage = (req, res) => {
    return res.render(render.register);
};

exports.registerHandle = async (req, res) => {
    const { login, email, password } = req.body;

    const select = `SELECT id_uzytkownika FROM uzytkownik WHERE email = ? OR login = ?`;
    const insert = `INSERT INTO uzytkownik (login, email, haslo) VALUES(?, ?, ?)`;

    try {
        const user = await querys.getSingleQuery(select, [email, login]);

        if (user) throw 'Podany email, lub login już istnieje.';

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await querys.runQuery(insert, [login, email, hashedPassword]);

        return res.redirect(redirect.login);
    } catch(error) {
        return res.render(render.register, { error });   
    }
};

////////////////////////
//     CHECK CODE     //
////////////////////////

exports.codePage = (req, res) => {
    res.render(render.code);
}

exports.codeHandle = async (req, res) => {
    const { email } = req.body;

    const sql = `SELECT id_uzytkownika FROM uzytkownik WHERE email = ?`;

    try {
        const user = await querys.getSingleQuery(sql, [email]);

        if (!user) throw 'Nie odnaleziono użytkownika z podanym e-mailem.';

        const randomCode = [...Array(6)].map(() => Math.floor(Math.random() * 10)).join('');

        req.session.reset = {
            id : user.id_uzytkownika,
            resetCode : randomCode
        }

        return res.redirect(redirect.reset);
    } catch(error) {
        return res.render(render.code, { error });
    }
}

////////////////////////////
//     RESET PASSWORD     //
////////////////////////////

exports.resetPage = (req, res) => {
    if (!req.session.reset) return res.redirect(redirect.code);

    const { resetCode } = req.session.reset;
    
    return res.render(render.reset, { code : resetCode });
}

exports.resetHandle = async (req, res) => {
    const { code, password } = req.body;
    const { id, resetCode } = req.session.reset;

    sql = 'UPDATE uzytkownik SET haslo = ? WHERE id_uzytkownika = ?';

    try {
        if (code != resetCode) throw 'Podano nieprawidłowy kod.';

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await querys.runQuery(sql, [hashedPassword, id]);

        return res.redirect(redirect.home);
    } catch(error) {
        return res.render(render.reset, { error, code : resetCode });
    }
}