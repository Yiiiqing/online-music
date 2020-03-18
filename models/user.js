const db = require('./db')

module.exports = {
    getUsers: async ()=>{
        return await db.q('select * from users',[]);
    },
    findUserByUsername: async username => await db.q('select 1 from users where username = ?',username),
    registerUser: async (...user) => await db.q('insert into users (username,password,email) values (?,?,?)',user),
    findUserDataByUsername: async username => await db.q('select * from users where username = ?', username)
    
}