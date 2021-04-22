<!--
@Author: ZJZ
@Date:   2019-08-01
@Filename: index.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-04
-->

<template>
  <!-- 运营总揽 -->
  <div class="wrapper">
    <base-tabs ref="active" v-model="checkedIndex" @on-click="getParentIndex">
      <base-pane label="新增患者统计"></base-pane>
      <base-pane label="实收来源统计"></base-pane>
      <base-pane label="患者增量趋势统计"></base-pane>
      <base-pane label="复诊患者趋势统计"></base-pane>
      <base-pane label="实收趋势统计"></base-pane>
    </base-tabs>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkedIndex: 0
    };
  },
  watch:{
    $route(to,from){
      if(to.name=='OperatingReport'){
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
        this.$router.push('TotalParent')
      }else if(this.checkedIndex==1){
        this.$router.push('TotalIncome')
      }else if(this.checkedIndex==2){
        this.$router.push('Increment')
      }else if(this.checkedIndex==3){
        this.$router.push('OverviewVisit')
      }else if(this.checkedIndex==4){
        this.$router.push('Received')
      }

    }
  }

};
</script>
<style lang="less" scoped>
.wrapper {
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  .main {
    flex: 2;
  }
}
</style>
