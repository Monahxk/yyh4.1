<template>
  <div class="wrapper DialogEditEmployee">
    <el-dialog
      title="编辑员工"
      :visible.sync="isShow.job"
      width="800px"
      @open="getUserInfo"
      :close-on-click-modal="false"
    >
      <div>
        <el-form label-width="80px">
          <el-collapse v-model="activeName">
            <el-collapse-item title="基本信息" name="1">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="姓名" :required="true">
                    <el-input v-model="employee.name" size="small"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="性别" :required="true">
                    <el-radio-group v-model="employee.gender">
                      <el-radio :label="1">男</el-radio>
                      <el-radio :label="2">女</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="工号" :required="true">
                    <el-input v-model="employee.workno" size="small"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="岗位" :required="true">
                    <el-select v-model="membership.positionId" placeholder="请选择" size="small">
                      <el-option
                        v-for="(item,index) in postitonList"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                    <el-checkbox v-model="isIntern" name="type">实习</el-checkbox>
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
                      size="small"
                    >
                      <el-option
                        v-for="(item,index) in departmentList"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="手机号" :required="true">
                    <el-input v-model="employee.teleno" size="small"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="20">
                  <el-form-item label="在职状态" :required="true" style="marginLeft:20px,width:315px">
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
                      :disabled="!canNotLogin || !isDimissionchenk"
                      style="width:135px"
                      placeholder="请输入"
                      v-model="employee.username"
                      size="small"
                    ></el-input>
                    <el-checkbox :disabled="!isDimissionchenk" v-model="canNotLogin">允许登录</el-checkbox>
                  </el-form-item>
                  <p v-show="passwordShow">初始密码 ： 123456</p>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="所属角色" :required="canNotLogin">
                    <el-select
                      :disabled="!canNotLogin"
                      v-model="membership.roleId"
                      placeholder="请选择"
                      :style="maxWidth"
                      size="small"
                    >
                      <el-option
                        v-for="(item,index) in this.role"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <p v-show="isShowed">初始密码 ： 123456</p>
            </el-collapse-item>

            <el-collapse-item title="更多信息" name="3">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="出生日期">
                    <el-date-picker
                      value-format="yyyy-MM-dd HH:mm:ss"
                      :style="maxWidth"
                      v-model="clinicUserProfile.birthDate"
                      type="date"
                      size="small"
                      placeholder="选择日期"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="民族">
                    <el-input placeholder="请输入" v-model="clinicUserProfile.nation" size="small"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="有效证件类型" class="line_height">
                    <el-input
                      placeholder="请输入"
                      v-model="clinicUserProfile.validCertificateType"
                      size="small"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="有效证件号码" class="line_height">
                    <el-input
                      placeholder="请输入"
                      v-model="clinicUserProfile.validCertificateNo"
                      size="small"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="执业范围">
                    <el-input
                      v-model="clinicUserProfile.practiceScope"
                      placeholder="请输入"
                      size="small"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="职称">
                    <el-input placeholder="请输入" v-model="clinicUserProfile.title" size="small"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="职务">
                    <el-input placeholder="请输入" v-model="clinicUserProfile.duty" size="small"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="执业证书编码" class="line_height">
                    <el-input
                      v-model="clinicUserProfile.certificateCode"
                      placeholder="请输入"
                      size="small"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="资格证书编码" class="line_height">
                    <el-input
                      placeholder="请输入"
                      v-model="clinicUserProfile.qualificationCode"
                      size="small"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="执业注册地" class="line_height">
                    <el-input
                      placeholder="请输入"
                      v-model="clinicUserProfile.registAddress"
                      size="small"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="处方有效标志" class="line_height">
                    <el-input
                      placeholder="请输入"
                      v-model="clinicUserProfile.prescriptionEffectiveSign"
                      size="small"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="开始执业时间" class="line_height">
                    <el-date-picker
                      :style="maxWidth"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      v-model="clinicUserProfile.beginPractiseDate"
                      type="date"
                      size="small"
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
                      value-format="yyyy-MM-dd HH:mm:ss"
                      v-model="clinicUserProfile.endPractiseDate"
                      type="date"
                      size="small"
                      placeholder="选择日期"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>

              <p v-show="isShowed">
                初始密码 ：
                <input type="text" placeholder="123456" />
              </p>
            </el-collapse-item>
          </el-collapse>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <ul class="btns_wrap" style>
            <li class="actives" @click="passwordShow= !passwordShow">
              <span @click="resetPassword">重置密码</span>
            </li>
            <li class="actives" @click="upData">
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
import { updateClinicUser, editClinicUser, resetPassword } from "@/api";
import {
  TYPE_CLINICUSER_JOB,
  SYSTEM_HTTP_SUCCESS,
  TYPE_PHYSICAL_NOTLOGIN
} from "@/constant";
export default {
  components: {},
  props: ["isShow", "userId"],
  data() {
    return {
      activeName: "1",
      maxWidth: "width:100%",
      isDimissionchenk:true,
      employee: {
        id: 0,
        name: "",
        gender: "",
        workno: "",
        teleno: "",
        username: ""
      },
      employee1: {},
      membership: {
        canNotLogin: 1,
        isIntern: "",
        isDimission: "",
        departmentId: "",
        positionId: "",
        roleId: "",
        
      },
      membership1: {},
      profile: {},
      lableWidth: "120px",
      type: "",
      postitonList: [],
      passwordShow: false,
      form: {},
      name: "",
      workno: "",
      teleno: "",
      cities: ["上海", "北京", "广州", "深圳", "上海", "北京", "广州", "深圳"],
      isShowed: false,
      departmentList: [],
      role: [],
      username: "",
      gender: 0,
      isDimission: 0,
      isIntern: false,
      postiton: "",
      roled: "",
      department: "",
      clinicUserProfile: {
        beginPractiseDate: "",
        birthDate: "",
        certificateCode: "",
        duty: "",
        endPractiseDate: "",
        nation: "",
        practiceScope: "",
        prescriptionEffectiveSign: "",
        qualificationCode: "",
        registAddress: "",
        title: "",
        validCertificateNo: "",
        validCertificateType: ""
      },
      clinicUserProfile1: {},
      birthDate: "",
      startTime: "",
      endTime: "",
      copyArr: "",
      roleId: "",
      datas: {},
      clinicUserArr: {},
      canNotLogin: false,
      checked: false
    };
  },
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
      this.isShow.job = !this.isShow.job;
    },
    getUserInfo() {
      editClinicUser({
        id: this.userId
      }).then(res => {
        this.type = res.data.data.type;
        let data = res.data.data;
        this.postitonList = data.positionList;
        this.departmentList = data.departmentList;
        this.role = data.roleList;

        Object.assign(this.employee, data.employee);
        Object.assign(this.membership, data.membership);
        if(data.profile)this.clinicUserProfile = data.profile;
        this.membership.canNotLogin == 1
          ? (this.canNotLogin = false)
          : (this.canNotLogin = true);
        this.membership.isIntern == 1
          ? (this.isIntern = true)
          : (this.isIntern = false);
      });
    },
    getTime(t) {
      return monment(t).format("YYYY-MM-DD  HH:mm:ss");
    },
    upData() {
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
      delete this.employee.genderText;
      delete this.employee.photoPath;
      delete this.employee.regTime;
      delete this.employee.typeText;
      delete this.membership.isDimissionText;
      delete this.membership.institutionName;
      delete this.membership.isInternText;
      delete this.membership.positionName;
      delete this.membership.roleName;
      this.membership.opr="u";

      if(!this.canNotLogin){
        this.employee.username = "";
        this.membership.canNotLogin = 1;
      }
      let data = {
        employee: this.employee,
        membership: this.membership,
        profile: this.clinicUserProfile
      };
      updateClinicUser(data).then(res => {
        if (res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.$emit("initData");
          this.isShow.job = !this.isShow.job;
          this.closedFn();
        }
      });
    },
    closedFn() {
      Object.assign(this.employee, this.employee1);
      Object.assign(this.membership, this.membership1);
      // console.log(this.clinicUserProfile1);

      // Object.assign(this.clinicUserProfile, this.clinicUserProfile1);
      this.canNotLogin = false;
    },
    resetPassword() {
      resetPassword(this.employee.id).then(res => {
        if (res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.$emit("initData");
          setTimeout(() => {
            this.passwordShow = !this.passwordShow;
          }, 3000);
        } 
      });
    }
  }
};
</script>
<style lang="less" scoped>
.spHeight {
  height: 35px;
}

.wrapper {
  .btns_wrap {
    display: flex;
    position: relative;
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
    }
    li:nth-child(2) {
      margin-left: 550px;
    }
    li:nth-child(3) {
      margin-left: 20px;
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
.lastrow {
  margin-bottom: 16px;
}
</style>
<style lang="less">
.DialogEditEmployee {
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