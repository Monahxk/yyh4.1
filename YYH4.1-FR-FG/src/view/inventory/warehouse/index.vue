<!--
 * @Descripttion: 库房
 * @version: 
 * @Author: hzj
 * @Date: 2019-08-26 10:15:43
 * @LastEditors: hzj
 * @LastEditTime: 2019-08-26 10:16:26
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
  name:'wareHouseIndex',
  data() {
    return {
			checkedIndex:0,
			navList: ['库房管理']
    };
  },
  watch:{
    $route(to,from){
      if(to.name=='Warehouse'){
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
			this.$router.push("/WarehouseIndex");
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

