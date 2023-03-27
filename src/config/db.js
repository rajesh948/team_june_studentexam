const mysql = require('mysql2/promise');
require("dotenv").config({ path: "../.env" });

let con = mysql.createPool({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_database
});


module.exports = con;