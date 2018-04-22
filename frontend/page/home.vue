<template>
  <div id="home">
    <!-- 欢迎页 -->
    <div class="welcome-mask" v-if="showWelcome">
      <h1>Save your time with Apier</h1>
      <h3>解放生产力是第一要务。</h3>
    </div>
    <el-row>
      <!-- 接口面板 -->
      <el-col :span="12" class="api-panel">
        <div class="filter">
          <b>选择测试接口</b>&nbsp;&nbsp;
          <el-select v-model="currentRequestIndex" placeholder="请选择测试接口" size="small">
            <el-option
              v-for="(name, i) in requestNames"
              :key="name"
              :label="name"
              :value="i">
            </el-option>
          </el-select>
          <el-button type="primary" size="mini" class="new-window" @click="openNewWindow">新开测试窗口</el-button>
          <el-button type="primary" size="mini" class="import-api-file" @click="importApiFile">导入接口测试文件</el-button>
        </div>
        <div class="request" v-if="currentRequest">
          <h1 class="title">
            {{ currentRequest.title }}
            <el-button type="default" size="mini" @click="showJSON">查看JSON数据</el-button>
          </h1>
          <p class="description">描述：{{ currentRequest.description }}</p>
          <el-tabs v-model="selectedTab" type="card">
            <el-tab-pane label="请求参数" name="params">
              <div class="params">
                <div class="param" v-for="(param, j) in currentRequest.params" :key="j">
                  <param-render :param="param"></param-render>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="返回格式" name="returns">
              <div class="params">
                <div class="param" v-for="(param, j) in currentRequest.returns" :key="j">
                  <param-render :param="param"></param-render>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <el-alert
          title="暂未接口信息，点击上方按钮导入接口文件"
          type="warning"
          :closable="false"
          v-else>
        </el-alert>
      </el-col>
      <!-- 请求面板 -->
      <el-col :span="12" class="request-panel">
        <!-- 请求地址 -->
        <el-input v-model="postman.url" placeholder="请输入请求URL" style="width: 100%;" size="small">
          <!-- HTTP 请求方法 -->
          <el-select v-model="postman.method" placeholder="请选择请求方法" size="small" style="width: 90px;" slot="prepend">
            <el-option
              v-for="method in methods"
              :key="method"
              :label="method"
              :value="method">
            </el-option>
          </el-select>
          <el-button type="primary" size="small" slot="append" @click="sendRequest" v-loading.fullscreen.lock="sendingRequest">发送请求</el-button>
        </el-input>
        <h3>请求数据<el-button type="primary" size="mini" class="build-mock-data-btn" @click="mockData">生成模拟数据</el-button></h3>
        <el-input
          type="textarea"
          :rows="15"
          placeholder="请求数据"
          v-model="postman.request.data">
        </el-input>
        <h3>返回</h3>
        <el-input
          type="textarea"
          :rows="15"
          placeholder="返回"
          v-model="postman.response.data"
          readonly>
        </el-input>
      </el-col>
    </el-row>
    <!-- 用于显示接口JSON数据的弹窗 -->
    <el-dialog
      title="当前接口JSON数据"
      :visible.sync="showJSONModal"
      width="40%"
      id="show-json-dialog">
      <el-input
        type="textarea"
        autosize
        :rows="20"
        placeholder="当前接口JSON数据"
        :value="currentRequestJSONData"
        readonly>
      </el-input>
    </el-dialog>
  </div>
</template>

