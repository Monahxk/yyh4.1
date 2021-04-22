<!--
 * @Descripttion: 新增技加工
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-05 17:37:06
 -->

<template>
  <div class="wrapper" id="patientDetial_machining">
    <ul class="header_wrap">
      <li>
        <span @click="backList">技加工记录 ></span>
        <span>新增技加工</span>
      </li>
    </ul>
    <div class="main" id="main">
      <div>
        <div class="selecttooth_box" v-if="innerVisible">
          <div class="selecttooth">
            <SelectTooth
              :index="selectToothIndex"
              :reqData="innerToothData"
              @selectToothFun="selectToothFun"
            />
          </div>
        </div>
        <el-form
          :inline="true"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="130px"
          class="demo-ruleForm mediumForm"
        >
          <el-collapse v-model="activeNames">
            <el-collapse-item title="加工信息" name="2">
              <div class="add_process_chunk">
                <el-table :data="ruleForm.detailsList" center style="width: 100%">
                  <el-table-column label="牙位" width="220">
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
                  <el-table-column label="*义齿材料" width="240">
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
                          filterable
                          allow-create
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
                  <el-table-column label="*义齿规格/颜色" width="240">
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
                          filterable
                          allow-create
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
                    <el-select v-model="ruleForm.visitTime" placeholder="请选择就诊时间" @change="visitTimeChange">
                    <el-option
                      :label="item.registerTime"
                      :value="item.registerTime"
                      v-for="(item, index) in registerTimeList"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
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
                    placeholder="选择取件时间"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="取件联系人" prop="pickupContacts">
                  <el-select v-model="ruleForm.pickupContacts" filterable allow-create placeholder="请选择取件人">
                    <el-option
                      :label="item.name"
                      :value="item.name"
                      v-for="(item, index) of personList"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="订单编号" prop="orderNo">
                  <el-input v-model="ruleForm.orderNo" placeholder="请输入订单编号"></el-input>
                </el-form-item>
                <el-form-item label="加工单位" prop="unit">
                  <el-select v-model="ruleForm.unit" filterable allow-create placeholder="请选择加工单位">
                    <el-option
                      :label="item.name"
                      :value="item.name"
                      v-for="(item, index) of unitList"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="联系电话" prop="teleno">
                  <el-input v-model="ruleForm.teleno" placeholder="请输入联系电话"></el-input>
                </el-form-item>
                <el-form-item label="加工成本" prop="machiningCostYuan">
                  <el-input v-model="ruleForm.machiningCostYuan" placeholder="请输入加工费用"></el-input>
                </el-form-item>
                <el-form-item label="出售价格" prop="sellPriceYuan">
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
    </div>
    <div class="foot">
      <span @click="itemForm('ruleForm')" class="btns o_btns">保 存</span>
      <span class="btns" @click="saveAndPrint">保存并打印</span>
      <span class="btns" @click="backList">取 消</span>
    </div>
    <PrintMachining @closeAdd="closeAdd" :isShow="isShowDialog"></PrintMachining>
  </div>
</template>

