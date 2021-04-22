<!--
 * @Descripttion: 收银对账
 * @version: v4.1
 * @Author: hzj
 * @Date: 2019-08-26 11:45:53
 * @LastEditors: hzj
 * @LastEditTime: 2019-08-27 13:35:14
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
  name:'AccountCollection',
  data() {
    return {
			checkedIndex:0,
			navList: ['收费账单','账目明细']
    };
  },
  watch:{
    $route(to,from){
      if(to.name=='AccountCollection'){
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
			this.$router.push("/AccountCollection/" + v);
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
