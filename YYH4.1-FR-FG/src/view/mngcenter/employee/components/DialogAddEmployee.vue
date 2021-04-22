<!--
@Author: ZJZ
@Date:   2019-08-01
@Filename: DialogAddEmployee.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-05
-->

<template>
  <div class="wrapper DialogAddEmployee">
    <el-dialog
      title="新增员工"
      :visible.sync="isShow.user"
      width="800px"
      height="640px"
      @closed="closedFn"
      @open="getDownList"
      top="16vh"
      :close-on-click-modal="false"
    >
      <div>
        <el-form :model="form" label-width="80px">
          <el-collapse v-model="activeName">
            <el-collapse-item title="基本信息" name="1">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="姓名" :required="true">
                    <el-input v-model="employee.name" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="性别" :required="true">
                    <el-radio-group v-model="employee.gender">
                      <el-radio label="1">男</el-radio>
                      <el-radio label="2">女</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="工号" :required="true">
                    <el-input v-model="employee.workno" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="岗位" :required="true">
                    <el-select v-model="membership.positionId" placeholder="请选择">
                      <el-option
                        v-for="(item,index) in this.optolist"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                    <el-checkbox class="checkboxintern" v-model="isIntern">实习</el-checkbox>
                  </el-form-item>
                </el-col>
                <el-col></el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="科室" :required="true">
                    <el-select
                      v-model="membership.departmentId"
                      placeholder="请选择"
                      :style="maxWidth"
                    >
                      <el-option
                        v-for="(item,index) in this.deptList"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="手机号" :required="true">
                    <el-input v-model="employee.teleno"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="16">
                  <el-form-item label="在职状态" :required="true">
                    <el-radio-group v-model="membership.isDimission">
                      <el-radio :label="0" name="type">在职</el-radio>
                      <el-radio :label="1" name="type">
                        离职
                        <span>离职员工不能登录系统</span>
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
            <el-collapse-item title="登录信息" name="2">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="登录账号" :required="canNotLogin">
                    <el-input
                      style="width:135px"
                      :disabled="!canNotLogin || !isDimissionchenk"
                      placeholder="请输入"
                      v-model="employee.username"
                    ></el-input>
                    <el-checkbox :disabled="!isDimissionchenk" v-model="canNotLogin">允许登录</el-checkbox>
                  </el-form-item>
                  <p class="password">初始密码 ：123456</p>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="所属角色" :required="canNotLogin">
                    <el-select :disabled="!canNotLogin" v-model="membership.roleId" placeholder="请选择" :style="maxWidth">
                      <el-option
                        v-for="(item,index) in this.roleArray"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                      >{{item.name}}</el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
            <el-collapse-item title="更多信息" name="3">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="出生日期">
                    <el-date-picker
                      :style="maxWidth"
                      v-model="birthDay"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="date"
                      placeholder="选择日期"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="民族">
                    <el-input placeholder="请输入" v-model="nation" class="table_input"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="有效证件类型" class="line_height">
                    <el-input placeholder="请输入" v-model="documentType" class="table_input"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="有效证件号码" class="line_height">
                    <el-input placeholder="请输入" v-model="userid" class="table_input"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="执业范围">
                    <el-input v-model="occupation" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="职称">
                    <el-input placeholder="请输入" v-model="title" class="table_input"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="职务">
                    <el-input placeholder="请输入" v-model="post"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="执业证书编码" class="line_height">
                    <el-input v-model="certificateNum" placeholder="请输入" class="table_input"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="资格证书编码" class="line_height">
                    <el-input placeholder="请输入" v-model="qualificationsNum"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="执业注册地" class="line_height">
                    <el-input placeholder="请输入" v-model="registeredPlace" class="table_input"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row style>
                <el-col :span="12">
                  <el-form-item label="处方有效标志" class="line_height">
                    <el-input placeholder="请输入" v-model="prescription"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="开始执业时间" class="line_height">
                    <el-date-picker
                      :style="maxWidth"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      v-model="startTime"
                      class="table_input"
                      type="date"
                      placeholder="选择日期"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row class="lastrow">
                <el-col :span="12">
                  <el-form-item label="结束执业时间" class="line_height">
                    <el-date-picker
                      :style="maxWidth"
                      v-model="endTime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      class="table_input"
                      type="date"
                      placeholder="选择日期"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <ul class="btns_wrap" style="position:relative">
            <li class="actives" @click="saveData()">
              <span>确定</span>
            </li>
            <li @click="cancel">
              <span>取消</span>
            </li>
          </ul>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import monment from "moment";
