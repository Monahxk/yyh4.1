<!--
 * @Descripttion: 单据管理
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-05 12:11:04
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
  name:'manageReceiptndex',
  data() {
    return {
			checkedIndex:0,
			navList: ['采购单','入库单','出库单','退货单'],//,'调拨单','盘点单'
    };
  },
  watch:{
    $route(to,from){
      if(to.name=='Receipt'){
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
      this.$router.push("/Receipt/" + v);
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
