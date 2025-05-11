const { execSync } = require('child_process');

const requiredPackages = [
    'express',
    'body-parser',
    'express-session',
    'bcrypt',
    'sqlite3',
    'ejs'
];

function isPackageInstalled(pkg) {
    try {
        require.resolve(pkg);
        return true;
    } catch (e) {
        return false;
    }
}

const missingPackages = requiredPackages.filter(pkg => !isPackageInstalled(pkg));

if (missingPackages.length > 0) {
    console.log('\n[ ? ] Wykryto brakujące paczki:', missingPackages.join(', '), '\n');
    
    try {
        execSync(`npm install ${missingPackages.join(' ')}`, { stdio: 'inherit' });
        console.log('\n[ ✔ ] Wszystkie wymagane paczki są zainstalowane.\n');
    } catch (err) {
        console.error('\n[ ✖ ] Błąd podczas instalacji paczek:', err.message,'\n');
        process.exit(1);
    }
}

try {
    require('./app');
} catch (err) {
    console.error('\n[ ✖ ] Błąd przy uruchamianiu aplikacji:', err.message, '\n');
    process.exit(1);
}