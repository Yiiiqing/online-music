const musicModel = require("../models/music");
const path = require("path");
/**
 * 没有获取id
 * @param {*} ctx
 */
function optUpload(ctx) {
  // console.log(ctx.request.files)
  //  console.log(ctx.request.body)
    // //1. 获取字符串数据
  let { title, singer, time } = ctx.request.body;
  // //2. 获取文件 -> 保存文件的网络路径(方便/public请求返回)
  // // 保存文件的绝对路径也可以,但是麻烦

  let fileStr
  let filelrcStr
  // if(ctx.request.body.file ){
  //   fileStr = ctx.request.body.file[0];
  //   filelrcStr = ctx.request.body.filelrc[0]
  // }
  let { file, filelrc } = ctx.request.files;
  let saveSongObj = {
    title,
    singer,
    time
  };
  //更新的时候
  if(ctx.url === '/music/update-music'){
    saveSongObj.uid = 1;
    return saveSongObj
  }
  //2.5 歌词可选
  if(!filelrcStr){
    //为了小程序也能用这个接口
    saveSongObj.filelrc = "lrc not upload";
    if (filelrc) {
      saveSongObj.filelrc = "/public/files/" + path.parse(filelrc.path).base; //文件名加后缀
    }
  }else{
    saveSongObj.filelrc = filelrcStr;
  }

  if (!file && !fileStr) {
    ctx.throw("歌曲必须上传");
    return;
  }
  //2.7 处理歌曲路径
  if(fileStr){
    saveSongObj.file = fileStr
  }else{
    saveSongObj.file = "/public/files/" + path.parse(file.path).base; //文件名加后缀
  }
  // 2.8 加入用户id, 未来使用session
  saveSongObj.uid = 1;
  return saveSongObj;
}

module.exports = {
  /**
   * 添加音乐
   * @param {} ctx
   * @param {*} next
   */
  async addMusic(ctx, next) {
    let saveSongObj = optUpload(ctx);
    //3. 插入数据到数据库
    let result = await musicModel.addMusicByObj(saveSongObj);
    //4. 响应结果给用户
    ctx.body = {
      //ajax 接收到的状态消息
      code: "001",
      msg: `添加歌曲: ${saveSongObj.title} 成功`
    };
  },
  /**
   * 更新音乐
   * @param {*} ctx
   * @param {*} next
   */
  async updateMusic(ctx, next, type) {
    let saveSongObj = optUpload(ctx);
    let { id } = ctx.request.body; //uid
    Object.assign(saveSongObj, { id });
    // update
    let result = await musicModel.updateMusic(saveSongObj);
    console.log(result);
    if (result.affectedRows !== 1) {
      // 没有更新成功(throw是针对页面的操作,ajax 请求, code:002)
      ctx.throw("更新失败");
      ctx.body = {
        code: "002",
        msg: result.message
      };
      return;
    }
    ctx.body = {
      code: "001",
      msg: "更新成功"
    };
    ctx.redirect('/music/index')
    // update musics set title = ?, singer = ?... where id = ?
  },
  async deleteMusic(ctx, next) {
    console.log(ctx.session.user.username)
    if(ctx.session.user.username !== 'root'){
      ctx.body = '你没有权限这么做哦'
      return
    };
    //接收请求url中的查询字符串
    let id = ctx.request.query.id // ctx.query.id也可以
    //删除音乐
    let result = await musicModel.deleteMusicById(id);
    console.log(result)
    //后续行为
    if(result.affectedRows === 0){
      ctx.throw('删除失败:' + result.message);
      return;
    }
    //响应请求
    ctx.body = {
      code: '001',
      msg:'删除成功'
    }
  },
  async showEdit(ctx,next){
    //获取路由查询字符串参数
    let id = ctx.query.id;
    //通过id查询音乐
    let musics = await musicModel.findMusicById(id);
    //判断是否有该歌曲
    if(musics.length === 0){
      //甩常见错误页面
      ctx.throw('歌曲不存在')
      return;
    }
    let music = musics[0];
    //渲染edit页面
    ctx.render('edit',{
      music:music,
    })
  },
  async showIndex(ctx,next){
    //根据用户的session中的id来查询数据 === 未完成 ===
    let uid = ctx.session.user.id;
    //根据id查询歌曲
    let musics = await musicModel.findMusicByUid(uid);
    //展示给用户
    ctx.render('index',{
      musics
    })
  },
  async addTimes(ctx,next){
    let {id} = ctx.request.body;
    //根据 id 找到歌曲,更新播放次数
    //通过id查询音乐
    let musics = await musicModel.findMusicById(id);
    if(musics.length === 0) return;
    let music = musics[0];
    if(music.times === null){
      music.times = 1;
    }else{
      music.times = music.times + 1;
    }
    // update
    let result = await musicModel.addTimes({times:music.times,id:music.id});
    let resultRecord = await musicModel.addRecords({user:ctx.session.user.username,songId:music.id,time:new Date()})
    if (result.affectedRows !== 1) {
      // 没有更新成功(throw是针对页面的操作,ajax 请求, code:002)
      ctx.throw("更新失败");
      ctx.body = {
        code: "002",
        msg: result.message
      };
      return;
    }
    ctx.body = {
      code: "001",
      msg: "更新成功"
    };
    // ctx.redirect('/music/index')
  },
};
