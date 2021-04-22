<!--
 * @Descripttion: 套餐
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-09-23 14:05:12
 -->
<template>
  <div class="charge_item Promotion">
    <div class="header">
      <div class="add_btn" @click="itemDialog('add')">新增促销套餐</div>
    </div>
    <div class="wrapper_table1" id="wrapper_table1">
      <el-table
        highlight-current-row
        ref="singleTable"
        :height="tableHeight"
        :data="list"
        style="font-size: 14px"
        :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
      >
        <el-table-column sortable prop="packageName" label="套餐名称" align="center"></el-table-column>
        <el-table-column sortable prop="chargeItem" label="套餐项目" align="center"></el-table-column>
        <el-table-column sortable prop="amountYuan" label="套餐价" align="right">
          <template slot-scope="scope">￥ {{scope.row.amountYuan}}</template>
        </el-table-column>
        <el-table-column label="有效期限" sortable align="center">
          <template slot-scope="scope">{{scope.row.status ? '永久有效' : scope.row.term}}</template>
        </el-table-column>

        <el-table-column label="状态" sortable align="center">
          <template slot-scope="scope">{{scope.row.statusStr }}</template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" sortable align="center"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope" style="marginLeft:-25px">
            <el-button type="text" size="small" @click="itemDialog('edit',scope.row.id)">编辑</el-button>
            <span class="line">|</span>
            <el-dropdown>
              <span class="el-dropdown-link">
                <el-button type="text" size="small">更多</el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <p @click="itemDel(scope.row.id)">删除</p>
                </el-dropdown-item>
                <el-dropdown-item  v-if='scope.row.hasMenu'>
                  <p @click="commonfn(scope.row.id)">同步门店</p>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>

        <template slot="empty">
          <img style="width:350px;" src="../../../assets/img/blank.png" alt />
        </template>
      </el-table>
      <div class="pagination_box">
        <div class="block">
          <el-pagination
            prev-text="上一页"
            next-text="下一页"
            background
            layout="total,prev,pager,next,sizes,jumper"
            :page-sizes="[4, 10, 15, 20]"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :pager-count="9"
            :total="formSearch.totalNumber"
            :current-page="formSearch.page"
          ></el-pagination>
        </div>
      </div>
    </div>

    <!-- 收费项目的弹窗 -->
    <el-dialog
      :title="itemDialogTitle"
      :visible.sync="itemDialogFla"
      :closeOnClickModal="false"
      :lock-scroll="false"
      @open="openDialog"
      @close="closeDialog"
      width="980px"
      top="8vh"
      center
    >
      <div class="content">
        <div class>
          <div class="aside_nav" v-if="isComboUse && isShowAsid">
            <el-tabs v-model="activeName" type="border-card">
              <el-tab-pane label="诊疗服务" name="0">
                <div class="search_box">
                  <el-input
                    size="small"
                    placeholder="编码名称/名称/首字母"
                    @input="searchServeFn"
                    v-model="searchServe"
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
                              <span>{{val.itemName}} ￥{{val.retailPriceYuan}}</span>
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
              <el-tab-pane label="商品销售" name="1">
                <div class="search_box">
                  <el-input
                    size="small"
                    placeholder="编码名称/名称/首字母"
                    @input="searchServeFn"
                    v-model="searchServe"
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
                              <span>{{val.name}} ￥{{val.retailPriceYuan}}</span>
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
                        <el-button type="text" style="color:#666">{{val.name}}</el-button>
                      </li>
                    </ul>
                  </vuescroll>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div class="right_box">
          <vuescroll :ops="ops">
            <div class="detail_wrap">
              <el-form ref="form" :rules="rules" :model="form">
                <div class="floor">
                  <div class="floor_seach">
                    <el-row class="floor_row">
                      <el-col :span="12">
                        <el-form-item label="套餐名称" label-width="80" prop="packageName">
                          <el-input
                            maxlength="32"
                            v-model="form.packageName"
                            placeholder="请输入内容最多不超过32个字符"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                  <el-table
                    ref="itemRuleForm"
                    :data="tableDataList"
                    style="font-size: 14px"
                    height="270px"
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
                          onkeyup="value=value.replace(/[^\d]/g,'')"
                          v-show="isComboUse && isShowAsid"
                        ></el-input>
                        <span v-show="!isComboUse || !isShowAsid">{{scope.row.number}}</span>
                      </template>
                    </el-table-column>

                    <el-table-column prop="discountFlag" label="是否允许打折" align="center">
                      <template slot-scope="scope">
                        <span>{{parseInt(scope.row.discountFlag)? '无折扣' : '折扣'}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="rowAllPrice" label="金额" align="center">
                      <template slot-scope="scope">
                        <span>{{scope.row.rowAllPrice|currency()}}</span>
                      </template>
                    </el-table-column>

                    <el-table-column label="操作" align="center" v-if="isComboUse && isShowAsid">
                      <template slot-scope="scope">
                        <i class="el-icon-delete delete" @click="handleDeleteFn(scope.row)"></i>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div class="all_price">
                    <span>费用合计：</span>
                    <span class="red">￥{{allPrice | currency()}}</span>
                  </div>
                </div>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="套餐价" label-width="80" prop="amountYuan">
                      <el-input maxlength="10" v-model="form.amountYuan" placeholder="请输入"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="term_row">
                  <el-col :span="10" class="term_box">
                    <el-form-item label="有效期限" label-width="80" prop="status">
                      <template>
                        <el-radio v-model="form.status" :label="1">永久有效</el-radio>
                        <el-radio v-model="form.status" :label="0">设置时间</el-radio>
                      </template>
                    </el-form-item>
                  </el-col>
                  <el-col class="box" :span="10">
                    <el-form-item v-if="!form.status" prop="activityTimeArr">
                      <el-date-picker
                        class="time"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        v-model="form.activityTimeArr"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="19">
                    <el-form-item label="备注" label-width="80" prop="remark">
                      <el-input placeholder="请输入内容最多不超过100个字符" v-model="form.remark"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </vuescroll>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="itemForm('form')">保存</el-button>
        <el-button @click="itemDialogFla = false">取 消</el-button>
      </span>
    </el-dialog>
    <activity-sync-dialog :dialog="dialog" @submitSync="submitSync"></activity-sync-dialog>
  </div>
</template>

<script>
import monment from "moment";
import {
  getAsideService,
  getAsideDrug,
  getAsideServiceChild,
  getSearchData,
  saveChargepackage,
  updataChargepackage,
  getChargepackageList,
  getChargepackagePage,
  getChargepackageInfo,
  deleteChargepackage,
  getChargepackagedto,
  getCashcouponactivitydo,
  saveSynchChargePackages,
  getSynchChargePackageById
} from "@/api";
import vuescroll from "vuescroll";
import {SYSTEM_HTTP_SUCCESS} from "@/constant"
import ActivitySyncDialog from './components/ActivitySyncDialog'
export default {
  name: "Promotion",
  components: {
    vuescroll,
    ActivitySyncDialog
  },
  data() {
    var reg = /^\d+(\.\d{0,2})?$/;
    var checkAmountYuan = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入金额"));
      }
      if (!reg.test(value)) {
        callback(new Error("请输入数字值最多两位小数"));
      }
      if (!(Number(value) > 0)) {
        callback(new Error("必须大于0"));
      }
      callback();
    };
    return {
      dialog: {
        isshow: false,//同步门店dialog
        id: '',
        institutionIdList: []
      },
      isShowAsid: true,
      itemDialogFla: false,
      comboName: 0,
      isShowComb: true,
      isAllPrice: "",
      specialClinic: "", // 特诊
      achievements: "",
      timeValue: "",
      visitTimeId: "",
      nurseId: "",
      doctorId: "",
      activeName: "0",
      searchServe: "",
      medicalServices: [],
      tableHeight: 300,
      commoditySales: [],
      doctorSearchData: [],
      nurseSearchData: [],
      chargePaymentRecordList: [],
      comboList: [],
      allPrice: "",
      discount: 100,
      remark: "",
      tableDataList: [],
      itemList: [],
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
      selectData: {
        doctorlist: [],
        nurselist: [],
        visitTimeList: []
      },
      // 支付详情
      payForm: {},
      itemDialogTitle: "新增促销套餐",
      formSearch: {
        //项目搜索
        commExpClassId: "",
        itemCode: "",
        itemName: "",
        totalNumber: 0,
        page: 1,
        pageSize: 10
      },
      commExpClass: [], //子类
      list: [],
      form: {
        packageName: "",
        amountYuan: "",
        status: 1,
        activityTimeArr: [],
        originalAmountYuan: "",
        startTime: "",
        endTime: "",
        term: "",
        remark: ''
      },
      rules: {
        packageName: [
          { required: true, message: "请输入名称", trigger: "blur" }
        ],
        amountYuan: [
          { required: true, validator: checkAmountYuan, trigger: "blur" }
        ],
        status: [{ required: true, message: "请输选择期限", trigger: "blur" }],
        activityTimeArr: [
          { required: true, message: "请输选择期限", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    "form.status"(val) {
      if (val) {
        this.form.activityTimeArr = [];
        this.form.startTime = "";
        this.form.endTime = "";
      }
    }
  },
  computed: {
    isComboUse(val) {
      return this.comboName == 0 ? true : false;
    }
  },
  mounted() {
    this.setData();
    this.$nextTick(() => {
      let height = document.getElementById("wrapper_table1").offsetHeight;
      this.tableHeight = height - 60;
    });
  },
  methods: {
    setData() {
      getChargepackagePage(this.formSearch).then(res => {
        res.data.data
          ? (this.list = res.data.data)
          : (this.list = []);

        this.list.map(item => {
          item.term =
            this.getTime(item.startTime) + "~" + this.getTime(item.endTime);
          return item;
        });
        this.formSearch.totalNumber = res.data.totalNumber;
      });
      this.initLeftAsidde();
    },
    itemForm(formName) {
      //项目表单
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.amount) this.$delete(this.form, "amount");
          if (this.form.originalAmount)
            this.$delete(this.form, "originalAmount");
          if (this.tableDataList.length < 1) {
            this.$message.error("请选择项目");
            return;
          }

          let itemList = [];
          this.form.startTime = this.form.activityTimeArr[0] || "";
          this.form.endTime =
            this.handEndTime(this.form.activityTimeArr[1]) || "";
          this.form.originalAmountYuan = this.allPrice;

          if (this.form.id) {
            this.tableDataList.map(item => {
              if (item.itemId) {
                itemList.push({
                  id: item.id,
                  itemUnit: item.unit,
                  itemPriceYuan: item.retailPriceYuan,
                  itemNum: item.number,
                  itemId: item.itemId,
                  itemType: item.itemType,
                  discountFlag: item.discountFlag,
                  amountMoneyYuan: item.rowAllPrice
                });
              } else {
                itemList.push({
                  itemUnit: item.unit,
                  itemPriceYuan: item.retailPriceYuan,
                  itemNum: item.number,
                  itemId: item.id,
                  itemType: item.itemType,
                  discountFlag: item.discountFlag,
                  amountMoneyYuan: item.rowAllPrice
                });
              }
            });

            updataChargepackage({ chargePackage: this.form, itemList }).then(
              res => {
                if (res.data.code == 200) {
                  this.itemDialogFla = false;
                  this.setData();
                }
              }
            );
          } else {
            this.tableDataList.map(item => {
              itemList.push({
                itemId: item.id,
                itemUnit: item.unit,
                itemPriceYuan: item.retailPriceYuan,
                itemNum: item.number,
                itemType: item.itemType,
                discountFlag: item.discountFlag,
                amountMoneyYuan: item.rowAllPrice
              });
            });
            saveChargepackage({ chargePackage: this.form, itemList }).then(
              res => {
                if (res.data.code == 200) {
                  this.itemDialogFla = false;
                  this.setData();
                }
              }
            );
          }
        } else {
          return false;
        }
      });
    },
    getTime(t) {
      return monment(t).format("YYYY-MM-DD");
    },
    closeDialog() {
      this.tableDataList = [];
    },
    openDialog() {},
    // ...................收费弹窗 .................
    // 搜索诊疗服务
    searchServeFn() {
      getSearchData({
        search: this.searchServe,
        type: parseInt(this.activeName)
      }).then(res => {
        const arr = ["medicalServices", "commoditySales"];
        let _D = res.data.data;
        _D = _D.map(val =>
          this.addDataAttribute(val, arr[Number(this.activeName)])
        );
        parseInt(this.activeName)
          ? (this.nurseSearchData = _D)
          : (this.doctorSearchData = _D);
      });
    },
    // 输入框 求值 的时候
    inputChangeFn(row, scope) {
      if (row.number < 1) {
        row.number = 1;
      }
      this.totalPriceFn();
      this.totalRowPriceFn(row);
      this.compAllPrice();
    },
    handleSelcet(id) {
      this.selectData.doctorlist.map(val => {
        if (val.id == id) {
          this.docNames = val.name;
        }
      });
    },
    // 选中一级菜单
    selectNav(item, index) {
      item.is = !item.is;
      if (!item.isClick) {
        // console.log(item);

        this.getAsideChildFn(item).then(
          callBackData => (item.childListData = callBackData)
        );
        item.isClick = true;
      }
    },
    // 点击子集
    handleChilden(val) {
      if (this.filterData(val)) {
        this.totalRowPriceFn(val);
      } else {
        val.number = 1;
        this.tableDataList.push(val);
        console.log(this.tableDataList);
      }
      this.achievements = "";
      this.totalPriceFn();
      this.compAllPrice();
    },
    // 处理子集数据
    getAsideChildFn({ id, type, isNames }) {
      if (isNames == "medicalServices") {
        // 诊疗服务
        return getAsideServiceChild(id).then(res => {
          return res.data.data.map(val => {
            return this.addDataAttribute(val, isNames, id);
          });
        });
      } else {
        alert("这个没有jie口");
      }
    },
    // 通用增加属性 基于aside
    addDataAttribute(val, isNames, id) {
      val.doc = this.doctorId;
      val.nurse = this.nurseId;
      val.number = 1;
      val.rowAllPrice = val.retailPriceYuan;
      (val.isNames = isNames), (val.itemClassId = val.commExpClassId);
      val.itemType = isNames == "medicalServices" ? 0 : 1;
      return val;
    },
    initLeftAsidde() {
      getAsideService().then(
        res =>
          (this.medicalServices = this.eachData(
            res.data.data,
            "medicalServices"
          ))
      );
      getAsideDrug().then(
        res =>
          (this.commoditySales = this.eachData(res.data.data, "commoditySales"))
      );
    },
    eachData(data, name) {
      console.log(data, name);

      return data.map(val => {
        val.is = false;
        val.childListData = [];
        val.isNames = name;
        return val;
      });
    },
    filterData(val) {
      let _is = false;
      this.tableDataList = this.tableDataList.map((item, index) => {
        if (item.itemId) {
          if (
            item.isNames == val.isNames &&
            parseInt(item.itemId) == parseInt(val.id)
          ) {
            item.number = parseFloat(item.number) + 1;
            item.rowAllPrice =
              parseFloat(item.number) * parseFloat(item.retailPriceYuan);
            _is = true;
          }
        } else {
          if (
            item.isNames == val.isNames &&
            parseInt(item.id) == parseInt(val.id)
          ) {
            item.number = parseFloat(item.number) + 1;
            item.rowAllPrice =
              parseFloat(item.number) * parseFloat(item.retailPriceYuan);
            _is = true;
          }
        }
        return item;
      });
      return _is;
    },
    // 回退计算
    Backstepping() {
      // allPrice 费用合计
      // discount 折扣
      // isAllPrice 应收合计
      // discountFlag)? '无折扣' : '折扣'
      if (!this.tableDataList.length) return;
      let all = 0;
      let flag = 0;
      this.tableDataList.forEach((val, index) => {
        if (!Number(val.discountFlag)) {
          all += Number(
            (
              (Number(val.number) * Number(val.retailPriceYuan) * 100) /
              100
            ).toFixed(1)
          );
        } else {
          flag += Number(
            (
              (Number(val.number) * Number(val.retailPriceYuan) * 100) /
              100
            ).toFixed(1)
          );
        }
      });

      if (all) {
        this.discount = Math.round(
          ((Number(this.isAllPrice) - flag) / all) * 100
        );
      }
    },
    // 套餐值变化
    changeComboFn(id) {
      if (id != 0) {
        this.getChargePackageFn(id);
      } else {
        this.discount = 100;
        this.isAllPrice = "";
        this.allPrice = "";
        this.tableDataList = [];
      }
    },
    // 计算应收合计
    compAllPrice() {
      // 0 可以 1 不可以
      let isAll = 0;
      if (this.discount == 0) {
        this.isAllPrice = this.allPrice;
        return;
      }
      if (this.discount !== 0 || this.discount !== "") {
        this.tableDataList.map(val => {
          if (parseInt(val.discountFlag)) {
            isAll += parseInt(val.number) * val.retailPriceYuan;
          } else {
            isAll +=
              ((Number(this.discount) / 100) *
                Number(val.number) *
                Number(val.retailPriceYuan) *
                100) /
              100;
          }
        });
      } else {
        isAll = this.allPrice;
      }
      this.isAllPrice = isAll.toFixed(1);
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
        all += parseInt(val.number) * val.retailPriceYuan;
      });
      this.allPrice = all;
    },
    // 计算一行的数据
    totalRowPriceFn(row) {
      row.rowAllPrice =
        parseFloat(row.number) * parseFloat(row.retailPriceYuan);
    },
    // 删除一行数据
    handleDeleteFn(row) {
      this.tableDataList = this.tableDataList.filter(item => item !== row);
      this.totalPriceFn();
      this.compAllPrice();
    },
    // ...................收费弹窗 end.................
    itemDialog(type, id) {
      let _this = this;
      _this.itemDialogFla = true;
      if (type == "add") {
        _this.itemDialogTitle = "新增促销套餐";
        _this.allPrice = "";
        setTimeout(function() {
          _this.$refs["form"].resetFields();
        }, 100);
        this.$delete(this.form, "id");
      } else {
        _this.itemDialogTitle = "修改促销套餐";

        getChargepackageInfo(id).then(res => {
          Object.assign(this.form, res.data.data.chargePackage);
          let timeArr = [];
          timeArr[0] = res.data.data.chargePackage.startTime || "";
          timeArr[1] = res.data.data.chargePackage.endTime || "";
          // this.$set(this.form, "activityTimeArr", timeArr);
          if(res.data.data.chargePackage.status){
            this.form.activityTimeArr=[]
          }else{
            this.form.activityTimeArr=timeArr
          }
          this.$set(this.form, "status", res.data.data.chargePackage.status);
          this.allPrice = res.data.data.chargePackage.originalAmountYuan;
          this.tableDataList = res.data.data.listChargePackageItem.map(item => {
            item.itemName = item.projectName;
            item.unit = item.itemUnit;
            item.retailPriceYuan = item.itemPriceYuan;
            item.number = item.itemNum;
            item.rowAllPrice = item.amountMoneyYuan;
            item.isNames = "medicalServices";
            // this.allPrice = item.originalAmountYuan;
            return item;
            // item.itemName=item.itemUnit;
            // item.itemName=item.itemUnit;
          });
          // this.$set(this.form, "id", res.data.data.chargePackage.id);
        });
      }
    },
    itemDel(id) {
      this.$confirm("确定要删除吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteChargepackage(id).then(res => {
            if (res.data.code == 200) {
              this.setData();
            }
          });
        })
        .catch(() => {});
    },
    handleSizeChange(pageSize) {
      this.formSearch.pageSize = pageSize;
      this.setData();
    },
    handleCurrentChange(val) {
      this.formSearch.page = val;
      this.setData();
    },
    inquire() {
      this.formSearch.page = 1;
      this.setData();
    },
    handEndTime(t) {
      if (t) {
        return t.replace(t.substring(t.length - 8), "23:59:59");
      } else {
        return "";
      }
    },
    commonfn(id) {
      /**
       * 打开同步到分店dialog
       */
      this.dialog.isshow = true;
      this.dialog.id = id;
      getSynchChargePackageById(id).then(res => {
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.dialog.institutionIdList = res.data.data.institutionIdList;
        }
      })
    },
    submitSync(data) {
      /**
       * 提交同步到分店
       */
      let formData = new FormData();
      formData.append('institutionIdList',data);
      formData.append('chargePackageId', this.dialog.id);
      saveSynchChargePackages(formData).then(res => {
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.dialog.isshow = false;
        }
      })
    }
  },
  mixins: []
};
</script>
<style lang="less" scoped>
.Promotion {
  width: 100%;
  height: 100%;
  position: relative;
}
.wrapper_table1 {
  position: absolute;
  left: 0;
  right: 0;
  top: 0px;
  bottom: 50px;
}

