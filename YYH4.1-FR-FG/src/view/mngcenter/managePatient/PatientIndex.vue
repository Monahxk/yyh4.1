<!--
@Author: ZJZ
@Date:   2019-08-01
@Filename: PatientIndex.vue
@Last modified by:   ZJZ
@Last modified time: 2019-09-10
-->

<template>
  <div class="wrapper">
    <div class="">
      <div class="header-left">
        <base-tabs ref='active' v-model="checkedIndex" @on-click="getParentIndex">
          <base-pane label="患者查询"></base-pane>
          <base-pane label="患者查重"></base-pane>
          <base-pane label="患者归档"></base-pane>
        </base-tabs>
      </div>
      <div class="">
        <router-view></router-view>
      </div>

    </div>

  </div>
</template>


<script>


export default {
  name:'patientIndex',
  data() {
    return {
      checkedIndex:0
    };
  },
  watch:{
    $route(to,from){
      if(to.name=='PatientMng'){
        this.$refs.active.currentValue=0
        this.getParentIndex(0)
      }
    }
  },
  mounted() {
    this.getParentIndex(0)
  },
  methods: {
    getParentIndex(v) {
      this.checkedIndex=v
      if(this.checkedIndex==0){
        this.$router.push('Inquire')
      }else if(this.checkedIndex==1){
        this.$router.push('Repetition')
      }else if(this.checkedIndex==2){
        this.$router.push('Flyback')
      }

    }
  }
};
</script>
<style lang="less" scoped>
.patientIndex {
  position: relative;
  .el-dialog{
    .el-select{
      width: 100%;
    }
  }
}
.header_right {
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0;
  width: 154px;
  height: 48px;
  font-size: 18px;
  font-weight: bold;
  color: #4e81f2;
  text-align: center;
  line-height: 48px;
  -webkit-box-shadow: 0 0 6px 0 #e4e9ff;
  box-shadow: 0 0 6px 0 #e4e9ff;
  background-color: #ffffff;
  margin-right: 20px;
}
</style>
