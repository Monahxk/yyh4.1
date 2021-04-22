<!--
 * @Descripttion: 收费单打印，单张
 * @version: 
 * @Author: hzj
 * @Date: 2019-08-01 14:52:35
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-18 14:16:24
 -->
<template>
  <div class="wrapper" id="wrapper">
    <aside-dialog :isShow="isShow" :showDialogClose="showDialogClose" @on-open="openDialog" v-model="closeData" title="打印预览" width="900px">
      <div class="print_wrap" id="printTest" :class="{isSCale: radio == 6}">
        <div class="header">
          <span>{{currentinstitution.name}}</span>
        </div>
        <div class="print_main">
          <ul class="table_floor">
            <li class="table_item">
              <p>
                <span>姓名</span>
                <span>{{patientsMsg.patientName}}</span>
              </p>
              <p>
                <span>单据号</span>
                <span class="brnone">{{chargeBill.number}}</span>
              </p>
            </li>
            <li class="table_item">
              <p>
                <span>病历号</span>
                <span>{{patientsMsg.emrNo}}</span>
              </p>
              <p>
                <span>就诊日期</span>
                <span class="brnone">{{getTime(chargeBill.visitTime)}}</span>
              </p>
            </li>
          </ul>
          <div class="print_content">
            <div style="paddingBottom:0px;">
              <ul class="title title_one other mains">
                <li v-for="(item, index) of titleData" :key="index">{{item}}</li>
              </ul>
              <ul class="title title_two mains" v-for="(item, index) in chargeBillItemList" :key="index">
                <li>{{item.projectName}}</li>
                <li>{{item.itemUnit}}</li>
                <li>{{item.itemPriceYuan}}</li>
                <li>{{item.itemNum}}</li>
                <li>{{item.amountMoneyYuan}}</li>
              </ul>
            </div>

            <ul class="title title_one sum">
              <li class="text_align_left">
                <span>总金额：</span>
                <span>￥{{chargeBill.amountYuan}}</span>
              </li>
              <li class="text_align_left">
                <span>整单折扣：</span>
                <span>{{chargeBill.discount}}%</span>
              </li>
              <li class="text_align_left">
                <span>折后价：</span>
                <span>￥{{chargeBill.discountAmountYuan}}</span>
              </li>
            </ul>
            <ul class="title title_one sum">
              <li class="text_align_left">
                <span>应收：</span>
                <span>￥{{moneyYuan}}</span>
              </li>
              <li :class="{biglength: !!number}" class="text_align_left">
                <span>实收：</span>
                <span>￥{{chargeBill.receivedAmountYuan}}<i v-if="number">（补{{number}}单据欠费）</i></span>
              </li>
              <li v-if="Number(chargeBill.arrearsYuan) > 0" class="text_align_left">
                <span>欠费：</span>
                <span>￥{{chargeBill.arrearsYuan}}</span>
              </li>
            </ul>
          </div>
        </div>

        <ul class="footers">
          <li class="doctor">
            <span>医生：{{chargeBill.doctor.name}}</span>
          </li>
          <li>
            <span>联系电话：{{currentinstitution.teleno}}</span>
          </li>
          <li>
            <span>地址：{{currentinstitution.addr}}</span>
          </li>
        </ul>
      </div>
      <div slot="footer">
        <div class="bottom">
        <div style="marginRight:40px;">
          <el-radio-group v-model="radio">
            <el-radio :label="3">A4纸张</el-radio>
            <el-radio :label="6">3联票据</el-radio>
          </el-radio-group>
        </div>
          <el-button size="medium" :loading="loading" type="primary" v-print="'#printTest'">打印</el-button>
          <el-button size="medium" @click="cancelPrintFn">取消</el-button>
        </div>
      </div>
    </aside-dialog>
  </div>
</template>

