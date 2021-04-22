<!--
@Author: ZJZ
@Date:   2019-08-01
@Filename: AppointIndex.vue
@Last modified by:   ZJZ
@Last modified time: 2019-09-05
-->

<template>
  <div class="wrapper">
    <div class="case_index">
      <div class="tabs_chunk">
        <base-tabs  ref='active' v-model="checkedIndex" @on-click="getParentIndex" :value='checkedIndex'>
          <base-pane label="预约医生视图">
        </base-pane>
          <base-pane label="预约日历视图">
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
      if(to.name=='AppointView'){
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
        this.$router.push('DoctorView')
      }else if(this.checkedIndex==1){
        this.$router.push('CalendarView')
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
