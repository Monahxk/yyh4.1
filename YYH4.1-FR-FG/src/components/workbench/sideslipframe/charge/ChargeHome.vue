<!--
 * @Descripttion: 
 * @version: 
 * @Author: hzj
 * @Date: 2019-08-01 14:52:35
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-13 14:43:26
 -->
<template>
  <div class="wrapper" id="charge_home">
    <!-- header -->
    <div class="title">
      <div class="t_left">
        <div class="t_left_wrap">
          <h3 class="other">账单记录</h3>
          <ul>
            <li
              class="nav_item"
              :class="{active:isActive == index }"
              v-for="(item, index) in navData"
              :key="index"
              @click="handleNavFn(index)"
            >{{item}}</li>
          </ul>
        </div>
      </div>
      <div class="t_right">
        <span @click="isBtnShow = true">批量操作</span>
        <span class="btns add_bt" @click="addChargeFn" v-if="billAddable == 1">新增收费</span>
      </div>
    </div>
    <!-- conent -->
    <div class="conent">
      <!-- 按钮组 -->
      <div class="btn_medium" v-if="isActive == 2">
        <el-radio-group v-model="radio" size="small">
          <el-radio-button
            :label="item.num"
            v-for="(item,index) in subNavData"
            :key="index"
          >{{item.txt}}</el-radio-button>
        </el-radio-group>
      </div>
      <div :class="{scroll_active: isActive == 2}" class="scroll_wrap" ref="scroll_wrap">
          <el-table
            ref="singleTable"
            :data="tableDataList"
            style="font-size: 14px;"
            :height="tableHeight"
            :cell-style="handelCellStyle"
            @select="hadleSelectRow"
            @select-all="hadleSelectAllRow"
            :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
          >
            <template slot="empty">
              <div style="padding: 50px 0;">
                <p>
                  <img src="../../../../assets/img/blank.png" alt style="width: 350px;">
                </p>
              </div>
            </template>
            <el-table-column type="selection" width="55" :selectable="selectable" v-if="isBtnShow"></el-table-column>
            <el-table-column
              v-for="(item,index) in tabletitle "
              :key="index"
              :prop="item.prop"
              :label="item.label"
              align="center"
            ></el-table-column>
            <el-table-column prop="handle" label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="detailsFn(scope.row)"
                  style="fontSize:14px;"
                >详情</el-button>
                <span v-if="scope.row.statusName == '待收费' && scope.row.isCancelBill == 1" >|</span> 
                <el-button v-if="scope.row.statusName == '待收费' && scope.row.isCancelBill == 1" type="text" @click="deleteFn(scope.row)" style="fontSize:14px;">作废</el-button>
              </template>
            </el-table-column>
          </el-table>
      </div>
      <charge-save-dialog
        :isShow="saveVisible"
        :allRowList="checkedAllList"
        :allPay="allPay"
        :isBatch="isBatch"
        @on-send="updateFn"
        :saveData="saveData"
      ></charge-save-dialog>
      <charge-printing-dialog
        :isShow="isShowPrintingPage"
        :tableDataList="tableDataLists"
        :orderNumber="orderNumber"
        :chargeStatus="chargeStatus"
        :compallConst="allPay"
      ></charge-printing-dialog>
      <PrintDialog :dialog="printDialog"></PrintDialog>
    </div>
    <!-- footer -->
    <div class="footer">
      <p class="all_amount">
        <span class="checkedAll" v-show="isBtnShow">
          已选
          <i class="big">{{barNum}}</i> 条
        </span>
        <span>实收总额：</span>
        <span class="blues">￥{{showFee}}</span>
      </p>
      <p class="handleBtns" v-show="isBtnShow">
        <span @click="cancelFn">取消</span>
        <span class="btns" @click="allPrinting">批量打印</span>
        <span class="btns" @click="allAhargingFn" v-if="chargeEditable == 1">批量收费</span>
      </p>
    </div>
  </div>
</template>

