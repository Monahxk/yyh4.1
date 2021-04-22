<!--
 * @Descripttion: 进销存配置
 * @version: v4.1
 * @Author: hzj
 * @Date: 2019-08-26 11:45:53
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-12 10:19:48
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
  name:'BatchIndex',
  data() {
    return {
			checkedIndex:0,
			navList: ['基础信息','供应商配置','物品配置']
    };
  },
  watch:{
    $route(to,from){
      if(to.name=='InventoryCfg'){
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
			this.$router.push("/InventoryCfg/" + v);
    }
  }
};
</script>
<style lang="less" scoped>
	.wrapper {
		height: 100%;
		position: relative;
    
		.main {
      position: absolute;
      top: 60px;
      left: 0;
      width: 100%;
      height: 100%;
      padding-bottom: 60px;
		}
	}
</style>