<script>
  import paramRender from './param-render.vue';
  import Mock from 'mockjs';
  export default {
    name: 'home',
    components: {
      paramRender,
    },
    computed: {
      // 所有接口名称数组
      requestNames (){
        return (this.requests && this.requests.map(request => request.title)) || [];
      },
      // 当前接口请求
      currentRequest (){
        return (this.requests && this.requests[this.currentRequestIndex]) || null;
      },
      // 当前接口请求的JSON格式数据
      currentRequestJSONData (){
        return JSON.stringify(this.currentRequest || {}, null, 2);
      },
    },
    data (){
      return {
        currentRequestIndex: 0,
        requests: null,
        selectedTab: 'params',
        methods: ['POST', 'GET'],
        postman: {
          method: 'POST',
          url: '',
          // 请求体
          request: {
            data: '',
          },
          // 返回体
          response: {
            data: '',
          },
        },
        showJSONModal: false,
        sendingRequest: false,
        showWelcome: true,
      };
    },
    mounted (){
      setTimeout(() => {
        this.showWelcome = false;
      }, 2000);
    },
    methods: {
      // 生成请求的 mock 数据
      mockData (){
        if(!this.currentRequest)return;
        const data = this.buildMockData(this.currentRequest.params);
        this.postman.request.data = JSON.stringify(data, null, 2);
      },
      buildMockData (params){
        const obj = {};
        // 为原始值生成随机值
        function getPrimitiveMockData (type, name = ''){
          let data = null;
          switch(type){
            case 'int':
              if(name.toLowerCase() === 'id'){
                data = Mock.Random.integer(0, 100000);
              }else data = Mock.Random.integer(-100000, 100000);
              break;
            case 'float':
              data = Mock.Random.float(-100000, 100000);
              break;
            case 'string':
              if(['url', 'avatar', 'link'].includes(name.toLowerCase())){
                data = Mock.Random.url();
              }else if(['name', 'username', 'user'].includes(name.toLowerCase())){
                data = Mock.Random.cname();
              }else if(['email', 'mail'].includes(name.toLowerCase())){
                data = Mock.Random.email();
              }else if(['city'].includes(name.toLowerCase())){
                data = Mock.Random.city();
              }else data = Mock.Random.word(3, 10);
              break;
            case 'boolean':
              data = Mock.Random.boolean();
              break;
          }
          return data;
        }
        for(const param of params){
          switch(param.type){
            case 'int':
            case 'float':
            case 'string':
            case 'boolean':
              obj[param.name] = getPrimitiveMockData(param.type, param.name);
              break;
            case 'object':
              obj[param.name] = this.buildMockData(param.subParams);
              break;
            case 'array':
              // 是否是只包含原始值的数组
              const isPrimitive = typeof param.subParams === 'string';
              // 生成的随机个数
              const arrNum = Mock.Random.integer(1, 5);
              const randomArr = [];
              for(let i=0; i<arrNum; i++){
                randomArr[i] = isPrimitive ? getPrimitiveMockData(param.subParams, param.name) : this.buildMockData(param.subParams);
              }
              obj[param.name] = randomArr;
            default:
              break;
          }
        }
        return obj;
      },
      // 发送请求
      sendRequest (){
        if(!this.currentRequest || !this.currentRequest.name.trim() || !this.postman.request.data.trim() || !this.postman.url.trim())return;
        this.sendingRequest = true;
        const requestData = {
          msgType: this.currentRequest.name,
          msgBody: JSON.parse(this.postman.request.data),
        };
        console.log('>>> sendRequest', requestData);
        this.api.config.http[this.postman.method.toLowerCase()](this.postman.url, requestData).then(res => {
          console.log('>>> sendRequest [res]', res);
          this.sendingRequest = false;
          try {
            this.postman.response.data = JSON.stringify(res.data, null, 2);
          }catch (e){
            this.postman.response.data = res.data;
          }
        }).catch(err => {
          console.log('>>> sendRequest [err]', err);
          this.sendingRequest = false;
          this.postman.response.data = err.toString();
        });
      },
      showJSON (){
        this.showJSONModal = true;
      },
      // 导入测试接口文件
      importApiFile (){
        ET.dialog.showOpenDialog({properties: ['openFile']}, (filePaths) => {
          if(filePaths && filePaths.length){
            this.api.file.importApiFile(filePaths[0]).then(res => {
              console.log('>>> sendRequest [res]', res);
              this.requests = res.data.data || null;
              this.currentRequestIndex = 0;
            }).catch(err => {
              console.log('>>> sendRequest [err]', err);
            });
          }
        });
      },
      // 新增测试窗口新增测试窗口
      openNewWindow (){
        ET.ipcRenderer.send('openNewWindow');
      },
    },
  };
</script>

<style lang="less">
  #show-json-dialog {
    .el-textarea {
      textarea {
        color: #ffffff;
        background-color: #444444;
      }
    }
  }
  #home {
    height: 100%;
    font-size: 1.4rem;
    color: #1e1e1e;
    position: relative;
    padding: 10px 15px;
    .welcome-mask {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-image: url('../../app/static/vteam.png');
      background-size: cover;
      z-index: 1;
      color: #dfdfdf;
      text-align: center;
      h1, h3 {
        opacity: .75;
      }
      h1 {
        padding-top: 80px;
        font-weight: normal;
        font-size: 24px;
        word-spacing: 5px;
      }
    }
    .el-row {
      height: 100%;
      /* 接口面板 */
      .api-panel {
        height: 100%;
        padding-right: 30px;
        > .filter {
          padding-bottom: 10px;
          margin: 10px 0;
          .new-window {
            margin-left: 5px;
          }
          > .el-button {
            float: right;
          }
        }
        > .request {
          height: calc(~"100% - 100px");
          overflow: auto;
          margin-top: 20px;
          > .title {
            > .el-button {
              float: right;
            }
          }
          h1, h2 {
            &:before {
              content: '';
              width: 0;
              height: 100%;
              padding-left: 5px;
              border-left: 4px solid #409EFF;
            }
          }
          h1 {
            font-size: 1.8rem;
          }
          h2 {
            margin-top: 30px;
            padding-bottom: 15px;
            font-size: 1.6rem;
          }
          h3 {
            font-size: 1.4rem;
          }
          .description {
            color: #565656;
            line-height: 1.5;
          }
          > .params {
            padding-left: 20px;
            > .param {
              // 
            }
          }
        }
      }
      /* 请求面板 */
      .request-panel {
        .build-mock-data-btn {
          float: right;
        }
        > .el-input {
          .el-input--suffix {
            background-color: #409EFF;
            color: #ffffff;
            .el-input__icon {
              color: #ffffff;
            }
          }
          .el-input-group__append {
            > .el-button {
              background-color: #409EFF;
              color: #ffffff;
              border-top-left-radius: 0;
              border-bottom-left-radius: 0;
            }
          }
        }
      }
    }
  }
</style>
