<!--
@Author: ZJZ
@Date:   2019-08-26
@Filename: ApprovalIndex.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-08
-->

<template>
  <div class="case_index">
    <div class="wrapper">
      <div class="tabs_chunk">
        <base-tabs  ref='active' v-model="checkedIndex" @on-click="getParentIndex" :value='checkedIndex'>
          <base-pane label="待我审批">
        </base-pane>
          <base-pane label="我已审批">
        </base-pane>
          <base-pane label="我发起的">
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
  name:'Approval',
  data() {
    return {
      checkedIndex:0
    };
  },
  watch:{
    $route(to,from){
      if(to.name=='Approval'){
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
        this.$router.push('Await')
      }else if(this.checkedIndex==1){
        this.$router.push('Approved')
      }else if(this.checkedIndex==2){
        this.$router.push('Me')
      }

    }
  }
};
</script>
<style lang="less" scoped>
.case_index,.wrapper,.main_content{
  height: 100%;
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
