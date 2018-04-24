const fs = require('fs');

module.exports = app => {
  class HomeController extends app.Controller {

    async index (){
      await this.ctx.display('index.html');
    }

    test (){
      try {
        // this.ctx.done(this.ctx.request.body);
        this.ctx.doneWithError('这是测试地址，请将地址改为你的项目 Node 后端地址，一般是 http://localhost:888/api/dll/invoke');
      }catch (err){
        this.ctx.doneWithError(err.toString());
      }
    }

    // 加载接口文件
    async importApiFile (){
      try {
        const api = fs.readFileSync(this.ctx.request.body.apiPath, {
          encoding: 'utf-8',
        });
        this.ctx.done(JSON.parse(api));
      }catch (err){
        this.ctx.doneWithError(err.toString());
      }
    }

  }
  return HomeController;
};
