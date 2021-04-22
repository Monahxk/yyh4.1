<!--
 * @Descripttion: 退货详情
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-19 18:13:43
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-14 10:45:41
 -->
<template>
	<div class="content">
		<div class="wrapper">
			<el-dialog
			:visible.sync="dialog.isshow"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
			width="1100px"
			style="margin-top: 0;"
      @open="openDialog"
      class="dialog"
			>
        <header class="header" slot="title">
          <div class="title">退货单详情</div>
        </header>
        	<el-form :model="dataForms"  ref="dataForms"  class="data-form">
            <div class="top-header">
              <el-row>
                <el-col :span="12">
                  库房：{{dataForms.wareHouseName}}
                </el-col>
                <el-col :span="12">
                  退货日期：{{dataForms.drugReturnRecord.applyDate}}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  备注：{{dataForms.drugReturnRecord.remark}}
                </el-col>
              </el-row>
            </div>
            <div class="table-box">
              <header class="nav">
                <div class="left">明细</div>
              </header>
              <div class="sum-box">
                <div class="g-type">种类：<span class="number">{{dataForms.drugReturnRecord.category}}</span></div>
                <div class="money">
                  <span>总数量：<i class="number">{{dataForms.drugReturnRecord.quantity}}</i></span>
                  <span class="sum-money">总金额：<i class="number">￥{{dataForms.drugReturnRecord.amountYuan}}</i></span>
                </div>
              </div>
              <div class="table-wrapper">
                <el-table
                  highlight-current-row
                  ref="table"
                  :data="dataForms.drugReturnRecordItemDTOList"
                  style="font-size: 14px"
                  height="100%"
                  v-loading="tableLoading"
                  :default-expand-all="false"
                  @expand-change="expand"
                  :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
                >
                  <el-table-column type="expand">
                    <template slot-scope="scope">
                      <el-table 
                      style="font-size: 14px"
                      :data="scope.row.batchList"
                      :header-cell-style="{background:'rgba(181,190,209,0.44)',color:'#000'}"
                      class="table-expand"
                      >
                        <el-table-column prop="batchNumber" label="批号" align="center"></el-table-column>
                        <el-table-column prop="effectiveTime" label="有效期" align="center"></el-table-column>
                        <!-- <el-table-column prop="curquantity" label="库存" align="center"></el-table-column> -->
                        <el-table-column prop="quantity" label="退货数量" align="center"></el-table-column>
                        <el-table-column prop="priceYuan" label="入库单价" align="center"></el-table-column>
                        <el-table-column prop="amountYuan" label="金额" align="center"></el-table-column>
                      </el-table>
                    </template>
                  </el-table-column>
                  <el-table-column prop="drugReturnRecordItem.drug.drugName" label="名称" align="center"></el-table-column>
                  <!-- <el-table-column prop="drugReturnRecordItem.curquantity" label="当前库存" align="center"></el-table-column> -->
                  <el-table-column prop="drugReturnRecordItem.drug.drugBrand.brandName" label="品牌" align="center"></el-table-column>
                  <el-table-column prop="drugReturnRecordItem.drug.drugSpec" label="规格" align="center"></el-table-column>
                  <el-table-column prop="drugReturnRecordItem.drug.drugUnitsConfig.unitName" label="单位" align="center"></el-table-column>
                  <el-table-column prop="" label="批号/有效期" align="center" >
                  <template slot-scope="scope" >
                    <span>添加</span>
                  </template>
                  </el-table-column>
                  <el-table-column prop="drugReturnRecordItem.quantity" label="退货数量" align="center"></el-table-column>
                  <el-table-column prop="drugReturnRecordItem.amountYuan" label="退货金额" align="center"></el-table-column>
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
import {getReturnRecorddetailById,getDrugBatchlineitem} from '@/api'
export default {
  name: 'ReturnDetial',
	components: {
    Buttons,
	},
	props: ['dialog'],
	data() {
		return {
      tableLoading: false,
      tableList: [],
      dataForms: {
        drugReturnRecord: {
          amountYuan: 0,
          category: 0,
          quantity: 0,
          remark: '',
          wareHouseId: '',
          applyDate: ''
        },
        drugReturnRecordItemDTOList: [],
        wareHouseName: ''
      },
		}
  },
  computed: {
  },
  mounted() {
  },
	methods: {
    expand(row, expandedRows) {
      if(row.batchList.length > 0) {
        return;
      }
      getDrugBatchlineitem({
        drugId: row.drugReturnRecordItem.drug.id,
        wareHouseId: this.dataForms.drugReturnRecord.wareHouseId
      }).then(res => {
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          let barch = res.data.data;
          barch.map(item=> {
            if(row.returnRecordBatchBatchList && row.returnRecordBatchBatchList.length > 0) {
              for(let a of row.returnRecordBatchBatchList) {
                if(item.id == a.drugBatchId) {
                  a.batchNumber = item.batchNumber;
                  a.curquantity = item.quantity;
                  a.priceYuan = item.priceYuan;
                }
              }
            } 
          })
          row.batchList = row.returnRecordBatchBatchList;
        }
      })
    },
    openDialog() {
      this.tableLoading = true;
      getReturnRecorddetailById(this.dialog.id).then(res => {
        this.tableLoading = false;
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          let {drugReturnRecord,drugReturnRecordItemDTOList,wareHouseName} = res.data.data;
          drugReturnRecordItemDTOList.map(item => {
            item.batchList = [];
          })
          this.dataForms.drugReturnRecordItemDTOList = drugReturnRecordItemDTOList;
          this.dataForms.drugReturnRecord = drugReturnRecord;
          this.dataForms.wareHouseName = wareHouseName;
        }
      }).catch(err =>{
        this.tableLoading = false;
      })
    },
	}
}
</script>
<style lang="less" scoped>
	.wrapper {
    color: #1B1E25;
		/deep/.el-dialog__body {
      background: #FCFDFF;
      padding-top: 0;
    }
    .top-header {
      padding: 0 24px;
      
      .el-row {
        margin-bottom: 15px;
      }
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
        height: calc(100% - 55px);
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

