const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'products.db');
const db = new sqlite3.Database(dbPath);

function initDatabase() {
    db.serialize(() => {
        db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        platform TEXT,
        title TEXT,
        price TEXT,
        region TEXT,
        link TEXT,
        image_url TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    });
    console.log('Database initialized');
}

module.exports = {
    db,
    initDatabase
};
