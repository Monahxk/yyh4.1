<!--
@Author: ZJZ
@Date:   2019-08-02
@Filename: DialogAddCustomer.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-04
-->

<template>
  <div class="wrapper">
    <el-dialog
      title="新增客户"
      :visible.sync="isShow.add"
      width="750px"
      @open="init"
      @close="closeFn"
      :close-on-click-modal="false"
    >
      <div>
        <el-form :model="formInline" label-width="80px">
          <el-row>
            <el-col :span="11">
              <el-form-item :required="true" label="姓名">
                <el-input
                  maxlength="32"
                  v-model="formInline.name"
                  placeholder="请输入姓名"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :push="2">
              <el-form-item :required="true" label="性别">
                <el-radio v-model="radio" label="0">男</el-radio>
                <el-radio v-model="radio" label="1">女</el-radio>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="11">
              <el-form-item :required="true" label="电话">
                <el-input v-model="teleno" maxlength="11" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :push="2">
              <el-form-item label="咨询师" :required="true">
                <el-select v-model="formInline.consultantId" placeholder="请选择">
                  <el-option
                    v-for="(item,index) in user"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="11">
              <el-form-item label="咨询项目">
                <el-select v-model="formInline.consultItemId" placeholder="请选择">
                  <el-option
                    v-for="(item,index) in project"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :push="2">
              <el-form-item label="咨询方式">
                <el-select
                  v-model="formInline.consultMethod"
                  placeholder="请选择"
                >
                  <el-option label="手机" value="0"></el-option>
                  <el-option label="电话" value="1"></el-option>
                  <el-option label="微信" value="2"></el-option>
                  <el-option label="qq" value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="11">
              <el-form-item label="咨询时间" :required="true">
                <el-row>
                  <el-date-picker
                    v-model="consultTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="date"
                    placeholder="选择日期"
                  ></el-date-picker>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="患者备注">
                <el-input
                  v-model="formInline.patientRemark"
                  maxlength="100"
                  placeholder="有意向"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

            <div class="box">
              <p>咨询基本信息</p>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="咨询记录" style="marginTop:10px">
                    <el-input
                      type="textarea"
                      v-model="formInline.consultRecord"
                      maxlength="200"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
                <el-form label-width="80px">
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="回访状态">
                        <el-select v-model="status" placeholder="请选择回访进度">
                          <el-option
                            v-for="(item,index) in statusList"
                            :key="index"
                            :label="item.lable"
                            :value="item.status"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="11" :push="2">
                      <el-form-item label="回访时间" :required="true">
                        <template>
                          <div class="block">
                            <span class="demonstration"></span>
                            <el-date-picker
                              v-model="followUpTime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              type="date"
                              placeholder="选择日期"
                            ></el-date-picker>
                          </div>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
            </div>
        </el-form>
        <div slot="footer"  style="marginTop:25px">
          <ul class="btns_wrap">
            <li class="actives" @click="sendEvent">
              <span>保存</span>
            </li>
            <li @click="quxiao">
              <span>取消</span>
            </li>
          </ul>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addClinicUsered, getCustomerDownList } from "@/api";
