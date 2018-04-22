module.exports = app => {
  app.router.get('/', 'home.index');
  // 简单的接口请求测试，给什么参数返回什么参数
  app.router.post('/api/test', 'home.test');
  app.router.get('/api/test', 'home.test');
  // 导入接口测试文件
  app.router.post('/api/import-api-file', 'home.importApiFile');
};
