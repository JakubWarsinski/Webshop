const session = require('express-session');

exports.localSesion = () => {
    session({
        secret: 'SklepInternetowyProjektSzkolnyUKW',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    });
}