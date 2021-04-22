<!--
 * @Author: jyp
 * @Date: 2019-07-01 09:11:18
 * @LastEditors: hzj
 * @LastEditTime: 2019-09-23 15:55:11
 * @Description: 代金券活动
 -->
<template>
  <div class="charge_item cashcoupon">
    <div class="header">
      <div class="add_btn" @click="itemDialog('add')">新增代金券</div>
    </div>
    <div class="wrapper_table1" id="wrapper_table1">
      <el-table
        highlight-current-row
        :height="tableHeight"
        ref="singleTable"
        :data="list"
        style="font-size: 14px"
        :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
      >
        <el-table-column sortable prop="name" label="活动名称" align="center"></el-table-column>
        <el-table-column sortable prop="amountYuan" label="抵扣金额" align="right">
          <template slot-scope="scope">￥ {{scope.row.amountYuan}}</template>
        </el-table-column>
        <el-table-column sortable prop="useTerm" label="使用时间" align="center"></el-table-column>
        <el-table-column label="状态" sortable align="center">
          <template slot-scope="scope">{{scope.row.status}}</template>
        </el-table-column>
        <el-table-column prop="activityTerm" label="活动时间" sortable align="center"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="itemDialog('edit',scope.row.id)">编辑</el-button>
            <span class="line">|</span>
            <el-dropdown align="right" trigger="click">
              <span class="el-dropdown-link">
                <el-button type="text" size="small">更多</el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="moreEvent(0,scope.row)">
                  <span class="setIcon"></span>记录
                </el-dropdown-item>

                <el-dropdown-item @click.native="moreEvent(1,scope.row)">
                  <span class="outIcon"></span>删除
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
      width="460px"
      center
    >
      <div class="content">
        <el-form
          :model="itemRuleForm"
          :rules="rules"
          ref="itemRuleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-row>
            <!-- <el-col :span="11"> -->
            <el-form-item label="活动名称" prop="name">
              <el-col :span="24">
                <el-input v-model="itemRuleForm.name" maxlength="32" placeholder="请输入内容最多不超过32个字符"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="抵扣金额" prop="amountYuan">
              <el-col :span="24">
                <el-input v-model="itemRuleForm.amountYuan" maxlength="6" placeholder="请输入"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="数量" prop="number">
              <el-row>
                <!-- <el-col :span="12">
                  <template>
                    <el-radio v-model="radio" :label="1">不限</el-radio>
                    <el-radio v-model="radio" :label="0">自定义</el-radio>
                  </template>
                </el-col>-->
                <el-col :span="9" v-if="!radio">
                  <el-input
                    v-if="!radio"
                    v-model="itemRuleForm.number"
                    maxlength="12"
                    placeholder="请输入"
                  ></el-input>
                </el-col>
                <el-col v-if="!radio" :offset="1" :span="1">张</el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="活动有效期" prop="activityTimeArr">
              <el-col :span="24">
                <el-date-picker
                  class="selectTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  v-model="itemRuleForm.activityTimeArr"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="使用有效期" prop="useTimeArr">
              <el-col :span="24">
                <el-date-picker
                  class="selectTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  v-model="itemRuleForm.useTimeArr"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="券号编码 " prop="code">
              <el-row>
                <el-col :span="8">
                  <el-input v-model="itemRuleForm.code" maxlength="12" placeholder="请输入"></el-input>
                </el-col>
                <el-col :span="8">+发放序号</el-col>
              </el-row>
              <el-row>
                <p class="example">(例：ABC001~ABC001)</p>
              </el-row>
            </el-form-item>
            <el-form-item label="使用规则 " prop="useRule">
              <el-col :span="24">
                <el-input
                  maxlength="200"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="不超过200字"
                  v-model="itemRuleForm.useRule"
                ></el-input>
              </el-col>
            </el-form-item>
            <!-- </el-col> -->
            <!-- <el-col class="left" :offset="1" :span="9">
              <div>
                <span>使用范围</span>
                <span @click="selectDialog=true">选择</span>
              </div>
              <el-col>
                <el-row type="flex" class="row-bg" justify="space-between">
                  <div class="comp" style>
                    <div class="class_box">
                      <el-tag
                        @click="clickTag"
                        @close="closeTag(index)"
                        class="tag"
                        v-for="(tag,index) in tableDataList"
                        :key="index"
                        closable
                        :type="tag.type"
                      >{{tag.name}}</el-tag>
                    </div>
                  </div>
                </el-row>
              </el-col>
            </el-col>-->
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="itemForm('itemRuleForm')">保存</el-button>
        <el-button size="small" @click="itemDialogFla = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="选择使用范围" class="range" :visible.sync="selectDialog" width="400px" center>
      <div slot="header"></div>
      <div class="content">
        <div>
          <div class="menu_box">
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
                        <li
                          v-for="(item, index) in medicalServices"
                          :key="index"
                          class="item_title"
                        >
                          <div class="titles" @click="selectNav(item, index)">
                            <i class="el-icon-caret-bottom" v-show="item.is"></i>
                            <i class="el-icon-caret-right" v-show="!item.is"></i>
                            <el-button type="text" style="color:#666">{{item.name}}</el-button>
                          </div>
                          <ul class="childNav" v-show="item.is">
                            <li
                              v-for="(val, index) in item.childListData"
                              :key="index"
                              @click="handleChilden(val,0,item.childListData)"
                            >
                              <p stylr="ineHeight:20px;">
                                <span>{{val.expName}} ￥{{val.retailPriceYuan}}</span>
                                <span :class="{'el-icon-check': val.isChecked}"></span>
                              </p>
                            </li>
                          </ul>
                        </li>
                      </ul>

                      <ul class="childNav" v-show="searchServe">
                        <li
                          v-for="(val, index) in doctorSearchData"
                          :key="index"
                          @click="handleChilden(val,0)"
                        >
                          <el-button type="text" style="color:#666">{{val.expName}}</el-button>
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
                            <el-button type="text" style="color:#666">{{item.name}}</el-button>
                          </div>
                          <ul class="childNav" v-show="item.is">
                            <li
                              v-for="(val, index) in item.childListData"
                              :key="index"
                              :class="{is_active_checked:val.isChecked}"
                              @click="handleChilden(val,1)"
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
                          @click="handleChilden(val,1)"
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
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="itemForm('itemRuleForm')">确 定</el-button>
        <el-button @click="selectDialog = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 弹窗 -->
    <div class="record_box">
      <el-dialog
        :closeOnClickModal="false"
        :title="recordTitle"
        class="record"
        :visible.sync="RecordDialog"
        style="font-size: 14px"
        width="30%"
        center
      >
        <div class="content">
          <div class="tabs_chunk">
            <!-- <base-tabs ref="active" v-model="checkedIndex" @on-click="getParentIndex">
            <base-pane label="发放记录"></base-pane>
            <base-pane label="使用记录"></base-pane>
            </base-tabs>-->
          </div>
        </div>
        <div class="table_box">
          <!-- <div class="grant" v-if="tableShow">
          <el-table
            highlight-current-row
            class="record_table"
            ref="grantTable"
            height="350"
            :data="grantList"
            :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
          >
            <el-table-column prop="name" label="发放时间" sortable align="center"></el-table-column>
            <el-table-column prop="name" label="发放数量" sortable align="center"></el-table-column>
            <el-table-column prop="name" label="券号编码" sortable align="center"></el-table-column>
          </el-table>
          </div>-->
          <div class="use">
            <el-table
              highlight-current-row
              ref="useTable"
              class="record_table"
              :data="recordList"
              height="350"
              style="font-size: 14px;background:#fff;"
              :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000',height:'60'}"
            >
              <el-table-column prop="patient.patientName" label="患者" sortable align="center"></el-table-column>
              <el-table-column prop="code" label="券号" sortable align="center"></el-table-column>
              <el-table-column prop="useTime" label="使用时间" sortable align="center"></el-table-column>
            </el-table>
            <div class="small_box">
              <div class="small_block">
                <el-pagination
                  layout="prev,pager,next"
                  :page-sizes="[4, 10, 15, 20]"
                  @size-change="usehandleSizeChange"
                  @current-change="usehandleCurrentChange"
                  :pager-count="9"
                  :total="10"
                  :current-page="1"
                ></el-pagination>
              </div>
            </div>
          </div>
        </div>
        <!-- <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="classForm('classForm')">确 定</el-button>
        <el-button @click="RecordDialog = false">取 消</el-button>
        </span>-->
      </el-dialog>
    </div>
    <activity-sync-dialog :dialog="dialog" @submitSync="submitSync"></activity-sync-dialog>
  </div>
