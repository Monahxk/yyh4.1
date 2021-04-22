<!--
 * @Descripttion: 新增修改日常收支
 * @version: v4.1
 * @Author: hzj
 * @Date: 2019-08-29 13:53:05
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-01 09:31:08
 -->
<template>
  <div>
    <el-dialog :title="title" 
    :visible.sync="dialog.isshow" 
    width="420px" 
    :close-on-click-modal="false" 
    :close-on-press-escape="false" 
    @close="closeDialog"
    @open="openDialog"
    center
    class="dialog"
    id="dialog">
      <div class="main">
        <base-tabs ref="active" v-model="navChecked" :value="navChecked" @on-click="getParentIndex">
          <base-pane label="日常收入" ></base-pane>
          <base-pane label="日常支出"></base-pane>
          <base-pane label="转账"></base-pane>
        </base-tabs>
        <el-form ref="form" :model="formData" :rules="rules" label-width="80px" class="data-form" v-if="this.navChecked != 2">
          <el-form-item :label="typeLabel" prop="dailyIncomeOutType.id" 
          v-if="formData.dailyIncomeOutType.id != 11 && formData.dailyIncomeOutType.id != 12">
            <el-select v-model="formData.dailyIncomeOutType.id" placeholder="请选择收">
              <el-option
                v-for="(item, index) in options.typeList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="payLabel" prop="payWay.id">
            <el-select v-model="formData.payWay.id" placeholder="请选择"  >
              <el-option
                v-for="(item, index) in options.payWayList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="金额" prop="amountMoneyYuan">
            <el-input v-model="formData.amountMoneyYuan"></el-input>
          </el-form-item>
          <el-form-item label="交易日期" prop="incomeTime">
            <el-date-picker
              v-model="formData.incomeTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
              :clearable="false"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="经办人" prop="employee.id">
            <el-select v-model="formData.employee.id" placeholder="请选择"  >
              <el-option
                v-for="(item, index) in options.employeeList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="description">
            <el-input v-model="formData.description" ></el-input>
          </el-form-item>
        </el-form>

        <!-- 转账form -->
        <el-form ref="transferForm" :model="transferForm" :rules="transferFormRules" label-width="80px" class="data-form" v-if="this.navChecked == 2">
          <el-form-item label="转出账户" prop="payWayOutId">
            <el-select v-model="transferForm.payWayOutId" placeholder="请选择收"  >
              <el-option
                v-for="(item, index) in options.payWayList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="转入账户" prop="payWayInId">
            <el-select v-model="transferForm.payWayInId" placeholder="请选择"  >
              <el-option
                v-for="(item, index) in options.payWayList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="金额" prop="amountMoney">
            <el-input v-model="transferForm.amountMoney" ></el-input>
          </el-form-item>
          <el-form-item label="交易日期" prop="incomeTime">
            <el-date-picker
              v-model="transferForm.incomeTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
              :clearable="false"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="经办人" prop="employeeId">
            <el-select v-model="transferForm.employeeId" placeholder="请选择"  >
              <el-option
                v-for="(item, index) in options.employeeList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="description">
            <el-input v-model="transferForm.description" ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitfn" :loading="loading">确 定</el-button>
        <el-button @click="dialog.isshow = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {getDailyincomeoutdo, updateDailyincomeout, saveDailyincomeout,postTransfer,getDailyMsgt} from '@/api'
