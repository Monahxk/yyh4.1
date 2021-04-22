<!--
 * @Descripttion: 新增，修改采购单
 * @version: 
 * @Author: hzj
 * @Date: 2019-08-13 14:02:21
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-14 18:22:31
 -->
<template>
	<div class="content">
		<div class="wrapper">
			<el-dialog
			title="选择物品"
			:visible.sync="dialog.isshow"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
			width="1000px"
			style="margin-top: 0;"
      @close="closeDialog"
      @open="openDialog"
      class="dialog"
			> 
        <header class="header" slot="title">
          <div class="title">{{getTitle}}</div>
          <div class="right">
            <div v-show="dialog.type == 'detail'">
              <el-button size="small" class="submit" v-if="dialog.status == 2 || dialog.status == 4" @click="dialog.type='edit'">重新编辑</el-button>
              <!-- <el-button size="small" type="text">查看审批</el-button> -->
            </div>
            <div v-show="dialog.type !== 'detail'">
              <Buttons :btncfg="{submit: true,text: '提交'}" @submitfn="submitfn"></Buttons>
            </div>
          </div>
        </header>
        	<el-form :model="dataForms"  ref="dataForms" :rules="rules"  class="data-form">
            <el-row >
              <el-col :span="10">
                <el-form-item label="库房" prop="drugPurchase.wareHouseId" label-width="100px">
                  <el-select v-model="dataForms.drugPurchase.wareHouseId" :disabled="disabled" placeholder="请选择">
                    <el-option
                    v-for="item in wareHouseList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10" :push="4">
                <el-form-item label="供应商" prop="drugPurchase.drugProviderId" label-width="110px">
                  <el-select v-model="dataForms.drugPurchase.drugProviderId" :disabled="disabled"  placeholder="请选择">
                    <el-option
                    v-for="item in drugProviderList"
                    :key="item.id"
                    :label="item.suppliersName"
                    :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="10">
                <el-form-item label="采购日期" prop="drugPurchase.purchaseDate" label-width="100px">
                  <el-input v-model="dataForms.drugPurchase.purchaseDate" readonly></el-input>
                  <!-- <el-date-picker type="date" 
                  v-model="dataForms.drugPurchase.purchaseDate" 
                  placeholder="选择日期" 
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :disabled="disabled">
                  </el-date-picker> -->
                </el-form-item>
              </el-col>
              <el-col :span="10" :push="4">
                <el-form-item label="计划到货日期" prop="drugPurchase.arrivalDate" label-width="110px">
                  <el-date-picker type="date" 
                  v-model="dataForms.drugPurchase.arrivalDate" 
                  placeholder="选择日期" 
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :disabled="disabled">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="24">
                <el-form-item label="备注" label-width="100px" prop="drugPurchase.remark">
                  <el-input v-model="dataForms.drugPurchase.remark" clearable :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="table-box">
              <header class="nav">
                <div class="left">明细</div>
                <div class="right" v-show="dialog.type !== 'detail'">
                  <el-button type="primary" size="small" @click="selectDrug">选择物品</el-button>
                </div>
              </header>
              <div class="sum-box">
                <div class="g-type">种类：<span class="number">{{dataForms.drugPurchaseItemList.length}}</span></div>
                <div class="money">
                  <span>总数量：<i class="number">{{dataForms.drugPurchase.quantity}}</i></span>
                  <span class="sum-money">总金额：<i class="number">￥{{dataForms.drugPurchase.amountYuan}}</i></span>
                </div>
              </div>
              <div class="table-wrapper">
                <el-table
                  highlight-current-row
                  ref="table"
                  :data="dataForms.drugPurchaseItemList"
                  style="font-size: 14px"
                  height="100%"
                  :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
                >
                  <el-table-column prop="drug.drugName" label="名称" align="center" width="150"></el-table-column>
                  <!-- <el-table-column prop="surplusNumber" label="当前库存" align="center"></el-table-column> -->
                  <el-table-column prop="drug.drugBrand.brandName" label="品牌" align="center"></el-table-column>
                  <el-table-column prop="drug.drugSpec" label="规格" align="center"></el-table-column>
                  <el-table-column prop="drug.drugUnitsConfig.unitName" label="单位" align="center"></el-table-column>
                  <el-table-column prop="planQuantity" label="计划数量" align="center">
                    <template slot-scope="scope">
                      <el-form-item :prop="'drugPurchaseItemList.' + scope.$index + '.planQuantity'" :rules='rules.planQuantity' >
                        <el-input v-model="scope.row.planQuantity" @input="inputPlanQuantity(scope.row)" :disabled="disabled" placeholder="请输入"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="planPriceYuan" label="计划单价" align="center">
                    <template slot-scope="scope">
                      <el-form-item :prop="'drugPurchaseItemList.' + scope.$index + '.planPriceYuan'" :rules='rules.planPriceYuan' >
                        <el-input v-model="scope.row.planPriceYuan" @input="inputPriceYuan(scope.row)" :disabled="disabled" placeholder="请输入"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="amountYuan" label="金额" align="center"> </el-table-column>

                  <el-table-column label="操作" align="center" v-if="!disabled">
                    <template slot-scope="scope" style="marginLeft:-25px">
                      <el-button type="text" size="small" @click="delRow(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
        	</el-form>
			</el-dialog>
		</div>
    <selectDrugDialog :isOpenDialog="isOpenDialog" @pushTableList="pushTableList"></selectDrugDialog>
	</div>
