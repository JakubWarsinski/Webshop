require('dotenv').config();

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();

app.use(session({
  secret: 'twojeSekretneHaslo', // Może być dowolny ciąg znaków, używany do podpisywania sesji
  resave: false, // Zapobiega niepotrzebnemu zapisywaniu sesji
  saveUninitialized: true, // Umożliwia zapisanie nowej sesji, nawet jeśli nic w niej nie zmieniono
  cookie: { secure: false } // Wymaga HTTPS do działania w trybie produkcyjnym, dla deweloperskiego ustawiamy `false`
}));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

const path = require('path');
app.set('views', path.join(__dirname, '../domains'));

// Połączenie z SQLite
const db = new sqlite3.Database('../../sklep.db', (err) => {
  if (err) return console.error(err.message);
  
  console.log('Połączono z SQLite');
});

const authRoutes = require('./authRoutes');
app.use('/auth', authRoutes); // lub app.use('/user', authRoutes) jeśli chcesz prefiks

// Start serwera
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
