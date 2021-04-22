<!--
 * @Descripttion: 融益口腔，收费打印
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-11-12 11:16:06
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-18 14:26:36
 -->
<template>
  <main>
    <el-dialog 
    id="printDialog"
    :visible.sync="dialog.isShow"
    :modal="false"
    title="打印预览"
    @open="openDialog"
    @close="closeDialog"
    class="print_dialog"
    width="500px"
    >
      <ryPrint 
      :currentinstitution="currentinstitution"
      :patientsMsg="patientsMsg"
      :chargeBill="item" 
      v-for="(item,index) in dataList" 
      :key="index"></ryPrint>
      <div slot="footer">
        <div class="bottom">
          <!-- <div style="marginRight:40px;">
            <el-radio-group v-model="radio">
              <el-radio :label="3">A4纸张</el-radio>
              <el-radio :label="6">3联票据</el-radio>
            </el-radio-group>
          </div> -->
          <el-button size="medium" :loading="loading" type="primary" v-print="'#printTest'">打印</el-button>
          <el-button size="medium" @click="cancelPrintFn">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </main>
</template>
<script>
import { mapState } from "vuex";
import monment from "moment";
import ryPrint from './ryPrint'
import {getCurrentClinic,getchargebillPrint,querychargebillinfos} from '@/api'
import { SYSTEM_HTTP_SUCCESS } from "@/constant";

export default {
  components: { ryPrint },
  props: ["dialog","chargeStatus"],
  data() {
    return {
      radio: 6,
      loading: true,
      currentinstitution: {},
      chargeBill: {
        doctor: {
          name: ''
        }
      },
      dataList: [],
      chargeBillItemList: [],
      payWayNamesStr: '',
      number: '',//原始单号
      moneyYuan: '0.00'
    };
  },
  computed: mapState({
    patientsMsg: state => state.signal.patientsMsg
  }),
  methods: {
    getTime(t) {
      return monment(t).format("YYYY-MM-DD HH:mm");
    },
    //取消打印
    cancelPrintFn() {
      this.dialog.isShow = false;
      this.$emit('cancel-print',this.id);
    },
    //获取当前诊所信息
    getCurrentinstitution() {
      let currentinstitution = sessionStorage.getItem('currentinstitution');
      if(currentinstitution) {
        this.currentinstitution = JSON.parse(currentinstitution);
      } else {
        getCurrentClinic().then(res => {
          if(res.data.code == SYSTEM_HTTP_SUCCESS) {
            this.currentinstitution = res.data.data;
            sessionStorage.setItem("currentinstitution", JSON.stringify(this.currentinstitution));
          }
        })
      }
    },
    openDialog() {
      
      //批量打印
      if(this.dialog.isBatch) {
        let ids = '';
        this.dialog.ids.forEach(item => {
          ids += ids ? ',' + item.id : item.id;
        })
        querychargebillinfos(ids).then(res => {
          if(res.data.code == SYSTEM_HTTP_SUCCESS) {
            this.dataList = [];
            let data = res.data.data;
            let statusArr = this.dialog.ids;
            if(Array.isArray(data)) {
              data.forEach(item => {
                for(let index in statusArr) {
                  if(statusArr[index].status == '2' && item.arrearsChargeBill && statusArr[index].id == item.arrearsChargeBill.id) {
                    let chargeBill = this.setData(item,item.arrearsChargeBill.status);
                    this.dataList.push(chargeBill);
                    statusArr.splice(index,1);
                    break;
                  } else if(statusArr[index].id == item.chargeBill.id){
                    let chargeBill = this.setData(item,item.chargeBill.status);
                    this.dataList.push(chargeBill);
                    statusArr.splice(index,1);
                    break;
                  }

                }
              })
            }
            this.loading = false;
          }
        })
      } else {
        this.getOnePrintData();
      }
    },
    getOnePrintData() {
      getchargebillPrint(this.dialog.id).then(res => {
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.dataList = [];
          let data = res.data.data;
          let chargeBill = this.setData(data,this.chargeStatus.billingStatus);
          this.dataList.push(chargeBill)
          this.loading = false;
        }
      }).catch(err => {
        console.log(err)
      })
    },
    setData(data,status) {
      let chargeBill = {
        moneyYuan: '',
        chargeBill: {
          doctor: {
          }
        },
        number: '',
        chargeBillItemList: [],
        payWayNamesStr: ''
      };
      //补收欠费状态，显示数据用arrearsChargeBill
      if(status == '2') {
        chargeBill.number = data.chargeBill.number;
        chargeBill.chargeBill = data.arrearsChargeBill;
        chargeBill.chargeBill.amountYuan = data.chargeBill.amountYuan;
        chargeBill.chargeBill.discountAmountYuan = data.chargeBill.discountAmountYuan;
        chargeBill.moneyYuan = '0.00';
      } else {
        chargeBill.chargeBill = data.chargeBill;
        chargeBill.number = '';
        chargeBill.moneyYuan = data.chargeBill.discountAmountYuan;
      }
      chargeBill.chargeBillItemList = data.chargeBillItemList;
      // let payWayNamesStr = '';
      // data.chargePaymentRecordList.map(item => {
      //   payWayNamesStr += payWayNamesStr ? ',' + item.payWayName : item.payWayName
      // })
      // chargeBill.payWayNamesStr = payWayNamesStr;
      return chargeBill;
    },
    closeDialog() {
      this.dataList = [];
    }
  },
  mixins: [],
  mounted() {
    this.getCurrentinstitution();
  }
}
</script>
<style lang="less" scoped>
  #printDialog {
    background: rgba(0, 0, 0, 0.5);
    z-index: 9990 !important;

    /deep/.el-dialog {
      margin-top: 15vh !important;
      position: relative;
      margin: 15vh auto 50px !important;
      background: #fff;
      border-radius: 2px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      box-sizing: border-box;
      height: auto !important;

      .el-dialog__header {
        display: block !important;
        border-bottom: 1px solid #eee;
      }

      .el-dialog__body {
        max-height: 700px;
        padding: 20px;
        padding-top: 50px;
      }
    }
  }
</style>