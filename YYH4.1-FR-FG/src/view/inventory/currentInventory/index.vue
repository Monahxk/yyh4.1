<!--
 * @Descripttion: 当前库存
 * @version: v4.1
 * @Author: hzj
 * @Date: 2019-09-09 15:04:11
 * @LastEditors: hzj
 * @LastEditTime: 2019-09-09 15:25:16
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
  name:'currentInventoryIndex',
  data() {
    return {
			checkedIndex:0,
			navList: ['当前库存']
    };
  },
  watch:{
    $route(to,from){
      if(to.name=='Inventory'){
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
			this.$router.push("/Inventory/" + v);
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
