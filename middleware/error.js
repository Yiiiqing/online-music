module.exports = (options)=>{
    return async(ctx,next)=>{
        //优雅的处理异常
        //先放行
        try {
            await next();
        } catch (error) {
            //根据之前的
            ctx.render('error',{msg:`002状态错误,原因是:${error}`})
        }
    }
}
