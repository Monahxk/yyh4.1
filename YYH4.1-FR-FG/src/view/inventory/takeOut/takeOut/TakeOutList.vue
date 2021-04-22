<!--
 * @Descripttion: 领用单
 * @version: 
 * @Author: hzj
 * @Date: 2019-08-16 16:27:48
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-12 15:28:06
 -->
<template>
	<div class="wrapper">
		<header class="header-page" :class="{'show-query': showQuery}">
			<div class="nav_wrap">
				<div class="nav_right_box">
					<div class="nav_item">
						<el-button type="text" icon="el-icon-search" @click="showQuery=!showQuery">搜索</el-button>
					</div>
					<div class="nav_item">
						<el-select v-model="formSearch.status"  @change="search">
							<el-option label="全部状态" value=""></el-option>
							<el-option
							v-for="item in statusList"
							:key="item.id"
							:label="item.name"
							:value="item.id">
							</el-option>
						</el-select>
					</div>
					<div class="nav_item">
						<Buttons :btncfg="{add: true,text: '新增领用单'}" @add="add"></Buttons>
					</div>
				</div>
			</div>
			<div class="query-box">
        <el-form :inline="true" :model="formSearch" @keyup.enter.native="search" >
						<el-form-item label="">
							<el-date-picker
								v-model="timeValue"
								value-format="yyyy-MM-dd HH:mm:ss"
								type="daterange"
								range-separator="-"
								start-placeholder="开始日期"
								end-placeholder="结束日期">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="">
              <el-select v-model="formSearch.wareHouseId" placeholder="全部库房" clearable>
								<el-option label="全部库房" value=""></el-option>
                <el-option
                  v-for="item in wareHouseList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
						<el-form-item label="">
							<el-input placeholder="领用单号/领用人" v-model="formSearch.numberOrApplyName" clearable></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" class="search_btn"  @click="search">搜索</el-button>
						</el-form-item>
				</el-form>
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
					:tooltip-effect="tableStyleConfig.tooltipEffect"
          :header-cell-style="{background:tableStyleConfig.headerCellStyle.background,color:tableStyleConfig.headerCellStyle.color}"
        >
          <template slot="empty">
            <div class="table-empty">
              <img src="../../../../assets/img/blank.png" alt>
            </div>
          </template>
					<el-table-column prop="statusText" label="状态" sortable align="center">
						<template slot-scope="scope">
							<span :class="'exp_status_color'+scope.row.status">
								{{scope.row.statusText}}
							</span>
						</template>
					</el-table-column>
					<el-table-column prop="applyDate" label="申请日期" min-width="120" sortable align="center"></el-table-column>
					<el-table-column prop="takeOutDate" label="领用日期" min-width="120" sortable align="center"></el-table-column>
          <el-table-column prop="orderNumber" label="单号" min-width="120" :show-overflow-tooltip="true" sortable align="center"></el-table-column>
          <el-table-column prop="wareHouseName" label="库房" min-width="120" :show-overflow-tooltip="true" sortable align="center"></el-table-column>
          <el-table-column prop="category" label="物品种类" min-width="100" sortable align="center"></el-table-column>
					<el-table-column prop="quantity" label="领用数量" min-width="100" sortable align="center"></el-table-column>
					<el-table-column prop="requestorName" label="领用人" min-width="100" sortable align="center"></el-table-column>
          <el-table-column prop="operateEmployeeName" label="经办人" sortable align="center"></el-table-column>
          <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true" sortable align="center"></el-table-column>

          <el-table-column label="操作" width="150" align="center" fixed="right">
            <template slot-scope="scope" style="marginLeft:-25px">
              <el-button type="text" size="small" @click="showDetailById(scope.row)">明细</el-button>
              <span class="line" v-if="scope.row.status == 2 || scope.row.status == 4">|</span>
							<el-button type="text" size="small" v-if="scope.row.status == 2" @click="edit(scope.row.id)">编辑</el-button>
              <el-dropdown v-if="scope.row.status == 4">
								<span class="el-dropdown-link">
									更多
								</span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <p @click="edit(scope.row.id)">编辑</p>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <p @click="del(scope.row.id)">删除</p>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
			</section>
			<footer class="footer">
				<Pagination :pageConfig="pageConfig" @handleSizeChange="handleSizeChange" @handleChage="handleChage"></Pagination>
			</footer>
		</main>
		<AddTakeOut :dialog="dialog" @search="search"></AddTakeOut>
	</div>
</template>
<script> 
import Buttons from '@/components/commons/buttons/Buttons'
import AddTakeOut from './AddTakeOut'
import Pagination from '@/components/commons/Pagination'
import {MESSAGE_TABLE_STYLE,PAGE_SIZE,SYSTEM_HTTP_SUCCESS} from '@/constant'
import {getTakeoutList,getTakeoutfilterdo,delTakeout} from '@/api'
import typesAndHouseMixin from '@/mixins/inventory/typesAndHouse';
export default {
	name: 'TakeOutList',
	components: {AddTakeOut,Pagination,Buttons},
	mixins: [typesAndHouseMixin],
  data() {
		return {
			showQuery: false,
			tableel: false,
			timeValue: '',
			statusList: [],
			wareHouseList: [],
			formSearch: {
				numberOrApplyName: '',
				wareHouseId: '',
				startDate: '',
				endDate: '',
				status: ''
			},
			tableLoading: false,
			tableList: [],
			dialog: {
				isshow: false,
				id: '',
				type: 'add',
				status: ''
			},
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
	watch: {
	},
	created() {
		this.$nextTick( () => {
			let id = this.$route.query.id;
			if(id) {
				this.edit(id);
			}
		})
	},
	mounted() {
		this.search();
		getTakeoutfilterdo().then(res => {
			if(res.data.code == SYSTEM_HTTP_SUCCESS) {
				this.wareHouseList = res.data.data.wareHouseList;
				let statusMap = res.data.data.statusMap;
				this.statusList = this.mapToArray(statusMap);
			}
		})
	},
	methods: {
		getTableList() {
			this.tableLoading = true;
      let params = {page:this.pageConfig.currentPage,pageSize: this.pageConfig.pageSize};
			getTakeoutList(Object.assign(params,this.formSearch)).then(res => {
        this.tableLoading = false;
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          let list = res.data.data;
          this.tableList = list;
          this.pageConfig.total = res.data.totalNumber || 0;
        } else {
          this.tableList = [];
          this.pageConfig.total = 0;
        }
      });
		},
		add() {
			this.dialog.isshow = true;
			this.dialog.type = 'add';
			this.dialog.id = '';
		},
		edit(id) {
			this.dialog.isshow = true;
			this.dialog.type = 'edit';
			this.dialog.id = id;
		},
		del(id) {
			this.$confirm("您确定要删除该单据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
				delTakeout(id).then(res => {
					if(res.data.code == SYSTEM_HTTP_SUCCESS) {
						this.search()
					}
				})
      }).catch(() => {});
		},
		showDetailById(row) {
			this.dialog.isshow = true;
			this.dialog.type = 'detail';
			this.dialog.id = row.id;
			this.dialog.status = row.status;
		},
		search() {
			this.pageConfig.currentPage = 1;
			this.formSearch.startDate =  this.timeValue ? this.timeValue[0] : '';
      this.formSearch.endDate = this.timeValue ? this.timeValue[1] : '';
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
