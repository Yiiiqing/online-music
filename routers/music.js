const Router = require('koa-router');
const musicController = require('../controllers/music')
let musicRouter = new Router();

musicRouter
//添加的请求行为在restful中,更好的请求规则,要求添加=>post
.post('/music/add-music',musicController.addMusic)
.put('/music/update-music',musicController.updateMusic)
.post('/music/update-music',musicController.updateMusic)
.post('/music/add-times',musicController.addTimes)
.delete('/music/del-music',musicController.deleteMusic)
.get('/music/del-music',musicController.deleteMusic)
.get('/music/edit',musicController.showEdit)
.get('/music/index',musicController.showIndex)
// musicRouter.get('/music/index',async ctx =>{
//     ctx.render('index');
// })
musicRouter.get('/music/add',async ctx=>{
    ctx.render('add')
})
// musicRouter.get('/music/edit',async ctx=>{
//     ctx.render('edit')
// })

module.exports = musicRouter;
