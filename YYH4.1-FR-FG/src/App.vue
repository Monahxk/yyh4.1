<!--
@Author: ZJZ
@Date:   2019-08-01
@Filename: App.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-11
-->

<template>
  <div id="app">
    <router-view/>
    <router-view name="sideslip"/>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      txt: '我是数据啊'
    }
  }
};
</script>

<style lang="less">
</style>

<style>
.el-popper[x-placement^=top] .popper__arrow::after {
  border-top-color:rgba(119,205,255, 0.8);
}
.el-popover {
  background: transparent;
  padding: 0;
}
.el-dialog__header {
  text-align: center !important;
  font-weight: bold;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.gutter {
  background: rgba(228, 233, 255, 0.29) !important;
}
.el-loading-parent--relative {
  position: initial !important;
}
</style>
