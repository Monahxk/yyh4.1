<!--
 * @Descripttion: 当前库存
 * @version: v4.1
 * @Author: hzj
 * @Date: 2019-08-26 11:48:59
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-15 10:40:19
 -->
<template>
	<div class="wrapper">
		<main class="main-content">
      <div class="drug-types">
        <drugType  @getTableList="drugTypeChange" class="height100"></drugType>
      </div>
      <div class="table-content">
        <div class="query-box">
          <el-form :inline="true" :model="formSearch" @keyup.enter.native="search">
            <el-form-item label="">
              <el-input v-model="formSearch.nameOrNumber"  placeholder="物品名称/编号/拼音首字母" clearable></el-input>
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
            <el-form-item label="库存数量：">
              <el-radio  v-model="formSearch.isAll" label="1" class="radio-start">全部</el-radio>
              <el-radio  v-model="formSearch.isAll" label="0" class="radio-end">小于等于</el-radio>
              <el-input-number v-model="formSearch.quantity" class="input-number"></el-input-number>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="search_btn" @click="search">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <section class="table-box" :class="{'re-ren': showQuery}">
          <el-table
            highlight-current-row
            ref="table"
            :data="tableList"
             @expand-change="expand"
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
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-table 
                :style="{'font-size': tableStyleConfig.font}"
                :data="scope.row.batchList"
                :header-cell-style="{background:tableStyleConfig.headerCellStyle.background,color:tableStyleConfig.headerCellStyle.color}"
                class="table-expand"
                >
                  <el-table-column prop="batchNumber" label="批号" align="center"></el-table-column>
                  <el-table-column prop="effectiveTime" :formatter="formatterDateTOymd" label="有效期" align="center"></el-table-column>
                  <el-table-column prop="priceYuan" label="入库单价" :formatter="formatterMoney" align="center"></el-table-column>
                  <el-table-column prop="quantity" label="库存" align="center"></el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column prop="drug.drugCode" label="物品编码" min-width="100" :show-overflow-tooltip="true" sortable align="left"></el-table-column>
            <el-table-column prop="drug.drugName" label="物品名称" :show-overflow-tooltip="true" min-width="120" sortable align="center"></el-table-column>
            <el-table-column prop="quantity" label="库存" sortable align="center"></el-table-column>
            <el-table-column prop="wareHouseText" label="库房" :show-overflow-tooltip="true" sortable align="center"></el-table-column>
            <el-table-column prop="drug.drugIndicator" label="物品条码" min-width="100" sortable align="center"></el-table-column>
            <el-table-column prop="drug.model" label="型号" sortable align="center"></el-table-column>
            <el-table-column prop="drug.drugSpec" label="规格" sortable align="center"></el-table-column>
            <el-table-column prop="drug.drugBrand.brandName" label="品牌" sortable align="center"></el-table-column>
            <el-table-column prop="drug.drugUnitsConfig.unitName" label="单位" sortable align="center"></el-table-column>
            <el-table-column prop="quantity" label="库存总量" sortable min-width="100" align="center"></el-table-column>
            <el-table-column prop="guidePriceYuan" label="预售价" :formatter="formatterMoney" sortable min-width="100" align="right"></el-table-column>
            <el-table-column prop="amountYuan" label="金额" min-width="100" :formatter="formatterMoney" sortable align="right"></el-table-column>

            <el-table-column label="操作" fixed="right" width="150" align="left">
              <template slot-scope="scope" style="marginLeft:-25px">
                <el-button type="text" size="small" @click="showDetailById(scope.row)">详情</el-button>
                <span class="line">|</span>
                <el-button type="text" size="small" @click="editPrice(scope.row)">修改预售价</el-button>
              </template>
            </el-table-column>
          </el-table>
        </section>
        <footer class="footer">
          <Pagination :pageConfig="pageConfig" @handleSizeChange="handleSizeChange" @handleChage="handleChage"></Pagination>
        </footer>
      </div>
		</main>
    <currentInvDetailDialog :isShowDialog="isShowDialog"></currentInvDetailDialog>
    <editPriceDialog :isShowDialog="isShowDialog" @getTableList="getTableList"></editPriceDialog>
	</div>
