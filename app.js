const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./src/routes/authRoutes');

const app = express();

const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './src/domains'));

app.use(session({
        secret: 'SklepInternetowyProjektSzkolnyUKW',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
}));

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Serwer: http://localhost:${PORT}/home`);
});