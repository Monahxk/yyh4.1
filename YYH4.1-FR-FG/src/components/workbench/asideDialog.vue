<!--
 * @Descripttion: 患者详情公用
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-07 11:28:43
 -->
<template>
  <div>
    <el-dialog
      @closed="closedFn"
      :title="title"
      width="1200px"
      :visible.sync="isShow.dialogVisible"
      class="reset"
      :modal="false"
      :close-on-click-modal="false" 
      :close-on-press-escape="false"
      :show-close="showClose"
      @open="openEmit"
    >
      <div class="main">
        <slot></slot>
      </div>
      <div>
        <slot name="footer"></slot>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: ["isShow", "title", "setWidth" , "close-on-click-modal","showDialogClose"],
  data() {
    return {
      
    };
  },
  watch: {},
  computed: {
    widths() {
      return this.setWidth? this.width : "900px"
    },
    showClose() {
      return ((typeof this.showDialogClose === 'undefined') || this.showDialogClose) ? true : this.showDialogClose
    }
  },
  methods: {
    closedFn() {
      this.$emit("on-close", true);
    },
    openEmit() {
      this.$emit("on-open");
    }
  },
  mixins: [],
  mounted() {}
};
</script>
<style lang="less" scoped>
</style>
<style>
#iframe_wrapper .reset .el-dialog__header {
  display: block !important;
  border-bottom: 1px solid #eee;
}
#iframe_wrappers .reset .el-dialog__body {
  height: auto !important;
  padding-bottom: 0;
}
#iframe_wrapper .reset .el-dialog {
  width: 1300px !important;
}
#iframe_wrapper .reset .el-dialog {
  margin-top: 15vh !important;
  position: relative;
  margin: 15vh auto 50px !important;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  height: auto !important;
}
#iframe_wrapper .reset {
  background: rgba(0, 0, 0, 0.5);
  z-index: 9990 !important;
}
#iframe_wrapper .reset .main {
  padding: 10px 20px 0 20px;
}
#iframe_wrapper .reset .el-icon-close:before {
  /* content: "\E60F" !important; */
  color: #ccc;
  font-size: 16px;
}
</style>