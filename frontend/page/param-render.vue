<template>
  <div class="param-render" v-if="param">
    <h3 class="param-name">
      <el-button type="text" icon="el-icon-arrow-right" size="mini" v-if="param.subParams" @click="toggleSubParams"></el-button>
      {{ param.name }}
    </h3>
    <el-table
      :data="[param]"
      style="width: 400px;">
      <el-table-column
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        v-for="(column, i) in table.columns" :key="i">
      </el-table-column>
    </el-table>
    <div class="sub-params" v-if="param.subParams">
      <template v-if="typeof param.subParams !== 'string'">
        <div class="param" v-for="(subParam, j) in param.subParams" :key="j">
          <param-render :param="subParam"></param-render>
        </div>
      </template>
      <div v-else>
        <h3 class="param-name"><el-tag size="small">原始值</el-tag> [ {{ param.subParams }} , ... ]</h3>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'param-render',
    props: {
      param: Object,
    },
    data (){
      return {
        table: {
          columns: [
            { prop: 'type', label: '类型', width: 80, },
            { prop: 'description', label: '描述' },
          ],
        },
      };
    },
    methods: {
      toggleSubParams (e){
        const subParamsArea = e.target.parentNode.parentNode.parentNode;
        // console.log('>>> toggleSubParams', e.target, subParamsArea);
        if(subParamsArea){
          const display = subParamsArea.querySelector('.sub-params').style.display;
          // console.log(display);
          if(!display || display === 'block'){
            subParamsArea.querySelector('.sub-params').style.display = 'none';
          }else subParamsArea.querySelector('.sub-params').style.display = 'block';
        }
      },
    },
  };
</script>

<style lang="less">
  .param-render {
    .param-name {
      .el-button {
        margin-left: -5px;
      }
    }
    .sub-params {
      padding-left: 20px;
    }
  }
</style>


