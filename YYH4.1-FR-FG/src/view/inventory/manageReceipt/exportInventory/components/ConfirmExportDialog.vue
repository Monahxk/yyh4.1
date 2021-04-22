<!--
 * @Descripttion: 确认出库
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-17 14:18:43
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-12 17:47:09
 -->
<template>
	<div class="content">
		<div class="wrapper">
			<el-dialog
			title="确认出库"
			:visible.sync="dialog.isshow"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
			width="1100px"
			style="margin-top: 0;"
      @close="closeDialog"
      @open="openDialog"
      class="dialog"
			>
        <header class="header" slot="title">
          <div class="title">确认出库</div>
          <div class="right">
            <div v-show="dialog.type !== 'detail'">
              <Buttons :btncfg="{submit: true,text: '确认'}" @submitfn="submitfn"></Buttons>
            </div>
          </div>
        </header>
        	<el-form :model="dataForms" :rules="rules"  ref="dataForms"  class="data-form">
            <el-row >
              <el-col :span="10">
                <div class="text-item">
                  出库库房: {{dataForms.exportInventoryRecord.wareHouseText}}
                </div>
              </el-col>
              <el-col :span="10" :push="4">
                <div class="text-item">
                  出库日期: {{dataForms.exportInventoryRecord.applyDate}}
                </div>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="24">
                <div class="text-item">
                  备注:{{dataForms.exportInventoryRecord.remark}}
                </div>
              </el-col>
            </el-row>
            <div class="table-box">
              <header class="nav">
                <div class="left">明细</div>
              </header>
              <div class="sum-box">
                <div class="g-type">种类：<span class="number">{{dataForms.exportInventoryRecord.category}}</span></div>
                <div class="money">
                  <span>总数量：<i class="number">{{dataForms.exportInventoryRecord.quantity}}</i></span>
                  <span class="sum-money">总金额：<i class="number">￥{{dataForms.amountYuan}}</i></span>
                </div>
              </div>
              <div class="table-wrapper">
                <el-table
                  highlight-current-row
                  ref="table"
                  :data="dataForms.exportInventoryRecordItemList"
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
                        <el-table-column prop="effectiveTime" :formatter="formatterDateTOymd" label="有效期" align="center"></el-table-column>
                        <el-table-column prop="quantity" label="库存" align="center"></el-table-column>
                        <el-table-column  label="出库数量" align="center">
                          <template slot-scope="scope1">
                            <el-form-item :prop="'exportInventoryRecordItemList.' + scope.$index + '.batchList.' + scope1.$index + '.quantity'" :rules='rules.quantity'>
                              <el-input v-model.number="scope1.row.expQuantity" placeholder="请输入" @input="inputQuantity(scope.row,scope1.row)"></el-input>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column prop="priceYuan" label="出库单价" align="center"></el-table-column>
                        <el-table-column prop="amountYuan" label="总金额" align="center"></el-table-column>
                      </el-table>
                    </template>
                  </el-table-column>
                  <el-table-column prop="drug.drugName" label="名称" align="center"></el-table-column>
                  <el-table-column prop="inventoryQuantity" label="当前库存" align="center"></el-table-column>
                  <el-table-column prop="drug.drugBrand.brandName" label="品牌" align="center"></el-table-column>
                  <el-table-column prop="drug.drugSpec" label="规格" align="center"></el-table-column>
                  <el-table-column prop="drug.drugUnitsConfig.unitName" label="单位" align="center"></el-table-column>
                  <el-table-column prop="" label="批号/有效期" align="center" >
                  <template slot-scope="scope" >
                    <span>添加</span>
                  </template>
                  </el-table-column>
                  <el-table-column prop="quantity" label="出库总数量" align="center"></el-table-column>

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
import {getExportInventoryDetailById,getDrugBatchlineitem,saveConfirmExport} from '@/api'
export default {
  name: 'ConfirmExportDialog',
	components: {
    Buttons
	},
	props: ['dialog'],
	data() {
		return {
      disabled: false,
      showBatch: false,
      tableLoading: false,
      isOpenDialog: {
				drug: false,
				isshowDddDrug: true,
				type: 'import'
			},
      tableList: [],
      dataForms: {
        exportInventoryRecord: {
          amountYuan: 0,
          category: 0,
          quantity: 0,
          remark: '',
          wareHouseId: '',
          wareHouseText: ''
        },
        exportInventoryRecordItemList: [],
        amountYuan: 0
      },
      rules: {
        'batchNumber': [
          { required: true, message: '请输入批号', trigger: 'blur' },
        ],
        effectiveTime: [
          { required: true, message: '请选择有效期', trigger: 'change' },
        ],
        quantity: [
          { required: true, message: '请输入数量', trigger: 'change' },
        ],
        priceYuan: [
          { required: true, message: '请输入价格', trigger: 'change' },
        ]
      },
      wareHouseList: [],
      drugProviderList: []
		}
  },
  computed: {
  },
	methods: {
    submitfn() {
      this.$refs['dataForms'].validate((valid) => {
        if (valid) {
          let isgo = true;
          let map = {
            amountYuan: this.dataForms.amountYuan,
            exportInventoryRecordId: this.dialog.id,
            exportInventorItemAndBatchDTOList: []
          }
          this.dataForms.exportInventoryRecordItemList.map((item => {
            let obj = {
              exportInventoryBatchList: [],
              exportInventoryItemId: item.id,
              amountYuan: 0,
              quantity: item.quantity
            }
            let batch = item.batchList;
            let price = 0,quantity = 0;
            for(let b of batch) {
              if(!b.expQuantity) {
                continue;
              }
              let map = {
                drugBatchId: b.id,
                quantity: b.expQuantity,
                amountYuan: b.amountYuan,
                // priceYuan: b.priceYuan
              }
              obj.exportInventoryBatchList.push(map);
              price += Number(b.amountYuan);
              quantity += b.expQuantity;
            }
            obj.amountYuan = price;
            if(quantity != item.quantity) {
              //批号的出库总量和总出库数量不相等
              isgo = false;
            }
            map.exportInventorItemAndBatchDTOList.push(obj);
          }))
          if(!isgo) {
            this.$message({
              message: '出库数量和不等于总出库数量',
              type: 'error'
            });
            return
          }
          console.log(JSON.stringify(map))
          saveConfirmExport(map).then(res => {
            if(res.data.code == SYSTEM_HTTP_SUCCESS) {
              this.$emit('search');
              this.dialog.isshow = false;
            }
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    inputPriceYuan(row,batchrow) {
      batchrow.priceYuan = batchrow.priceYuan.replace(/^\./g,'').replace(/[^\d\.]/g,'').replace(/(\d)(\.)(\d{3,})/g,'$1$2');
      this.sumtotale(row,batchrow);
    },
    inputQuantity(row,batchrow) {
      batchrow.amountYuan = ((Number(batchrow.expQuantity) || 0) * (batchrow.priceYuan || 0)).toFixed(TO_FIXED);;
      this.sumtotale(row,batchrow);
    },
    sumtotale(row,batchrow) {
      let sumNumber = 0;
      row.batchList.map(item => {
        sumNumber += (Number(item.expQuantity) || 0)
      })
      if(sumNumber > Number(row.quantity)) {
        batchrow.amountYuan = 0;
        batchrow.expQuantity = 0;
        this.$message({
					message: '出库数量和大于总出库数量',
					type: 'error'
				});
      } else if(sumNumber < Number(row.quantity)) {
        this.$message({
					message: '出库数量和小于总出库数量',
					type: 'error'
				});
      }
      let amountYuan = 0;
      this.dataForms.exportInventoryRecordItemList.map((item => {
        for(let d of item.batchList) {
            amountYuan += Number(d.amountYuan);
        }
      }))
      this.dataForms.amountYuan = amountYuan.toFixed(TO_FIXED);
    },
    expand(row, expandedRows) {
      console.log(row, expandedRows)
      if(row.batchList.length > 0) {
        return;
      }
      getDrugBatchlineitem({
        drugId: row.drug.id,
        wareHouseId: this.dataForms.exportInventoryRecord.wareHouseId
      }).then(res => {
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          let barch = res.data.data;
          barch.map(item=> {
            item.expQuantity = null;
            item.amountYuan = '';
            // item.priceYuan = row.priceYuan;
          })
          row.batchList = barch;
        }
      })
    },
    closeDialog() {
			this.$refs['dataForms'].clearValidate();
			this.$refs['dataForms'].resetFields();
			this.dialog.show = false;
      this.dataForms.exportInventoryRecordItemList = [];
      this.dataForms.exportInventoryRecord.category = 0;
      this.dataForms.exportInventoryRecord.amountYuan = 0;
      this.dataForms.exportInventoryRecord.quantity = 0;
    },
    openDialog() {
      this.tableLoading = true;
      let timestamp = new Date().getTime();
      getExportInventoryDetailById(this.dialog.id).then(res => {
        this.tableLoading = false;
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          let {exportInventoryRecord,exportInventoryRecordItemList} = res.data.data;
          this.dataForms.exportInventoryRecord = exportInventoryRecord || {};
          exportInventoryRecordItemList.map(item => {
            item.batchList = [];
          })
          this.dataForms.exportInventoryRecordItemList = exportInventoryRecordItemList;
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
      height: 100%;
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