<script>
import asideDialog from "@/components/workbench/asideDialog";
import { mapState } from "vuex";
import monment from "moment";
import {getCurrentClinic,getchargebillPrint} from '@/api'
import { SYSTEM_HTTP_SUCCESS } from "@/constant";
export default {
  components: { asideDialog },
  props: ["isShow","id","chargeStatus"],
  data() {
    return {
      radio: 6,
      loading: true,
      closeData: "",
      titleData: ["项目名称", "单位", "单价（元）", "数量", "金额（元）"],
      showDialogClose: false,
      currentinstitution: {},
      chargeBill: {
        doctor: {
          name: ''
        }
      },
      chargeBillItemList: [],
      payWayNamesStr: '',
      number: '',//原始单号
      moneyYuan: '0.00',
      timmer: null
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
      this.isShow.dialogVisible = false;
      this.endCallback();
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
      getchargebillPrint(this.id).then(res => {
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          let data = res.data.data;
          //补收欠费状态，显示数据用arrearsChargeBill
          if(this.chargeStatus.billingStatus == '2' || (this.isShow.status == 'charge' && data.arrearsChargeBill != null)) {
            this.number = data.chargeBill.number;
            data.arrearsChargeBill.amountYuan = data.chargeBill.amountYuan;
            data.arrearsChargeBill.discountAmountYuan = data.chargeBill.discountAmountYuan;
            this.moneyYuan = '0.00';
            this.chargeBill = data.arrearsChargeBill;
          } else {
            this.number = '';
            this.moneyYuan = data.chargeBill.discountAmountYuan;
            this.chargeBill = data.chargeBill;
          }
          this.chargeBillItemList = data.chargeBillItemList;
          let payWayNamesStr = '';
          data.chargePaymentRecordList.map(item => {
            payWayNamesStr += payWayNamesStr ? ',' + item.payWayName : item.payWayName
          })
          this.payWayNamesStr = payWayNamesStr;
          this.loading = false;
        }
      }).catch(err => {
        console.log(err)
      })
    },
    endCallback() {
      this.$emit("on-success");
    }
  },
  mixins: [],
  mounted() {
    this.getCurrentinstitution();
  },
  destroyed() {
    this.timmer = null;
  }
};
</script>
<style lang="less" scoped>
#wrapper {
  /deep/.el-dialog {
    width: 700px !important;
  }
}
#printTest {
  padding: 0 30px;
  color: #000 !important;
}
.isSCale{
  margin: 0 auto;
  // transform: scaleX(0.6);
  font-size: 14px;
  width: 550px;
  // transform: translateX()
}
.df(@just:space-between) {
  display: flex;
  align-items: center;
  justify-content: @just;
}
@blue: rgb(59, 120, 253);
.header {
  padding: 0 20px 10px 20px;
  // height: 60px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  .df(center);
  .header_left {
    width: 60px;
    margin-right: 30px;
  }
  .header_right {
    width: 680px;
    .header_txt {
      font-size: 14px;
      font-weight: bold;
      margin-top: 10px;
      margin-left: -109px;
    }
  }
}
.print_main {
  // border: 2px solid #423e48;

  .table_floor {
    .table_item {
      height: 24px;
      margin-right: -1px;
      border: 1px solid #000;
      text-align: center;
      line-height: 24px;
      .df();
      p {
        width: 50%;
        .df();
        span {
          border-right: 1px solid #000;
        }
        span:nth-child(1) {
          flex: 1;
        }
        span:nth-child(2) {
          flex: 2;
        }
      }
    }
    .table_item:nth-child(1) {
      border-bottom: none;
    }
  }
}
.print_content {
  padding: 10px 10px 0px 10px;
  text-align: center;
  .title_two {
    padding: 5px 0;
    border-bottom: 1px solid #000;
  }
  .title {
    font-size: 13px;
    .df();
    li {
      width: 33.33%;
    }
    li:nth-child(1) {
      // width: 50%;
    }
    justify-content: left;
  }
}
.title_one {
  height: 30px;
  
  border-bottom: 1px solid #000;
}

.all_price {
  .df();
  line-height: 30px;
  li {
    text-align: left;
    padding-left: 20px;
    width: 50%;
  }
}
.footers {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  line-height: 18px;
  font-size: 12px;
  li {
    width: 50%;
  }
  li:nth-child(3) {
    width:100%;
  }
}
.bottom {
  .df(flex-end);
  height: 60px;
  padding: 0 20px;
  border-top: 1px solid #eee;
}
.btns {
  margin-right: 10px;
  margin-top: 5px;
  display: block;
  cursor: pointer;
  padding: 0 20px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: @blue;
  border: 1px solid @blue;
}

.blues {
  background: @blue;
  color: #fff !important;
}
.other {
  margin-bottom: 0px;
  border-top: 1px solid #000;
}
.wrap {
  li {
    width: 40px;
  }
}
.brnone{
  border: 0 !important;
}
.mains {
  li:nth-child(1) {
    width: 60%;
  }
}
.sum {
  padding-left: 15px;
  &:nth-of-type(1) {
    margin-top: 10px;
    border-top: 2px solid #000;
  }
}
.biglength {
  width: 66.66% !important;
}
.text_align_left {
  text-align: left;
}
</style>