import { getAddClinicUserDownList, saveClinicUser, resetPassword } from "@/api";
import {
  TYPE_CLINICUSER_JOB,
  SYSTEM_HTTP_SUCCESS,
  TYPE_PHYSICAL_NOTLOGIN
} from "@/constant";
export default {
  components: {},
  props: ["isShow"],
  data() {
    return {
      activeName: "1",
      maxWidth: "width:100%",
      isDimissionchenk: false,
      employee1: {},
      employee: {
        id: 0,
        name: "",
        gender: "",
        workno: "",
        teleno: "",
        username: ""
      },
      membership1: {},
      membership: {
        canNotLogin: 1,
        isIntern: "",
        isDimission: "",
        departmentId: "",
        positionId: "",
        roleId: "",
        opr: "c"
      },
      profile: {},
      type: "",
      isIntern: false,
      form: {
        nation: "",
        regioned: "",
        name: "",
        region: "",
        nameed: "",
        regioen: ""
      },
      isShowed: false,
      deptList: "",
      roleArray: "",
      name: "",
      optolist: "",
      work: "",
      gender: "1",
      isDimission: 0,
      birthDay: "",
      startTime: "",
      endTime: "",
      nation: "",
      documentType: "",
      userid: "",
      occupation: "",
      title: "",
      post: "",
      certificateNum: "",
      qualificationsNum: "",
      prescription: "",
      registeredPlace: "",
      roleId: "",
      isDimission: "0",
      canNotLogin: false
    };
  },
  mounted() {},
  watch: {
    canNotLogin(val) {
      if (val) {
          this.membership.canNotLogin = 0;
      } else {
        this.employee.username = "";
        this.membership.canNotLogin = 1;
      }
    },
    isIntern(val) {
      if (val) {
        this.membership.isIntern = 1;
      } else {
        this.membership.isIntern = 0;
      }
    },
    'membership.isDimission'(val){
      if(val){
        this.canNotLogin=false;
        this.isDimissionchenk=false;
        this.employee.username = "";
      }else{
        this.isDimissionchenk=true;

      }
    }
  },
  computed: {},
  mixins: [],
  methods: {
    cancel() {
      this.isShow.user = !this.isShow.user;
    },
    getDownList() {
      this.employee1 = JSON.parse(JSON.stringify(this.employee));
      this.membership1 = JSON.parse(JSON.stringify(this.membership));
      getAddClinicUserDownList({}).then(res => {
        let data = res.data.data;
        this.deptList = data.departmentList;
        this.optolist = data.positionList;
        this.roleArray = data.roleList;
      });
    },
    getTime(t) {
      return monment(t).format("YYYY-MM-DD HH:mm:ss");
    },
    saveData() {
      if (!this.employee.name) {
        this.$message.error("请填写姓名");
        return;
      }

      if (!this.employee.gender) {
        this.$message.error("请填写性别");
        return;
      }

      if (!this.employee.workno) {
        this.$message.error("请填写工号");
        return;
      }

      if (!this.membership.departmentId) {
        this.$message.error("请填写科室");
        return;
      }
      if (!this.membership.positionId) {
        this.$message.error("请选择岗位");
        return;
      }
      if (!this.employee.teleno) {
        this.$message.error("请填写手机号");
        return;
      }
      if (this.membership.isDimission === "") {
        this.$message.error("请选择在职状态");
        return;
      }
      if (this.canNotLogin) {
        if (!this.membership.roleId) {
          this.$message.error("请选择角色");
          return;
        }
      }
      if (this.canNotLogin) {
        if (!this.employee.username) {
          this.$message.error("请填写用户名");
          return;
        }
      }
      this.membership.opr = "c";
      if(!this.canNotLogin){
        this.employee.username = "";
        this.membership.canNotLogin = 1;
      }
      let data = {
        employee: this.employee,
        membership: this.membership,
        profile: {
          birthDate: this.birthDay,
          nation: this.nation,
          validCertificateType: this.documentType,
          validCertificateNo: this.userid,
          practiceScope: this.occupation,
          title: this.title,
          duty: this.post,
          certificateCode: this.certificateNum,
          qualificationCode: this.qualificationsNum,
          registAddress: this.registeredPlace,
          prescriptionEffectiveSign: this.prescription,
          beginPractiseDate: this.startTime,
          endPractiseDate: this.endTime
        }
      };
      saveClinicUser(data).then(res => {
        if (res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.$emit("initData");
          this.isShow.user = !this.isShow.user;
          this.closedFn();
        }
      });
    },
    closedFn() {
      Object.assign(this.employee, this.employee1);
      Object.assign(this.membership, this.membership1);
      this.nation = "";
      this.documentType = "";
      this.userid = "";
      this.occupation = "";
      this.title = "";
      this.post = "";
      this.certificateNum = "";
      this.qualificationsNum = "";
      this.registeredPlace = "";
      this.prescription = "";
      this.startTime = "";
      this.endTime = "";
      this.birthDay = "";
      this.isIntern = false;
    }
  }
};
</script>
<style lang="less" scoped>
.checkboxintern {
  margin-left: 20px;
}
.spHeight {
  height: 35px;
}
.wrapper {
  height: 100px;
  overflow-y: scroll;

  .btns_wrap {
    display: flex;
    justify-content: flex-start;
    text-align: center;
    line-height: 32px;
    margin-top: 30px;
    li {
      cursor: pointer;
      color: #3b78fd;
      width: 88px;
      height: 32px;
      border: 1px solid #3b78fd;
      margin-right: 20px;
    }
    li:nth-child(1) {
      margin-left: 500px;
    }
    .actives {
      color: #fff;
      background-image: linear-gradient(110deg, #4d9eff, #3c79fd 99%, #3b78fd);
    }
  }
}
.box {
  width: 700px;
  height: 170px;
  box-shadow: 0 0 6px 0 #e4e9ff;
  margin-left: 15px;
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
.demo-ruleForm {
  width: 800px;
  height: 400px;
}

.el-form-item {
  margin-bottom: 7px;
}
.login_info,
.meor_info {
  color: blue;
  height: 40px;
  line-height: 40px;
  text-align: left;
}
.password {
  margin-left: 11px;
  line-height: 40px;
  margin-bottom: 16px;
}
.lastrow {
  margin-bottom: 16px;
}
</style>
<style lang="less">
.DialogAddEmployee {
  .el-dialog__body {
    padding: 10px 20px;
    .line_height {
      .el-form-item__label {
        line-height: normal;
      }
    }
  }
  .el-form-item {
    margin-bottom: 16px;
  }
  .el-collapse-item__header {
    color: blue;
  }
  .el-collapse-item__content {
    padding-bottom: 2px;
  }
}
</style>
