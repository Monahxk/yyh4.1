<!--
 * @Descripttion: 
 * @version: V2.0
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-15 15:36:15
 -->
<template>
  <div class="wrapper">
    <aside-dialog
      :isShow="isShow"
      v-model="closeData"
      :showDialogClose="showDialogClose"
      :title="isBatch?'批量收费':'确认收费' "
      @on-open="openDialogFn"
    >
      <div class="content">
        <ul class="header">
          <li class="item">
            <span>患者姓名：</span>
            <span>{{patientMsg.patientName}}</span>
          </li>
          <li class="item">
            <span>病历号：</span>
            <span>{{patientMsg.emrNo}}</span>
          </li>
          <li class="item">
            <span>手机号：</span>
            <span>{{patientMsg.mobilephone}}</span>
          </li>
        </ul>
        <div class="mains">
          <div class="main_num">
            <span>应收金额</span>
            <span class="red">￥{{accounts}}</span>
          </div>
          <!-- 单条收费 -->
          <div class="main_tab">
            <vuescroll :ops="ops">
              <!-- 批量收费 -->
              <div class="main_tab1" v-if="isBatch">
                <!--  @expand-change="expandChangeFn" -->
                <el-table :data="allRowList" style="width: 100%; font-size: 14px;marginBottom:20px;">
                  <el-table-column
                    align="center"
                    v-for="(item, index) in batchDataTitle"
                    :key="index"
                    :prop="item.prop"
                    :label="item.label"
                  ></el-table-column>
                  <el-table-column type="expand" label="展开">
                    <template slot-scope="props">
                      <div class="expand_wraps">
                        <ul class="headers">
                          <li v-for="(item, index) in titList" :key="index">{{item}}</li>
                        </ul>
                        <!-- ['项目名称','单位', '单价', '数量', '金额', '费用合计', '折扣', '合计应收'] , -->
                        <ul
                          v-for="(item,index) in props.row.childrenList"
                          :key="index"
                          class="items"
                        >
                          <li>{{item.projectName}}</li>
                          <li>{{item.itemUnit}}</li>
                          <li>{{item.itemPriceYuan}}</li>
                          <li>{{item.itemNum}}</li>
                          <li>{{item.amountMoneyYuan}}</li>
                        </ul>
                        <ul class="items">
                          <li>
                            <span>费用合计</span>
                            <span class="red">{{props.row.countFee}}</span>
                          </li>
                          <li>
                            <span>折扣</span>
                            <span class="red">{{props.row.discount}}%</span>
                          </li>
                          <li>
                            <span>合计应收</span>
                            <span
                              class="red"
                            >{{parseFloat(props.row.discount)? parseFloat(props.row.countFee) * parseFloat(props.row.discount) / 100: props.row.countFee}}</span>
                          </li>
                        </ul>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="支付方式" v-for="(item, index) of formData" :key="index">
                  <div class="form_item">
                    <div class="baseDf">
                      <div class="item_left baseDf">

                        <el-select v-model="item.checkId" placeholder="请选择收费方式" @change="changeSelect(item)">
                          <template v-for="item in options">
                            <el-option
                            :key="item.id"
                            :label="item.name"
                            :disabled="item.disabled"
                            :value="item.id">
                            </el-option>
                          </template>
                        </el-select>
          
                        <div class="baseDf" style="marginLeft:20px;" v-show="item.type == 0">
                          <span style="paddingRight:10px;">￥</span>
                          <el-input style="width:110px" placeholder="支付金额"  v-model="item.amount" @input="changeValue(item, 'amount')"></el-input>
                        </div>

                        <!-- 代金券 -->
                        <div class="baseDf" style="marginLeft:20px;" v-show="item.type==3">
                          <el-input v-model="item.voucherTxt" placeholder="券号搜索" style="width:200px" @blur="enterTicket(item)"  @keyup.enter.native="enterTicket(item)">
                            <i class="el-icon-search el-input__icon" slot="suffix" @click="enterTicket(item)"></i>
                          </el-input>
                          <span v-show="item.voucherStatus == 0" style="padding:0 20px;">
                            <span>抵扣金额</span>
                            <span class="red" style="marginRight:10px;">￥ {{item.voucherPrice}}</span>
                          </span>
                          <span v-show="item.voucherStatus != 0" style="padding:0 20px;">
                            {{item.voucherStatus == 1? '已使用代金券' : "代金券不存在"}}
                          </span>

                          <el-tooltip class="item" effect="dark" content="不与其他优惠同享" placement="right">
                            <span class="el-icon-warning" style="color:#ccc;"></span>
                          </el-tooltip>
                        </div>

                        <!-- 预付卡 -->
                        <div class="baseDf" style="marginLeft:20px;" v-show="item.type == 1">
                          <div>
                            <el-select v-model="item.cardIds" placeholder="选择卡号">
                              <el-option  v-for="val in item.cardList" :key="val.value" :label="val.cardNo" :value="val.id" style="width:200px"></el-option>
                            </el-select>
                            <el-input placeholder="卡密码" style="width:110px;marginLeft:20px;" type="password" v-model="item.cardPassword"></el-input>
                            <el-input placeholder="支付金额" style="width:110px;marginLeft:20px;" v-model="item.cardPrice" @input="changeValue(item, 'card')"></el-input>
                            <el-tooltip class="item" effect="dark" placement="right">
                              <div slot="content">
                                <span v-show="item.cardIds && item.cardCurrent">卡余额 ￥{{item.cardbalance}}</span>
                                <span v-show=" !item.cardCurrent  || !item.cardIds ">未查询到该卡信息</span>
                                <br/>
                                <span>不与其他优惠同享</span>
                              </div>
                              <span class="el-icon-warning" style="color:#ccc;"  @mouseover="enterCard(item)"></span>
                            </el-tooltip>
                          </div>
                        </div>

                        <!-- 打折卡 -->
                        <div class="baseDf" style="marginLeft:20px;" v-show="item.type == 2">
                          <div>
                            <el-select v-model="item.discountId" placeholder="选择卡号" @change="enterDiscount(item)">
                              <el-option  v-for="val in item.discountList" :key="val.value" :label="val.cardNo" :value="val.id"></el-option>
                            </el-select>
                          <el-input placeholder="卡密码" style="width:110px;marginLeft:20px;" v-model="item.discountPassword"  type="password"></el-input>
                          <el-tooltip class="item" effect="dark" content="不与其他优惠同享" placement="right">
                            <div slot="content">
                              <span v-show="item.discountId && item.discountbalance">卡余额 ￥{{item.discountbalance}}</span>
                              <span v-show="!item.discountbalance  || !item.discountId ">未查询到该卡信息</span>
                              <br/>
                              <span>不与其他优惠同享</span>
                            </div>
                            <span class="el-icon-warning" style="color:#ccc;" @mouseover="enterDiscount(item)"></span>
                          </el-tooltip>
                          </div>
                        </div>
                      </div>
                      <div class="item_right">
                        <span class="el-icon-circle-plus-outline add_btn" @click="addNewFormDataFn" v-if="index == 0"></span>
                        <span class="delete" @click="deleteFormDataFn(item)" v-else></span>
                      </div>
                    </div>

                    <div class="posi_box" v-show="item.type == 2">
                      <span style="width:200px;display:inline-block;">卡折扣：{{item.discountNum}}%</span>
                      <div style="display:inline-block; width:220px;">
                        <span style="margin: 0px 10px 0px 10px;">￥</span>
                        <el-input placeholder="支付金额" style="width:110px;" v-model="item.discountPrice" @input="changeValue(item, 'discount')"></el-input>
                      </div>
                      <span style="paddingLeft:20px;">折后金额:</span>
                      <span>￥ {{item.discountMoney}}</span>
                    </div>
                  </div>
                </el-form-item>
              
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="欠费">
                      <span class="red">￥{{form.arrearsYuan}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="合计">
                      <span class="red">￥{{form.baseTotleAmountYuan}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label="实收">
                      <span class="green">￥{{form.receivedAmountYuan}}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col>
                    <el-form-item label="备注">
                      <el-input
                        resize="none"
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入内容"
                        v-model="form.remark"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </vuescroll>
          </div>
        </div>
      </div> 
      <div slot="footer">
        <div class="bottom">
          <p>
            <el-button size="medium" @click="handlePrintFn">打印</el-button>
          </p>
          <p class="btn_right">
            <el-button size="medium" :loading="loading" type="primary" @click="paymentFn">确认收费</el-button>
            <el-button size="medium" @click="cancelSaveFn">取消</el-button>
          </p>
        </div>
      </div>
    </aside-dialog>
    <charge-printing-dialog
      :isShow="isShowPrintingPage"
      :tableDataList="tableDataList"
      :orderNumber="orderNumber"
      :chargeStatus="chargeStatus"
      :compallConst="form.realResultFee"
      :saveData="saveData"
    ></charge-printing-dialog>
  </div>
</template>

<script>

import asideDialog from "@/components/workbench/asideDialog";
import ChargePrintingDialog from "@/components/workbench/sideslipframe/charge/component/ChargePrintingDialog";
import vuescroll from "vuescroll";
import TempSave from '../template/TempSave'
import { getPayWay, postCollect, getEditchargebill, postBatchcharge,  getCach, getCardMsg, getValidCard, getDiscount, getPatientCardList, getWillCard, getVioiDiscount } from "@/api";
import { mapState } from "vuex";
import { TO_FIXED } from "@/constant";
export default {
  components: { asideDialog, vuescroll, ChargePrintingDialog, TempSave },
  props: ["isShow", "allPay", "orderNum", "allRowList", "isBatch", "arrearsPrice", "countFeePrice", "saveData"],
  inject: ["apps"],
  data() {
    return {
      loading: true,
      chargeStatus: {
        arrears: "",
        billingStatus: ""
      },
      closeData: "",
      compallConst: "",
      tableDataList: "",
      orderNumber: "",
      checkId: '',
      showDialogClose: false,
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
      state:'',
      isShowPrintingPage: {
        dialogVisible: false
      },
      cardList:[],
      discountList:[],
      checkOption: [],
      formData: [
        {
          amount: "",             // 实收金额
          voucherTxt: "",         // 代金券 - 搜索值
          voucherStatus: "",      // 代金券状态
          voucherPrice: '',       // 代金券金额
          voucherId: "",          // 代金券ID
          cardList: [],           // 预付卡 - 列表
          cardPrice: '',          // 预付卡 - 金额
          cardbalance: '',        // 预付卡 - 余额
          cardIds: "",            // 预付卡 - Id
          cardPassword: "",       // 预付卡 - 密码
          cardCurrent: false,     // 预付卡状态
          discountList:[],        // 预付卡 - 列表
          discountPassword: "",   // 折扣卡 - 密码
          discountbalance: "",    // 折扣卡 - 余额
          discountNum: "",        // 折扣卡 - 折扣
          discountPrice: "",      // 折扣卡 - 金额
          discountMoney: "",      // 折扣卡 - 金额
          discountId: "",         // 折扣卡 - id
          type: 0,                // 选中的类型
          checkId: "",            // 选中支付方式 id
          disabled: false,        // 是否需要禁用选项
          paywayName: ""          // 支付方式名称
        }
      ],
      copyFormData: null,
      form: {
        arrearsYuan: 0,          // 欠费
        baseTotleAmountYuan: 0,  // 合计实收
        receivedAmountYuan: 0,   // 实收
        remark: ""              // 备注
      },
      value: "",
      options: [],
      num: "",
      accounts:'',
      titList: ["项目名称", "单位", "单价", "数量", "金额"],
      batchDataTitle: [
        {
          label: "单据号",
          prop: "number"
        },
        {
          label: "诊治医生",
          prop: "anames"
        },
        {
          label: "创建时间",
          prop: "createTime"
        },
        {
          label: "状态",
          prop: "billingText"
        },
        {
          label: "应收",
          prop: "countFee"
        }
      ]
    };
  },
  watch: {
    orderNum(val) {
      this.num = val;
    },
    "saveData": {
      handler(val) {
        if (this.isBatch) {
          this.accounts = val.discountAmountYuan;
        } else {
          this.accounts = val.arrearsYuan == 0? val.discountAmountYuan : val.arrearsYuan
        }
        this.accounts = parseFloat(this.accounts).toFixed(TO_FIXED);
      },
      deep: true
    }
  },
  computed: mapState({
    patientMsg: state => state.signal.patientsMsg,
    patientId: state => state.signal.patientId
  }),
  methods: {
    validationNum(n) {
      let reg = new RegExp(/(^[\-0-9][0-9]*(.[0-9]+)?)$/)
      let _n = Number(n)
      if (!reg.test(_n)) {
        this.$message.error('请输入有效的数字');
        return false
      } else {
        return true
      }
    },
    // 输入金额
    changeValue(item, way) {
      switch(way) {
        case 'amount':
          if (!this.validationNum(item.amount)) return
          break
        case 'card':
          if (!this.validationNum(item.cardPrice)) return
          if (!item.cardIds) {
            this.$message.error('还没有选择预付卡');
            return
          }
          break
        case 'discount':
          if (!this.validationNum(item.discountPrice)) return
          if (!item.discountId) {
            this.$message.error('还没有选择折扣卡');
            return
          }
          break
      }
      item.discountMoney = (item.discountPrice * item.discountNum / 100).toFixed(2)

      this.countPrice()
    },
    // 计算金额
    countPrice(){
      let data = {baseTotleAmountYuan:0 , receivedAmountYuan: 0, arrearsYuan: 0}
     
      this.formData.map(val => {
        data.baseTotleAmountYuan += Number(val.amount) + Number(val.cardPrice) + Number(val.discountPrice) + Number(val.voucherPrice)
        let dis = val.discountNum == 0 ? 100 : val.discountNum
        data.receivedAmountYuan += (Number(val.amount) + Number(val.cardPrice) + (Number(val.discountPrice) * Number(dis / 100)))
      })

      if( data.baseTotleAmountYuan < this.accounts) {
        data.arrearsYuan = (this.accounts - data.baseTotleAmountYuan).toFixed(TO_FIXED)
      } else {
        data.arrearsYuan = 0
      }
      data.baseTotleAmountYuan = data.baseTotleAmountYuan.toFixed(TO_FIXED);
       data.receivedAmountYuan =  data.receivedAmountYuan.toFixed(TO_FIXED);
      Object.assign(this.form, data)
    },
    deepCopy(obj) {
      var result = Array.isArray(obj) ? [] : {};
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'object') {
            result[key] = this.deepCopy(obj[key]);
          } else {
            result[key] = obj[key];
          }
        }
      }
      return result;
    },
    findType({checkId}) {
      let obj = {}
      this.options.forEach(val => {
        if (val.id == checkId) {
          obj = val
        }
      })
      return obj
    },
    // 下拉框的值变化的时候
    changeSelect(item) {
      let obj = this.findType(item)
      let types = [1,2,3]
      let {checkId} = item
      // this.options.forEach(val => {
      //   if ( !types.includes(val.type) ) {
      //     val.disabled = false
      //   }
      // })
      // if ( types.includes(obj.type) ) obj.disabled = true

      Object.assign(item, this.deepCopy(this.copyFormData[0]))
      item.type = obj.type
      item.paywayName = obj.name
      item.checkId = checkId
      item.cardList = this.cardList
      item.discountList = this.discountList;
      this.countPrice();
    },
    // 根据id 获取 预付卡 余额
    getNumber(list, id) {
      if (!list.length) {
        return ''
      } else {
        let ids = ''
        list.forEach(val => {
          if (id == val.id) {
            ids = val.cardNo
          }
        })
        return ids
      }
    },
    // 根据代金券 - 获取代金券详情
    enterTicket(item) {
      let {voucherTxt} = item
      getCach(voucherTxt).then(res => {
        let data = res.data.data
        item.voucherStatus = data.status
        item.voucherPrice = data.status == 0 ? data.amountYuan : 0;
        item.voucherId = data.id;
        this.countPrice()
      })
    },
    // 根据预付卡号 - 获取预付卡信息
    enterCard(item) {
      let {cardList,cardIds} = item
      let num = this.getNumber(cardList, cardIds)
      getCardMsg(num).then(res => {
        let data = res.data.data
        if (!data) {
          item.cardCurrent = false
        } else {
          item.cardbalance = data.balanceYuan
          item.cardCurrent = true
        }
      })
    },
    // 根据折扣卡号 - 获取折扣信息
    enterDiscount(item) {
      let {discountList, discountId} = item
      let num = this.getNumber(discountList, discountId)
      getDiscount(num).then(res => {
        let data = res.data.data
        if (!data) {
          item.balanceYuan = ''
        } else {
          item.discountbalance = data.balanceYuan
          item.discountNum = data.discount
        }
      })
    },
    // 新增行数
    addNewFormDataFn() {
      if (this.formData.length > 3) {
        this.$message.error('最多只能添加4条收费方式');
        return
      }
      let item = this.deepCopy(this.copyFormData[0])
      item.cardList = this.cardList
      item.discountList = this.discountList
      this.formData.push( item );
    },
    // 删除行数
    deleteFormDataFn(item) {
      this.formData = this.formData.filter(val => val !== item);
      let obj = this.findType(item)
      obj.disabled = false
      this.countPrice()
    },
    // 打印
    handlePrintFn() {
      if (this.isBatch) {
        let arr = [];
        let allPrice = 0;
        this.allRowList.map(val => {
          allPrice = 0;
          val.childrenList.map(item => {
            item.unit = item.itemUnit;
            item.retailPrice = item.itemPriceYuan;
            item.number = item.itemNum;
            item.rowAllPrice = item.amountMoneyYuan;
            item.name = item.projectName;
            allPrice += item.rowAllPrice;
          });
          val.allRowPrices = allPrice;
          arr.push(val);
        });
        this.isShowPrintingPage.dialogVisible = true;
        this.tableDataList = arr;
        this.chargeStatus.arrears = "";
        this.chargeStatus.billingStatus = "";
        console.log(arr);
      } else {
        this.$emit("on-print");
      }
    },
    // 打开窗口
    openDialogFn() {
      this.formData = this.deepCopy(this.copyFormData)
      Object.keys(this.form).forEach( key => {
        this.form[key] = key == 'remark'? '' : 0
      })
      getPayWay().then(res => {
        let data = res.data.data.map(val=> ({...val.payWay, disabled: false}))
        this.options = data;
        this.loading = false;
      });
      
      this._initCardList(0)
      this._initWillCardList(0)
    },
    numberCheck(num) { 
      var str = num;
      var len1 = str.substr(0, 1);
      var len2 = str.substr(1, 1);
      //如果第一位是0，第二位不是点，就用数字把点替换掉
      if (str.length > 1 && len1 == 0 && len2 != ".") {
        str = str.substr(1, 1);
      }
      //第一位不能是.
      if (len1 == ".") {
        str = "";
      }
      //限制只能输入一个小数点
      if (str.indexOf(".") != -1) {
        var str_ = str.substr(str.indexOf(".") + 1);
        if (str_.indexOf(".") != -1) {
          str = str.substr(0, str.indexOf(".") + str_.indexOf(".") + 1);
        }
      }
      //正则替换，保留数字和小数点
      str = str.replace(/[^\d^\.]+/g, "");

      // str = (Math.floor(str * 100)) / 100

      // str = (Math.floor(str) * 100) / 100
      //如果需要保留小数点后两位，

      return str;
    },
    // 计算费用
    handleInput(item) {
      var reg = /^[0-9]+\.?[0-9]*$/;
      if (!item.amount) return;
      if (!reg.test(item.amount)) {
        this.$message.error("请输入正确的数字");
        return;
      }
      console.log( this.formData )
      let allNum = "";

      // amount: "", // 实收金额
      // mode: "" // 收费方式

      if (this.formData.length > 1) {
        let _n = 0
        this.formData.map( (val)=>{
          let current = 0
          if (!val.amount) {
            current = 0
          } else {
            current = parseFloat(val.amount)
          }
          _n += current
        })
        this.form.realResultFee = _n
      } else {
        this.form.realResultFee = parseFloat(item.amount);
      }

      // arrears 欠款
      // allPay 应收
      // this.form.realResultFee 合计实收
      if (this.form.realResultFee > this.saveData.discountAmountYuan) {
        this.form.arrears = 0;
        this.form.change = parseFloat(this.form.realResultFee) - parseFloat(this.saveData.discountAmountYuan);
      } else {
        this.form.arrears = parseFloat(this.saveData.discountAmountYuan) - parseFloat(this.form.realResultFee);
        this.form.change = 0;
      }
    },
    // 验证
    baseValidation() {
      let on = false
      let reg = new RegExp(/(^[\-0-9][0-9]*(.[0-9]+)?)$/)
      let voucherPriceTotle = 0;
       try {
        this.formData.forEach(val => {
          if ( !val.checkId ) throw Error('checkId');
          if(val.type == 3 ) {
            //代金券
            voucherPriceTotle += val.voucherPrice;
          }
          switch(val.type) {
            case 1:
              if ( !val.cardIds )                                           throw Error('cardIds')              // 预付卡 - 单号 
              if ( !val.cardPassword )                                      throw Error('cardPassword')         // 预付卡 - 密码
              if ( !reg.test(val.cardPrice))                                throw Error('cardPrice')            // 预付卡 - 金额
            break
            case 2:
              if ( !val.discountId )                                        throw Error('discountId')           // 折扣卡 - 账号
              if ( !val.discountPassword )                                  throw Error('discountPassword')     // 折扣卡 - 密码
              if ( !reg.test(val.discountPrice))                            throw Error('discountPrice')        // 折扣的金额 
            break
            case 3:
              if ( !val.voucherTxt )                                        throw Error('voucherTxt')           // 代金券 - 未填写
              else if(Number(val.voucherPrice) <= 0)                         throw Error('voucherNumber')           // 代金券 - 券号错误
              break
            default : 
              if ( !reg.test(val.amount))                                  throw Error('amount')               // 正常 - 支付金额
          }
        })
        if ( this.isBatch ) {
          if(Number(this.form.baseTotleAmountYuan) < Number(this.accounts)) {
            throw Error('batchTotle')
          }
        }
        
        //合计 减去 代金券抵扣金额，超过应收金额，提示
        let payWayList = this.formData;
        if(payWayList.length == 1) {
          if(payWayList[0].type != 3) {
            if(Number(this.form.baseTotleAmountYuan) > Number(this.accounts)) {
              throw Error('baseTotle')
            } 
          }
        } else if(Number(this.form.baseTotleAmountYuan) > Number(this.accounts)) {
          throw Error('baseTotle')
        } 
        on = true
      } catch (e) {
        on = false
        switch(e.message) {
          case 'checkId': 
            this.$message.error('存在未选择的收费方式，否则将无法完成收费')
          break
          // 预付卡 
          case 'cardIds': 
            this.$message.error('请选择需要使用的预付卡，否则将无法完成收费')
          break
          case 'cardPassword': 
            this.$message.error('请填写预付卡密码，否则将无法完成收费')
          break
          case 'cardPrice': 
            this.$message.error('请选择填写正确的预付卡金额，否则将无法完成收费')
          break
          // 折扣
          case 'discountId':
            this.$message.error('请选择需要使用的折扣卡，否则将无法完成收费')
          break
          case 'discountPassword':
            this.$message.error('请填写折扣卡密码，否则将无法完成收费')
          break
          case 'discountPrice':
            this.$message.error('请填写正确的折扣卡金额，否则将无法完成收费')
          break
          // 代金券 
          case 'voucherTxt':
            this.$message.error('请填输入需要使用的代金券号码，否则将无法完成收费')
          break
          case 'voucherNumber':
            this.$message.error('请填写正确的代金券号码，否则将无法完成收费')
          break
          // 正常功能收费
          case 'amount': 
            this.$message.error('请填输入正确的需要支付的金额，否则将无法完成收费')
          break
          // 批量收费不予许欠费
          case 'batchTotle':
            this.$message.error('批量收费不允许欠费，否则将无法完成收费')
            break
          // 收费不允许找零
          case 'baseTotle':
            this.$message.error('合计金额不允许大于应收金额，否则将无法完成收费')
        }
      }
      return on
    },
    filterFormData(...arg) {
      let str = ''
      arg.forEach(element => {
        if (element) str = element
      })
      return str
    },
    publicTips(id) {
      this.isShow.dialogVisible = false;
      this.$emit("on-success",'charge',id);
    },
    // 确认支付
    paymentFn() {
      if ( !this.baseValidation() ) return
      //收欠费时，收完所欠费用
      if(this.saveData.status == 4 && this.form.arrearsYuan != 0) {
        this.$message.error('请收完欠费！');
        return;
      }
      let data = {
        chargeBillId: this.saveData.id,
        chargeBillIdList: [],
        receivedAmountYuan: '',
        baseTotleAmountYuan: '',
        arrearsYuan: '',
        remark: '',
        payWayDOList: []
      }

      Object.assign( data, this.form )
      
      data.payWayDOList = this.formData.map(item => {
        console.log(item)
        let baseAmountYuan = this.filterFormData( item.voucherPrice, item.discountPrice, item.amount, item.cardPrice )
        let password = this.filterFormData( item.cardPassword, item.discountPassword )
        let cardId = this.filterFormData( item.voucherId, item.cardIds, item.discountId )
        return {
          payWayId: item.checkId,
          payWayName: item.paywayName,
          type: item.type,
          baseAmountYuan,
          payMoneyYuan: item.type == 2? item.discountMoney : baseAmountYuan,
          discount: item.type == 2? item.discountNum : 100,
          cardId,
          password
        }
      })
      this.loading = true;
      if ( this.isBatch ) {
        data.chargeBillIdList = this.allRowList.map(val => val.id) 
        console.log('批量',data)
        postBatchcharge(data).then(res => {
          if (res.data.code == 200) {
            this.isShow.dialogVisible = false;
            this.$emit("on-send");
          } else {
            this.loading = false;
            // this.$message.error(res.data.msg)
          }
        });
      } else {
        console.log('单次',data)
        postCollect(data).then(res => {
          if (res.data.code == 200) {
            this.publicTips(res.data.data.id)
          } else {
            // this.$message.error(res.data.msg)
            this.loading = false;
          }
        })
      }

      

    },
    // 初始化 - 预付卡
    _initWillCardList(index) {
      let { id } = this.patientMsg
      getWillCard(id).then(res => {
        let data = res.data.data
        if (data.length) {
          this.formData[index].cardList = data
          this.cardList = data
        } else {
          this.formData[index].cardList = []
          this.formData[index].cardIds = ''
          this.formData[index].cardPrice = ''
        }

      })
    },
    // 初始化 - 折扣卡
    _initCardList(index) {
      let { id } = this.patientMsg
      getPatientCardList(id).then(res => {
        this.formData[index].discountList = res.data.data
        this.discountList = res.data.data
      })
    },
    //取消保存
    cancelSaveFn() {
      this.isShow.dialogVisible = false;
      this.$emit('cancel-charge-save',this.saveData.id);
    },
  },
  mixins: [],
  mounted() {
    this.copyFormData = this.deepCopy(this.formData)
  }
};
</script>
<style lang="less" scoped>
@blue: rgb(59, 120, 253);
.df(@just:flex-end) {
  display: flex;
  align-items: center;
  justify-content: @just;
}
.btns {
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
.red,
.green {
  font-size: 15px;
  font-weight: bold;
}
.red {
  color: #ff4e65;
}
.green {
  color: #8bd836;
}
.content {
  .header {
    .df(flex-start);
    padding-bottom: 20px;
    .item {
      margin-right: 30px;
    }
  }
  .mains {
    .main_num {
      height: 40px;
      padding: 0 20px;
      line-height: 40px;
      background: rgb(245, 247, 255);
    }
    .main_tab {
      height: 400px;
      padding: 20px;
    }
    .delete {
      display: block;
      margin-top: 6px;
      margin-left: 40px;
      cursor: pointer;
      width: 24px;
      height: 24px;
      background: url("../../../../../assets/img/delete.png") no-repeat;
    }
  }
}

.bottom {
  .df(space-between);
  height: 60px;
  padding: 0 20px;
  border-top: 1px solid #eee;
  .btn_right {
    .df();
  }
  .btns {
    display: block;
    cursor: pointer;
    margin-right: 20px;
    padding: 0 20px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: @blue;
    border: 1px solid @blue;
  }
}
.blues {
  background: @blue;
  color: #fff !important;
}
.expand_wraps {
  text-align: center;
  .headers {
    height: 40px;
    background: #f5f7ff;
    .df(space-between);
    li {
      width: 20%;
    }
  }
  .items {
    .df(space-between);
    height: 40px;
    li {
      width: 20%;
    }
  }
}
.baseDf {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.add_btn {
  cursor: pointer;
  font-size: 24px;
}
.form_item {
  position: relative;
}
.posi_box {
  padding-top: 20px;
  // position: absolute;
}
.item_right {
  padding-right: 10px;
}
</style>