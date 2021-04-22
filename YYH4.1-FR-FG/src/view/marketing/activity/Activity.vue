<template>
  <div class="Charge_item">
    <div class="Charge_item_index">
      <div class="tabs_chunk">
        <base-tabs ref='active' v-model="checkedIndex" @on-click="getParentIndex">
          <base-pane label="预存款"></base-pane>
          <base-pane label="折扣卡"></base-pane>
          <base-pane label="代金券"></base-pane>
          <base-pane label="促销套餐"></base-pane>
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
  name:'Activity',
  data() {
    return {
      checkedIndex:0
    };
  },
  watch:{
    $route(to,from){
      if(to.name=='AdvanceDeposit'){
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
        this.$router.push('AdvanceDeposit')
      }else if(this.checkedIndex==1){
        this.$router.push('DiscountCard')
      }else if(this.checkedIndex==2){
        this.$router.push('Cashcoupon')
      }else if(this.checkedIndex==3){
        this.$router.push('Promotion')
      }

    }
  }
};
</script>
<style lang="less" scoped>
.Charge_item ,.Charge_item_index ,.main_content{
  width: 100%;
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
