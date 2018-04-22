<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    name: 'app',
  };
</script>

<style lang="less">
  html, body {
    height: 100%;
    font-family: 'Microsoft Yahei';
    font-size: 10px;
    margin: 0;
    padding: 0;
  }
  #app {
    height: 100%;
    box-sizing: border-box;
  }
</style>
