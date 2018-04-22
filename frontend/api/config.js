import axios from 'axios';
import appConfig from '../config.js';

export default {
  http: axios, // you can use your favourite ajax library
  urlPrefix: `http://localhost:${appConfig.env === 'development' ? appConfig.devPort : appConfig.serverPort}/api`
};
