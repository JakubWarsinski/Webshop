const bcrypt = require('bcrypt');
const queryHelper = require('../utils/queryHelper');

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

const userTable = {
    table : 'Uzytkownik',
    id : 'id_uzytkownika',
    login : 'login',
    password : 'haslo',
    email : 'email'
}

/////////////////////
//     SING IN     //
/////////////////////

exports.loginPage = (req, res) => {
    return res.render(render.login);
};

exports.loginHandle = async (req, res) => {
    const { email, password } = req.body;

    const sql = `
        SELECT ${userTable.id}, ${userTable.email}, ${userTable.login}, ${userTable.password} 
        FROM ${userTable.table} 
        WHERE ${userTable.email} = ?`;

    try {
        const user = await queryHelper.getSingleQuery(sql, [email]);

        if (!user) throw 'Podany użytkownik nie istnieje.';

        const isMatch = await bcrypt.compare(password, user.haslo);

        if (!isMatch) throw 'Podano błędny email lub hasło.';

        req.session.user = {
            id: user.id_uzytkownika,
            login: user.login,
        }

        const returnTo = req.session.returnTo || redirect.home;

        delete req.session.returnTo;

        return res.redirect(returnTo);
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

    const select = `
        SELECT ${userTable.id}
        FROM ${userTable.table} 
        WHERE ${userTable.email} = ? OR ${userTable.login} = ?`;

    const insert = `
        INSERT INTO ${userTable.table} (${userTable.login}, ${userTable.email}, ${userTable.password}) 
        VALUES(?, ?, ?)`;

    try {
        const user = await queryHelper.getSingleQuery(select, [email, login]);

        if (user) throw 'Podany email, lub login już istnieje.';

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await queryHelper.runQuery(insert, [login, email, hashedPassword]);

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

    const sql = `
        SELECT ${userTable.id}, ${userTable.login}, ${userTable.login}, ${userTable.password} 
        FROM ${userTable.table} 
        WHERE ${userTable.email} = ?`;

    try {
        const user = await queryHelper.getSingleQuery(sql, [email]);

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

    const sql = `
        UPDATE ${userTable.table} 
        SET ${userTable.password} = ? 
        WHERE ${userTable.id} = ?`;

    try {
        if (code != resetCode) throw 'Podano nieprawidłowy kod.';

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await queryHelper.runQuery(sql, [hashedPassword, id]);

        return res.redirect(redirect.login);
    } catch(error) {
        return res.render(render.reset, { error, code : resetCode });
    }
}