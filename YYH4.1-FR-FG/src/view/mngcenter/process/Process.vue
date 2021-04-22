<!--
@Author: ZJZ
@Date:   2019-08-01
@Filename: Process.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-08
-->

<template>
  <div class="manage_Process">
    <div class="main_top_title">技加工管理</div>
    <div class="box_header">
      <el-form :inline="true" :model="formSearch" class="demo-form-inline" label-width="80px">
        <el-row :gutter="24">
          <el-col :span="7">
            <el-form-item label="送件日期">
              <el-date-picker
                v-model="formSearch.deliveryTime"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="取件日期">
              <el-date-picker
                v-model="formSearch.receivingTime"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="诊治医生">
              <el-select v-model="formSearch.doctorId" clearable placeholder="请选择诊治医生">
                <el-option
                  :label="item.name"
                  :value="item.id"
                  v-for="(item, index) of doctorTOList"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
              <el-button type="primary" class="search_btn" round @click="inquire">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="7">
            <el-form-item label="姓名/电话">
              <el-input v-model="formSearch.patientNameOrMobile" clearable placeholder="姓名/电话"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="加工单位">
              <el-select v-model="formSearch.unit" clearable placeholder="请选择加工单位">
                <el-option
                  :label="item.name"
                  :value="item.name"
                  v-for="(item, index) of unitList"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="状态">
              <el-select v-model="formSearch.orderStatus" clearable placeholder="请选择状态">
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="(item, index) of orderStatus"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="add_btn" @click="itemDialog('add')">新增技加工</div>
    </div>
    <div class="wrapper_table1">
      <el-table
        highlight-current-row
        height="580px"
        ref="singleTable"
        :data="list"
        style="font-size: 14px"
        :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
      >
        <el-table-column prop="patientName" label="姓名" sortable align="center"></el-table-column>
        <el-table-column prop="visitTime" label="就诊时间" sortable align="center"></el-table-column>
        <el-table-column prop="doctorName" label="诊治医生" sortable align="center"></el-table-column>
        <el-table-column prop="unit" label="加工单位" sortable align="center"></el-table-column>
        <el-table-column prop="machiningCostYuan" label="加工费" sortable align="center"></el-table-column>
        <el-table-column prop="sellPriceYuan" label="患者花费" sortable align="center"></el-table-column>
        <el-table-column prop="deliveryTime" label="送件时间" sortable align="center"></el-table-column>
        <el-table-column prop="receivingTime" label="取件时间" sortable align="center"></el-table-column>
        <el-table-column prop="orderStatusText" label="状态" sortable align="center"></el-table-column>

        <el-table-column label="操作" width="150">
          <template slot-scope="scope" style="marginLeft:-25px">
            <el-button type="text" size="small" @click="itemDialog('edit',scope.row.id)">编辑</el-button>
            <span class="line">|</span>
            <el-button type="text" size="small" @click="Del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
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

    <!-- 技加工的弹窗 -->
    <el-dialog :title="DialogTitle" :visible.sync="DialogFla" width="80%" center>
      <el-dialog width="70%" title="选择牙位" center :visible.sync="innerVisible" append-to-body>
        <div class="inner_content">
          <SelectTooth v-if='innerVisible'
            :index="selectToothIndex"
            :reqData="innerToothData"
            @selectToothFun="selectToothFun"
          />
        </div>
      </el-dialog>
      <div class="content">
        <el-form
          :inline="true"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="130px"
          class="demo-ruleForm mediumForm"
        >
          <div class="header_chunk">
            <div class="header" v-if="!isEdit">
              <el-form-item label="选择患者" prop="patientId">
                <el-autocomplete
                  style="width:280px"
                  popper-class="my-autocomplete"
                  v-model="state3"
                  :trigger-on-focus="false"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入患者姓名"
                  @select="handleSelect"
                  size="small"
                >
                  <i class="el-icon-search el-input__icon" slot="suffix"></i>
                  <template slot-scope="{ item }">
                    <div class="name_box">
                      <span>{{ item.patientName }}</span>
                    </div>
                  </template>
                </el-autocomplete>
              </el-form-item>

              <ul class="btns"></ul>
            </div>

            <div class="content_user">
              <ul class="user_msg">
                <li>
                  <span>患者姓名：</span>
                  <span>{{stateDatas.patientName}}</span>
                </li>
                <li>
                  <span>病历号：</span>
                  <span>{{stateDatas.emrNo}}</span>
                </li>
                <li>
                  <span>手机号：</span>
                  <span>{{stateDatas.mobilephone}}</span>
                </li>
              </ul>
              <div></div>
            </div>
          </div>
          <el-collapse v-model="activeNames">
            <el-collapse-item title="加工信息" name="2">
              <div class="add_process_chunk">
                <el-table :data="ruleForm.detailsList" center style="width: 100%">
                  <el-table-column label="牙位" width="250">
                    <template slot-scope="scope">
                      <div
                        class="table_tooth select_tooth"
                        @click="innerSelectTooth(scope.$index,scope.row)"
                      >
                        <div class="top_left">{{scope.row.leftUpValue}}</div>
                        <div class="top_right">{{scope.row.rightUpValue}}</div>
                        <div class="bottom_left">{{scope.row.leftDownValue}}</div>
                        <div class="bottom_right">{{scope.row.rightDownValue}}</div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="*义齿材料" width="260">
                    <template slot="header" slot-scope="scope">
                      <div class>
                        <span class="red">*</span> 义齿材料
                      </div>
                    </template>
                    <template slot-scope="scope">
                      <el-form-item
                        :prop="'detailsList['+scope.$index+'].material'"
                        :rules="rules.material"
                      >
                        <el-select
                          v-model="ruleForm.detailsList[scope.$index].toothContentList"
                          multiple
                          collapse-tags
                          @change="toothContentFun(ruleForm.detailsList[scope.$index])"
                          placeholder="请选择义齿材料"
                        >
                          <el-option
                            v-for="item in contentList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.name"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="*义齿规格/颜色" width="260">
                    <template slot="header" slot-scope="scope">
                      <div class>
                        <span class="red">*</span> 义齿规格/颜色
                      </div>
                    </template>
                    <template slot-scope="scope">
                      <el-form-item
                        :prop="'detailsList['+scope.$index+'].model'"
                        :rules="rules.model"
                      >
                        <el-select
                          v-model="ruleForm.detailsList[scope.$index].toothSizeList"
                          multiple
                          collapse-tags
                          @change="toothSizeFun(ruleForm.detailsList[scope.$index])"
                          placeholder="请选择义齿规格/颜色"
                        >
                          <el-option
                            v-for="item in modelColorList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.name"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="数量" width="170">
                    <template slot-scope="scope">
                      <el-form-item>
                        <el-input-number
                          :min="1"
                          class="input_number"
                          v-model="scope.row.quantity"
                          size="small"
                          label="描述文字"
                        ></el-input-number>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-form-item>
                        <el-button
                          size="mini"
                          type="danger"
                          icon="el-icon-delete"
                          @click="deleteRow(scope.$index, ruleForm.detailsList)"
                        ></el-button>
                      </el-form-item>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="add_table_footer">
                  <el-button type="primary" @click="addRow()">新增加工</el-button>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item title="详细信息" name="3">
              <div class="info_chunk">
                <el-form-item label="就诊时间" prop="visitTime">
                  <el-select v-model="ruleForm.visitTime" placeholder="请选择就诊时间" @change='registerChange'>
                    <el-option
                      :label="item.registerTime"
                      :value="item"
                      v-for="(item, index) of registerTimeList"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item label="就诊时间" prop="visitTime">
                  <el-date-picker
                    v-model="ruleForm.visitTime"
                    type="datetime" value-format='yyyy-MM-dd HH:mm:ss'
                    placeholder="请选择就诊时间">
                  </el-date-picker>
                </el-form-item>-->
                <el-form-item label="诊治医生" prop="doctorId">
                  <el-select v-model="ruleForm.doctorId" placeholder="请选择医生">
                    <el-option
                      :label="item.name"
                      :value="item.id"
                      v-for="(item, index) of doctorTOList"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="送件日期" prop="deliveryTime">
                  <el-date-picker
                    v-model="ruleForm.deliveryTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="取件日期" prop="receivingTime">
                  <el-date-picker
                    v-model="ruleForm.receivingTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择收件时间"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="订单编号" prop="orderNo">
                  <el-input v-model="ruleForm.orderNo" placeholder="请输入订单编号"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="teleno">
                  <el-input v-model="ruleForm.teleno" placeholder="请输入联系电话"></el-input>
                </el-form-item>
                <el-form-item label="加工单位" prop="unit">
                  <el-select v-model="ruleForm.unit" placeholder="请选择加工单位">
                    <el-option
                      :label="item.name"
                      :value="item.name"
                      v-for="(item, index) of unitList"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="取件联系人" prop="pickupContacts">
                  <el-select v-model="ruleForm.pickupContacts" placeholder="请选择取件人">
                    <el-option
                      :label="item.name"
                      :value="item.name"
                      v-for="(item, index) of personList"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="加工成本" prop="machiningCostYuan">
                  <el-input v-model="ruleForm.machiningCostYuan" placeholder="请输入单位"></el-input>
                </el-form-item>
                <el-form-item label="售出价格" prop="sellPriceYuan">
                  <el-input v-model="ruleForm.sellPriceYuan" placeholder="请输入价格"></el-input>
                </el-form-item>
                <el-form-item label="订单状态" prop="orderStatus">
                  <el-radio-group v-model="ruleForm.orderStatus" @change="orderStatusFun">
                    <el-radio label="0">未取</el-radio>
                    <el-radio label="1">取回</el-radio>
                    <el-radio label="2">已戴走</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="戴走时间" prop="wornawayTime" v-if="wornawayFla">
                  <el-date-picker
                    v-model="ruleForm.wornawayTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="保质期" prop="qaPeriod" v-if="wornawayFla">
                  <el-input v-model="ruleForm.qaPeriod" placeholder="请输入保质期"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                  <el-input type="textarea" v-model="ruleForm.remark" :rows="4"></el-input>
                </el-form-item>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="itemForm('ruleForm')">确 定</el-button>
        <el-button @click="DialogFla = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>



