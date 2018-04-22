import config from './config.js';
const { http, urlPrefix } = config;

export default {
  // 导入接口文件
  importApiFile (apiPath){
    return new Promise((resolve, reject) => {
      http.post(urlPrefix + '/import-api-file', {
        apiPath,
      }).then(res => {
        resolve(res);
      }).catch(reject);
    });
  },
};