<script>
import {
  getCaseDoctor,
  machiningproductList,
  deleteMachiningproduct,
  getPatientlists,
  machiningproductId,
  machiningproductInit,
  addMachiningproduct,
  putMachiningproduct,
  getmMchiningvo
} from "@/api";
import monment from "moment";
import { mapState } from "vuex";
import PrintMachining from "./PrintMachining.vue";
import { SYSTEM_HTTP_SUCCESS } from "@/constant";
import SelectTooth from "../components/SelectTooth";
export default {
  components: { SelectTooth, PrintMachining },
  props: ["id"],
  data() {
    let _float =  (rule, value, callback) => {
      var re = /^\d+(?:\.\d{0,2})?$/;
      if(value && !re.test(value)) {
        callback(new Error('格式不正确'));
      } else {
         callback();
      }
    }
    return {
      isShowDialog: {
        dialogVisible: false,
        id: ""
      },
      ruleForm: [],
      list: {},
      sendData: [],
      DialogTitle: "新增技加工",
      activeNames: ["1", "2", "3"],
      innerVisible: false, //内层弹窗
      selectToothIndex: 0, //点击选中的牙位是列表第几个
      DialogFla: false,
      wornawayFla: false, //是否带走
      unitList: [], //单位列表
      doctorTOList: [], //医生列表
      contentList: [], //材料列表
      modelColorList: [], //规格列表
      personList: [], //取件人列表
      registerTimeList: [], //就诊时间下拉列表
      list: [],
      selectToothIndex: 0, //点击选中的牙位是列表第几个
      loading: "",
      pid: "",
      innerToothData: {
        lt: "12345ABCDE",
        rt: "12345A",
        lb: "12345AB",
        rb: "12345AC"
      },
      ruleForm: {
        //表单
        appointmentVisitTrackId: '',
        patientId: "", // 患者Id
        patientName: "",
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
          { required: true, message: "选择取件时间", trigger: "change" }
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
        ],
        machiningCostYuan: [
          { validator: _float, trigger: 'blur' }
        ],
        sellPriceYuan: [
          { validator: _float, trigger: 'blur' }
        ],
      }
    };
  },
  watch: {},
  computed: mapState({
    pId: state => state.signal.patientId
  }),
  mounted() {
    this.id ? this.itemDialog("edit", this.id) : this.itemDialog("add");
    this.setData();
    getCaseDoctor().then(res => {
      if (res.data.code === SYSTEM_HTTP_SUCCESS) {
        this.doctorTOList = res.data.data;
      }
    });
    getmMchiningvo(this.pId).then(res => {
      console.log(res);
      let arr = [];
      res.data.data.avTrackList.map(item => {
        let map = {
          id: item.id,
          registerTime: item.registerTime,
          patientName: item.patientName
        }
        arr.push(map);
      });
      this.registerTimeList = arr;
    });
    machiningproductInit().then(res => {
      this.unitList = res.data.data.unitList;
      this.contentList = res.data.data.materialList;
      this.modelColorList = res.data.data.modelList;
      this.personList = res.data.data.contactsList;
    });
  },
  methods: {
    init() {},
    orderStatusFun(val) {
      if (val != 2) {
        this.wornawayFla = false;
      } else {
        this.wornawayFla = true;
      }
    },
    toothContentFun(val) {
      val.material = val.toothContentList.join(",");
    },
    toothSizeFun(val) {
      val.model = val.toothSizeList.join(",");
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
    closeAdd() {
      this.$emit("openOrclose", "", true);
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    saveAndPrint() {
      let id = this.ruleForm.id;
      let openPrint = id => {
        this.isShowDialog.dialogVisible = true;
        this.isShowDialog.id = id;
      };
      this.itemForm("ruleForm", openPrint);
    },
    itemForm(formName, cb) {
      let _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          _this.ruleForm.patientId = _this.pId;
          if(!_this.ruleForm.sellPriceYuan) {
            _this.ruleForm.sellPriceYuan = 0;
          }
          if(!_this.ruleForm.machiningCostYuan) {
            _this.ruleForm.machiningCostYuan = 0;
          }
          if(_this.id) {
            putMachiningproduct(_this.ruleForm).then(res => {
              if (res.data.code == SYSTEM_HTTP_SUCCESS) {
                this.setData();
                if (res.data.data.id) {
                  _this.isShowDialog.id = res.data.data.id;
                  if (cb) cb(res.data.data.id);
                  if(!_this.isShowDialog.dialogVisible){
                    _this.$emit("openOrclose", "", true);
                  }
                }
              }
            });
          } else {
            addMachiningproduct(_this.ruleForm).then(res => {
              if (res.data.code == SYSTEM_HTTP_SUCCESS) {
                this.setData();
                if (res.data.data.id) {
                  _this.isShowDialog.id = res.data.data.id;
                  if (cb) cb(res.data.data.id);
                  if(!_this.isShowDialog.dialogVisible){
                    _this.$emit("openOrclose", "", true);
                  }
                }
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
          res.data.data.machiningProduct.detailsList.map(val => {
            val.toothContentList = val.material.split(",");
            val.toothSizeList = val.model.split(",");
          });
          res.data.data.machiningProduct.orderStatus = res.data.data.machiningProduct.orderStatus.toString();
          // res.data.data.unit = res.data.data.unit;
          // res.data.data.picker = res.data.data.picker;
          if (res.data.data.machiningProduct.orderStatus == 2) {
            this.wornawayFla = true;
          } else {
            this.wornawayFla = false;
          }
          _this.ruleForm = res.data.data.machiningProduct;
        });
      }
    },
    visitTimeChange() {
      let visitTimeList = this.registerTimeList;

      for(let i=0;i<visitTimeList.length;i++) {
        if(visitTimeList[i].registerTime == this.ruleForm.visitTime) {
          this.ruleForm.appointmentVisitTrackId = visitTimeList[i].id;
          this.ruleForm.patientName = visitTimeList[i].patientName;
        }
      }
    },
    setData() {},
    Del(id) {
      this.$confirm("此操作将删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteMachiningproduct(id).then(res => {
            if (res.data.code == SYSTEM_HTTP_SUCCESS) {
              this.setData();
            }
          });
        })
        .catch(() => {});
    },

    backList() {
      this.$emit("openOrclose", "", true);
    },
    getTime(t, l) {
      if (l) {
        return monment(t).format("YYYY-MM-DD");
      } else {
        return monment(t).format("YYYY-MM-DD HH:mm:ss");
      }
    }
  },
  mixins: []
};
</script>
<style lang="less" scoped>
.wrapper {
  .main::-webkit-scrollbar {
    width: 2px;
    height: 2px;
    background: #ccc;
    border-radius: 1px;
  }
  .main::-webkit-scrollbar-thumb {
    display: block;
    width: 1px;
    margin: 0 auto;
    border-radius: 1px;
    background: #3b78fd;
  }
  padding-bottom: 30px;
  .section_title {
    font-weight: bold;
  }
  .foot {
    width: 100%;
    position: absolute;
    right: 0;
    padding: 10px 0;
    bottom: 0px;
    text-align: right;
    background: white;
    border-top: 1px solid #eee;
    button {
      display: inline-block;
      border: 1px solid #3b78fd;
      background: #3b78fd;
      color: #fff;
      padding: 10px 14px;
      border-radius: 4px;
    }
    input {
      display: inline-block;
      border: 1px solid #3b78fd;
      background: #3b78fd;
      color: #fff;
      padding: 10px 14px;
      border-radius: 4px;
    }
    .o_btns.btns {
      color: #fff;
      background: linear-gradient(to right, #4d9eff, #3c79fd);
    }
    .btns {
      display: inline-block;
      cursor: pointer;
      padding: 0 20px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      color: rgb(59, 120, 253);
      border: 1px solid rgb(59, 120, 253);
    }
  }
}
.add_bt {
  font-size: 14px;
  display: block;
  cursor: pointer;
  width: 80px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: rgb(59, 120, 253);
}
.header_wrap {
  color: #3b78fd;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  position: relative;
  z-index: 9;
  background: white;
  li:nth-child(1) {
    font-size: 16px;
    cursor: pointer;
  }
  li:nth-child(3) {
    height: 32px;
    text-align: center;
    line-height: 32px;
    font-size: 14px;
    padding-left: 10px;
    padding: 0 4px 0 4px;
    border: 1px solid #3b78fd;
    margin-left: 700px;
    cursor: pointer;
  }
  li:nth-child(2) {
    cursor: pointer;
    height: 32px;
    text-align: center;
    line-height: 32px;
    font-size: 14px;
    border: 1px solid #3b78fd;
    padding: 0 4px 0 4px;
  }
}
.img_box {
  width: 400px;
}
.addMain {
  display: flex;
  justify-content: center;
  align-items: center;
}
.main {
  padding-top: 35px;
  padding-bottom: 35px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: scroll;
  .list_item {
    display: flex;
    margin-bottom: 20px;
    .timer {
      width: 100px;
      color: #1b1e25;
      font-size: 14px;
      font-weight: bold;
    }
    .list_content {
      width: 650px;
      padding: 10px;
      color: #1b1e25;
      font-size: 14px;
      box-shadow: 0 0 6px 0 #e4e9ff;
      background-color: #ffffff;
      li {
        display: flex;
        line-height: 30px;
      }
      li span:nth-child(1) {
        margin-right: 10px;
      }
      .other {
        justify-content: space-between;
        div {
          display: flex;
          p {
            cursor: pointer;
            width: 88px;
            height: 32px;
            border: 1px solid #3b78fd;
            color: #3b78fd;
            text-align: center;
            line-height: 32px;
          }
          p:nth-child(1) {
            margin-right: 20px;
          }
        }
      }
    }
  }
}
.selecttooth_box {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 99;
  background: rgba(7, 5, 5, 0.3);
  .selecttooth {
    width: 800px;
    height: 500px;
    background: #fff;
    margin: 100px auto;
  }
}
.add_table_footer {
  margin-top: 20px;
  text-align: left;
}
.info_chunk {
  margin: 20px auto;
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
</style>
<style lang="less">
.caseHistoryList_collapse .el-collapse-item__arrow {
  display: none;
}
#patientDetial_machining {

  .el-collapse-item {
    .el-collapse-item__header {
      background: #f7f9ff;
      padding-left: 20px;
      color: #493bfd;
      font-size: 18px;
    }
  }
}
</style>
