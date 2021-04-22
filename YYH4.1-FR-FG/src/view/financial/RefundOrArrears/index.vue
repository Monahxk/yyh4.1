<!--
 * @Descripttion: 欠退费
 * @version: v4.1
 * @Author: hzj
 * @Date: 2019-08-30 14:43:37
 * @LastEditors: hzj
 * @LastEditTime: 2019-08-30 14:45:55
 -->
<template>
  <div class="wrapper">
		<div class="header">
			<base-tabs ref='active' v-model="checkedIndex" @on-click="getParentIndex">
				<base-pane v-for="(item,index) in navList" :label="item" :key="index"></base-pane>
			</base-tabs>
		</div>
		<div class="main">
			<router-view></router-view>
		</div>
  </div>
</template>


<script>

export default {
  name:'RefundOrArrears',
  data() {
    return {
			checkedIndex:0,
			navList: ['欠费报表','退费报表']
    };
  },
  watch:{
    $route(to,from){
      if(to.name=='RefundOrArrears'){
        this.$refs.active.currentValue=0
        this.getParentIndex(0)
      }
    }
  },
  created(){
  },
  mounted() {
    this.getParentIndex(0)

  },
  methods: {
    getParentIndex(v) {
      this.checkedIndex = v;
			this.$router.push("/RefundOrArrears/" + v);
    }
  }
};
</script>
<style lang="less" scoped>
	.wrapper {
		height: 100%;
		display: flex;
		flex-direction: column;
		.main {
			flex-grow: 1;
		}
	}
</style>
