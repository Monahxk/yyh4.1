<!--
@Author: ZJZ
@Date:   2019-08-01
@Filename: Index.vue
@Last modified by:   ZJZ
@Last modified time: 2019-09-23
-->

<template>
  <div class="wrapper">
    <div class="pc_patient_index">
      <div class="header-left">
        <base-tabs ref='active' v-model="checkedIndex" @on-click="getParentIndex" v-if='isChain=="true"'>
          <base-pane label="本店患者"></base-pane>
          <base-pane v-if='isChain' label="连锁店患者"></base-pane>
        </base-tabs>
        <base-tabs ref='active' v-model="checkedIndex" @on-click="getParentIndex"  v-if='isChain=="false"'>
          <base-pane label="本店患者"></base-pane>
        </base-tabs>
      </div>
      <div class="">
        <router-view></router-view>
      </div>
    </div>

  </div>
</template>


<script>

import sse from "sessionstorage";
export default {
  name:'activityIndex',
  data() {
    return {
      checkedIndex:0,
      isChain:false,
    };
  },
  watch:{
    $route(to,from){
      if(to.name=='VisitMng'){
        this.$refs.active.currentValue=0
        this.getParentIndex(0)
      }
    }
  },
  created(){
    this.isChain=sse.getItem("isChain")
    console.log(this.isChain)
  },
  mounted() {
    this.getParentIndex(0)

  },
  methods: {
    getParentIndex(v) {
      this.checkedIndex=v
      if(this.checkedIndex==0){
        this.$router.push('TodayPatient')
      }else if(this.checkedIndex==1){
        this.$router.push('AllPatient')
      }

    }
  }
};
</script>
<style lang="less" scoped>
.chargeItem {
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