</template>

<script>
import vuescroll from "vuescroll";
import monment from "moment";
import {SYSTEM_HTTP_SUCCESS} from "@/constant"
import ActivitySyncDialog from './components/ActivitySyncDialog'
import {
  getAsideService,
  getAsideDrug,
  getAsideServiceChild,
  getSearchData,
  saveCashcouponactivity,
  updataCashcouponactivity,
  getCashcouponactivityPage,
  deleteCashcouponactivity,
  getCashcouponactivitydo,
  getEditCashcouponactivity,
  queryCashcouponnumber,
  saveCashcouponActivitys,
  getCashCouponActivityById
} from "@/api";
export default {
  name: "Cashcoupon",
  components: {
    vuescroll,
    ActivitySyncDialog
  },
  data() {
    var reg = /^\d+(\.\d{0,2})?$/;
    var regLetter = new RegExp("^[a-zA-Z]+$");
    var checkAmountYuan = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("抵扣金额不能为空"));
      }
      if (!reg.test(value)) {
        callback(new Error("请输入数字值最多两位小数"));
      }
      if (!(Number(value) > 0)) {
        callback(new Error("必须大于0"));
      }
      callback();
    };
    var checkNumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("数量不能为空"));
      }
      if (!Number(value)) {
        return callback(new Error("必须为数字"));
      }
      if (!(Number(value) > 0)) {
        return callback(new Error("必须大于0"));
      }
      if (!(Number(value) < 300)) {
        callback(new Error("必须小于300"));
      }
      callback();
    };
    var checkCode = (rule, value, callback) => {
      if (!regLetter.test(value)) {
        return callback(new Error("必须为字母"));
      }
      callback();
    };
    return {
      dialog: {
        isshow: false,//同步门店dialog
        id: '',
        institutionIdList: []
      },
      tableHeight: 500,
      radio: 0,
      tags: [{ name: "标签一", type: "" }],
      typeArr: ["success", "info", "warning", "danger", ""],
      tableDataList: [],
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
      commoditySales: [],
      doctorSearchData: [],
      nurseSearchData: [],
      chargePaymentRecordList: [],
      comboList: [],
      allPrice: "",
      discount: 100,
      remark: "",
      itemList: [],
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

      checkedIndex: false,
      RecordDialog: false,
      itemDialogFla: false,
      selectDialog: false,
      recordTitle: "使用记录",
      recordList: [],
      itemDialogTitle: "新增代金券",
      formSearch: {
        //项目搜索
        commExpClassId: "",
        itemCode: "",
        expName: "",
        totalNumber: 0,
        page: 1,
        pageSize: 10
      },
      commExpClass: [], //子类
      list: [],
      grantList: [1, 2, 3],
      useList: [1, 2, 3],
      tableShow: true,
      itemRuleForm: {
        id: "",
        name: "",
        number: 100,
        amountYuan: "",
        activityStartTime: "",
        activityEndTime: "",
        code: "",
        status: "",
        useRule: "",
        useStartTime: "",
        useEndTime: "",
        activityTimeArr: [],
        useTimeArr: [],
        activityTerm: "",
        useTerm: "",
        checkNum: true
      },
      chargeItemList: [101],
      drugList: [1],
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        amountYuan: [
          { required: true, validator: checkAmountYuan, trigger: "blur" }
        ],
        number: [{ required: true, validator: checkNumber, trigger: "blur" }],
        activityTimeArr: [
          { required: true, message: "请选择活动有效期", trigger: "change" }
        ],
        useTimeArr: [
          { required: true, message: "请选择使用有效期", trigger: "change" }
        ],
        code: [{ trigger: "blur", validator: checkCode }],
        useRule: [{ required: true, message: "请输入规则", trigger: "change" }]
      }
    };
  },
  watch: {
    radio(val) {
      if (val) {
        this.itemRuleForm.number = 1;
      } else {
        this.itemRuleForm.number = "";
      }
    },
    "itemRuleForm.number"(val) {
      if (val === -1) {
        this.radio = 1;
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
    this.initLeftAsidde();
    this.$nextTick(() => {
      let height = document.getElementById("wrapper_table1").offsetHeight;
      this.tableHeight = height;
    });
  },
  methods: {
    setData() {
      getCashcouponactivityPage(this.formSearch).then(res => {
        this.list = res.data.data;
        this.list = res.data.data.map(item => {
          item.useTerm =
            this.getTime(item.useStartTime) +
            "~" +
            this.getTime(item.useEndTime);
          item.activityTerm =
            this.getTime(item.activityStartTime) +
            "~" +
            this.getTime(item.activityEndTime);
          return item;
        });
        this.formSearch.totalNumber = res.data.totalNumber;
      });
    },
    itemForm(formName) {
      //项目表单
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.itemRuleForm.amount)
            this.$delete(this.itemRuleForm, "amount");
          this.itemRuleForm.activityStartTime = this.itemRuleForm.activityTimeArr[0];
          this.itemRuleForm.activityEndTime = this.handEndTime(
            this.itemRuleForm.activityTimeArr[1]
          );
          this.itemRuleForm.useStartTime = this.itemRuleForm.useTimeArr[0];
          this.itemRuleForm.useEndTime = this.handEndTime(
            this.itemRuleForm.useTimeArr[1]
          );

          if (this.radio == "1") {
            this.itemRuleForm.number = -1;
          }

          let data = {
            cashCouponActivity: this.itemRuleForm
          };
          if (this.itemRuleForm.id) {
            updataCashcouponactivity(data).then(res => {
              if (res.data.code == 200) {
                this.itemDialogFla = false;
                this.tableDataList = [];
                this.setData();
              }
            });
          } else {
            saveCashcouponactivity(data).then(res => {
              if (res.data.code == 200) {
                this.itemDialogFla = false;
                this.tableDataList = [];
                this.setData();
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    getParentIndex(v) {
      this.checkedIndex = v;
      if (this.checkedIndex == 0) {
        this.tableShow = true;
        this.recordTitle = "代金券记录";
      } else if (this.checkedIndex == 1) {
        this.tableShow = false;
        this.recordTitle = "使用记录";
      }
    },
    openRecord(id) {
      queryCashcouponnumber(id).then(res => {
        if (res.data.code == 200) {
          this.recordList = res.data.data;
        }
      });
    },
    detailsEvent() {},
    moreEvent(i, row) {
      if (i === 0) {
        this.openRecord(row.id);
        this.RecordDialog = !this.RecordDialog;
      }
      if (i === 1) {
        deleteCashcouponactivity(row.id).then(res => {
          if (res.data.code == 200) {
            this.setData();
          }
        });
      }
    },
    itemDialog(type, id) {
      let _this = this;

      if (type == "add") {
        _this.itemDialogFla = true;
        _this.itemDialogTitle = "新增代金券";
        setTimeout(function() {
          _this.$refs["itemRuleForm"].resetFields();
          _this.itemRuleForm.name=''
          _this.itemRuleForm.amountYuan=''
          _this.itemRuleForm.number=''
          _this.itemRuleForm.activityTimeArr=''
          _this.itemRuleForm.useTimeArr=''
          _this.itemRuleForm.code=''
          _this.itemRuleForm.useRule=''
        }, 100);
        this.$delete(this.itemRuleForm, "id");
      } else {
        _this.itemDialogTitle = "修改代金券";
        getEditCashcouponactivity(id).then(res => {
          if (res.data.code == 200) {
            let data = res.data.data;
            Object.assign(this.itemRuleForm, res.data.data.cashCouponActivity);
            _this.itemDialogFla = true;
            let activityTimeArr = [];
            let useTimeArr = [];
            activityTimeArr[0] = data.cashCouponActivity.activityStartTime;
            activityTimeArr[1] = data.cashCouponActivity.activityEndTime;
            useTimeArr[0] = data.cashCouponActivity.useStartTime;
            useTimeArr[1] = data.cashCouponActivity.useEndTime;
            this.$set(this.itemRuleForm, "activityTimeArr", activityTimeArr);
            this.$set(this.itemRuleForm, "useTimeArr", useTimeArr);
          }

          // this.tableDataList = data.itemList.map(item => {
          //   item.name = item.itemName;
          //   item.types = item.type;
          //   item.type = "";
          //   return item;
          // });
        });
      }
    },
    itemDel(id) {
      this.$confirm("此操作将删除该收费项目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteChargitemconfig(id).then(res => {
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
    usehandleSizeChange(pageSize) {},
    usehandleCurrentChange(val) {},
    inquire() {
      this.formSearch.page = 1;
      this.setData();
    },
    clickTag() {},
    closeTag(i) {
      this.tableDataList.splice(i, 1);
    },
    getTime(t) {
      return monment(t).format("YYYY-MM-DD");
    },
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
        this.getAsideChildFn(item).then(
          callBackData => (item.childListData = callBackData)
        );
        item.isClick = true;
      }
    },

    forEachData() {
      let arr = [];
      this.medicalServices.map(item => {
        if (item.childListData && item.childListData.length) {
          item.childListData.map(val => {
            if (val.isChecked) {
              arr.push(arr);
            }
          });
        }
      });

      this.addList = arr;
    },

    // 点击子集
    handleChilden(val, type, data) {
      val.isChecked = !val.isChecked;
      // val.number = 1;

      let obj = {
        name: val.expName,
        types: type,
        itemId: val.id
      };
      if (this.tableDataList.length > 0) {
        if (this.filterData(obj)) {
          this.tableDataList.push(obj);
        }
      } else {
        this.tableDataList.push(obj);
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
        alert("这个没有接口");
      }
    },
    // 通用增加属性 基于aside
    addDataAttribute(val, isNames, id) {
      val.doc = this.doctorId;
      val.nurse = this.nurseId;
      val.number = 1;
      val.isChecked = false;
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
      return data.map(val => {
        val.is = false;
        val.childListData = [];
        val.isNames = name;
        return val;
      });
    },
    filterData(val) {
      let _is = false;
      this.tableDataList.map(item => {
        if (val.itemId != item.itemId) {
          _is = true;
        }
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
    handEndTime(t) {
      if (t) {
        return t.replace(t.substring(t.length - 8), "23:59:59");
      } else {
        return "";
      }
    }
    // ...................收费弹窗 end.................
    ,
    commonfn(id) {
      /**
       * 打开同步到分店dialog
       */
      this.dialog.isshow = true;
      this.dialog.id = id;
      getCashCouponActivityById(id).then(res => {
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
      formData.append('cashCouponActivityId', this.dialog.id);
      saveCashcouponActivitys(formData).then(res => {
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
.cashcoupon {
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
.time {
  width: 100%;
}
.left {
  .select {
    color: #409eff;
    cursor: pointer;
  }
}
.center {
  .detail_wrapper {
    position: relative;
    height: 100%;
    flex: 2;
  }
  .detail_wrap {
    width: 900px;
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
}
.comp {
  // margin-top: 10px;
  width: 100%;
  box-shadow: 0 0 6px 0 #84ace8;
  height: 500px;
  overflow-y: scroll;
  .class_box {
    padding: 5px;
    .tag {
      margin: 4px;
    }
  }
}

.comp::-webkit-scrollbar {
  width: 2px;
  height: 2px;
  background: #ccc;
  border-radius: 1px;
}
.comp::-webkit-scrollbar-thumb {
  display: block;
  width: 1px;
  margin: 0 auto;
  border-radius: 1px;
  background: #3b78fd;
}

.range {
  .content {
    width: 100%;
    .selectBox {
      width: 100%;
      height: 40px;
      text-align: center;
    }
    .selectAll {
      width: 100%;
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
      text-align: left;
      border-bottom: 1px solid #dcdfe6;
    }
    .menu_box {
      width: 100%;
      height: 400px;
      overflow-y: scroll;
      .aside_box {
        .item_title {
          cursor: pointer;
          .childNav {
            line-height: 30px;
            li {
              padding-left: 20px;
              margin-bottom: 5px;
              p {
                position: relative;
                .el-icon-check {
                  font-weight: bold;
                  color: #3b78fd;
                  margin-left: 20px;
                  font-size: 20px;
                  position: absolute;
                  right: 10px;
                  top: 8px;
                }
              }
            }
            li:hover {
              background: @bacColor;
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
        .aside_nav {
          width: 200px;
          margin-top: 10px;
          border: 1px solid #e4e9ff;
          margin-right: 20px;
        }
      }
    }
    .menu_box::-webkit-scrollbar {
      width: 2px;
      height: 2px;
      background: #fff;
      border-radius: 1px;
    }
    .menu_box::-webkit-scrollbar-thumb {
      display: block;
      width: 1px;
      margin: 0 auto;
      border-radius: 1px;
      background: #3b78fd;
    }
  }
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

.selectTime {
  width: 100% !important;
}
.example {
  line-height: normal !important;
  display: block;
  white-space: nowrap;
}
.small_block {
  text-align: right;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
</style>
<style lang="less">
.cashcoupon {
  .el-range-editor .el-input__inner {
    width: 100% !important;
  }
  .el-dialog__body {
    padding-bottom: 0px;
    padding-left: 20px;
  }
  .el-table::before {
    background-color: #fff;
  }
  .record_box .el-dialog__body {
    padding: 10px 10px;
  }
  .record_box .el-pagination {
    padding: 10px 10px;
  }
  .el-table__empty-text {
    margin-top: -70px;
  }
  .el-pagination__jump {
    margin-left: 0px;
  }
}

.el-form-item__error {
  left: 158px;
}
</style>
