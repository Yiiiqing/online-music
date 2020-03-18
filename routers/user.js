const Router = require('koa-router');
let userRouter = new Router();
let userController = require('../controllers/user')
const db = require('../models/db');
const confit = require('../config')
const {appPort} = require('../config')
userRouter.get('/user/register',userController.showRegister)
.post('/user/check-username',userController.checkUsername)
.post('/user/do-register',userController.doRegister)
.post('/user/do-login',userController.doLogin)
.get('/user/logout',userController.logout)
.get('/user/get-pic',userController.getPic)
.get('/user/login',async ctx=>{
    let {req} = ctx;
    //谁在访问
    // let host = req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    ctx.render('login',{
        host: appPort
    })
})

module.exports = userRouter