<script>
import vuescroll from "vuescroll";
import monment from "moment";
import {SYSTEM_HTTP_SUCCESS,PLM_INSTITUTION_ID,TO_FIXED,RY_INSTITUTION_ID} from "@/constant"
import {
  getPatientInfo,
  deletechargebill,
  querychargebillinfos,
  getBilladdable,
  getChargeEditable
} from "@/api";
import { mapState } from "vuex";
import ChargeSaveDialog from "./component/ChargeSaveDialog";
import ChargePrintingDialog from "@/components/workbench/sideslipframe/charge/component/ChargePrintingDialog";
import PrintDialog from './component/printDialog/index'

 let status = [
    "待收费",
    "已收费",
    "",
    "退费",
    "欠费",
    "作废",
    "审批待处理",
    "审批通过",
    "审批驳回",
    "待审批",
    "驳回",
    "审批中",
    "撤销",
    "已待批",
    "提交申请",
    "补收欠费"
  ];
export default {
  components: { vuescroll, ChargeSaveDialog, ChargePrintingDialog,PrintDialog },
  inject: ["apps"],
  props: [],
  data() {
    return {
      saveData: {discountAmountYuan: 0},
      isShowPrintingPage: {
        dialogVisible: false
      },
      chargeStatus: {
        arrears: "",
        billingStatus: ""
      },
      orderNumber: "",
      allPay: "", // 应收金额
      postChildData: {},
      tableHeight: 100,
      saveVisible: {
        dialogVisible: false
      },
      selectFee: 0,
      showFee: 0,
      tableFee: 0,

      navData: ["全部", "待处理", "已收费"],
      subNavData: [
        { txt: "全部", num: "1,3,4,5" },
        { txt: "已收费", num: "1" },
        { txt: "退费", num: "3" },
        { txt: "欠费", num: "4" },
        { txt: "作废", num: "5" }
      ],
      radio: "1,3,4,5",
      ops: {
        mode: "native",
        sizeStrategy: "percent",
        detectResize: true,
        bar: {
          background: "#F0F0F0",
          keepShow: false,
          size: "6px",
          minSize: 0.2
        }
      },
      barNum: 0,
      isBtnShow: false, // 控制底部按钮显示
      isDetial: false,
      currentTitle: "",
      isActive: 0,
      elStatus: {},
      isBatch: true,
      tabletitle: [
        {
          prop: "number",
          label: "单据号"
        },
        {
          prop: "visitTime",
          label: "就诊时间"
        },
        {
          prop: "doctorUserNamesA",
          label: "诊治医生"
        },
        {
          prop: "discountAmountYuan",
          label: "应收"
        },
        {
          prop: "receivedAmountYuan",
          label: "实收"
        },
        {
          prop: "statusName",
          label: "状态"
        },
        {
          prop: "toller.name",
          label: "收费员"
        },
        {
          prop: "addTime",
          label: "创建时间"
        }
      ],
      tableDataLists: [],
      tableDataList: [],
      currentFree: 0,
      allRowList: [],
      checkedAllList: [],
      pId: "",
      billAddable: 0,
      chargeEditable: 0,//批量收费权限
      printDialog: {
        isShow: false,
        ids: '',
        isBatch: true
      }
    };
  },
  watch: {
    radio(val) {
       this.getPatientInfoFn({id:this.patientId,num: val});
    },
    patientId: {
      handler(val) {
        this.getPatientInfoFn({id:val,num: ''});
      },
      immediate: true
    },
    allRowList(val) {
      if (this.isBtnShow) {
        let all = 0;
        // console.log( val )
        val.map(val => {
          all += parseFloat(val.receivedAmountYuan);
        });
        this.showFee = all.toFixed(TO_FIXED);
      }
    },
    isBtnShow(val) {
      if (!val) {
        this.showFee = this.tableFee;
      }
    }
  },
  computed: mapState({
    patientId: state => state.signal.patientId
  }),
  methods: {
    updateFn() {
      if (this.isActive == 0) {
        this.getPatientInfoFn({id:this.patientId,num: ''});
      }
      if (this.isActive == 1) {
        this.getPatientInfoFn({id:this.patientId,num: '0'});
      }
      if (this.isActive == 2) {
        this.getPatientInfoFn({id:this.patientId,num: this.radio});
      }
    },
    getTime(t) {
      return monment(t).format("YYYY-MM-DD HH:mm");
    },
    // 获取全部金额
    // 批量收费
    allAhargingFn() {
      if (!this.allRowList.length) {
        this.$message.error("请先勾选账单，在进行批量操作");
        return;
      }

      let str = [];
      let _is = false;
      this.allRowList.map(val => {
        if (val.statusName == "待收费") {
          str.push(val.id);
        } else {
          _is = true;
        }
      });

      if (_is) {
        this.$message("已经过非待收费的订单");
      }
      if (!str.length) {
        this.$message("只有待收费的单子 才能批量收费");
        return;
      }
      querychargebillinfos(str.join(",")).then(res => {
        // let status = [
        //   "待收费",
        //   "已收费",
        //   "",
        //   "退费",
        //   "欠费",
        //   "作废",
        //   "审批待处理",
        //   "审批通过",
        //   "审批驳回"
        // ];
        // let {chargeBillItemList, chargeBillList: [chargeData]} = res.data.data;


        let arr = [];
        let _allPay = 0;
        // return
        res.data.data.map((val, index) => {
          let discount = parseFloat(val.chargeBill.discount) / 100;
          let chargeBillList = val.chargeBill;
          _allPay += chargeBillList.discountAmountYuan - 0;
          arr[index] = chargeBillList;
          arr[index].createTime = chargeBillList.addTime;
          arr[index].billingText = status[parseInt(chargeBillList.status)];
          arr[index].doctorUserNames = chargeBillList.doctor.username;
          arr[index].anames = chargeBillList.doctor.name;
          arr[index].childrenList = val.chargeBillItemList;
          arr[index].countFee = chargeBillList.discountAmountYuan
        })

        this.saveData.discountAmountYuan = _allPay;
        this.checkedAllList = arr;
        this.isBatch = true;
        this.saveVisible.dialogVisible = true;
      });
    },
    // 取消
    cancelFn() {
      this.isBtnShow = false;
      this.allRowList = [];
    },
    hadleSelectRow(all, row) {
      this.barNum = all.length;
      this.allRowList = all;
      this.getCurrentPrice();
    },
    getCurrentPrice() {
      let str = 0;
      console.log( this.allRowList )
      this.allRowList.map(val => {
        str += val.receivedAmountYuan
      });
      this.currentFree = str;
    },
    selectable(row, index) {
      return true;
    },
    hadleSelectAllRow(all) {
      this.barNum = all.length;
      this.allRowList = all;
      this.getCurrentPrice();
    },
    handleNavFn(i) {
      if (this.isActive !== i) this.isBtnShow = false;
      this.isActive = i;
      if (i == 0) {
        this.setTableHeight(0);
        this.getPatientInfoFn({id:this.patientId,num: ''});
      }
      if (i == 1) {
        this.setTableHeight(0);
        this.getPatientInfoFn({id:this.patientId,num: '0'});
      }
      if (i == 2) {
        this.setTableHeight(-52);
        this.getPatientInfoFn({id:this.patientId,num: "1,3,4,5"})
      }
    },
    setTitleFn(val) {
      this.currentTitle = val;
    },
    addChargeFn() {
      this.$emit("sendChange", true);
    },
    // 全部
    getPatientInfoFn(params) {
      getPatientInfo(params).then(res => {
        let _D = res.data.data;
        if (!_D.length) {
          this.tableDataList = _D
        } else {
          this.tableDataList = this.handelData(_D);
        }
        this.compAllFn()
      });
    },

    compAllFn() {
      let realResultFee = 0;
      if (this.tableDataList.length) {
        this.tableDataList.map(val => {
          realResultFee += val.receivedAmountYuan - 0;
        })
      }
      this.showFee = realResultFee.toFixed(TO_FIXED);
      this.tableFee = realResultFee.toFixed(TO_FIXED);
    },
    // 批量打印
    allPrinting() {
      if (!this.allRowList.length) {
        this.$message.error("请先勾选账单，在进行批量操作");
        return;
      }

      let str = [],arrMap=[];
      this.allRowList.map(val => {
        // console.log(val)
        let map = {
          id: val.id,
          status: val.status
        }
        str.push(val.id);
        arrMap.push(map);
      });

      let institutionId = sessionStorage.getItem('institutionId');
      if(institutionId == RY_INSTITUTION_ID) {
        this.printDialog.isShow = true;
        this.printDialog.ids = arrMap;
        return;
      }
      this.tableDataLists = [];
      querychargebillinfos(str.join(",")).then(res => {
        let _D = res.data.data;
        let dataList = [];
        if(Array.isArray(_D)) {
          _D.forEach(item => {
            for(let index in arrMap) {
              if(arrMap[index].status == '2' && item.arrearsChargeBill && arrMap[index].id == item.arrearsChargeBill.id) {
                let chargeBill = this.setData(item,item.arrearsChargeBill.status);
                dataList.push(chargeBill);
                arrMap.splice(index,1);
                break;
              } else if(arrMap[index].id == item.chargeBill.id){
                let chargeBill = this.setData(item,item.chargeBill.status);
                dataList.push(chargeBill);
                arrMap.splice(index,1);
                break;
              }

            }
          })
        }
        this.tableDataLists = dataList;
        this.isShowPrintingPage.dialogVisible = true;
        // console.log(this.tableDataLists);
      });
    },
    //批量打印重装数据
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
    // 查看详情
    detailsFn(row) {
      this.postChildData = row;
      if (row.statusName == "退费") {
        this.apps.getDetails(row, true);
      } else {
        this.$emit("on-details", row);
      }
    },
    handelData(data) {
      // let status = [
      //   "待收费",
      //   "已收费",
      //   "",
      //   "退费",
      //   "欠费",
      //   "作废",
      //   "审批待处理",
      //   "审批通过",
      //   "审批驳回",
      //   "待审批",
      //   "驳回",
      //   "审批中",
      //   "撤销",
      //   "已待批",
      //   "提交申请"
      // ];
      let arr = data.map(v => {
        v.visitTime = this.getTime(v.visitTime);
        v.doctorUserNamesA = v.doctor.name || ''; // 诊治医生
        v.tollerUser = v.doctor.name; // 收费员
        v.createTime = this.getTime(v.createTime);
        // v.statusName = status[parseInt(v.status)];
        v.clinicNo = v.mergeId
          ? v.clinicNo.substring(6) + "(批量)"
          : v.clinicNo;
        return v;
      });
      return arr;
    },
    handelCellStyle({ row, column, rowIndex, columnIndex }) {
      if (
        (((row.statusName == '待收费' && column.property === 'discountAmountYuan') ||
          (row.statusName == '待收费' && column.property === 'statusName')) ) 
      )
        return "color:#ff4e65";
      if (
        ( (row.statusName == '欠费' && column.property === 'discountAmountYuan') ||
        (row.statusName == '欠费' && column.property === 'statusName'))
      )
        return "color:#ff4e65";

      if (
        (row.statusName == '已收费' && column.property === 'discountAmountYuan') ||
        (row.statusName == '已收费' && column.property === 'statusName')
      )
        return "color:#8bd836";

      if (
        (row.statusName == '退费' && column.property === 'discountAmountYuan') ||
        (row.statusName == '退费' && column.property === 'statusName')
      )
        return "color:#3B78FD";
      if (
        (row.statusName == '作废' && column.property === 'discountAmountYuan') ||
        (row.statusName == '作废' && column.property === 'statusName')
      )
        return "color:#3EC7F6";
      if (
        (row.statusName == '审批待处理' && column.property === 'discountAmountYuan') ||
        (row.statusName == '审批待处理' && column.property === 'statusName')
      )
        return "color:#F67F1A";
      if (row.statusName == '退费待审批' && (column.property === 'discountAmountYuan' ||  column.property === 'statusName'))
        return "color:#0CD2FC";
      
      if(row.statusName == '待审批' && (column.property === 'discountAmountYuan' || column.property === 'statusName'))
        return 'color: #FF485F';

      if(row.statusName == '退费审批中' && (column.property === 'discountAmountYuan' || column.property === 'statusName'))
        return 'color: #0CD2FC';

      if(row.statusName == '退费被驳回' && (column.property === 'discountAmountYuan' || column.property === 'statusName'))
        return 'color: #FF9400';

      if(row.statusName == '退费审批通过' && (column.property === 'discountAmountYuan' || column.property === 'statusName'))
        return 'color: #7ED321';
    },
    // 删除
    deleteFn(row) {
      if ( parseInt(row.statusName) === '已收费' ) {
        this.$message.error('【错误】 已经收费的单子 不能在作废了');
        return
      }
      deletechargebill(row.id).then(res => {
        if (this.isActive == 0) {
          this.getPatientInfoFn({id:this.patientId,num: ''});
        }
        if (this.isActive == 1) {
          this.getPatientInfoFn({id:this.patientId,num: '0'});
        }
      });
    },
    setTableHeight(h) {

        let height = document.getElementById('iframe_wrapper').offsetHeight - 230 + h;
        this.tableHeight = height;
    },
  },
  mixins: [],
  mounted() {
    this.$nextTick(() => {
      this.setTableHeight(0)
    });
    getBilladdable().then(res => {
      if(res.data.code == SYSTEM_HTTP_SUCCESS) {
        this.billAddable = res.data.data;
      }
    })
    getChargeEditable().then(res => {
      if(res.data.code == SYSTEM_HTTP_SUCCESS) {
        this.chargeEditable = res.data.data;
      }
    })
  },
  
};
</script>
<style lang="less" scoped>
@blue: rgb(59, 120, 253);
@big: {
  font-weight: bold;
};
.red {
  color: #ff4e65;
}
.green {
  color: #8bd836;
}
.blue {
  color: @blue;
}
.df(@dir:flex-end) {
  display: flex;
  align-items: center;
  justify-content: @dir;
}
.bold {
  font-weight: bold;
}
.btns {
  font-size: 14px;
  display: block;
  cursor: pointer;
  width: 80px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: @blue;
  border: 1px solid @blue;
}
.wrapper {
  height: 100%;
  position: relative;
  .nav_item {
    border-bottom: 2px solid transparent;
    padding-bottom: 3px;
  }
  .active {
    border-bottom: 2px solid #7874f2;
  }
  .conent {
    position: absolute;
    margin-top: 10px;
    top: 30px;
    right: 0;
    bottom: 60px;
    left: 0;
  }
  .msg_list {
    display: flex;
    width: 710px;
    margin: 20px 0;
    h4 {
      padding-top: 15px;
      margin-right: 30px;
    }
    .message {
      position: relative;
      padding: 10px;
      width: 720px;
      line-height: 30px;
      box-shadow: 0 0 6px 0 #e4e9ff;
      .msg_time {
        font-size: 15px;
        display: flex;
        p:nth-child(1) {
          margin-right: 30px;
        }
      }
      .btns_wrap {
        position: absolute;
        display: flex;
        right: 20px;
        bottom: 20px;
        span:nth-child(2) {
          margin-left: 10px;
        }
      }
    }
  }
  .scroll_wrap {
    height: 100%;
  }
  .scroll_active {
    padding-bottom: 52px;
  }
}
.btn_medium {
  padding-bottom: 20px;
}
.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px;
  border-top: 1px solid #eee;
  .df(space-between);
  .all_amount .blues {
    color: @blue;
    @big();
  }
  .all_amount .checkedAll {
    margin-right: 10px;
    i {
      padding: 0 5px 0 10px;
      font-size: 16px;
    }
  }
  .handleBtns {
    width: 280px;
    .df(space-between);
    span:nth-child(1) {
      cursor: pointer;
    }
  }
}
.title {
  height: 30px;
  color: @blue;
  .df(space-between);
  .t_left .t_left_wrap,
  .t_left .t_left_wrap > ul {
    .df(flex-start);
    li {
      margin-right: 20px;
      cursor: pointer;
    }
  }
  .t_left .t_left_wrap .other {
    font-weight: normal;
    font-size: 16px;
    margin-right: 30px;
  }
  .t_right {
    display: flex;
    justify-content: center;
    align-items: center;
    span:nth-child(1) {
      cursor: pointer;
      margin-right: 20px;
    }
  }
}
.curren_other {
  font-size: 16px;
  h3:nth-child(1) {
    color: #606266;
  }
  span {
    padding: 0 10px;
  }
}
.add_bt {
  // width: 88px;
  // height: 32px;
}
</style>
<style>
#charge_home .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  border: 1px solid #dcdfe6 !important;
  background: #fff;
}
#charge_home .wrapper_cablecom .el-table__row .cell .el-button {
  font-size: 14px;
}
#charge_home .el-table:before {
  background: #fff !important;
}
#charge_home .el-table__body-wrapper {
  /* height: 100% !important; */
}
</style>
