const port = process.env.PORT || 2333;

module.exports = {
  host: 'localhost',
  port: port,
  view: {
    enabled: true,
    engine: 'nunjucks',
  },
  static: {
    enabled: true,
    path: 'static',     // 路径
  },
  logRequestTime: true,
  debugFlag: 'Apier',
  env: 'development',   // development/production
  devPort: 2334,
  appName: 'Apier',
};