@blue: rgb(59, 120, 253);
@bacColor: rgb(236, 242, 252);
.df(@dir:flex-end) {
  display: flex;
  align-items: center;
  justify-content: @dir;
}
.charge_item {
  position: relative;

  .el-dialog {
    .el-select {
      width: 100%;
    }
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
  border: 1px solid #e4e9ff;
  display: flex;
  .aside_nav {
    width: 200px;
    // margin-top: 10px;
    border-right: 1px solid #e4e9ff;
    // margin-right: 20px;
  }
}
.detail_wrapper {
  position: relative;
  height: 100%;
  flex: 2;
}
.detail_wrap {
  width: 700px;
  margin: 10px 5px 5px 10px;
  // box-shadow: 0 0 6px 0 #e4e9ff;
  .floor {
    .floor_seach {
      height: 74px;
      padding-top: 15px;
      padding-bottom: 8px;
      .floor_row {
        span {
          line-height: 40px;
        }
      }
    }
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
.all_price {
  height: 60px;
  padding: 0 20px;
  .df(flex-end);
}
.left {
  float: left;
}
.scroll_wrap {
  height: 512px;
  padding-bottom: 32px;
}
.header {
  .add_btn {
    cursor: pointer;
    position: absolute;
    right: 0;
    top: -60px;
    width: 154px;
    height: 48px;
    font-size: 18px;
    font-weight: bold;
    color: #4e81f2;
    text-align: center;
    line-height: 48px;
    -webkit-box-shadow: 0 0 6px 0 #e4e9ff;
    box-shadow: 0 0 6px 0 #e4e9ff;
    background-color: #ffffff;
    margin-right: 20px;
  }
}
.time {
  width: 100%;
}
.red {
  color: red;
  font-weight: bold;
}
.img_box {
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    height: 100%;
  }
}
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
</style>
<style lang="less">
.Promotion {
  .el-tabs--border-card {
    border: none;
    box-shadow: none;
  }
  .el-form-item__content {
    margin-left: 80px;
  }
  .box .el-form-item__content {
    margin-left: 10px;
  }
  .el-form-item__label {
    width: 80px;
  }
  .el-dialog__body {
    padding: 10px 10px;
  }
  .el-table__empty-text {
    margin-top: -70px;
  }
  .el-pagination__jump {
    margin-left: 0px;
  }
}
</style>
