<template>
  <div class="returnVisit_dialog">
    <el-dialog title="新增回访" :visible.sync="isShow.register" width="960px" @open="getSelectData">
      <div class="dialog_content">
        <div class="headers">
          <el-autocomplete
            style="width:500px"
            popper-class="my-autocomplete"
            v-model="state3"
            :trigger-on-focus="false"
            :fetch-suggestions="querySearch"
            placeholder="请输入患者姓名"
            @select="handleSelect"
          >
            <i class="el-icon-edit el-input__icon" slot="suffix" @click="handleIconClick"></i>
            <template slot-scope="{ item }">
              <div class="name_box">
                <span>{{ item.name }}</span>
                <span class="addr">{{ item.sex }}</span>
                <span class="addr">{{ item.mobilphone }}</span>
              </div>
            </template>
          </el-autocomplete>
        </div>

        <div class="dialog_content_center">
          <div class="p_row">
            <div class="p_row_left fl">
              <span class="key">姓名：</span>
              <span class="val">{{stateData.name}}</span>
            </div>
            <div class="p_row_left fl">
              <span class="key">病历号：</span>
              <span class="val">{{stateData.emrNo}}</span>
            </div>

            <div class="p_row_left fl">
              <span class="key">手机号：</span>
              <span class="val">{{stateData.mobilphone}}</span>
            </div>

            <div class="p_row_left fl">
              <span class="key">日期：</span>
              <span class="val">{{stateData.visitTime}}</span>
            </div>
            <div style="color: #3b78fd;" class="fr">
              <!-- <span>详情</span> -->
            </div>
          </div>
        </div>

        <div class="dialog_tabs">
          <div class="dialog_tabs_title">
            <span class="title_text">回访设置</span>
          </div>
          <div class="add_box">
            <div class="select_header">
              <el-radio v-model="radio" label="1">单次回访</el-radio>
              <el-radio v-model="radio" label="2">定制回访计划</el-radio>
            </div>
            <el-form ref="form" :model="form" label-width="100px" v-show="radio == 1">
              <el-row>
                <el-col :span="11">
                  <el-form-item label="回访人员" :required="true">
                    <el-select v-model="form.callerId" placeholder="请选回访人员">
                      <el-option
                        :label="item.name"
                        :value="item.id"
                        v-for="(item, index) of selectData.callerTOList"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="回访时间" :required="true">
                    <el-date-picker
                      v-model="form.callTime"
                      value-format="yyyy/MM/dd HH:mm"
                      type="datetime"
                      placeholder="选择日期时间"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item label="诊治医生" :required="true">
                    <el-select v-model="form.doctorId" placeholder="请选择诊治医生">
                      <el-option
                        :label="item.name"
                        :value="item.id"
                        v-for="(item, index) of selectData.doctorTOList"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="回访状态" :required="true">
                    <el-radio-group v-model="form.status">
                      <el-radio :label="0">未回访</el-radio>
                      <el-radio :label="1">已完成</el-radio>
                      <el-radio :label="2">无结果</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item label="回访内容" :required="true">
                    <el-select
                      v-model="form.content"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      placeholder="请选择回访内容"
                    >
                      <el-option
                        :label="item"
                        :value="item"
                        v-for="(item, index) of selectData.contentSet"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="回访结果">
                    <el-select
                      v-model="form.result"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      placeholder="请选择回访结果"
                    >
                      <el-option
                        :label="item"
                        :value="item"
                        v-for="(item, index) of selectData.resultSet"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="备注">
                    <el-input
                      type="textarea"
                      autosize
                      placeholder="请输入内容"
                      v-model="form.remark"
                      :autosize="{ minRows: 4, maxRows: 4}"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>

            <el-form ref="form" :model="form2" label-width="100px" v-show="radio == 2">
              <el-row>
                <el-col :span="11">
                  <el-form-item label="回访人员" :required="true">
                    <el-select v-model="form2.callerId" placeholder="请选回访人员">
                      <el-option
                        :label="item.name"
                        :value="item.id"
                        v-for="(item, index) of selectData.callerTOList"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="回访计划" :required="true">
                    <el-select v-model="form2.periods" placeholder="请选择回访计划">
                      <el-option
                        :label="item.name"
                        :value="item.period"
                        v-for="(item, index) of selectData.periodList"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item label="诊治医生" :required="true">
                    <el-select v-model="form2.doctorId" placeholder="请选择诊治医生">
                      <el-option
                        :label="item.name"
                        :value="item.id"
                        v-for="(item, index) of selectData.doctorTOList"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="回访内容">
                    <el-select 
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      v-model="form2.content" 
                      placeholder="请选择回访内容">
                      <el-option
                        :label="item"
                        :value="item"
                        v-for="(item, index) of selectData.contentSet"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="备注">
                    <el-input
                      type="textarea"
                      autosize
                      placeholder="请输入内容"
                      v-model="form2.remark"
                      :autosize="{ minRows: 4, maxRows: 4}"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow.register = false">取 消</el-button>
        <el-button type="primary" @click="sendDataFn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPatientfilter,
  getCallbackvo,
  postAddCallback
} from "@/api";
import qs from "qs";
import monment from "moment";
export default {
  components: {},
  props: ["isShow"],
  data() {
    return {
      radio: "1",
      radio2: "",
      selectData: {
        contentSet: [],
        callerTOList: [],
        doctorTOList: [],
        periodList: [],
        resultSet: []
      },
      form: {
        callerId: "", // 回访人员
        callTime: "", // 回访时间
        doctorId: "", // 诊治医生
        status: 0,
        result: "", // 回访结果
        content: "",
        remark: "",
        mode: 0,
        visitTime: ""
      },
      form2: {
        callerId: "",
        doctorId: "",
        periods: [],
        content: "",
        remark: "",
        mode: 1,
        visitTime: ""
      },
      dialogFormVisible: false,
      textarea3: "",
      state3: "",
      stateData: {}
    };
  },
  created() {},
  watch: {},
  computed: {},
  methods: {
    // 获取下拉列表data
    ininSelectFn() {
      getCallbackvo().then(res => {
        if (res.data.code == 200) {
          console.log( res.data.data )
          this.selectData = res.data.data;
        }
      });
    },
    // 保存数据
    sendDataFn() {
      if (!this.stateData.ids) {
        this.$message.error("请选择患者");
        return;
      }

      if (this.radio == 1) {
        if (!this.form.callerId) {
          this.$message.error("请选择回访人员");
          return;
        }

        if (!this.form.callTime) {
          this.$message.error("请选择回访时间");
          return;
        }

        if (!this.form.doctorId) {
          this.$message.error("请选择诊治医生");
          return;
        }

        if (!this.form.result) {
          this.$message.error("请选择回访结果");
          return;
        }

        this.form["patient.id"] = this.stateData.ids;
        this.form.visitTime = this.stateData.visitTime;

        this.form.content = this.form.content.join("");
        this.form.result = this.form.result.join("");

        postAddCallback(this.form).then(res => {
          if (res.data.code == 200) {
            this.isShow.register = false;
            this.successFn();
            this.$emit("successData");
          }
        });
      } else {
        if (!this.form2.callerId) {
          this.$message.error("请选择回访人员");
          return;
        }

        if (!this.form2.periods.length) {
          this.$message.error("请选择回访计划");
          return;
        }

        if (!this.form2.doctorId) {
          this.$message.error("请选择诊治医生");
          return;
        }

        this.form2["patient.id"] = this.stateData.ids;
        this.form2.visitTime = this.stateData.visitTime;

        this.form2.content = this.form2.content.join("");
        var formData = new FormData();
        Object.keys(this.form2).map(key => {
          if (key === "periods") {
            this.form2[key].map(val => {
              formData.append("periods", val);
            });
          } else {
            formData.append(key, this.form2[key]);
          }
        });

        postAddCallback(formData).then(res => {
          if (res.data.code == 200) {
            this.isShow.register = false;
            this.successFn();
            this.$emit("successData");
          }
        });
      }
    },
    successFn() {
      this.$message({
        message: "新增回访记录成功",
        type: "success"
      });
    },
    getSelectData() {
      let obj = {
        callerId: "", // 回访人员
        callTime: "", // 回访时间
        doctorId: "", // 诊治医生
        status: 0,
        result: "", // 回访结果
        content: "",
        remark: "",
        mode: 0,
        visitTime: ""
      };

      let obj2 = {
        callerId: "",
        doctorId: "",
        periods: [],
        content: "",
        remark: "",
        mode: 1,
        visitTime: ""
      };

      Object.assign(this.form, obj);
      Object.assign(this.form2, obj2);
    },
    handleSelect(val) {
      console.log(val);
      this.stateData = val;
      this.state3 = val.name;
    },
    getTime(t) {
      return monment(t).format("YYYY/MM/DD hh:mm");
    },
    handleIconClick() {},
    querySearch(queryString, cb) {
      getPatientfilter({ nameOrTeleOrEmrno: queryString }).then(res => {
        console.log(res);
        if (res.data.code === 200) {
          let _D = res.data.data;
          let arr = ["男", "女"];
          let dataArr = _D.map((val, index) => {
            val.ids = val.patientTO.id;
            val.sex = arr[parseInt(val.patientTO.sex) - 1];
            val.visitTime = this.getTime(val.visitTime);
            val.name = val.patientTO.name;
            val.emrNo = val.patientTO.emrNo;
            val.mobilphone = val.patientTO.mobilphone;
            // val.id = val.patientTO.id
            return val;
          });
          cb(dataArr);
        }
      });
    }
  },
  mixins() {},
  created() {
    this.ininSelectFn();
  }
};
</script>
<style  scoped>
.select_header {
  margin-bottom: 20px;
}
.name_box {
  display: flex;
  justify-content: space-between;
}
.headers {
  padding: 10px 20px;
  background: rgb(247, 245, 255);
}
.dialog_content_center {
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
}
.dialog_tabs_title {
  height: 50px;
  padding: 0 20px;
  line-height: 50px;
  background: rgb(247, 245, 255);
}
.add_box {
  padding: 20px;
}
.p_row_left {
  margin-right: 40px;
}
</style>
<style>
.returnVisit_dialog .el-dialog__body {
  padding: 0;
}
</style>
