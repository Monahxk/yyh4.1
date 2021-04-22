<!--
 * @Descripttion: 收费详情单
 * @version: 
 * @Author: hzj
 * @Date: 2019-08-01 14:52:35
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-18 14:09:29
 -->
<template>
  <div class="detail_wrapper" id="detail_wrappers">
    <div class="t_left_wrap curren_other">
      <h3 @click="goBackFn" style="fontWeight:normal;">账单记录</h3>
      <span>></span>
      <h3 class="blues" style="fontWeight:normal;">{{breadcrumb}}</h3>
    </div>

    <div class="content">
      <div class="aside_nav" v-if="isComboUse && isShowAsid">
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="诊疗服务" name="0">
            <div class="search_box">
              <el-input
                size="small"
                placeholder="编码名称/名称/首字母"
                @input="searchServeFn"
                v-model="searchServe"
                clearable
              ></el-input>
            </div>
            <div class="scroll_wrap">
              <vuescroll :ops="ops">
                <!-- <div> -->
                <ul class="aside_box" v-show="!searchServe">
                  <li v-for="(item, index) in medicalServices" :key="index" class="item_title">
                    <div class="titles" @click="selectNav(item, index)">
                      <i class="el-icon-caret-bottom" v-show="item.is"></i>
                      <i class="el-icon-caret-right" v-show="!item.is"></i>
                      <el-button type="text" style="color:#666">{{item.name}}</el-button>
                    </div>
                    <ul class="childNav" v-show="item.is">
                      <li
                        v-for="(val, index) in item.childListData"
                        :key="index"
                        @click="handleChilden(val)"
                      >
                      <p stylr="ineHeight:20px;">
                        <span>{{val.itemName}}  ￥{{val.retailPriceYuan}}</span>
                      </p>
                      </li>
                    </ul>
                  </li>
                </ul>

                <ul class="childNav" v-show="searchServe">
                  <li
                    v-for="(val, index) in doctorSearchData"
                    :key="index"
                    @click="handleChilden(val)"
                  >
                    <el-button type="text" style="color:#666">{{val.itemName}}</el-button>
                  </li>
                </ul>
                <!-- </div> -->
              </vuescroll>
            </div>
          </el-tab-pane>
          <!-- <el-tab-pane label="库存物品" name="1">
            <div class="search_box">
              <el-input
                size="small"
                placeholder="编码名称/名称/首字母"
                @input="searchServeFn"
                v-model="searchServe"
                clearable
              ></el-input>
            </div>
            <div class="scroll_wrap">
              <vuescroll :ops="ops">
                <ul class="aside_box" v-show="!searchServe">
                  <li v-for="(item, index) in commoditySales" :key="index" class="item_title">
                    <div class="titles" @click="selectNav(item, index)">
                      <i class="el-icon-caret-bottom" v-show="item.is"></i>
                      <i class="el-icon-caret-right" v-show="!item.is"></i>
                      <el-button type="text" style="color:#666">{{item.goodstypeName}}</el-button>
                    </div>
                    <ul class="childNav" v-show="item.is">
                      <li
                        v-for="(val, index) in item.childListData"
                        :key="index"
                        :class="{is_active_checked:val.isChecked}"
                        @click="handleChilden(val)"
                      >
                      <p stylr="ineHeight:20px;">
                        <span>{{val.itemName}}  ￥{{val.retailPriceYuan}}</span>
                      </p>
                      </li>
                    </ul>
                  </li>
                </ul>

                <ul class="childNav" v-show="searchServe">
                  <li
                    v-for="(val, index) in nurseSearchData"
                    :key="index"
                    :class="{is_active_checked:val.isChecked}"
                    @click="handleChilden(val)"
                  >
                    <el-button type="text" style="color:#666">{{val.itemName}}</el-button>
                  </li>
                </ul>
              </vuescroll>
            </div>
          </el-tab-pane> -->
        </el-tabs>
      </div>
      <div class="right_box" :class="{wid:isShowAsid }">
        <vuescroll :ops="ops">
          <div class="detail_wrap">
            <div class="floor">
              <charge-title titleTxt="收费明细">
                <el-select size="medium" v-model="comboName" @change="changeComboFn" :disabled="!isShowAsid" v-show="isShowComb">
                 <el-option
                  v-for="(item, index) in comboList"
                  :key="index"
                  :label="item.packageName"
                  :value="item.id">
                </el-option>
                </el-select>
              </charge-title>
              <div class="charge-table-box" :style="{height: item_isdown_height}">
                <el-table
                  ref="singleTable"
                  :data="tableDataList"
                  style="font-size: 14px"
                  :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
                >
                  <el-table-column
                    v-for="(item,index) in tabletitle"
                    :key="index"
                    :prop="item.prop"
                    :label="item.label"
                    align="center"
                  ></el-table-column>

                  <el-table-column prop="number" label="数量" align="center">
                    <template slot-scope="scope">
                      <el-input
                        v-model="scope.row.number"
                        size="small"
                        style="width:80px"
                        @input="inputChangeFn(scope.row, scope)"
                        :min="1"
                        onkeyup="value=value!=''?value.replace(/[^\d]/g,''):''"
                        @blur="inputBlur(scope.row, scope)"
                        v-show="isComboUse && isShowAsid"
                      ></el-input>
                      <span v-show="!isComboUse || !isShowAsid">{{scope.row.number}}</span>
                    </template>
                    <!-- :class="{readonlys: !isShowAsid}" -->
                    <!-- <template slot-scope="scope" v-if="!isShowAsid">
                      <span>{{scope.row.number}}</span>
                    </template>-->
                  </el-table-column>

                  <el-table-column prop="discountFlag" label="是否允许打折" align="center">
                    <template slot-scope="scope">
                      <span>{{parseInt(scope.row.discountFlag)? '无折扣' : '折扣'}}</span>
                    </template>
                    <!-- <template slot-scope="scope" v-if="!isShowAsid">
                      <span>{{scope.row.amountMoney}}</span>
                    </template>-->
                  </el-table-column>
                  <el-table-column prop="rowAllPrice" label="金额" align="center">
                    <template slot-scope="scope">
                      <span>{{scope.row.rowAllPrice|currency()}}</span>
                    </template>
                    <!-- <template slot-scope="scope" v-if="!isShowAsid">
                      <span>{{scope.row.amountMoney}}</span>
                    </template>-->
                  </el-table-column>

                  <el-table-column label="操作" align="center" v-if="isComboUse && isShowAsid">
                    <template slot-scope="scope">
                      <i class="el-icon-delete delete" @click="handleDeleteFn(scope.row)"></i>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="all_price">
                <span @click="handleArrowDown('item_isdown')" v-show="!item_isdown" v-if="tableDataList.length > 2"><i class="el-icon-arrow-down"></i>展开</span>
                <span @click="handleArrowDown('item_isdown')" v-show="item_isdown" v-if="tableDataList.length > 2"><i class="el-icon-arrow-up"></i>收起</span>
                <div class="price-box">
                  <span>费用合计：</span>
                  <span class="red"><i :class='"money"+apps.isCurrent' class="money money-totle">￥{{allPrice | currency()}}</i></span>
                </div>
              </div>
            </div>

            <div class="floor" v-if="!isShowAsid">
              <charge-title titleTxt="收费单"></charge-title>
              <div :style="{height: isdown_height}" class="charge-table-box">
                <el-table
                :data="batchChargeBillList"
                style="font-size: 14px"
                :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
                >
                  <el-table-column
                      prop="number"
                      label="单号"
                      align="center"
                  >
                    <template slot-scope="scope">
                      {{scope.row.number}}
                      <span v-if="scope.row.number == saveData.number">(本单)</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                      prop="discount"
                      label="整单折扣"
                      align="center"
                  >
                    <template slot-scope="scope">
                      {{scope.row.discount}}%
                    </template>
                  </el-table-column>
                  <el-table-column
                      prop="discountAmountYuan"
                      label="应收"
                      align="center"
                  >
                    <template slot-scope="scope">
                      <i :class='"money"+apps.isCurrent' class="money">￥{{scope.row.discountAmountYuan}}</i>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="arrow-down-box" v-if="batchChargeBillList.length > 2">
                <span @click="handleArrowDown('isdown')" v-show="!isdown"><i class="el-icon-arrow-down"></i>展开</span>
                <span @click="handleArrowDown('isdown')" v-show="isdown"><i class="el-icon-arrow-up"></i>收起</span>
              </div>
            </div>
            <div class="floor">
              <charge-title titleTxt="支付详情"></charge-title>
              <el-form ref="payForm" :model="payForm" label-width="100px" v-if="isShowAsid">
                <el-row type="flex" justify="space-around" >
                  <el-col :span="10">
                    <el-form-item label="整单折扣">
                      <div class="from_item">
                        <el-input
                          v-model="discount"
                          :readonly=" !isComboUse  || !isShowAsid   "
                          :min="0"
                          onblur="value=value.replace(/\.$/gi,'')"
                          @input="compAllPrice"
                        ></el-input>
                        <span>%</span>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="应收合计 ￥">
                      <div class="from_item">
                        <el-input v-model="isAllPrice" @input="Backstepping" onblur="value=value.replace(/\.$/gi,'')" :readonly=" !isComboUse  || !isShowAsid "></el-input>
                        <el-checkbox :disabled="!isShowAsid" v-model="specialClinic" style="margin-left:20px;">特诊</el-checkbox>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <div class="price-details" v-if="!isShowAsid">
                <div class="pay-wey-box">
                  <div class="pay-wey-item">
                    <span>实收金额：</span>
                    <span v-for="(item,index) of chargePaymentRecordList" :key="index">
                      ￥{{(item.payMoneyYuan-0).toFixed(to_fixed)}}/{{item.payWayName}}
                      <template v-if="item.type == 3">({{item.basePayAmountYuan}})</template>、
                    </span>
                  </div>
                  <div class="pay-wey-item display-flex">
                    <div class="row-left">
                      <span v-if="arrearsPrice>0">欠费：<i class="money-red money-totle">￥{{arrearsPrice}}</i></span>
                      <el-checkbox :disabled="!isShowAsid" v-model="specialClinic" style="margin-left:20px;">特诊</el-checkbox>
                    </div>
                    <div class="row-right">
                      <span>合计实收：<i :class='"money"+apps.isCurrent' class="money money-totle">￥{{receivedAmountYuans}}</i></span>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            <div class="floor" :class="{'is_edit': !isShowAsid}">
              <charge-title titleTxt="操作信息"></charge-title>
              <el-form ref="form" :model="form" label-width="100px" >
                <el-row type="flex" justify="space-around">
                  <el-col :span="10">
                    <el-form-item label="收费时间">
                      <el-date-picker
                        v-model="timeValue"
                        :readonly="!isShowAsid"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        style="width:200px;"
                        placeholder="选择日期时间"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="就诊时间">
                      <el-select v-model="visitTimeId" placeholder="请选择" :disabled="!isShowAsid" style="width:200px;">
                        <el-option
                          v-for="(item, index) in selectData.visitTimeList"
                          :key="index"
                          :label="item.registerTime"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row type="flex" justify="space-around">
                  <el-col :span="10">
                    <el-form-item label="医生">
                      <el-select v-model="doctorId" @change="handleSelcet" placeholder="请选择" :disabled="!isShowAsid" style="width:200px;">
                        <el-option
                          v-for="(item, index) in selectData.doctorlist"
                          :key="index"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="护士">
                      <el-select v-model="nurseId" placeholder="请选择" :disabled="!isShowAsid" style="width:200px;">
                        <el-option
                          v-for="item in selectData.nurselist"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <!-- <el-row>
                  <el-col :span="23">
                    <el-form-item label="绩效分配" label-width="130px">
                      <div class="from_item">
                        <el-input
                          v-model="achievements"
                          readonly
                          type="textarea"
                          :autosize="{ minRows: 2, maxRows: 4}"
                          resize="none"
                        ></el-input>
                        <span class="icon" @click="handelAllotFn()" v-show="isShowAsid"></span>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row> -->

                <el-row>
                  <el-col :span="23">
                    <el-form-item label="备注" label-width="130px">
                      <el-input v-model="remark" :readonly="!isShowAsid"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
        </vuescroll>
      </div>
    </div>

    <!-- footer -->
    <div class="footer" v-if="isShowAsid">
      <p class="handleBtns">
        <span class="btns o_btns" @click="postChildlistFn(true)">保存</span>
        <!-- <span class="btns" @click="handleSaveFn">保存并收费</span> -->
        <span class="btns" @click="savePrint">保存并打印</span>
        <span class="btns" @click="cancelFn">取消</span>
      </p>
    </div>
    <!-- 待处理 -->
    <div class="footer" v-show="apps.isCurrent == 0  && !isShowAsid">
      <p class="handleBtns">
        <span class="btns o_btns" @click="handlePrice" v-if="chargeEditable == 1">收费</span>
        <span class="btns" @click="printingFn">打印</span>
        <span class="btns" @click="deleteDataFn" v-if="isCancelBill == 1">作废</span>
        <span class="btns" @click="editPageFn" v-if="isEditBill == 1">修改</span>
        <!-- <span class="btns" @click="goBackFn">取消</span> -->
      </p>
    </div>
    <!-- 已收费 -->
    <div class="footers footer" v-show="apps.isCurrent == 1 && !isShowAsid">
      <p>
        <span class="btns o_btns" @click="applyDialog.dialogVisible = true" v-if="!refundedId ">申请退费</span>
      </p>
      <p class="handleBtns">
        <span class="btns" @click="printingFn">打印</span>
        <!-- <span class="btns" @click="deleteDataFn">作废</span> -->
      </p>
    </div>
    <!-- 欠费 -->
    <div class="footers footer" v-show="apps.isCurrent == 4 && !isShowAsid && chargeEditable == 1">
      <p>
        <!-- <span class="btns o_btns" @click="applyDialog.dialogVisible = true">申请退费</span> -->
      </p>
      <p class="handleBtns">
        <span class="btns o_btns" @click="handlePrice()">收欠费</span>
        <!-- <span class="btns o_btns"></span> -->
        <span class="btns" @click="printingFn">打印</span>
      </p>
    </div>
    <!-- 其他 -->
    <div class="footers footer" v-show="apps.isCurrent > 5 && !isShowAsid ">
      <p></p>
      <p class="handleBtns">
        <span class="btns" @click="editPageFn" v-if="isEditBill == 1">修改</span>
        <span class="btns" @click="printingFn">打印</span>
      </p>
    </div>

    <!-- 绩效分配 -->
    <charge-allot-dialog
      :isShow="allotVisible"
      :tableData="tableDataList"
      :selectData="selectData"
      @on-saveData="handleAchievements"
    ></charge-allot-dialog>
    <!-- 收费 -->
    <charge-save-dialog
      :isShow="saveVisible"
      :allPay="chargeArrears"
      :orderNum="orderNumber"
      @on-success="goBackFn"
      @on-print="changePrint"
      @cancel-charge-save="isEditFn"
      :isBatch="isBatch"
      :arrearsPrice="arrearsPrice"
      :countFeePrice="chargeArrears"
      :saveData="saveData"
    ></charge-save-dialog>
    <!-- 申请退费 -->
    <charge-apply-dialog
    @on-charge="goBackFn"
    :isAllPrice="isAllPrice"
    :receivedAmountYuans="receivedAmountYuans"
    :isShow="applyDialog"
    :tableList="tableDataList"
    :applyDiscount="applyDiscount"
    :orderId="orderId"
    :refund="isShowComb"
    :batchId="batchId"
    :allFee="realResultFee"></charge-apply-dialog>
    <!-- 打印 -->
    <charge-one-dialog
      :isShow="printingVisible"
      :tableDataList="tableDataList"
      :discount="discount"
      :compallConst="countFeePrice"
      :orderNumber="orderNumber"
      :chargeStatus="chargeStatus"
      :price="rowAllPrice"
      :time="time"
      :docNames="docNames"
      :saveData="saveData"
      :payWayNamesStr="payWayNamesStr"
      :receivedAmountYuans="receivedAmountYuans"
      :id="currentId"
      @cancel-print="isEditFn"
      @on-success="goBackFn"
    ></charge-one-dialog>
    <!-- 普乐米打印 -->
    <plmPrint :isShow="printDialog" @on-success="goBackFn"></plmPrint>
    <!-- 融益打印 -->
    <PrintDialog :dialog="printDialog" :chargeStatus="chargeStatus" @on-success="goBackFn" @cancel-print="isEditFn"></PrintDialog>
    <!-- chargeArrears -->
    <div>
      <el-dialog
        title="确认是否提交？"
        :visible.sync="dialogDiscont"
        id="dialogDiscont"
        :modal="false"
        center>
        <span class="desc">整单折扣超出默认权限，提交 则进入审批流程</span>
        <div class="r-box">
          <el-form>
            <el-form-item>
              <el-input placeholder="请输入折扣申请原因（必填）" clearable v-model="discountReason"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="surepost">确 定</el-button>
          <el-button @click="dialogDiscont = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>