import {SYSTEM_HTTP_SUCCESS} from "@/constant"
export default {
  components: {},
  props: ["isShow"],
  data() {
    return {
      statusList: [],
      formInline: {
        user: "",
        consultantId: "",
        consultItemId: "",
        name: "",
        phone: "",
        patientRemark: "",
        consultMethod: "",
        consultRecord: ""
      },
      followUpTime: "",
      radio: "",
      consultTime: "",
      user: [],
      project: [],
      teleno: "",
      status: "1",
    };
  },
  watch: {
  },
  computed: {},
  mounted() {
  },
  methods: {
    closeFn() {
      this.formInline.name = "";
      this.formInline.consultantId = "";
      this.teleno = "";
      this.radio = "";
      this.formInline.consultItemId = "";
      this.formInline.consultMethod = "";
      this.consultTime = "";
      this.followUpTime = "";
      this.status = "";
      this.formInline.patientRemark = "";
      this.formInline.consultRecord = "";
    },
    sendEvent() {
      if (checkData(this)) {
        if (!this.formInline.name) {
          this.$message.error("请填写姓名");
          return;
        }
        if (!this.radio) {
          this.$message.error("请选择性别");
          return;
        }

        if (!this.teleno) {
          this.$message.error("请选择电话");
          return;
        }
        if (!this.formInline.consultantId) {
          this.$message.error("请选择电话");
          return;
        }

        if (!this.consultTime) {
          this.$message.error("请选择咨询时间");
          return;
        }
        if (!this.followUpTime) {
          this.$message.error("请选择回访时间");
          return;
        }

        var date = new Date();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }

        let formData = {};
        formData.id= 0;
        formData.name= this.formInline.name;
        if (this.teleno == "") {
          formData.teleno= "";
        } else {
          formData.teleno= this.teleno;
        }
        formData.gender= this.radio;
        formData.status= this.status;
        formData.consultantId= this.formInline.consultantId;
        formData.consultItemId= this.formInline.consultItemId;
        formData.consultMethod= this.formInline.consultMethod;
        formData.consultTime= this.consultTime;
        formData.followUpTime= this.followUpTime;
        formData.consultRecord= this.formInline.consultRecord;
        if (this.formInline.patientRemark == "") {
          formData.patientRemark= "";
        } else {
          formData.patientRemark= this.formInline.patientRemark;
        }

        addClinicUsered(formData).then(res => {
          if (res.data.code == SYSTEM_HTTP_SUCCESS) {
            this.$root.Bus.$emit("refreshList");
          }
        });
        this.isShow.add = !this.isShow.add;
      }
    },
    open(msg, type) {
      this.$message({
        message: msg,
        type: type
      });
    },
    init() {
      getCustomerDownList({}).then(res => {
        let s = res.data.data.statusMap;
        for (const key in s) {
          this.statusList.push({ status: key, lable: s[key] });
        }
        this.project = res.data.data.consultItemList;
        this.user = res.data.data.consultantList;
      });
    },
    quxiao() {
      this.isShow.add = !this.isShow.add;
    }
  },

  mixins: []
};
function checkData(v) {
  let cd = false;
  let reg = /^[0-9]*$/;

  if (v.formInline.name != "") {
    cd = true;
  } else {
    cd = false;
    v.open("姓名不能为空！", "warning");
    return cd;
  }
  if (v.radio != "") {
    cd = true;
  } else {
    cd = false;
    v.open("性别不能为空！", "warning");
    return cd;
  }
  if (util.isMobile(v.teleno)) {
    cd = true;
  } else {
    cd = false;
    v.open("手机号格式不正确！", "warning");
    return cd;
  }
  if (v.formInline.consultantId != "") {
    cd = true;
  } else {
    cd = false;
    v.open("咨询师不能为空！", "warning");
    return cd;
  }
  return cd;
}
</script>
<style lang="less" scoped>
@import "../../../../assets/css/workbench/publicTable.css";
.wrapper {
  .btns_wrap {
    display: flex;
    justify-content: flex-end;
    text-align: center;
    line-height: 32px;
    li {
      cursor: pointer;
      color: #3b78fd;
      width: 88px;
      height: 32px;
      border: 1px solid #3b78fd;
      margin-right: 20px;
    }
    .actives {
      color: #fff;
      background-image: linear-gradient(110deg, #4d9eff, #3c79fd 99%, #3b78fd);
    }
  }
}
.el-select,/deep/.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 100%;
}
.box {
  height: 170px;
  background-color: #ffffff;
  p {
    width: 100%;
    height: 40px;
    background-color: #f7f9ff;
    padding-left: 35px;
    box-sizing: border-box;
    line-height: 44px;
    color: #000;
  }
}
</style>
