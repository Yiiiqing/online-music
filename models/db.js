var mysql = require('mysql');
const {dbConfig} = require('../config')
var pool = mysql.createPool(dbConfig)

var db = {};

db.q = function (sql, params) {
    return new Promise((resolve, reject) => {
        //取出链接
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err)
                return;
            }
            connection.query(sql, params, function (error, results, fields) {
                console.log(`${sql} => ${params}`);
                connection.release();
                if(error){
                    reject(error);
                    return
                }
                resolve(results)
                // callback(error, results);
            })
        })
    })

}

//导出对象
module.exports = db