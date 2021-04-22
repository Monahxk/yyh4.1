<!--
 * @Descripttion: 低量预警
 * @version: v4.1
 * @Author: hzj
 * @Date: 2019-08-26 11:49:10
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-11 18:51:21
 -->
<template>
	<div class="wrapper">
		<header class="header-page" :class="{'show-query': showQuery}">
			<div class="nav_wrap">
				<div class="nav_right_box">
					<div class="nav_item">
						<el-select v-model="formSearch.wareHouseId" @change="search" >
							<el-option label="全部库房" value=""></el-option>
							<el-option
								v-for="item in wareHouseList"
								:key="item.id"
								:label="item.name"
								:value="item.id">
							</el-option>
						</el-select>
					</div>
					<div class="nav_item">
						<el-select v-model="formSearch.drugTypeId"  @change="search">
							<el-option label="全部类别" value=""></el-option>
							<el-option
							v-for="item in drugTypeList"
							:key="item.id"
							:label="item.goodstypeName"
							:value="item.id">
							</el-option>
						</el-select>
					</div>
          <div class="nav_item">
            <el-input placeholder="请输入物品名称" 
            v-model="formSearch.name"
            @keyup.enter.native="search"
						clearable>
              <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
            </el-input>
          </div>
				</div>
			</div>
		</header>
		<main class="main-content">
			<section class="table-box" :class="{'re-ren': showQuery}">
				<el-table
          highlight-current-row
          ref="table"
          :data="tableList"
          :style="{'font-size': tableStyleConfig.font}"
          height="100%"
          v-loading="tableLoading"
          :header-cell-style="{background:tableStyleConfig.headerCellStyle.background,color:tableStyleConfig.headerCellStyle.color}"
        >
          <template slot="empty">
            <div class="table-empty">
              <img src="../../../../assets/img/blank.png" alt>
            </div>
          </template>
         	<el-table-column prop="drug.drugType.goodstypeName" label="物品类别" sortable align="center"></el-table-column>
          <el-table-column prop="drug.drugName" label="物品名称" sortable align="center"></el-table-column>
          <el-table-column prop="drug.drugBrand.brandName" label="品牌" sortable align="center"></el-table-column>
          <el-table-column prop="drug.drugSpec" label="规格" sortable align="center"></el-table-column>
          <el-table-column prop="drug.drugUnitsConfig.unitName" label="单位" sortable align="center"></el-table-column>
          <el-table-column prop="quantity" label="库存数量" sortable align="center"></el-table-column>
        </el-table>
			</section>
			<footer class="footer">
				<Pagination :pageConfig="pageConfig" @handleSizeChange="handleSizeChange" @handleChage="handleChage"></Pagination>
			</footer>
		</main>
	</div>
</template>
<script>
import Pagination from '@/components/commons/Pagination'
import {MESSAGE_TABLE_STYLE,PAGE_SIZE,SYSTEM_HTTP_SUCCESS} from '@/constant'
import {listLowQuantityWarning,getinventorywarningDO} from '@/api'
export default {
	name: 'earlyWarning',
	components: {Pagination},
  data() {
		return {
			showQuery: false,
			tableel: false,
			wareHouseList: [],
			drugTypeList: [],
			formSearch: {
				drugTypeId: '',
				wareHouseId: '',
				name: ''
			},
			tableLoading: false,
			tableList: [],
			pageConfig: {
				currentPage: 1,
				total: 0,
				pageSize: PAGE_SIZE
			}
		}
	},
	computed: {
		tableStyleConfig() {
			return MESSAGE_TABLE_STYLE;
		}
	},
	mounted() {
    this.getTableList();
    getinventorywarningDO().then(res => {
      if(res.data.code == SYSTEM_HTTP_SUCCESS) {
        this.drugTypeList = res.data.data.drugTypeList || [];
				this.wareHouseList = res.data.data.wareHouseList || [];
      }
    })
  },
	methods: {
		getTableList() {
			this.tableLoading = true;
			let params = {page:this.pageConfig.currentPage,pageSize: this.pageConfig.pageSize};
			listLowQuantityWarning(Object.assign(params,this.formSearch)).then(res => {
				this.tableLoading = false;
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.tableList = res.data.data;
          this.pageConfig.total = res.data.totalNumber || 0;
        } else {
          this.tableList = [];
          this.pageConfig.total = 0;
        }
      }).catch(err => {
				this.tableLoading = false;
			});
    },
    search() {
      this.pageConfig.currentPage = 1;
      this.getTableList();
    },
    handleSizeChange(pageSize) {
      this.pageConfig.currentPage = 1;
      this.pageConfig.pageSize = pageSize;
      this.getTableList();
    },
     handleChage(page) {
      this.pageConfig.currentPage = page;
      this.getTableList();
    },
	}
}
</script>
<style lang="less" scoped>
	
</style>