import {SYSTEM_HTTP_SUCCESS} from '@/constant'
export default {
  name: 'AddInAnOurDialog',
  components: {
  },
  props: ['dialog'],
  data() {
    var dailyIncomeOutType = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(`请选择${this.typeLabel}`));
      } else {
        callback();
      }
    };
    var payWay = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(`请选择${this.payLabel}`));
      } else {
        callback();
      }
    };
    var isMoney = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(`请输入金额`));
      } else if(!util.isMoney(value)) {
        callback(new Error(`请输入正确金额`));
      }else {
        callback();
      }
    };
    return {
      title: '新增日常收支',
      navChecked: 0,
      loading: false,
      optionsDataList: [],
      formData: { //日常收入，支出
        id: '',
        amountMoneyYuan: '',
        description: '',
        incomePhoto: '',
        incomeTime: '',
        type: '1',
        dailyIncomeOutType: {
          id: '',
          name: '',
        },
        employee: {
          id: ''
        },
        payWay: {
          id: '',
          name: ''
        }
      },
      transferForm: { //转账
        amountMoney: '',
        description: '',
        employeeId: '',
        payWayInId: '',
        payWayOutId: '',
        photo: '',
        incomeTime: ''
      },
      transferFormRules: {
        amountMoney:[
          { required: true, validator: isMoney, trigger: 'blur'},
        ],
        'employeeId': [
          { required: true, message: '请选择经办人', trigger: 'change' },
        ],
        'payWayOutId': [
          { required: true,message: '请选择转出账户', trigger: 'change' }
        ],
        'payWayInId': [
          { required: true, message: '请选择转入账户', trigger: 'change' }
        ],
        'incomeTime': [
          { required: true, message: '请选择交易日期', trigger: 'blur' }
        ]
      },
      rules: {
        amountMoneyYuan:[
          { required: true, validator: isMoney, trigger: 'blur'},
        ],
        'employee.id': [
          { required: true, message: '请选择经办人', trigger: 'change' },
        ],
        'dailyIncomeOutType.id': [
          { required: true,validator: dailyIncomeOutType, trigger: 'change' }
        ],
        'payWay.id': [
          { required: true, validator: payWay, trigger: 'change' }
        ],
        'incomeTime': [
          { required: true, message: '请选择交易日期', trigger: 'blur' }
        ]
      },
      options: {
        employeeList: [],
        payWayList: [],
        dailyIncomeTypeList: [],
        dailyOutTypeList: [],
        typeList: []
      },
      typeLabel: '收入类别',
      payLabel: '收入方式'
    }
  },
  mounted() {
    getDailyincomeoutdo().then(res => {
      if(res.data.code == SYSTEM_HTTP_SUCCESS) {
        this.options = Object.assign({typeList: []},res.data.data);
        this.options.typeList = this.options.dailyIncomeTypeList;
      }
    })
  },
  methods: {
    getParentIndex(v) {
      this.navChecked = v;
      this.formData.type = v + 1;
      if(v ==0) {
        this.typeLabel = '收入类别';
        this.payLabel = '收入方式';
        this.options.typeList = this.options.dailyIncomeTypeList;
      } else if(v ==1 ) {
        this.typeLabel = '支出类别';
        this.payLabel = '支付方式';
        this.options.typeList = this.options.dailyOutTypeList;
      }
      if(this.dialog.type == this.formData.type) {
        this.getDetailData();
      }
      this.$nextTick(()=> {
        this.closeDialog();
      })
    },
    submitfn() {
      let form = 'form';
      if(this.formData.type == 3) {
        form = 'transferForm';
      }
      this.loading = true;
      this.$refs[form].validate((valid) => {
        if (valid) {

          if(!this.dialog.id || this.dialog.type != this.formData.type) {
            if(this.formData.type == 3) {
              postTransfer(this.transferForm).then(res => {
                if(res.data.code == SYSTEM_HTTP_SUCCESS) {
                  this.successfn();
                }
              }).catch(err => {
                this.loading = false;
              })
            } else {
              saveDailyincomeout(this.formData).then(res => {
                if(res.data.code == SYSTEM_HTTP_SUCCESS) {
                  this.successfn();
                }
              }).catch(err => {
                this.loading = false;
              })
            }
            
          } else if(this.dialog.type == this.formData.type){
            this.formData.id = this.dialog.id;
            updateDailyincomeout(this.formData).then(res => {
              if(res.data.code == SYSTEM_HTTP_SUCCESS) {
                this.successfn();
              }
            }).catch(err => {
              this.loading = false;
            })
          }
        } else {
          console.log('error submit!!');
          this.loading = false;
          return false;
        }
      });
    },
    successfn() {
      this.$emit('on-search');
      this.dialog.isshow = false;
      this.loading = false;
    },
    closeDialog() {
      if(this.formData.type < 3) {
        this.$refs['form'].resetFields();
      } else {
        this.$refs['transferForm'].resetFields();
      }
      this.formData.dailyIncomeOutType.id = '';
      this.formData.id = '';
    },
    openDialog() {
      if(this.dialog.type > 0) {
        this.title = '修改日常收支';
        // this.getDetailData();
        this.getParentIndex(this.dialog.type - 1);
      } else {
        this.title = '新增日常收支';
      }
    },
    getDetailData() {
      this.loading = true;
      getDailyMsgt(this.dialog.id).then(res => {
        this.loading = false;
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.$nextTick(() => {
            this.formData = res.data.data;
          })
        }
      }).catch(err => {
        this.loading = false;
      })
    }
  }
}
</script>
<style lang="less">
  #dialog /deep/.el-dialog__header {
    text-align: center !important;
  }
</style>