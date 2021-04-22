<!--
@Author: ZJZ
@Date:   2019-08-01
@Filename: ActivityIndex.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-11
-->

<template>
  <div class="wrapper">
    <div class="header-left">
      <base-tabs ref='active' v-model="checkedIndex" @on-click="getParentIndex">
        <base-pane label="预存卡">
      </base-pane>
        <base-pane label="折扣卡">
      </base-pane>
      </base-tabs>
    </div>
    <div class="main_content">
      <keep-alive>
        <component :is="currentView"></component>
      </keep-alive>
    </div>
  </div>
</template>


<script>

import predepositCard from "./PredepositCard"
import discount from "./Discount"
export default {
  name:'predeposite',
  components: {
    predepositCard,
    discount,
  },
  data() {
    return {
      currentView: 'predepositCard',
      checkedIndex:0
    };
  },
  watch:{
    $route(to,from){
      if(to.name=='Activity'){
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
        this.currentView = 'predepositCard';
      }else if(this.checkedIndex==1){
        this.currentView = 'discount';
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
.wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  .main_content {
    flex: 1;
    
  }
}
</style>
v<style>
@import "../../../assets/css/workbench/publicTable.css";
</style>
