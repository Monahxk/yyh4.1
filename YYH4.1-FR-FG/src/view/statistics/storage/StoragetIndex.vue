<!--
@Author: ZJZ
@Date:   2019-08-19
@Filename: StoragetIndex.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-08
-->

<template>
  <div class="case_index">
    <div class="wrapper">
      <div class="tabs_chunk">
        <base-tabs  ref='active' v-model="checkedIndex" @on-click="getParentIndex" :value='checkedIndex'>
          <base-pane label="库存报表"></base-pane>
          <base-pane label="入库报表"></base-pane>
          <base-pane label="出库报表"></base-pane>
          <base-pane label="采购报表"></base-pane>
          <base-pane label="领用报表"></base-pane>
          <base-pane label="退库报表"></base-pane>
          <!-- <base-pane label="盘点报表"></base-pane>
          <base-pane label="报损报表"></base-pane>
          <base-pane label="退货报表"></base-pane> -->
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
      if(to.name=='InventoryReport'){
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
        this.$router.push('Stock')
      }else if(this.checkedIndex==1){
        this.$router.push('Access')
      }else if(this.checkedIndex==2){
        this.$router.push('Out')
      }else if(this.checkedIndex==3){
        this.$router.push('Purchase')
      }else if(this.checkedIndex==4){
        this.$router.push('Receive')
      }else if(this.checkedIndex==5){
        this.$router.push('Quit')
      }else if(this.checkedIndex==6){
        this.$router.push('Check')
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
  .main_content,.wrapper{
    height: 100%;
  }
}

</style>