</template>

<script>
import vuescroll from "vuescroll";
import ChargeTitle from "./component/ChargeTitle";
import ChargeAllotDialog from "./component/ChargeAllotDialog";
import ChargeSaveDialog from "./component/ChargeSaveDialog";
import ChargeApplyDialog from "./component/ChargeApplyDialog";
import ChargeOneDialog from "./component/ChargeOneDialog";
import plmPrint from './component/printDialog/plmPrint'
import PrintDialog from './component/printDialog/index'
import {SYSTEM_HTTP_SUCCESS,PLM_INSTITUTION_ID,TO_FIXED,RY_INSTITUTION_ID,CT_INSTITUTION_ID} from "@/constant"
import { mapState,mapGetters } from "vuex";
import {
  getAsideService,
  getAsideDrug,
  getAsideServiceChild,
  getParentSelect,
  getSearchData,
  postSaveCharge,
  deletechargebill,
  getChargeSelList,
  getChargePackage,
  getAsideDrugChild,
  getDoctorDiscount,
  getChargeEditable,
} from "@/api";
import { price } from "@/directive";
import monment from "moment";
export default {
  components: {
    ChargeTitle,
    vuescroll,
    ChargeAllotDialog,
    ChargeSaveDialog,
    ChargeApplyDialog,
    ChargeOneDialog,
    plmPrint,
    PrintDialog
  },
  props: ["isShowAsid","currentRowId","iframeVisible"],
  directives: { price },
  inject: ["apps"],
  filters: {
    capitalize: function(value) {
      // if (!value)  return '00.00'
    }
  },
  data() {
    return {
      isdown: true,
      currentId: '',
      item_isdown: true,
      isdown_height: 'auto',
      item_isdown_height: 'auto',
      receivedAmountYuans:0,
      batchId: 0,
      isClickEd: false,
      chargePaymentRecordList: [],
      batchChargeBillList: [],
      AddChange: '',
      saveData: {},
      payWayNamesStr: '',
      comboList:'',
      comboName: 0,
      isShowComb: true,
      docNames: '',
      refundedId: '',
      orderId: '',
      time: '',
      newchargeBill: '',
      discountPrice: '',
      countFeePrice: '',
      arrearsPrice: '',
      applyDiscount: 0,
      realResultFee: "",
      orderNumber: '', // 订单号 相当重要
      medicalServices: [],
      commoditySales: [],
      childList: [{ isChecked: false }],
      asideCheck: null,
      doctorId: "",
      nurseId: "",
      loading:'',
      visitTimeId: "",
      allPrice: "",
      discount: 100,
      searchServe: "",
      isBatch: null,
      editNumber: false,
      rowAllPrice: '',
      // 医生data
      doctorSearchData: [],
      nurseSearchData: [],
      // 支付详情
      payForm: {},
      // 绩效 input
      achievements: "",
      isAllPrice: "",
      chargeArrears:"",
      remark: "",
      discountReason: '',
      specialClinic: "", // 特诊
      selectData: {
        doctorlist: [],
        nurselist: [],
        visitTimeList: []
      },
      defaultProps: {
        children: "children",
        label: "label"
      },
      activeName: "0",
      checked: "",
      timeValue: "",
      form: {},
      pId: 0,
      chargeStatus: {
        arrears: "",
        billingStatus: ""
      },
      allotVisible: {
        dialogVisible: false
      },
      saveVisible: {
        dialogVisible: false
      },
      applyDialog: {
        dialogVisible: false
      },
      printingVisible: {
        dialogVisible: false,
        status: ''
      },
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
      tableDataList: [],
      tabletitle: [
        {
          prop: "itemName",
          label: "项目名称"
        },
        {
          prop: "unit",
          label: "单位"
        },
        {
          prop: "retailPriceYuan",
          label: "单价"
        }
      ],
      edit: false,
      issave: true,
      chargeEditable: 0, //收费按钮 权限
      isEditBill: 0, //修改按钮权限
      isCancelBill: 0, //作废按钮权限
      dialogDiscont: false,
      discontGo: false, //折扣权限，允许走流程
      printDialog: {
        dialogVisible: false,//普乐米
        isShow: false,//融益
        id: '',
        status: ''
      },
      to_fixed: TO_FIXED
    };
  },
  watch: {
    activeName() {
      this.searchServe = "";
    },
    patientId: {
      handler(val) {
        this.pId = val;
      },
      immediate: true
    },
    doctorId() {
      this.resetChecked();
    },
    nurseId() {
      this.resetChecked();
    },
    'currentRowId': {
      handler(val) {
        if(val) {
          getChargeEditable(val).then(res => {
            if(res.data.code == SYSTEM_HTTP_SUCCESS) {
              this.chargeEditable = res.data.data;
            }
          })
        }
      },
      immediate: true
    }
  },
  computed: {
    isComboUse(val) {
      return this.comboName == 0 ? true : false
    },
    compallConst() {},
    breadcrumb() {
      return this.isShowAsid ? "新增收费" : "收费单详情";
    },
    currentAsideName() {
      return parseInt(this.activeName) ? "commoditySales" : "medicalServices";
    },
    patientId() {
      return this.$store.state.signal.patientId;
    }
  },
  methods: {
    handleSelcet(id) {
      this.selectData.doctorlist.map(val => {
        if ( val.id == id ) {
          this.docNames = val.name
        }
      })
    },
    // 回退计算
    Backstepping() {
      // allPrice 费用合计
      // discount 折扣
      // isAllPrice 应收合计
      // discountFlag)? '无折扣' : '折扣'
      if (!this.tableDataList.length) return;
      this.isAllPrice = util.getFloatVal(this.isAllPrice);
      let all = 0
      let flag = 0
      this.tableDataList.forEach((val, index) => {
        if (!Number(val.discountFlag)) {
          all += Number((Number(val.number) * Number(val.retailPriceYuan)*100 /100).toFixed(TO_FIXED))
        } else {
          flag += Number( (Number(val.number) * Number(val.retailPriceYuan)*100 /100).toFixed(TO_FIXED) )
        }
      })
      if (all) {
        this.discount = (((Number(this.isAllPrice) - flag) / all) * 100).toFixed(TO_FIXED)
      }
    },
    // 计算应收合计
    compAllPrice() {
      // 0 可以 1 不可以
      let isAll = 0;
      if (this.discount == 0) {
        this.isAllPrice = Number(this.allPrice).toFixed(TO_FIXED)
        return
      } else {
        this.discount = util.getFloatVal(this.discount);
      }

      if (this.discount !== 0 || this.discount !== '') {
        this.tableDataList.map(val => {
          if (parseInt(val.discountFlag)) {
            isAll += parseInt(val.number) * val.retailPriceYuan;
          } else {
            isAll += ( (Number(this.discount) / 100) * (Number(val.number)  )* Number(val.retailPriceYuan)) * 100 / 100
          }
        })
      } else {
        isAll = this.allPrice - 0;
      }
      this.isAllPrice = isAll.toFixed(TO_FIXED);
      this.saveData.discountAmountYuan = isAll.toFixed(TO_FIXED);
    },
    // 修改收费
    editPageFn() {
      // if(this.comboName != 0) {
      //   this.$message.error("当前是套餐，无法编辑");
      //   return
      // }
      this.edit = true;
      this.$emit("on-aside", true);
    },
    // 返回上级
    goBackFn(type,id) {
      /**
       * 普乐米收费成功后，自动调打印界面
       * 打印后返回收费列表
       */
      let institutionId = sessionStorage.getItem('institutionId');
      if(type == 'charge' && institutionId == PLM_INSTITUTION_ID) {
        this.printDialog.dialogVisible = true;
        this.printDialog.id = id;
        this.printDialog.status = '';
      }if(type == 'charge' && institutionId == CT_INSTITUTION_ID) {
        this.printingVisible.dialogVisible = true;
        this.currentId = id;
        this.printingVisible.status = 'charge';
      } else {
        this.$emit("sendChange", false);
      }
    },
    // 取消编辑
    cancelFn() {
      if (this.edit ) {
        console.log(this.edit,'#####')
        this.$emit("on-aside", false);
        this.$root.Bus.$emit("reloadDetail",{
          id: this.apps.currentRowId,
          billingStatusName: this.apps.billingStatusName
        });
        this.getParentDetail();
        this.initLeftAsidde();
        return;
      }
      this.$emit("sendChange", false);
    },

    changePrint() {
      console.log(this.printDialog.id , this.apps.currentRowId,'保存并打印')
      let institutionId = sessionStorage.getItem('institutionId');
      this.printDialog.id = this.printDialog.id || this.apps.currentRowId;
      this.currentId = this.printDialog.id || this.apps.currentRowId;
      this.printDialog.status = '';
      if(institutionId == PLM_INSTITUTION_ID) {
        this.printDialog.dialogVisible = true;
      } else if(institutionId == RY_INSTITUTION_ID) {
        this.printDialog.isShow = true;
      } else {
        this.printingVisible.dialogVisible = true;
      }
    },
    // 打印并保存
    savePrint() {
      if (this.isClickEd) {
        // this.printingVisible.dialogVisible = true;
        this.changePrint();
      } else {
        this.postChildlistFn(false, () => {
          this.changePrint();
          // this.printingVisible.dialogVisible = true;
        })
      }
    },

    handlePrice() {
      this.saveVisible.dialogVisible = true;
    },
    // 保存并收费弹窗
    handleSaveFn() {
      if (this.isClickEd) {
        this.saveVisible.dialogVisible = true;
      } else {
        this.postChildlistFn(false, () => {
          this.saveVisible.dialogVisible = true;
        });
      }
    },
    deleteDataFn() {
      deletechargebill(this.apps.currentRowId).then(res => {
        this.$message({
          message: '该条收据已经作废',
          type: 'success'
        });
        this.goBackFn()
      });
    },
    // 提交数据
    postChildlistFn(isClose, callback) {
      if (!this.tableDataList.length) {
        this.$message.error("【错误】，请添加收费明细");
        return;
      }

      if (!this.timeValue) {
        this.$message.error("【错误】，请选择收费时间");
        return;
      }

      if (!this.doctorId) {
        this.$message.error("【错误】，请选择医生");
        return
      }

      if (!this.visitTimeId) {
        this.$message.error("【错误】，由于当前用户未预约 未挂号，无法新增收费");
        return
      }
      let isgo = true;
      this.isDoctorDiscountPass(isClose,callback);
    },
    postData(isClose,callback) {
      let data = {
        "chargeBill": {
          amountYuan             : this.allPrice,                 // 费用合计
          discount                 : this.discount,                 // 整单折扣 ，最大值100 ,
          receivedAmountYuan     : 0,                             // 实收,
          chargeTime               : this.getTime(this.timeValue),  // 收费日期 ,
          appointmentVisitTrackId  : this.visitTimeId,              // 就诊时间
          doctor               : {id:this.doctorId},            // 医生对象
          nurse                : {id:this.nurseId},             // 护士对象 ,
          discountAmountYuan     : this.isAllPrice,               // 实际应收金额，折扣价 ,
          id                       : this.orderNumber,              // 收费主键id ，修改时传、增加时则不传,
          multiStatus              : '',                            // 获取多账单状态，以逗号拼接 ,
          number                   : '' ,                           // 收费单号 ,
          patient                  : {id:this.patientId},           // 患者的对象 ,
          remark                   : this.remark,                   // 备注 ,
          specialVisit             : Number(this.specialClinic),    // 特诊： 0否 1是 ,
          visitTime                : '',                            // 就诊时间
          chargePackageId          : this.comboName,                 // 是否是套餐
          discountReason           : this.discountReason            //折扣申请原因
        },
        "itemList": [],
        "performanceList": []
      }

      this.selectData.visitTimeList.forEach(val => {
        if (this.visitTimeId == val.id) data.chargeBill.visitTime = val.registerTime
      })

      this.tableDataList.forEach((val, index) => {
        data.itemList.push({
          "amountMoneyYuan": val.rowAllPrice,
          "discountFlag": val.discountFlag,
          "itemClass": val.itemClassId,
          "itemId": val.itemId? val.itemId : val.id,
          "itemNum": val.number,
          "itemPriceYuan": val.retailPriceYuan,
          "itemType": val.itemType,
          "itemUnit": val.unit
        })
      })

      if (this.achievements) {
        this.tableDataList.forEach((val, index) => {
          data.performanceList.push({
            "doctor": {id:val.doc},
            "nurse": {id: val.nurse},
            "itemId": val.itemId? val.itemId : val.id,
            "itemName": val.itemName,
            "itemType": val.itemType,
          })
        })
      }
      if(!this.issave) {
        return;
      } else {
        this.issave = false;
      }
      postSaveCharge(data,callback).then(res => {
        this.printDialog.id = res.data.data.id;
        this.saveData = res.data.data
        this.docNames = res.data.data.doctor ? res.data.data.doctor.name : ''
        // this.isClickEd = true
        this.issave = true;
        if (isClose) {
          this.goBackFn();
        }
        if (callback) callback();
      }).catch(err => {
        this.issave = true;
      })
    },
    isDoctorDiscountPass(isClose,callback) {
      //判断医生折扣权限
      getDoctorDiscount({doctorId:this.doctorId,discount: this.discount}).then(res => {
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          let {discountPvgFlag,flowPvgFlag} = res.data.data;
          if(discountPvgFlag) {
            this.postData(isClose,callback);
          } else {
            if(!flowPvgFlag) {
              this.$message.error("【错误】：超出折扣权限！");
            } else {
              this.dialogDiscont = true;
            }
          }
        } else {
        }
      }).catch(err => {
      });
    },
    surepost() {
      if (!this.discountReason) {
        this.$message.error("【错误】，请输入申请原因！");
        return;
      }
      this.dialogDiscont = false;
      this.postData(true);
    },
    // 选中一级菜单
    selectNav(item, index) {
      item.is = !item.is;
      if (!item.isClick) {
        this.getAsideChildFn(item).then(callBackData => (item.childListData = callBackData));
        item.isClick = true;
      }
    },
    // 处理子集数据
    getAsideChildFn({ id, type, isNames }) {
      if (isNames == 'medicalServices') { // 诊疗服务
         return getAsideServiceChild(id).then(res => {
          return res.data.data.map(val => {
            return this.addDataAttribute(val, isNames, id);
          })
        })
      } else {
        return getAsideDrugChild(id).then(res => {
          return res.data.data.map(val => {
            return this.addDataAttribute(val, isNames, id);
          })
        })
      }
    },
    // 通用增加属性 基于aside
    addDataAttribute(val, isNames, id) {
      // console.log(val, isNames, id)
      val.doc = this.doctorId;
      val.nurse = this.nurseId;
      val.number = 1
      val.rowAllPrice = val.retailPriceYuan
      val.isNames = isNames,
      // val.itemClassId = val.commExpClassId
      //2019-11-11修改
      val.itemClassId = id;
      val.itemType = isNames == 'medicalServices'? 0 : 1
      return val;
    },
    // 搜索诊疗服务
    searchServeFn() {
      getSearchData({
        search: this.searchServe,
        type: parseInt(this.activeName)
      }).then(res => {
        const arr = ['medicalServices', 'commoditySales']
        let _D = res.data.data;
        _D = _D.map(val => this.addDataAttribute(val, arr[Number(this.activeName)]));
        console.log(_D)
        parseInt(this.activeName) ? (this.nurseSearchData = _D): (this.doctorSearchData = _D);
      });
    },
    // 输入框 求值 的时候
    inputChangeFn(row, scope) {
      if (row.number < 1) {
        //row.number = 1;
      }
      this.totalPriceFn()
      this.totalRowPriceFn(row);
      this.compAllPrice()
    },
    inputBlur(row, scope) {
      if(isNaN(row.number) || !row.number) {
        row.number = 1;
      }
      this.inputChangeFn(row, scope);
    },
    // 计算全部金额
    totalPriceFn() {
      if (!this.tableDataList.length) {
        this.allPrice = 0;
        return;
      }
      let all = 0;
      let isAll = 0;
      this.tableDataList.map(val => {
        all += parseInt(val.number ? val.number : 0) * val.retailPriceYuan;
      });
      this.allPrice = all;
    },
    // 计算一行的数据
    totalRowPriceFn(row) {
      row.rowAllPrice = parseFloat(row.number ? row.number : 0) * parseFloat(row.retailPriceYuan);
    },
    // 删除一行数据
    handleDeleteFn(row) {
      this.tableDataList = this.tableDataList.filter(item => item !== row);
      this.totalPriceFn();
      this.compAllPrice()
    },
    filterData(val) {
      let _is = false;
      this.tableDataList = this.tableDataList.map((item, index) => {
        if (item.itemId) {
          if(item.isNames == val.isNames && parseInt(item.itemId) == parseInt(val.id)) {
            item.number = parseFloat(item.number) + 1
            item.rowAllPrice = parseFloat(item.number) * parseFloat(item.retailPriceYuan);
            _is = true
          }
        } else {
          if(item.isNames == val.isNames && parseInt(item.id) == parseInt(val.id)) {
            item.number = parseFloat(item.number) + 1
            item.rowAllPrice = parseFloat(item.number) * parseFloat(item.retailPriceYuan);
            _is = true
          }
        }
        return item
      });
      return _is;
    },
    // 点击子集
    handleChilden(val) {
      // console.log( val )
      if (this.filterData(val)) {
        this.totalRowPriceFn(val)
      } else {
        val.number = 1;
        this.tableDataList.push(val);
        this.totalRowPriceFn(val);
      }
      this.achievements = "";
      this.totalPriceFn();
      this.compAllPrice()
    },
    // 绩效分配弹窗
    handelAllotFn() {
      if (!this.tableDataList.length) {
        this.$message.error("【错误】：当前未添加收费明细， 请先添加收费明细");
        return;
      }
      this.allotVisible.dialogVisible = true;
    },
    // 获取医生or护士name
    getWorkMsg(key, id) {
      let name = "";
      this.selectData[key].map(val => {
        if (val.id == id) {
          name = val.name;
        }
      });
      return name;
    },
    // 绩效分配
    handleAchievements() {
      let str = "";
      this.tableDataList.map(val => {
        str += `${val.itemName} (${this.getWorkMsg("doctorlist", val.doc)}， ${this.getWorkMsg("nurselist", val.nurse)})   `;
      });
      this.achievements = str;
    },
    // 打印弹出框
    printingFn() {
      this.currentId = this.currentRowId;
      let isplm = this.isplmfn();
      if(!isplm){
        this.realResultFee = this.allPrice
        this.printingVisible.dialogVisible = true;
      }
    },
    // 格式化 一级 菜单 数据
    eachData(data, name) {
      return data.map(val => {
        val.is = false;
        val.childListData = [];
        val.isNames = name;
        return val;
      });
    },
    // 格式化时间
    getTime(t) {
      return monment(t).format("YYYY-MM-DD HH:mm:ss");
    },
    // 初始化 左侧菜单
    initLeftAsidde() {
      getAsideService().then(res => this.medicalServices = this.eachData(res.data.data,'medicalServices'))
      getAsideDrug().then(res => this.commoditySales = this.eachData(res.data.data,'commoditySales'))
    },
    // 重置默认选中
    resetChecked() {
      // alert('我被触发了')
      this.tableDataList = this.tableDataList.map(val => {
        console.log( val )
        // val.doc = this.doctorId;
        // val.nurse = this.nurseId;
        return val;
      });
    },
    // 过滤选中
    eachSelectData(arr) {
      let data = arr.filter(val => val.checked)
      return data.length? data[0].id : arr[0].id
    },
    // 获取下拉框数据
    initVistMsg(callback) {
      let params = {
        patientId: this.patientId,
        chargeBillId: 0
      }

      getParentSelect(params).then(res => {
        if(res.data.code != SYSTEM_HTTP_SUCCESS) {
          return;
        }
        let _D = res.data.data;
        let {doctorlist, nurselist, visitTimeList} = res.data.data
        this.selectData = _D;
        let visitRecord = this.getVisitRecordFrist();
        this.doctorId = this.eachSelectData(doctorlist);
        this.nurseId = this.eachSelectData(nurselist)
        this.visitTimeId = visitTimeList[0].id;
        if(this.isShowAsid) {
          visitTimeList.map((item,index) => {
            if(visitRecord.appointmentVisitTrack && visitRecord.appointmentVisitTrack.registerTime == item.registerTime) {
              this.visitTimeId = item.id;
            }
          })

          //工作台列表进入详情，收费时医生默认列表中的医生
          if(this.iframeVisible && this.iframeVisible.doctor.id) {
            this.doctorId = this.iframeVisible.doctor.id;
          } else if(visitRecord.appointmentVisitTrack){
            this.doctorId = visitRecord.appointmentVisitTrack.doctorId;
          }
          if(this.iframeVisible &&  this.iframeVisible.nurse.id) {
            this.nurseId = this.iframeVisible.nurse.id;
          }
          
        }
        if (callback) callback();
      });
    },
    // 套餐值变化
    changeComboFn(id) {
      if (id != 0) {
        this.getChargePackageFn(id)
      } else {
        this.discount = 100
        this.isAllPrice = ''
        this.allPrice = ''
        this.tableDataList = []
      }
    },
    // 套菜下拉数据
    initSelectList() {
      getChargeSelList().then(res => {
        if ( this.isShowComb && this.isShowAsid ) {
          res.data.data.unshift({
            packageName: '不选用套餐',
            id: 0
          })
        }
        this.comboList  = res.data.data
      })
    },
    //
    getChargePackageFn(id) {
      getChargePackage(id).then(res => {
        console.log( res )
        let {chargePackage: {amountYuan, discount} , listChargePackageItem} = res.data.data
        this.discount = discount
        this.isAllPrice = amountYuan
        this.allPrice = amountYuan

        this.tableDataList = listChargePackageItem.map(val => {
          return {
            itemId              : val.itemId,
            itemName             : val.projectName,
            unit                : val.itemUnit,
            retailPriceYuan   : val.itemPriceYuan,
            number              : val.itemNum,
            discountFlag        : val.discountFlag,
            rowAllPrice         : val.amountMoneyYuan,
            itemClassId         : val.itemClass,
            itemType            : val.itemType
          }
        })
      })
    },
    // 点击详情
    getParentDetail() {
      this.initVistMsg(() => {
        let {chargeBillItemList, chargeBill:chargeData, performanceAllotList: allotList, chargePaymentRecordList,batchChargeBillList} = this.apps.detailsData
        this.comboName = chargeData.chargePackageId;
        this.batchId = chargeData.batchId; //batchId>0,批量收费
        this.isShowComb = this.comboName == 0 ? false : true

        this.tableDataList = chargeBillItemList.map((val, index) => {
          return {
            itemName             : val.projectName,             // 名称
            unit                : val.itemUnit,                // 单位
            retailPriceYuan   : val.itemPriceYuan,         // 单价
            number              : val.itemNum,                 // 数量
            discountFlag        : val.discountFlag,            // 是否打折
            rowAllPrice         : val.amountMoneyYuan,       // row 总价格
            doc                 : allotList.length? allotList[index].doctor.id : '',
            nurse               : allotList.length? allotList[index].nurse.id : '',
            diaAllPrice         : val.amountMoneyYuan,       // 应收     - 用于退费
            diaCancel           : val.itemNum,                 // 可退数量 - 用于退费
            diaNeed             : this.isShowComb? val.itemNum : 0, // 需退数量 - 用于退费
            itemId              : val.itemId,
            id                  : val.id,
            itemClassId         : val.itemClass
          }
        })
        let receivedAmountYuan = 0;
        let payWayNamesStr = ''; //收费方式名称，string
        chargePaymentRecordList.map((val,index) => {
          if(index <4 ) {
            payWayNamesStr += payWayNamesStr == '' ? val.payWayName : ',' + val.payWayName;
            if(val.type != 3)receivedAmountYuan += (val.payMoneyYuan - 0);
          }
        });
        this.batchChargeBillList = batchChargeBillList;
        this.payWayNamesStr = payWayNamesStr;
        this.allPrice = chargeData.amountYuan                          // 应收合计
        this.discount = chargeData.discount                              // 折扣
        this.isAllPrice = chargeData.discountAmountYuan                // 应收合计
        this.timeValue = chargeData.chargeTime                           // 收费时间
        this.visitTimeId = chargeData.appointmentVisitTrackId            // 就诊时间
        this.doctorId = chargeData.doctor.id                         // 医生
        this.nurseId = chargeData.nurse.id                           // 护士
        this.specialClinic = Boolean(Number( chargeData.specialVisit ))  // 是否特诊
        this.remark = chargeData.remark
        this.orderNumber = chargeData.id
        this.docNames = chargeData.doctor.name
        this.refundedId = chargeData.refundedId                           // 用来判断是否显示退费按钮

        this.applyDiscount = chargeData.discount
        this.orderId = chargeData.id

        this.chargePaymentRecordList = chargePaymentRecordList
        this.arrearsPrice = chargeData.arrearsYuan
        this.receivedAmountYuans = receivedAmountYuan.toFixed(TO_FIXED);
        this.chargeStatus.arrears = chargeData.arrearsYuan;
        this.chargeStatus.billingStatus = chargeData.status;
        this.saveData = chargeData;
        this.isEditBill = chargeData.isEditBill;
        this.isCancelBill = chargeData.isCancelBill;
        if (allotList.length) this.handleAchievements()
        this.initSelectList()
      });
    },
    isEditFn(id) {
      this.isClickEd = false;
      this.orderNumber = id;
    },
    handleArrowDown(name) {
      this[name] = !this[name];
      if(!this[name]) {
        this[name+'_height'] = '144px';
      } else {
        this[name+'_height'] = 'auto';
      }
    },
    /**
     * 判断是否是普乐米诊所登录
     */
    isplmfn(type) {
      let institutionId = sessionStorage.getItem('institutionId');
      this.printDialog.id = this.printDialog.id || this.apps.currentRowId;
      this.printDialog.status = this.chargeStatus.billingStatus;
      if(institutionId == PLM_INSTITUTION_ID || (type && type == 'charge')) {
        this.printDialog.dialogVisible = true;
        return true;
      } else if(institutionId == RY_INSTITUTION_ID) {
        this.printDialog.isShow = true;
        return true;
      }
      return false;
    },
    ...mapGetters([
        'getVisitRecordFrist'
    ])
  },
  mixins: [],
  mounted() {
    if (this.apps.isDetail) {
      this.getParentDetail();
      this.initLeftAsidde();
      return;
    }
    this.timeValue = new Date()
    this.initVistMsg();
    this.initLeftAsidde();
    this.initSelectList();
  },
  created() {
    let _this = this;
    this.$root.Bus.$on("renderDetail", function(loaded) {
      console.log('reander')
      if(loaded)_this.getParentDetail();
    });
  }
};
</script>
<style lang="less" scoped>
@blue: rgb(59, 120, 253);
@bacColor: rgb(236, 242, 252);
.blues {
  color: @blue;
}
.red {
  color: #ff4e65;
}
.green {
  color: #8bd836;
}
.df(@dir:flex-end) {
  display: flex;
  align-items: center;
  justify-content: @dir;
}
.btns {
  display: block;
  cursor: pointer;
  padding: 0 20px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: @blue;
  border: 1px solid @blue;
}
.all_price {
  height: 60px;
  padding: 0 20px;
  position: relative;
  text-align: center;
  line-height: 60px;
  .price-box {
    position: absolute;
    right: 20px;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  &>span {
    cursor: pointer;
  }
}
.search_box {
  // pos
}
.title {
  height: 50px;
  font-size: 15px;
  padding-left: 20px;
  line-height: 50px;
  .df(flex-start);
  .line {
    width: 2px;
    height: 10px;
    margin-right: 10px;
    background: @blue;
  }
}
.right_box {
  height: 100%;
  flex: 2;
}

.delete {
  font-size: 18px;
  color: @blue;
  cursor: pointer;
}
.aside_box {
  .item_title {
    cursor: pointer;
    .childNav {
      line-height: 30px;
      li {
        padding-left: 20px;
        margin-bottom: 5px;
      }
    }
    .titles:hover {
      background: @bacColor;
    }
  }
}
.is_active_checked {
  background: @bacColor;
}
.content {
  display: flex;
  position: absolute;
  top: 30px;
  right: 0;
  bottom: 60px;
  left: 0;
  .aside_nav {
    width: 200px;
    margin-top: 10px;
    border: 1px solid #e4e9ff;
    margin-right: 20px;
  }
}
.detail_wrapper {
  position: relative;
  height: 100%;
  flex: 2;
}
.detail_wrap {
  margin: 10px 5px 5px 10px;
  box-shadow: 0 0 6px 0 #e4e9ff;
  .floor {
  }
}
.t_left_wrap {
  height: 30px;
  display: flex;
  align-items: center;
  h3:nth-child(1) {
    cursor: pointer;
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
.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px;
  border-top: 1px solid #eee;
  .o_btns {
    color: #fff;
    background: linear-gradient(to right, #4d9eff, #3c79fd);
  }
  .df();
  .all_amount .blues {
    color: @blue;
  }
  .all_amount .checkedAll {
    margin-right: 10px;
    i {
      padding: 0 5px 0 10px;
      font-size: 16px;
    }
  }
  .handleBtns {
    .df(space-between);

    span {
      margin-right: 10px;
    }
    span:nth-child(1) {
      cursor: pointer;
    }
  }
}
.from_item {
  display: flex;
  align-items: center;
  span {
    margin-left: 10px;
  }
}
.icon {
  cursor: pointer;
  display: block;
  width: 20px;
  height: 15px;
  background: url("../../../../static/icon.png") no-repeat;
  background-size: 100% 100%;
}
.scroll_wrap {
  height: 100%;
  padding-bottom: 32px;
}
.footers {
  justify-content: space-between;
}
.wid {
  width: 500px !important;
}
.price-details {
  padding: 0 20px 0 60px;
  .pay-wey-box {
    .pay-wey-item {
      padding-bottom: 15px;

      &.display-flex {
        display: flex;
        justify-content: space-between;
      }
    }

  }
}
.money0,.money4{
  color:#ff4e65;
}
.money1{
  color: rgb(139, 216, 54);
}
.money3{
  color: rgb(59, 120, 253);
}

.money-red {
  color: #ff4e65;
}
.money-totle {
  font-size: 16px;
}
.arrow-down-box {
  text-align: center;
  margin-top: 15px;
  span {
    cursor: pointer;
  }
}
.el-icon-arrow-down,.el-icon-arrow-up {
  color: #B6BFD2;
}
.el-icon-arrow-down {
  margin-right: -10px;
}
.charge-table-box {
  overflow: hidden;
}

</style>
<style lang="less">
#iframe_wrapper {
  #dialogDiscont {
    .el-dialog {
      width: 318px !important;
      height: 240px !important;
      margin: auto !important;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      .el-dialog__header {
        display: block;
      }
      .el-dialog__body {
        height: auto;
        padding: 0 20px;

        .desc {
          padding: 0 40px;
          display: block;
          text-align: center;
          color: #1B1E25;
          line-height: 22px;
        }
        .r-box {
          margin: 15px 0;
        }
      }
      .el-dialog__footer {
        border-top: 1px solid #F0F0F1;
      }
    } 
  }
}
#detail_wrappers .__view {
  width: 100% !important;
}
#detail_wrappers .el-tabs__content {
  padding: 10px;
}
#detail_wrappers .el-tabs--border-card {
  box-shadow: 0 0 0 #fff;
  border: 0px solid #ccc;
}
#detail_wrappers .el-tab-pane {
  height: 100%;
}
#detail_wrappers .readonlys .el-input__inner {
  border: 0;
}
#detail_wrappers .readonlys .el-input__inner:hover {
  background: rgb(245, 247, 250);
}
#detail_wrappers .is_edit .el-input__inner {
  background: #fff !important;
  color: #606266 !important;
  cursor: default !important;
}
#detail_wrappers .is_edit .el-input__suffix {
  display: none;
}
</style>