<script>
import {
  getCallbackfiltervo,
  machiningproductList,
  deleteMachiningproduct,
  getPatientlists,
  machiningproductId,
  machiningproductInit,
  addMachiningproduct,
  putMachiningproduct,
  getmMchiningvo
} from "@/api";
import SelectTooth from "@/components/SelectTooth";
export default {
  name: "mngcenterProcess",
  components: {
    SelectTooth
  },
  data() {
    return {
      isEdit: false,
      state3: "",
      stateDatas: {
        patientName: "",
        emrNo: "",
        mobilephone: ""
      },
      formSearch: {
        //项目搜索
        deliveryTime: "",
        receivingTime: "",
        doctorId: "",
        patientNameOrMobile: "",
        unit: "",
        orderStatus: "",
        page: 1,
        pageSize: 10,
        totalNumber: 0
      },
      unitList: [], //单位列表
      doctorTOList: [], //医生列表
      contentList: [], //材料列表
      modelColorList: [], //规格列表
      personList: [], //取件人列表
      list: [],
      orderStatus: [
        { label: "未取", value: 0 },
        { label: "取回", value: 1 },
        { label: "已戴走 ", value: 2 }
      ],
      innerToothData: {
        lt: "",
        rt: "",
        lb: "",
        rb: ""
      },
      registerTimeList: [],
      innerVisible: false, //内层弹窗
      selectToothIndex: 0, //点击选中的牙位是列表第几个
      activeNames: ["1", "2", "3"],
      DialogFla: false,
      DialogTitle: "新增技加工",
      wornawayFla: false, //是否带走
      ruleForm: {
        //表单
        patientId: "", // 患者Id
        patientName: "",
        appointmentVisitTrackId: "",
        doctorId: "",
        visitTime: "",
        unit: "",
        pickupContacts: "",
        teleno: "",
        deliveryTime: "",
        orderStatus: "0",
        receivingTime: "",
        sellPriceYuan: "",
        machiningCostYuan: "",
        remark: "",
        wornawayTime: "",
        qaPeriod: "",
        orderNo: "",
        detailsList: [
          //加工信息
          {
            leftUpValue: "",
            leftDownValue: "",
            rightUpValue: "",
            rightDownValue: "",
            toothContentList: [],
            material: "",
            toothSizeList: [],
            model: "",
            quantity: 1
          }
        ]
      },
      rules: {
        patientId: [
          { required: true, message: "请选择患者", trigger: "change" }
        ],
        material: [
          { required: true, message: "请选择义齿材料", trigger: "change" }
        ],
        visitTime: [
          { required: true, message: "请选择就诊时间", trigger: "change" }
        ],
        doctorId: [
          { required: true, message: "请选择医生", trigger: "change" }
        ],
        deliveryTime: [
          { required: true, message: "选择送件时间", trigger: "change" }
        ],
        receivingTime: [
          { required: true, message: "选择收件时间", trigger: "change" }
        ],
        unit: [
          { required: true, message: "请选择加工单位", trigger: "change" }
        ],
        pickupContacts: [
          { required: true, message: "请选择取件人", trigger: "change" }
        ],
        qaPeriod: [
          { required: true, message: "请输入保质期", trigger: "blur" }
        ],
        wornawayTime: [
          { required: true, message: "请选择日期时间", trigger: "change" }
        ]
      }
    };
  },
  mounted() {

    getCallbackfiltervo().then(res => {
      if (res.data.code === 200) {
        this.doctorTOList = res.data.data.doctorList;
      }
    });
    machiningproductInit().then(res => {
      this.unitList = res.data.data.unitList;
      this.contentList = res.data.data.materialList;
      this.modelColorList = res.data.data.modelList;
      this.personList = res.data.data.contactsList;
    });
    this.setData();

  },
  methods: {
    orderStatusFun(val) {
      if (val != 2) {
        this.wornawayFla = false;
      } else {
        this.wornawayFla = true;
      }
    },
    toothContentFun(val) {
      console.log(val);
      val.material = val.toothContentList.join(",");
    },
    toothSizeFun(val) {
      val.model = val.toothSizeList.join(",");
    },
    querySearch(queryString, cb) {
      // this.init();
      getPatientlists(this.state3).then(res => {
        if (res.data.code === 200) cb(res.data.data);
      });
    },
    handleSelect(val) {
      this.ruleForm.patientId = val.id;
      this.ruleForm.patientName = val.patientName;
      this.state3 = val.patientName;
      this.stateDatas = val;
      getmMchiningvo(val.id).then(res => {
        console.log(res);
        let arr = [];
        // res.data.data.avTrackList.map(item => {
        //   arr.push(item.registerTime);
        // });
        this.registerTimeList = res.data.data.avTrackList;
      });
    },
    innerSelectTooth(index, data) {
      this.innerVisible = true;
      this.selectToothIndex = index;
      this.innerToothData = data;
    },
    selectToothFun(val) {
      this.innerVisible = false;
      this.ruleForm.detailsList[this.selectToothIndex].leftUpValue =
        val.leftUpValue;
      this.ruleForm.detailsList[this.selectToothIndex].rightUpValue =
        val.rightUpValue;
      this.ruleForm.detailsList[this.selectToothIndex].leftDownValue =
        val.leftDownValue;
      this.ruleForm.detailsList[this.selectToothIndex].rightDownValue =
        val.rightDownValue;
    },
    addRow() {
      //table新增
      this.ruleForm.detailsList.push({
        leftUpValue: "",
        rightUpValue: "",
        leftDownValue: "",
        rightDownValue: "",
        model: "",
        toothContentList: "",
        material: "",
        quantity: 1
      });
    },
    deleteRow(index, rows) {
      //table删除tr
      rows.splice(index, 1);
    },
    itemForm(formName) {
      let _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if(!this.isEdit){
            addMachiningproduct(_this.ruleForm).then(res => {
              if (res.data.code == 200) {
                this.setData();
                _this.DialogFla = false;
              }
            });
          }else{
            putMachiningproduct(_this.ruleForm).then(res => {
              if (res.data.code == 200) {
                this.setData();
                _this.DialogFla = false;
              }
            });
          }

        } else {
          return false;
        }
      });
    },
    itemDialog(type, id) {
      let _this = this;
      _this.DialogFla = true;
      if (type == "add") {
        _this.DialogTitle = "新增技加工";
        _this.isEdit = false;
        this.wornawayFla = false;
        setTimeout(function() {
          _this.$refs["ruleForm"].resetFields();
        }, 200);
        this.$delete(this.ruleForm, "id");
        this.ruleForm.patientId = "";
        this.ruleForm.patientName = "";
        this.ruleForm.detailsList = [
          {
            leftUpValue: "",
            leftDownValue: "",
            rightUpValue: "",
            rightDownValue: "",
            toothContentList: [],
            material: "",
            toothSizeList: [],
            model: "",
            quantity: 1
          }
        ];
        this.stateDatas = { patientName: "", emrNo: "", mobilephone: "" };
        this.state3 = "";
      } else {
        _this.DialogTitle = "修改技加工";
        _this.isEdit = true;
        machiningproductId(id).then(res => {
          console.log(res);

          res.data.data.machiningProduct.detailsList.map(val => {
            val.toothContentList = val.material.split(",");
            val.toothSizeList = val.model.split(",");
          });
          res.data.data.machiningProduct.orderStatus = res.data.data.machiningProduct.orderStatus.toString();
          // res.data.data.unit=parseInt(res.data.data.unit)
          // res.data.data.pickupContacts=parseInt(res.data.data.pickupContacts)
          if (res.data.data.machiningProduct.orderStatus == 2) {
            this.wornawayFla = true;
          } else {
            this.wornawayFla = false;
          }
          _this.ruleForm = res.data.data.machiningProduct;
          _this.stateDatas.patientName = res.data.data.machiningProduct.patientName;
          _this.stateDatas.emrNo = res.data.data.machiningProduct.emrNo;
          _this.stateDatas.mobilephone = res.data.data.machiningProduct.patientMobile;
          console.log(_this.ruleForm);
          _this.$set(_this.ruleForm, "detailsList", res.data.data.machiningProduct.detailsList);
          getmMchiningvo(this.ruleForm.patientId).then(res => {
            console.log(res);

            this.registerTimeList = res.data.data.avTrackList;
          });
        });
      }
    },

    setData() {

      machiningproductList({ params: this.formSearch }).then(res => {
        if (res.data.code == 200) {
          this.list = res.data.data;
          this.formSearch.totalNumber = res.data.totalNumber;
        }
      });
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
    registerChange(val){
      this.ruleForm.appointmentVisitTrackId=val.id
      this.ruleForm.visitTime=val.registerTime
    },
    Del(id) {
      this.$confirm("此操作将删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteMachiningproduct(id).then(res => {
            if (res.data.code == 200) {
              this.setData();
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="less" scoped>
.manage_Process {
  // position: relative;

  .el-dialog {
    .header {
      display: flex;
      align-items: center;
      padding: 0 20px;
      height: 60px;
      background: #f7f9ff;
      .el-form-item{
        margin-bottom: 0;
      }
      .btns {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        line-height: 36px;
        li {
          cursor: pointer;
          width: 100px;
          height: 36px;
          margin-left: 20px;
          color: #3b78fd;
          border: 1px solid #3b78fd;
        }
        li:nth-child(1) {
          color: #fff;
          background: #3b78fd;
        }
      }
    }
    .content_user {
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      .user_msg {
        display: flex;
        li {
          margin-right: 30px;
        }
      }
    }

    .add_table_footer {
      margin-top: 20px;
      text-align: left;
    }
    .info_chunk {
      margin: auto;
      width: 900px;
      .el-input,
      .el-select {
        width: 300px;
      }
      .el-radio-group {
        width: 400px;
      }
      .el-textarea {
        width: 750px;
      }
    }
    .select_tooth {
      //选择牙的十字架
      display: flex;
      flex-wrap: wrap;
      cursor: pointer;
      > div {
        display: inline-block;
        width: 49%;
      }
      .top_left {
        border-right: 1px solid #3b78fd;
        border-bottom: 1px solid #3b78fd;
      }
      .bottom_left {
        border-right: 1px solid #3b78fd;
      }
      .top_right {
        border-bottom: 1px solid #3b78fd;
      }
    }
    .table_tooth {
      > div {
        display: inline-block;
        width: 49%;
        height: 25px;
      }
    }
  }
}
</style>
<style lang='less'>
.manage_Process {
    .add_btn {
      cursor: pointer;
      position: absolute;
      right: 0;
      top: 20px !important;
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
  .el-dialog {
    .el-collapse-item {
      .el-collapse-item__header {
        background: #f7f9ff;
        padding-left: 20px;
        color: #493bfd;
        font-size: 18px;
      }
      .el-collapse-item__content {
        padding: 20px;
        .tooth {
          width: 225px;
        }
        .input_number {
          .el-input {
            width: 130px;
          }
        }
      }
    }
    .el-dialog__body {
      padding: 0;
    }
  }
}
</style>
