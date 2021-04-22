<!--
 * @Descripttion: 领用、退库
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-05 14:19:39
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

import sse from "sessionstorage";
export default {
  name:'ReportLossIndex',
  data() {
    return {
			checkedIndex:0,
			navList: ['领用管理','退库管理']
    };
  },
  watch:{
    $route(to,from){
      if(to.name=='TakeOut'){
        this.$refs.active.currentValue=0
        this.getParentIndex(0)
      }
    }
  },
  created(){
  },
  mounted() {
    let id = this.$route.query.id;
    if(id) {
      let path = this.$route.path;
      let index = path.substr(path.length - 1,path.length);
      this.$refs.active.currentValue = index;
    } else {
      this.getParentIndex(0)
    }

  },
  methods: {
    getParentIndex(v) {
      this.checkedIndex = v;
			this.$router.push("/TakeOut/"+v);
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
