const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_shop', 'root', 'Lategansql18',
    {
        dialect: 'mysql',
        host: 'localhost'
    });

module.exports = sequelize;



// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root', // DO NOT USE "USERNAME" as attribute
//     database: 'node_shop',
//     password: 'Lategansql18'
// });

// module.exports = pool.promise();