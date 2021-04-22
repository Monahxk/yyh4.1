<!--
 * @Descripttion: 普罗米打印
 * @version: V4.0
 * @Author: hzj
 * @Date: 2019-10-11 17:17:34
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-12 17:10:20
 -->
<template>
  <div class="wrapper" id="wrapper">
    <aside-dialog :isShow="isShow" @on-open="openDialog" :showDialogClose="showDialogClose" title="打印预览" >
      <div class="print_content" id="print">
        <div class="print_main">
          <div class="header_msg">
            <div class="item header-item1" title="科别">{{chargeBill.departmentName}}</div>
            <div class="item"></div>
          </div>
          <div class="header_msg">
            <div class="item header-item1" title="姓名">{{patientsMsg.patientName}}</div>
            <div class="item header-item" title="病历号">{{patientsMsg.emrNo}}</div>
          </div>
          <div class="header_msg">
            <div class="item header-item1" title="性别">{{patientsMsg.gender}}</div>
            <div class="item header-item" title="诊疗员">{{chargeBill.doctor.name}}</div>
          </div>
          <table class="table" border="0" cellspacing="1" cellpadding="0">
            <tr>
              <td></td>
              <td></td>
            </tr>
            <template v-for="(item,index) in tableList">

              <tr :key="index" v-if="item.receivedAmountYuan != '0.00' && item.receivedAmountYuan != '0' && item.receivedAmountYuan != '0.0'">
                <td style="width: 190px;text-align:center;" title="费用项目">{{item.className}}</td>
                <td style="width: 100px;text-align:left;" title="金额">{{item.receivedAmountYuan}}</td>
              </tr>
            </template>
            <tr>
              <td colspan="2">
                <table class="sumtable" border="0" cellspacing="1" cellpadding="0">
                  <tr>
                    <td style="width: 100px"></td>
                    <td style="width: 260px" class="sum-money" title="实收">￥{{chargeBill.receivedAmountYuan}}(实收)</td>
                  </tr>
                  <tr>
                    <td title=""></td>
                    <td title="人民币（大写）" class="cap-money">{{chargeBill.capitalizationReceivedAmountYuan}}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <div class="bottom-msg-box">
            <div class="bottom_msg">
              <div class="item tollerUser" title="收费员">{{chargeBill.toller.name}}</div>
              <div class="item" title="会员号"></div>
            </div>
            <div class="bottom_msg">
              <div class="item" title="单位"></div>
              <div class="item">
                <span class="year">{{year}}</span>
                <span class="month">{{month}}</span>
                <span class="day">{{day}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <div class="bottom">
          <el-button type="primary" v-print="'#print'" id="printbtn">打印</el-button>
          <el-button @click="cancelPrintFn">取消</el-button>
        </div>
      </div>
    </aside-dialog>
  </div>
</template>

<script>
import asideDialog from "@/components/workbench/asideDialog";
import {getchargebillPrint} from '@/api'
import {SYSTEM_HTTP_SUCCESS} from "@/constant"
import monment from "moment";
import { mapState } from "vuex";
export default {
  components: { asideDialog },
  props: ["isShow", ],
  data() {
    return {
      showDialogClose: true,
      title1: '普罗米门诊综合',
      title2: '诊疗结算单',
      chargeTime: '',
      chargeBill: {
        doctor: {},
        toller: {}
      },
      tableList: [],
      year: '',
      month: '',
      day: '',
      timmer: null
    };
  },
  computed: mapState({
    patientsMsg: state => state.signal.patientsMsg
  }),
  created() {
    let tableList = [];
    tableList = this.defaultData(0,tableList);
    this.tableList = tableList;
  },
  methods: {
    cancelPrintFn() {
      this.isShow.dialogVisible = false;
    },
    getTime(t) {
      return monment(t).format("YYYY-MM-DD");
    },
    openDialog() {
      getchargebillPrint(this.isShow.id).then(res => {
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          let {chargeBill,arrearsChargeBill,chargeTypeClassList} = res.data.data;

          /**
           * 详情按钮点击打印
           * 单据状态：补收欠费
           * 显示数据用arrearsChargeBill
           * status:''的时候，表示收费后自动打印，普乐米
           */
          if(this.isShow.status == '2' || (this.isShow.status == '' && arrearsChargeBill.chargeTime != null)) {
            this.chargeBill = arrearsChargeBill;
          } else {
            this.chargeBill = chargeBill;
          }
          let chargeTime = this.getTime(this.chargeBill.chargeTime);
          this.chargeTime = chargeTime;
          let timeArr = chargeTime.split('-');
          if(timeArr && timeArr.length == 3) {
            this.year = timeArr[0];
            this.month = timeArr[1];
            this.day = timeArr[2];
          }

          let length = chargeTypeClassList.length;
          if(length < 6) {
            for(let i=length;i<6;i++) {
              let map = {
                className: '',
                receivedAmountYuan: ''
              }
              chargeTypeClassList[i] = map;
            }
          }
          if(chargeTypeClassList[5].className == '' && this.chargeBill.arrearsYuan > 0) {
            chargeTypeClassList[5].className = '欠费';
            chargeTypeClassList[5].receivedAmountYuan = this.chargeBill.arrearsYuan;
          }
          this.tableList = chargeTypeClassList;
          this.$nextTick(() => {
            document.getElementById('printbtn').click();
            this.timmer = setTimeout(() => {
              this.endCallback();
            }, 300);
          })
        }
      })
    },
    defaultData(length,list) {
      if(length < 6) {
        let map = {
          className: '',
          receivedAmountYuan: ''
        }
        for(let i=length;i<6;i++) {
          list[i] = map;
        }
      }
      return list;
    },
    endCallback() {
      this.$emit("on-success");
    }
  },
  mixins: [],
  destroyed() {
    this.timmer = null;
  }
};
</script>
<style type="text/css" media="print">
   @page { margin: 0; }
</style>
<style lang="less" scoped>
#wrapper {
  font-size: 10px;
  /deep/.el-dialog {
    width: 320px !important;
  }
}
#printTest {
  padding: 0 30px;
  color: #000 !important;
}
.header {
  width: 100%;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 8px;

  .title {
    margin-bottom: 10px;

  }
}
.print_main {
  font-size: 10px;
  margin-top: 62px;
  .header_msg,.bottom_msg {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2px;

    .item {
      flex: 1;
    }
  }
  .header-item {
    padding-left: 25px;
  }
  .tollerUser {
    padding-left: 65px;
  }
  .header-item1 {
    padding-left: 55px;
  }
  .table {
    width: 100%;
    border-right:0 solid #000;
    border-bottom:0 solid #000;
    .sumtable {
      width: 100%;
      margin-top: 28px;

      tr:first-child {
        td {
          border-top: 0;
        }
      }
      tr {
        td:first-child {
          border-left: 0;
        }
      }
    }
    
    td {
      border-left:0 solid #000;
      border-top:0 solid #000;
      text-align: center;
      height: 21px;
    }
  }

  .bottom-msg-box {
    margin-top: 10px;
    // margin-bottom: 20px;
  }
}
.sum-money,.cap-money {
  text-align: left;
}
.bottom {
  margin-bottom: 8px;
  text-align: center;
}
.year {
  margin-left: -15px;
  margin-top: 5px;
}
.month {
  margin-left: 15px;
  margin-top: 5px;
}
.day {
  margin-left: 15px;
  margin-top: 5px;
}
</style>