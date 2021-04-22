<!--
 * @Descripttion: 入库明细
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-17 14:18:43
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-14 15:55:33
 -->
<template>
	<div class="content">
		<div class="wrapper">
			<el-dialog
			title="确认入库"
			:visible.sync="dialog.isshow"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
			width="1100px"
			style="margin-top: 0;"
      @open="openDialog"
      class="dialog"
			>
        <header class="header" slot="title">
          <div class="title">查看明细</div>
          <div class="right">
            <el-button size="small" class="submit" v-if="dialog.status == 0" @click="jumpEdit">重新编辑</el-button>
          </div>
        </header>
        	<el-form class="data-form">
            <el-row >
              <el-col :span="10">
                <div class="text-item">
                  入库库房: {{dataForms.importInventoryRecord.wareHouseText}}
                </div>
              </el-col>
              <el-col :span="10" :push="4">
                <div class="text-item">
                  入库日期: {{dataForms.importInventoryRecord.applyDate}}
                </div>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="24">
                <div class="text-item">
                  备注:{{dataForms.importInventoryRecord.remark}}
                </div>
              </el-col>
            </el-row>
            <div class="table-box">
              <header class="nav">
                <div class="left">明细</div>
              </header>
              <div class="sum-box">
                <div class="g-type">种类：<span class="number">{{dataForms.importInventoryRecord.category}}</span></div>
                <div class="money">
                  <span>总数量：<i class="number">{{dataForms.importInventoryRecord.quantity}}</i></span>
                  <span class="sum-money">总金额：<i class="number">￥{{dataForms.importInventoryRecord.amountYuan}}</i></span>
                </div>
              </div>
              <div class="table-wrapper">
                <el-table
                  highlight-current-row
                  ref="table"
                  :data="dataForms.importInventoryItemDTOList"
                  style="font-size: 14px"
                  height="100%"
                  v-loading="tableLoading"
                  :default-expand-all="false"
                  :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
                >
                  <el-table-column type="expand" v-if="dialog.status == 1">
                    <template slot-scope="scope">
                      <el-table 
                      style="font-size: 14px"
                      :data="scope.row.importInventoryBatchList"
                      :header-cell-style="{background:'rgba(181,190,209,0.44)',color:'#000'}"
                      class="table-expand"
                      >
                        <el-table-column prop="batchNumber" label="批号" align="center"></el-table-column>
                        <el-table-column prop="effectiveTime" :formatter="formatterDateTOymd" label="有效期" align="center"></el-table-column>
                        <!-- <el-table-column prop="inventoryQuantity" label="库存" align="center"></el-table-column> -->
                        <el-table-column prop="quantity" label="入库数量" align="center"></el-table-column>
                        <el-table-column prop="priceYuan" label="入库单价" align="center"></el-table-column>
                        <el-table-column prop="amountYuan" label="总金额" align="center"></el-table-column>
                      </el-table>
                    </template>
                  </el-table-column>
                  <el-table-column prop="importInventoryRecordItem.drug.drugName" label="名称" align="center"></el-table-column>
                  <!-- <el-table-column prop="importInventoryRecordItem.inventoryQuantity" label="当前库存" align="center"></el-table-column> -->
                  <el-table-column prop="importInventoryRecordItem.drug.drugBrand.brandName" label="品牌" align="center"></el-table-column>
                  <el-table-column prop="importInventoryRecordItem.drug.drugSpec" label="规格" align="center"></el-table-column>
                  <el-table-column prop="importInventoryRecordItem.drug.drugUnitsConfig.unitName" label="单位" align="center"></el-table-column>
                  <el-table-column prop="importInventoryRecordItem.quantity" label="入库总数量" align="center"></el-table-column>

                </el-table>
              </div>
            </div>
        	</el-form>
			</el-dialog>
		</div>
	</div>
</template>
<script>
import Buttons from '@/components/commons/buttons/Buttons'
import {SYSTEM_HTTP_SUCCESS,TO_FIXED} from "@/constant"
import {getImportInventoryObj} from '@/api'
export default {
  name: 'DetailExportDialog',
	components: {
    Buttons
	},
	props: ['dialog'],
	data() {
		return {
      tableLoading: false,
      tableList: [],
      dataForms: {
        importInventoryRecord: {
          amountYuan: 0,
          category: 0,
          quantity: 0,
          remark: '',
          wareHouseId: '',
          wareHouseText: ''
        },
        importInventoryItemDTOList: [],
        amountYuan: 0
      },
		}
  },
  computed: {
  },
	methods: {
    openDialog() {
      this.tableLoading = true;
      getImportInventoryObj({id:this.dialog.id,status: this.dialog.status}).then(res => {
        this.tableLoading = false;
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          let {importInventoryRecord,importInventoryItemDTOList} = res.data.data;
          this.dataForms.importInventoryRecord = importInventoryRecord || {};
          this.dataForms.importInventoryItemDTOList = importInventoryItemDTOList;
        }
      }).catch(err =>{
        this.tableLoading = false;
      })
    },
    jumpEdit() {
      //跳转到编辑页
      this.dialog.isshow = false;
      this.$emit('edit',this.dialog.id);
    }
	}
}
</script>
<style lang="less" scoped>
	.wrapper {
    color: #1B1E25;
		/deep/.el-dialog__body {
      height: calc(100% - 61px);
      background: #FCFDFF;
      padding-top: 0;
		}
		/deep/.el-dialog {
			margin: 0 0 0 auto;
			height: 100%;
      margin-top: 0 !important;

      .header {
        display: flex;
        justify-content: space-between;
        line-height: 40px;
        .title {
          font-size: 16px;
        }

        .right {
          margin-right: 30px;
        }

        .submit {
          border-color: #3B78FD;
          color: #3B78FD;
        }
      }
 
      .table-box {
        height: calc(100% - 124px);
        background: #fff;
        border: 1px solid #DFE7F0;
        padding: 20px;

        .nav {
          display: flex;
          justify-content: space-between;
          height: 32px;
          line-height: 32px;
          margin-bottom: 20px;

          .left{
            font-weight:500;
            &::before {
              content: '';
              height: 14px;
              width: 0;
              border: 0;
              border-left: 5px solid #3B78FD;
              margin-right: 5px;
            }
          }
        }
        .sum-box {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;

          .number {
            color: #3B78FD;
          }

          .sum-money {
            margin-left: 10px;
          }
        }

        .table-wrapper {
          height: calc(100% - 75px);

          .el-table {
            height: 100% !important;
          }
        }
      }

      .el-form.data-form {
        height: 100%;
        padding-top: 15px;
        .el-input {
          width: 100%;
        }
        .text-item {
          padding: 10px 20px;
        }
      }

		}
	}
	
</style>

