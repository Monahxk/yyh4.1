<!--
 * @Descripttion: 供应商配置
 * @version: v4.1
 * @Author: hzj
 * @Date: 2019-08-26 11:48:59
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-11 16:25:42
 -->
<template>
	<div class="wrapper">
		<header class="header-page" :class="{'show-query': showQuery}">
			<div class="nav_wrap">
				<div class="nav_right_box">
          <div class="nav_item">
            <el-input placeholder="物品名称/编号" v-model="formSearch.drugName"  @keyup.enter.native="search">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
            </el-input>
          </div>
          <div class="nav_item">
            <Buttons :btncfg="{add: true,text: '新增物品'}" @add="openDrugDialog('add')"></Buttons>
					</div>
				</div>
			</div>
		</header>
		<main class="main-content">
      <div class="drug-types">
        <drugType  @getTableList="drugTypeChange" class="height100"></drugType>
      </div>
      <div class="table-content">
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
            <el-table-column prop="drugCode" label="物品编码" sortable align="center" width="200"></el-table-column>
            <el-table-column prop="drugName" label="物品名称" :show-overflow-tooltip="true" sortable align="center"></el-table-column>
            <el-table-column prop="drugIndicator" label="物品条码" sortable align="center"></el-table-column>
            <el-table-column prop="model" label="型号" sortable align="center"></el-table-column>
            <el-table-column prop="drugSpec" label="规格" sortable align="center"></el-table-column>
            <el-table-column prop="drugBrand.brandName" label="品牌" sortable align="center"></el-table-column>
            <el-table-column prop="drugUnitsConfig.unitName" label="单位" sortable align="center"></el-table-column>
            <el-table-column label="操作" width="150" align="center">
              <template slot-scope="scope" style="marginLeft:-25px">
                <el-button type="text" size="small" @click="openDrugDialog('edit',scope.row.id)">编辑</el-button>
                <span class="line">|</span>
                <el-button type="text" size="small" @click="del(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </section>
        <footer class="footer">
          <Pagination :pageConfig="pageConfig" @handleSizeChange="handleSizeChange" @handleChage="handleChage"></Pagination>
        </footer>
      </div>
		</main>
    <!-- 新增/修改供应商的弹窗 -->
    <addDrugDialog :drugDialog="drugDialog" @getTableList="getTableList"></addDrugDialog>
    <importExcelDialog :imExcelDiaog="imExcelDiaog"></importExcelDialog>
	</div>
</template>
<script>
import Buttons from '@/components/commons/buttons/Buttons'
import Pagination from '@/components/commons/Pagination'
import {MESSAGE_TABLE_STYLE,PAGE_SIZE,SYSTEM_HTTP_SUCCESS} from '@/constant'
import {deleteDrug,listDrug} from '@/api'
import drugType from '@/components/inventory/drugType'
import addDrugDialog from '@/components/inventory/addDrugDialog'
import importExcelDialog from '@/components/inventory/importExcelDialog'
export default {
	name: 'Goods',
	components: {drugType,addDrugDialog,importExcelDialog,Pagination,Buttons},
  data() {
		return {
			showQuery: false,
			tableel: false,
			state: 0,
			formSearch: {
				drugName: '',
        dgtId: ''
      },
      drugDialog: {
        drugDialogFla:false,
        drugDialogTitle:'',
        type: 'add',
        id: ''
      },
      imExcelDiaog: {
        isshow: false,
        modalHref: '',//导入模板下载地址
        uploadApi: 'drugs',//提交api
        dialogTitle: '导入物品',//dialog名称
        downloadName: '导入物品模板',//下载模板名称
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
    // this.getTableList();
  },
	methods: {
		getTableList() {
      this.tableLoading = true;
      let params = {page:this.pageConfig.currentPage,pageSize: this.pageConfig.pageSize};
			listDrug(Object.assign(params,this.formSearch)).then(res => {
        this.tableLoading = false;
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.tableList = res.data.data;
          this.pageConfig.total = res.data.totalNumber || 0;
        } else {
          this.tableList = [];
          this.pageConfig.total = 0;
        }
      });
    },
    openDrugDialog(type,id){
      let _this=this
      _this.drugDialog.drugDialogFla = true;
      _this.drugDialog.type = type;
      if(type == 'add'){
        _this.drugDialog.drugDialogTitle = '新增物品';
      }else{
        _this.drugDialog.drugDialogTitle = '修改物品';
        _this.drugDialog.id = id;
      }

    },
    //打开导入excel模态框
    showImExcelDiaog() {
      this.imExcelDiaog.isshow = true;
    },
    del(id) {
       this.$confirm("此操作将删除该物品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteDrug(id).then(res => {
          this.getTableList();
        })
      }).catch(() => {});
    },
    search() {
      this.pageConfig.currentPage = 1;
      this.getTableList();
    },
    drugTypeChange(id) {
      this.formSearch.dgtId = id;
      this.pageConfig.currentPage = 1;
      this.search();
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
    closeDialog() {
      this.$refs['form'].clearValidate();
			this.$refs['form'].resetFields();
    },
	}
}
</script>
<style lang="less" scoped>
  .main-content {
    display: flex;
  }
	.drug-types {
    width: 200px;
    min-width: 200px;
    height: 100%;
    overflow-y: auto;
    border-right: 1px solid #DFE7F0;
  }
  .table-content {
    flex-grow: 1;
    position: relative;
  }
  /deep/.el-menu {
    border-right: none 0;
  }
</style>
