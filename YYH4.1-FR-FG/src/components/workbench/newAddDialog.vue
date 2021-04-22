<template>
  <div class="returnVisit_dialog" id="returnVisit_dialog">
    <el-dialog
      title="新增回访"
      :visible.sync="isShow.register"
      width="960px"
      @open="getSelectData"
      :modal="false"
    >
      <div class="dialog_content">
        <div class="headers"></div>

        <div class="dialog_content_center">
          <div class="content_center_row">
            <div class="content_center_row_left fl">
              <span class="key">姓名：</span>
              <span class="val">{{stateData.patientName}}</span>
            </div>

            <div class="content_center_row_left fl">
              <span class="key">性别：</span>
              <span class="val">{{stateData.sex}}</span>
            </div>

            <div class="content_center_row_left fl">
              <span class="key">病历号：</span>
              <span class="val">{{stateData.clinicNo}}</span>
            </div>

            <div class="content_center_row_left fl">
              <span class="key">手机号：</span>
              <span class="val">{{stateData.mobilphone}}</span>
            </div>
          </div>
        </div>

        <div class="dialog_tabs">
          <div class="dialog_tabs_title">
            <span class="title_text">回访设置</span>
          </div>
          <div class="add_box">
            <div class="select_header">
              <el-radio v-model="callbackMode" label="1">单次回访</el-radio>
              <el-radio v-model="callbackMode" label="2">定制回访计划</el-radio>
            </div>
            <el-form ref="form" :model="form" label-width="90px" v-show="callbackMode == 1">
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
                      allow-create
                      filterable
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
                    <el-select v-model="form.result" placeholder="请选择回访结果">
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

            <el-form ref="form" :model="userInfo" label-width="80px" v-show="callbackMode == 2">
              <el-row>
                <el-col :span="11">
                  <el-form-item label="回访人员">
                    <el-select v-model="userInfo.callerId" placeholder="请选回访人员">
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
                  <el-form-item label="回访计划">
                    <el-select v-model="userInfo.periods" multiple placeholder="请选择回访计划">
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
                  <el-form-item label="诊治医生">
                    <el-select v-model="userInfo.doctorId" placeholder="请选择诊治医生">
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
                    <el-select v-model="userInfo.content" default-first-option placeholder="请选择回访内容">
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
                      v-model="userInfo.remark"
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
import { mapState } from "vuex";
import sse from "sessionstorage";
import {SYSTEM_HTTP_SUCCESS} from "@/constant";
export default {
  components: {},
  props: ["isShow"],
  data() {
    return {
      callbackMode: "1",
      selectData: {
        contentSet: [],
        callerTOList: [],
        doctorTOList: [],
        periodList: [],
        resultSet: []
      },
      form: {
        callerId: "", 
        callTime: "", 
        doctorId: "", 
        status: 0,
        result: "", 
        content: "",
        remark: "",
        mode: 0,
        visitTime: ""
      },
      userInfo: {
        callerId: "",
        doctorId: "",
        periods: [],
        content: "",
        remark: "",
        mode: 1,
        visitTime: ""
      },
      dialogFormVisible: false,
      name: ""
    };
  },
  watch: {
    "isShow.register"(val) {
      this.form.callTime = new Date();
    }
  },
  computed: mapState({
    stateData: state => state.signal.patientsMsg,
    patientId: state => state.signal.patientId
  }),
  methods: {
    ininSelectFn() {
      getCallbackvo().then(res => {
        if (res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.selectData = res.data.data;
          this.form.callerId = Number(sse.getItem("userId"));
        }
      });
    },
    sendDataFn() {
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

        if (!this.form.content) {
          this.$message.error("请选择回访内容");
          return;
        }
        this.form["patient.id"] = this.patientId;
        this.form.visitTime = this.getTime(this.stateData.visitTime);
        postAddCallback(this.form).then(res => {
          if (res.data.code == SYSTEM_HTTP_SUCCESS) {
            this.isShow.register = false;
            this.successFn();
            this.$emit("successData");
          }
        });
      } else {
        this.userInfo["patient.id"] = this.patientId;
        this.userInfo.visitTime = this.getTime(this.stateData.visitTime);
        var formData = new FormData();

        Object.keys(this.userInfo).map(key => {
          if (key === "periods") {
            this.userInfo[key].map(val => {
              formData.append("periods", val);
            });
          } else {
            formData.append(key, this.userInfo[key]);
          }
        });

        postAddCallback(formData).then(res => {
          if (res.data.code == SYSTEM_HTTP_SUCCESS) {
            this.isShow.register = false;
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
    getSelectData() {},
    handleSelect(val) {
      this.stateData = val;
      this.name = val.name;
    },
    getTime(t) {
      return monment(t).format("YYYY/MM/DD hh:mm");
    },
    handleIconClick() {},
    querySearch(queryString, cb) {
      getPatientfilter({ nameOrTeleOrEmrno: queryString }).then(res => {
        if (res.data.code === SYSTEM_HTTP_SUCCESS) {
          let _D = res.data.data;
          let arr = ["男", "女"];
          let dataArr = _D.map((val, index) => {
            val.ids = val.patientTO.id;
            val.sex = arr[parseInt(val.patientTO.sex) - 1];
            val.visitTime = this.getTime(val.visitTime);
            val.name = val.patientTO.name;
            val.emrNo = val.patientTO.emrNo;
            val.mobilphone = val.patientTO.mobilphone;
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
.content_center_row_left {
  margin-right: 40px;
}
</style>
<style>
.returnVisit_dialog .el-dialog__body {
  padding: 0;
}

#returnVisit_dialog .el-dialog__body {
  height: auto !important;
}
</style>
