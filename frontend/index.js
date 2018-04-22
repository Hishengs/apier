import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router.js';
import store from './store';
import api from './api';
import util from './util';
import App from './page/app.vue';
import './style/index.less';

window.ET = {
  ipcRenderer: window.require('electron').ipcRenderer,
  dialog: window.require('electron').remote.dialog,
};

Vue.use(ElementUI);

function installPlugin(plugin, name){
  window[name] = plugin;
  plugin.install = function(Vue, options){
    Vue.prototype[name] = this;
  };
  Vue.use(plugin);
}
installPlugin(api, 'api');
installPlugin(util, 'util');
installPlugin(new Vue(), 'eventHub');

window.app = new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