</template>
<script>
import Pagination from '@/components/commons/Pagination'
import currentInvDetailDialog from './CurrentInvDetailDialog'
import editPriceDialog from './EditPriceDialog'
import {MESSAGE_TABLE_STYLE,PAGE_SIZE,SYSTEM_HTTP_SUCCESS} from '@/constant'
import {listCurrentInventory,getWareHouseAll,getDrugBatchlineitem} from '@/api'
import drugType from '@/components/inventory/drugType'
export default {
	name: 'currentInventory',
	components: {drugType,Pagination,currentInvDetailDialog,editPriceDialog},
  data() {
		return {
			showQuery: false,
			tableel: false,
      state: 0,
      wareHouseList: [],
			formSearch: {
        wareHouseId: '',
				drugTypeId: '',
        nameOrNumber: '',
        quantity: 0,
        isAll: '1',
      },
      isShowDialog: {
        isshow: false,
        id: '',
        drugName: '',
        editPrice: {
          isshow: false,
          id: '',
          salePrice: ''
        }
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
    getWareHouseAll().then(res => {
      if(res.data.code == SYSTEM_HTTP_SUCCESS) {
        this.wareHouseList = res.data.data;
      }
    })
  },
	methods: {
    //打开详情
    showDetailById(row){
      this.isShowDialog.isshow = true;
      this.isShowDialog.id = row.id;
      this.isShowDialog.drugName = row.drug.drugName;
    },
    editPrice(rowData) {
      this.isShowDialog.editPrice.id = rowData.id;
      this.isShowDialog.editPrice.salePrice = rowData.guidePriceYuan;
      this.isShowDialog.editPrice.isshow = true;
    },
		getTableList() {
      this.tableLoading = true;
      let params = {page:this.pageConfig.currentPage,pageSize: this.pageConfig.pageSize};
			listCurrentInventory(Object.assign(params,this.formSearch)).then(res => {
        this.tableLoading = false;
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          let list = res.data.data;
          list.map(item => {
            item.batchList = [];
          })
          this.tableList = list;
          this.pageConfig.total = res.data.totalNumber || 0;
        } else {
          this.tableList = [];
          this.pageConfig.total = 0;
        }
      });
    },
    search() {
      this.pageConfig.currentPage = 1;
      this.getTableList();
    },
    drugTypeChange(id) {
      this.formSearch.drugTypeId = id;
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
    expand(row) {
      if(row.batchList.length > 0) {
        return;
      }
      getDrugBatchlineitem({
        drugId: row.drug.id,
        wareHouseId: row.wareHouseId
      }).then(res => {
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          let barch = res.data.data;
          row.batchList = barch;
        }
      })
    }
	}
}
</script>
<style lang="less" scoped>
  .el-select {
    width: 110px !important;
  }
  .wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .main-content {
    position: relative;
  }
	.drug-types {
    width: 200px;
    min-width: 200px;
    height: 100%;
    overflow-y: auto;
    border-right: 1px solid #DFE7F0;
    position: absolute;
    left: 0;
    top: 0;
  }
  .table-content {
    margin-left: 200px;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    position: relative;
    .query-box {
      padding-top: 15px;
      text-align: right;
    }
    .table-box {
      position: relative;
    }
  }
  /deep/.el-menu {
    border-right: none 0;
  }
  .total-content {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 0 15px;
    .total-right {
      span {
        margin-left: 10px;
      }
    }
    .money {
      color: #568BFD;
    }
  }
  .el-menu-item {
    .item {
      height: 100%;
      display: flex;
      flex-direction: column;
      line-height: 20px;
      justify-content: center;
      &:hover,div:hover {
        background: none !important;
      }
    }
    &.is-active {
      background-color: #ecf5ff;
      color: #303133;
    }
  }
  .radio-end {
    margin-right: 0;
  }
  .radio-start {
    margin-right: 10px;
  }
</style>
