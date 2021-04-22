<template>
  <div class="wrapper">
    <div class="case_index">
      <div class="tabs_chunk">
        <base-tabs  ref='active' v-model="checkedIndex" @on-click="getParentIndex" :value='checkedIndex'>
          <base-pane label="病历模板维护">
        </base-pane>
          <base-pane label="病历词条维护">
        </base-pane>
          <base-pane label="病历存储设置">
          </base-pane>
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
      if(to.name=='EmrCfg'){
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
        this.$router.push('CaseTemplate')
      }else if(this.checkedIndex==1){
        this.$router.push('CaseEntry')
      }else if(this.checkedIndex==2){
        this.$router.push('Stockpile')
      }

    }
  }
};
</script>
<style lang="less" scoped>

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
