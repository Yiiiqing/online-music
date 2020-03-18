const path = require('path'); //核心对象

module.exports = {
    viewDir: path.resolve('./views'),
    staticDir: path.resolve('./public'),
    uploadDir: path.resolve('./public/files'),
    appPort: 8888,
    dbConfig:{
        connectionLimit: 10,
        host: 'localhost',
        user: 'root',
        password: 'zzz',
        database: 'music'
    },
    dbConfigStr: 'mysql://kcxez9gf7a0sa58g:pyee0lklxw6jj7s5@qbhol6k6vexd5qjs.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/qnubkui1v1zloexg'
}