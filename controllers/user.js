const userModel = require('../models/user');
const captchapng = require('captchapng2');

module.exports = {
    showRegister: async(ctx,next) => {
        // let users = await userModel.getUsers();
        // console.log(users);
        ctx.render('register');
    },
    /**
     * 检查用户名是否存在
     */
    checkUsername: async (ctx,next)=>{
        //处理接收请求之类的繁琐事务,纬度不 CRUD
        let {username} =  ctx.request.body;
        //查询数据库中是否存在该用户名
        let users = await userModel.findUserByUsername(username)
        //判断 users 数组的长度是否为 0
        if(users.length === 0){
            ctx.body = { code:'001',msg:'可以注册'};
            return;
        }
        //存在该用户
        ctx.body = {code:'002',msg:'用户已存在'}
    },
    doRegister: async (ctx,next)=>{
        let{ username, password, email, v_code } = ctx.request.body;
        //比较v_code
        if(v_code !== ctx.session.v_code){
            return ctx.body = {
                code:'002',
                msg:'验证码不正确'
            }
        }
        //判断用户名是否存在
        let users = await userModel.findUserByUsername(username)
        //判断是否可以注册
        if(users.length !== 0){
            console.log(users)
            ctx.body = { code:'002',msg:'用户已存在'};
            return;
        }
        // 开始注册
        try {
            let result = await userModel.registerUser(
                username,password,email
            )
            console.log(result)
            if(result.affectedRows === 1){
                ctx.body = {code:'001',msg:'注册成功'}
                return;
            }
            //不等于 1 的情况会发生在 id 冲突,那就不插入数据
            ctx.body = {code:'002',msg:result.message}
        } catch (error) {
            ctx.throw('002')
        }
    },
    /**
     * 登录
     * @param {*} ctx 
     * @param {*} next 
     */
    async doLogin(ctx,next){
        //1.接收参数
        let {username,password} = ctx.request.body;
        //2. 查询用户名相关的用户
        let users = await userModel.findUserDataByUsername(username);
        //2.5: 判断是否有用户
        if(users.length === 0 ){
            //没有该用户
            ctx.body = {
                //避免黑客等试探用户名正确的情况,模糊错误
                code:'002',
                msg:'用户名或密码不正确'
            }
            return;
        }
        let user = users[0];//注册必须控制司,不能存在相同用户名的数据
        //3. 对比密码是否一致
        //3.1: 如果密码正确,认证用户session属性区分是否登陆
        if ( user.password === password){
            ctx.body = {code:'001',msg:'登录成功'};
            //挂载session用户认证判断
            ctx.session.user = user;
            return;
        }
        //3.2: 响应json结果:code:002
        ctx.body = {code:'002',msg:'用户名或密码不正确'}
    },
    //获取验证码图片
    getPic(ctx,next){
        let rand = parseInt(Math.random() * 9000 + 1000);
        // 区分不同用户的答案,并分配session,响应cookie
        ctx.session.v_code = rand+'';
        let png = new captchapng(80,30,rand);

        ctx.body = png.getBuffer()
    },
    /**
     * 1.清除session上的user
      2. 重定向一个页面到login
     */
    async logout(ctx,next){
        ctx.session.user = null;
        ctx.redirect('/user/login')
    }
}