</template>
<script>
import Buttons from '@/components/commons/buttons/Buttons'
import selectDrugDialog from '@/components/inventory/selectDrugDialog'
import {SYSTEM_HTTP_SUCCESS,TO_FIXED} from "@/constant"
import {saveDrugpurchase,updateDrugpurchase,getDrugpurchasedo} from '@/api'
export default {
  name: 'AddPurchaseOrder',
	components: {
    selectDrugDialog,
    Buttons
	},
  props: ['dialog'],
	data() {
		return {
      isOpenDialog: {
				drug: false,
				isshowDddDrug: true,
        type: 'in',
        wareHouseId: ''
      },
      drugProviderList: [],
      wareHouseList: [],
      tableList: [],
      disabled: false,
      dataForms: {
        drugPurchase: {
          id: '',
          amountYuan: 0,
          arrivalDate: '',
          purchaseDate: '',
          drugProviderId: '',
          wareHouseId: '',
          category: 0,
          quantity: 0,
          remark: ''
        },
        drugPurchaseItemList: [],
      },
      rules: {
        'drugPurchase.purchaseDate': [
          { required: true, message: '请选择采购日期', trigger: 'change' },
        ],
        'drugPurchase.arrivalDate': [
          { required: true, message: '请选择计划到货日期', trigger: 'change' },
        ],
        'drugPurchase.wareHouseId': [
          { required: true, message: '请选择库房', trigger: 'change' },
        ],
        'drugPurchase.drugProviderId': [
          { required: true, message: '请选择供应商', trigger: 'change' },
        ],
        planQuantity: [
          { required: true, message: '请输入计划数量', trigger: 'change' },
        ],
        planPriceYuan: [
          { required: true, message: '请输入计划单价', trigger: 'change' },
        ]
          
      }
		}
  },
  computed: {
    getTitle() {
      if(this.dialog.type === 'add') {
        this.disabled = false;
        return '新增采购单'
      } else if (this.dialog.type === 'edit') {
        this.disabled = false;
        return '编辑采购单'
      } else {
        this.disabled = true;
        return '采购单明细'
      }
    }
  },
  mounted() {
    let date = new Date();
    this.dataForms.drugPurchase.purchaseDate = util.timestampToTime(date);
  },
	methods: {
    submitfn() {
      this.$refs['dataForms'].validate((valid) => {
        if (valid) {
          if(this.dataForms.drugPurchaseItemList.length == 0) {
            this.$message({
              message: '请填写采购明细',
              type: 'error'
            });
            return;
          }
          if(this.dialog.type == 'add' || this.dialog.type == 'edit') {
            this.dataForms.drugPurchase.category = this.dataForms.drugPurchaseItemList.length;
            this.dataForms.drugPurchase.id = '';
            this.dataForms.drugPurchaseItemList.map((item => {
              item.id = '';
            }))
            saveDrugpurchase(this.dataForms).then(res => {
              if(res.data.code == SYSTEM_HTTP_SUCCESS) {
                this.$emit('search');
                this.dialog.isshow = false;
              }
            });
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
		selectDrug() {
      if(!this.dataForms.drugPurchase.wareHouseId) {
        this.$message({
					message: '请选择库房',
					type: 'warning'
        });
        return;
      }
      this.isOpenDialog.wareHouseId = this.dataForms.drugPurchase.wareHouseId;
      this.isOpenDialog.drug = true;
    },
    //添加入库数据
		pushTableList(rowData) {
			let ishas = this.dataForms.drugPurchaseItemList.find(function(value,index,arr){
		　　　　return value.drug.id == rowData.drug.id;
		　　});
			if(ishas) {
				this.$message({
					message: '已存在',
					type: 'warning'
				});
			} else {

        let data = {
          id: '',
          amountYuan: 0,
          planQuantity: '',
          planPriceYuan: '',
          surplusNumber: rowData.quantity || 0,
          drug: {
            id: rowData.drug.id,
            drugName: rowData.drug.drugName,
            drugBrand: {
              brandName: rowData.drug.drugBrand?rowData.drug.drugBrand.brandName: '',
            },
            drugSpec: rowData.drug.drugSpec,
            drugUnitsConfig: {
              unitName: rowData.drug.drugUnitsConfig?rowData.drug.drugUnitsConfig.unitName:'',
            }
          }

        }
				this.dataForms.drugPurchaseItemList.push(data);
				this.$message({
					message: '添加成功',
					type: 'success'
				});
			}
		},
		//删除行
		delRow(index) {
			this.dataForms.drugPurchaseItemList.splice(index,1);
			this.sumtotale();
    },
    closeDialog() {
			this.$refs['dataForms'].clearValidate();
			this.$refs['dataForms'].resetFields();
			this.dialog.show = false;
			this.dataForms.drugPurchaseItemList = [];
			this.dataForms.drugPurchase.amountYuan = 0;
			this.dataForms.drugPurchase.quantity = 0;
    },
    openDialog() {
      getDrugpurchasedo(this.dialog.id).then(res => {
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          let {wareHouseList,drugProviderList,drugPurchase,drugPurchaseItemList} = res.data.data;
          this.wareHouseList = wareHouseList || [];
          this.drugProviderList = drugProviderList || [];
          drugPurchase ? this.dataForms.drugPurchase = drugPurchase : '';
          drugPurchaseItemList? this.dataForms.drugPurchaseItemList = drugPurchaseItemList : '';
        }
      })
    },
    inputPlanQuantity(row) {
      row.planQuantity = row.planQuantity.replace(/\D|(^0)/g,'');
      this.sumRowMoney(row);
    },
    inputPriceYuan(row) {
      row.planPriceYuan = row.planPriceYuan.replace(/^\./g,'').replace(/[^\d\.]/g,'').replace(/(\d)(\.)(\d{3,})/g,'$1$2');
      this.sumRowMoney(row);
    },
    sumRowMoney(row) {
      let n = Number(row.planQuantity) || 0;
      let m = Number(row.planPriceYuan) || 0;
      row.amountYuan = (n * m).toFixed(TO_FIXED);
      this.sumtotale();
    },
    sumtotale() {
      let sumNumber = 0, sumMoney = 0;
      this.dataForms.drugPurchaseItemList.map((v) => {
         let n = Number(v.planQuantity) || 0;
         let m = Number(v.amountYuan) || 0;
         sumNumber += n;
         sumMoney  += m;
      });
      this.dataForms.drugPurchase.quantity = sumNumber;
      this.dataForms.drugPurchase.amountYuan = sumMoney.toFixed(TO_FIXED);
    },
	}
}
</script>
<style lang="less" scoped>
	.wrapper {
    color: #1B1E25;
		/deep/.el-dialog__body {
      height: calc(100% - 61px);
      background: #FCFDFF;
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
        height: calc(100% - 186px);
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
      }

		}
	}
	
</style>

