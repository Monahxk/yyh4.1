<template>
  <div class="wrapper">
    <div class="case_index">
      <div class="tabs_chunk">
        <base-tabs  ref='active' v-model="checkedIndex" @on-click="getParentIndex" :value='checkedIndex'>
          <base-pane label="门店地图"></base-pane>
          <base-pane label="新增患者"></base-pane>
          <base-pane label="收入统计"></base-pane>
          <base-pane label="预约统计"></base-pane>
          <base-pane label="收入趋势"></base-pane>
        </base-tabs>
      </div>
      <div class="main_content">
        <router-view></router-view>
      </div>

    </div>

  </div>
</template>


<script>


export default {
  name:'caseIndex',
  data() {
    return {
      checkedIndex:0
    };
  },
  watch:{
    $route(to,from){
      if(to.name=='ChainReport'){
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
        this.$router.push('ChainReportMap')
      }else if(this.checkedIndex==1){
        this.$router.push('ChainReportPatient')
      }else if(this.checkedIndex==2){
        this.$router.push('ChainReportEarnings')
      }else if(this.checkedIndex==3){
        this.$router.push('ChainReportAppointment')
      }else if(this.checkedIndex==4){
        this.$router.push('ChainReportTrend')
      }

    }
  }
};
</script>
<style lang="less" scoped>
.case_index{
  overflow-y: auto;
  position: absolute;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  padding: 20px;
}

</style>
