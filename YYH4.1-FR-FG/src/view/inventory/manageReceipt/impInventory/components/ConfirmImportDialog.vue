<!--
 * @Descripttion: 确认入库单
 * @version: v4.1
 * @Author: hzj
 * @Date: 2019-08-28 17:10:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-11 18:47:13
 -->
<template>
	<div class="content">
		<div class="wrapper">
			<el-dialog
			title="确认入库单"
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
          <div class="title">确认入库单</div>
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
                  入库库房: {{dataForms.importInventoryRecord.wareHouseText}}
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
                  <span class="sum-money">总金额：<i class="number">￥{{dataForms.amountYuan}}</i></span>
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
                  :default-expand-all="true"
                  :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
                >
                  <el-table-column type="expand">
                    <template slot-scope="scope">
                      <el-table 
                      style="font-size: 14px"
                      :data="scope.row.importInventoryBatchList"
                      :header-cell-style="{background:'rgba(181,190,209,0.44)',color:'#000'}"
                      class="table-expand"
                      >
                        <el-table-column prop="batchNumber" label="批号" align="center">
                          <template slot-scope="scope1">
                            <el-form-item :prop="'importInventoryItemDTOList.' + scope.$index + '.importInventoryBatchList.' + scope1.$index + '.batchNumber' " :rules='rules.batchNumber'>
                              <el-input v-model="scope1.row.batchNumber" placeholder="请输入"></el-input>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column prop="effectiveTime" label="有效期" align="center">
                          <template slot-scope="scope1">
                            <el-form-item :prop="'importInventoryItemDTOList.' + scope.$index + '.importInventoryBatchList.' + scope1.$index + '.effectiveTime' " :rules='rules.effectiveTime'>
                              <el-date-picker
                                v-model="scope1.row.effectiveTime"
                                type="date"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择日期">
                              </el-date-picker>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column prop="quantity" label="入库数量" align="center">
                          <template slot-scope="scope1">
                            <el-form-item :prop="'importInventoryItemDTOList.' + scope.$index + '.importInventoryBatchList.' + scope1.$index + '.quantity'" :rules='rules.quantity'>
                              <el-input v-model.number="scope1.row.quantity" placeholder="请输入" @input="inputQuantity(scope.row,scope1.row)"></el-input>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column prop="priceYuan" label="入库单价" align="center">
                          <template slot-scope="scope1">
                            <el-form-item :prop="'importInventoryItemDTOList.' + scope.$index + '.importInventoryBatchList.' + scope1.$index + '.priceYuan'" :rules='rules.priceYuan'>
                              <el-input v-model="scope1.row.priceYuan" placeholder="请输入" @input="inputPriceYuan(scope.row,scope1.row)"></el-input>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column prop="amountYuan" label="金额" align="center"></el-table-column>
                        <el-table-column label="操作" width="80" align="center">
                          <template slot-scope="scope1" style="marginLeft:-25px">
                            <el-button type="text" size="small" v-if="scope1.$index == 0" @click="addRow(scope.row.importInventoryBatchList,scope.$index)">添加</el-button>
                            <el-button type="text" size="small" v-else @click="delRow(scope.row.importInventoryBatchList,scope1.$index)">删除</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </template>
                  </el-table-column>
                  <el-table-column prop="importInventoryRecordItem.drug.drugName" label="名称" align="center"></el-table-column>
                  <el-table-column prop="importInventoryRecordItem.drug.drugBrand.brandName" label="品牌" align="center"></el-table-column>
                  <el-table-column prop="importInventoryRecordItem.drug.drugSpec" label="规格" align="center"></el-table-column>
                  <el-table-column prop="importInventoryRecordItem.drug.drugUnitsConfig.unitName" label="单位" align="center"></el-table-column>
                  <el-table-column prop="importInventoryRecordItem.drugProviderId" label="供应商" width="150" align="center"></el-table-column>
                  <el-table-column prop="" label="批号/有效期" align="center" >
                  <template slot-scope="scope" >
                    <span>添加</span>
                  </template>
                  </el-table-column>
									<el-table-column prop="importInventoryRecordItem.quantity" label="入库总数量" align="center"></el-table-column>
                  <el-table-column prop="importInventoryRecordItem.amountYuan" label="金额" align="center"></el-table-column>

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
import {getImportInventoryObj,saveImportInventoryConfirm} from '@/api'
export default {
  name: 'ConfirmImportDialog',
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
      rules: {
        'batchNumber': [
          { required: false, message: '请输入批号', trigger: 'blur' },
        ],
        effectiveTime: [
          { required: false, message: '请选择有效期', trigger: 'change' },
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

          let data = {
            amountYuan: this.dataForms.amountYuan,
            importInventoryId: this.dialog.id,
            importInventoryBatchDTOList: []
          };
          let isgo = true;
          this.dataForms.importInventoryItemDTOList.map((item => {
            let batch = item.importInventoryBatchList;
            let map = {
              amountYuan: item.importInventoryRecordItem.amountYuan,
              importInventoryItemId: item.importInventoryRecordItem.id,
              importInventoryBatchList: []
            }
            let quantity = 0;
            for(let b of batch) {
              let bmap = {
                importInventoryItemId: item.importInventoryRecordItem.id,
                amountYuan: b.amountYuan,
                batchNumber: b.batchNumber,
                effectiveTime: b.effectiveTime,
                priceYuan: b.priceYuan,
                quantity: b.quantity
              }
              map.importInventoryBatchList.push(bmap);
              quantity += b.quantity - 0;
            }
            if(quantity != (item.importInventoryRecordItem.quantity -0)) {
              isgo = false;
            }
            data.importInventoryBatchDTOList.push(map)
          }))
          if(!isgo) {
            this.$message({
              message: '入库数量和小于总入库数量',
              type: 'error'
            });
            return;
          }
          // console.log(JSON.stringify(data))
          saveImportInventoryConfirm(data).then(res => {
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
    addRow(importInventoryBatchList,index) {
      console.log(importInventoryBatchList,index)
      importInventoryBatchList.push(
        {
          batchNumber: '',
          effectiveTime: '',
          priceYuan: '',
          quantity: '',
          amountYuan: 0,

        }
      )
    },
		//删除行
		delRow(importInventoryBatchList,index) {
      importInventoryBatchList.splice(index,1);
    },
    inputPriceYuan(row,batchrow) {
      batchrow.priceYuan = batchrow.priceYuan.replace(/^\./g,'').replace(/[^\d\.]/g,'').replace(/(\d)(\.)(\d{3,})/g,'$1$2');
      this.sumtotale(row,batchrow);
    },
    inputQuantity(row,batchrow) {
      this.sumtotale(row,batchrow);
    },
    sumtotale(row,batchrow) {
      let sumNumber = 0,rowamountYuan = 0;
      row.importInventoryBatchList.map((v) => {
         let n = Number(v.quantity) || 0;
         sumNumber += n;
         rowamountYuan += Number(v.amountYuan);
      });
      if(sumNumber > Number(row.importInventoryRecordItem.quantity)) {
        batchrow.amountYuan = 0;
        batchrow.quantity = 0;
        this.$message({
					message: '入库数量和大于总入库数量',
					type: 'error'
				});
      } else {
        let quantity = Number(batchrow.quantity) || 0;
        let priceYuan = Number(batchrow.priceYuan) || 0;
        batchrow.amountYuan = (quantity * priceYuan).toFixed(TO_FIXED);
        rowamountYuan += Number(batchrow.amountYuan);
      }
      row.importInventoryRecordItem.amountYuan = rowamountYuan.toFixed(TO_FIXED);;
      let amountYuan = 0;
      this.dataForms.importInventoryItemDTOList.map((item => {
        for(let d of item.importInventoryBatchList) {
            amountYuan += Number(d.amountYuan);
        }
      }))
      this.dataForms.amountYuan = amountYuan.toFixed(TO_FIXED);
    },
    closeDialog() {
			this.$refs['dataForms'].clearValidate();
			this.$refs['dataForms'].resetFields();
			this.dialog.show = false;
			this.dataForms.importInventoryItemDTOList = [];
    },
    openDialog() {
      this.tableLoading = true;
      let timestamp = new Date().getTime();
      getImportInventoryObj({id:this.dialog.id,status: this.dialog.status}).then(res => {
        this.tableLoading = false;
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          let {importInventoryItemDTOList,importInventoryRecord} = res.data.data;
          if(importInventoryItemDTOList && Array.isArray(importInventoryItemDTOList)) {
            for(let item of importInventoryItemDTOList) {
              if(!item.importInventoryBatchList || item.importInventoryBatchList.length == 0) {
                item.importInventoryBatchList = [
                  {
                    batchNumber: '',
                    effectiveTime: '',
                    priceYuan: '',
                    quantity: '',
                    amountYuan: 0,

                  }
                ]
              }
            }
          }
          this.dataForms.importInventoryItemDTOList = importInventoryItemDTOList || [];
          this.dataForms.importInventoryRecord = importInventoryRecord;
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

