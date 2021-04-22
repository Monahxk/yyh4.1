<!--
 * @Descripttion: 报损单列表
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-06 15:36:02
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
						<el-select v-model="state" size="small">
							<el-option
							v-for="item in stateList"
							:key="item.id"
							:label="item.name"
							:value="item.id">
							</el-option>
						</el-select>
					</div>
					<div class="nav_item">
						<el-button size="small">导入报损</el-button>
					</div>
					<div class="nav_item">
						<el-button type="primary" size="small"  @click="add">新增报损</el-button>
					</div>
				</div>
			</div>
			<div class="query-box">
        <el-form :inline="true" :model="formSearch" >
					<el-row >
            <el-col :span="5">
              <el-form-item label="报损日期">
                  <el-date-picker
                    v-model="formSearch.date"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="">
                <el-input placeholder="单号/供应商" v-model="formSearch.text" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item>
                <el-button type="primary" class="search_btn"  @click="getTableList('')">搜索</el-button>
              </el-form-item>
            </el-col>
          </el-row>
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
          :header-cell-style="{background:tableStyleConfig.headerCellStyle.background,color:tableStyleConfig.headerCellStyle.color}"
        >
          <template slot="empty">
            <div class="table-empty">
              <img src="../../../../assets/img/blank.png" alt>
            </div>
          </template>
          <el-table-column prop="number" label="报损日期" sortable align="center"></el-table-column>
          <el-table-column prop="drugProvider.suppliersName" label="单号" sortable align="center"></el-table-column>
					<el-table-column prop="drugProvider.suppliersName" label="库房" sortable align="center"></el-table-column>
          <el-table-column prop="category" label="物品种类" sortable align="center"></el-table-column>
          <el-table-column prop="amount" label="总金额" sortable align="center"></el-table-column>
          <el-table-column prop="creater.name" label="经办人" sortable align="center"></el-table-column>
          <el-table-column prop="remark" label="报损原因" sortable :show-overflow-tooltip="true" align="center"></el-table-column>

          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope" style="marginLeft:-25px">
              <el-button type="text" size="small" @click="showDetailById(scope.row.id)">明细</el-button>
              <span class="line">|</span>
              <el-dropdown>
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
				<Pagination :pageConfig="pageConfig"></Pagination>
			</footer>
		</main>
		<AddReportLoss :dialog="dialog"></AddReportLoss>
	</div>
</template>
<script>
import AddReportLoss from './AddReportLoss'
import Pagination from '@/components/commons/Pagination'
import {MESSAGE_TABLE_STYLE} from '@/constant'
export default {
	name: 'ReportLossList',
	components: {AddReportLoss,Pagination},
  data() {
		return {
			showQuery: false,
			tableel: false,
			state: 0,
			stateList: [
				{name: '全部状态', id: 0}
			],
			formSearch: {
				date: '',
				text: ''
			},
			tableLoading: false,
			tableList: [],
			dialog: {
				isshow: false,
				id: '',
				type: 'add'
			},
			pageConfig: {
				currentPage: 1,
				total: 2
			}
		}
	},
	computed: {
		tableStyleConfig() {
			return MESSAGE_TABLE_STYLE;
		}
	},
	watch: {
		showQuery: {
			handler() {
				// this.$refs.table.doLayout()
			}
		}
	},
	methods: {
		getTableList() {
			let arr = [];
			for(let i=0;i<40;i++) {
				arr.push({number: i})
			}
			this.tableList = arr;
		},
		add() {
			this.dialog = {
				type: 'add',
				isshow: true
			}
		},
		edit() {
			this.dialog = {
				type: 'eidt',
				isshow: true
			}
		},
		del(id) {
			this.$confirm("您确定要删除该单据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
      }).catch(() => {});
		},
		showDetailById(id) {
			this.dialog = {
				type: 'detail',
				isshow: true
			}
		}
	}
}
</script>
<style lang="less" scoped>
	
</style>
