const level = require('level');
const path = require('path');

let dbPath = process.env.DB_PATH || path.join(__dirname, 'url.db');
let db = level(dbPath);

module.exports = db;