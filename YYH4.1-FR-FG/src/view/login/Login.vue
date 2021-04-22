<!--
 * @Author: jyp
 * @LastEditors: hzj
 * @Description:login
 * @Date: 2019-04-02 13:12:20
 * @LastEditTime: 2019-11-12 15:09:20
 -->
<template>
  <div class="wrapper" id="login">
    <el-row>
      <el-col :span="14">
        <div class="login_img"></div>
      </el-col>
      <el-col :span="10">
        <div class="login_main">
          <div class="login_form">
            <div class="login_title">
              <img class="login_logo" :src="logoPath" alt />
            </div>
            <h3 class="login_clinic_title">{{clinicName}}</h3>
            <div>
              <div>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
                  <el-form-item prop="username" class="form_input">
                    <el-input
                      ref="un"
                      v-model="ruleForm.username"
                      placeholder="账号"
                      @keyup.enter.native="userLogin('ruleForm')"
                      @blur="getInstitutionList"
                    ></el-input>
                  </el-form-item>
                  <el-form-item prop="password" class="form_input">
                    <el-input
                      v-model="ruleForm.password"
                      type="password"
                      placeholder="密码"
                      @keyup.enter.native="userLogin('ruleForm')"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    prop="switchInstitutionId"
                    v-if="storeArr.length>1"
                    class="form_input"
                  >
                    <el-select
                      class="switch"
                      v-model="ruleForm.switchInstitutionId"
                      placeholder="请选择"
                      size="small"
                    >
                      <el-option
                        v-for="(item,index) in storeArr"
                        :key="index"
                        :label="item.alias"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>
              <div>
                <el-checkbox v-model="checked">7天免登录</el-checkbox>
              </div>
              <div @click="userLogin('ruleForm')" class="login_btn">
                <span>登录</span>
              </div>
            </div>
          </div>
        </div>
        <div class="copyright">
          <span>2019 © 华西天健科技有限公司 版权所有</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  userLogin,
  getMenuList,
  getClinicBaseInfo,
  getLoginInstitutionList
} from "@/api";
import { SYSTEM_HTTP_SUCCESS } from "@/constant";
import { IMGSRC_ROOT } from "@/api/config";
import sse from "sessionstorage";
export default {
  components: {},
  props: {},
  data() {
    return {
      headImg: IMGSRC_ROOT + "/common/file/",
      checked: false,
      storeArr: [],
      logoPath: require("../../assets/img/login/icon_login_logo.png"),
      username: "",
      password: "",
      clinicName: "牙医慧口腔云",
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [{ required: true, message: "用户名不能为空" }],
        password: [{ required: true, message: "密码不能为空" }],
        switchInstitutionId: [{ required: true, message: "请选择门店" }]
      }
    };
  },
  created() {
    this.getClinicBaseInfo();
  },
  mounted() {},
  watch: {
    "ruleForm.username"(val) {
      this.getInstitutionList();
    }
    // "ruleForm.switchInstitutionId"(val) {
    //   if (this.storeArr.length > 1) {
    //     this.ruleForm.username = this.ruleForm.username + "$$" + val;
    //   }
    // }
  },
  computed: {},
  methods: {
    getIdentifier() {
      var url = document.location.href;
      var index = url.lastIndexOf("/");
      url = url.substring(index + 1, url.length);
      // let url ="/cdwh"
      return url;
    },
    getMenu() {
      getMenuList({}).then(res => {
        if (res.data.code == 200) {
          let [data] = res.data.data
          if (data.index == 1) {
            this.$router.push({
              name: data.submenu[0].subUrl,
              params: { menu: 0, sub: 0 }
            });
          } else {
            data.submenu.map((val, index) => {
              if (!index) this.$router.push({ path: "/" + val.subUrl });
            });
          }
        }
      });
    },
    getInstitutionList() {
      getLoginInstitutionList(this.ruleForm.username).then(res => {
        if (res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.storeArr = res.data.data || [];
          if(this.storeArr.length > 0) {
            res.data.data[0].id ? this.ruleForm.switchInstitutionId = res.data.data[0].id : this.ruleForm.switchInstitutionId = "";
          }
        }
      });
    },
    userLogin(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.openLoading();
          let formData = new FormData();
          if (this.storeArr.length > 1) {
            formData.append(
              "username",
              this.ruleForm.username + "$$" + this.ruleForm.switchInstitutionId
            );
          } else {
            formData.append("username", this.ruleForm.username);
          }
          formData.append("password", this.ruleForm.password);
          formData.append("remember-me", this.checked);
          let _this = this;
          userLogin(formData)
            .then(res => {
              if (res.data.code === SYSTEM_HTTP_SUCCESS) {
                this.loading.close();
                sse.setItem("username", this.ruleForm.username);
                sse.setItem("password", this.ruleForm.password);
                sse.setItem("userId", res.data.data.employee.id);
                sse.setItem("name", res.data.data.employee.name);
                sse.setItem("powerId", res.data.data.positionId);
                sse.setItem("departmentId", res.data.data.departmentId);
                sse.setItem("institutionId", res.data.data.institutionId);
                if (res.data.data.photoPath !== null) {
                  sse.setItem("headImgSrc", res.data.data.employee.photoPath);
                }
                this.getMenu();
              } else {
                this.loading.close();
              }
            })
            .catch(function(error) {
              _this.loading.close();
            });
        } else {
          return false;
        }
      });
    },
    getClinicBaseInfo() {
      this.getIdentifier();
      if (this.getIdentifier()) {
        getClinicBaseInfo(this.getIdentifier()).then(res => {
          if (res.data.code === SYSTEM_HTTP_SUCCESS) {
            this.clinicName = res.data.data.alias;
            res.data.data.logoPath
              ? (this.logoPath = this.headImg + res.data.data.logoPath)
              : (this.logoPath = require("../../assets/img/login/icon_login_logo.png"));
          }
        });
      }
    },
    openMsg(msg, type) {
      this.$message({
        message: msg,
        type: type
      });
    },
    openLoading() {
      this.loading = this.$loading({
        lock: true,
        text: "正在提交……",
        color: "#fff",
        spinner: "el-icon-loading",
        background: "rgba(0,0,0,.1)"
      });
    }
  },
  mixins: [],
  mounted() {}
};
</script>
<style lang="less"  scoped>
.wrapper {
  width: 100vw;
  height: 100vh;
  .el-row,
  .el-col {
    height: 100%;
    position: relative;
    overflow: hidden;
  }
  .login_img {
    height: 100%;
    background: url("../../assets/img/login/img_login_bg.png") no-repeat center
      center;
    background-size: 710px 480px;
    background-clip: content-box;
  }
  .login_main {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .login_form {
      width: 320px;
      height: 530px;
      .login_title {
        width: 60px;
        height: 60px;
        margin: 0 auto;
        display: flex;
        justify-content: center;
      }
      .form_input {
        margin-bottom: 40px;
      }
      .form_input:nth-child(2) {
        margin-bottom: 20px;
      }
      .switch {
        width: 100%;
        height: 40px;
        margin-top: 20px;
      }
      .login_clinic_title {
        padding: 30px 0;
        text-align: center;
        font-size: 22px;
        font-weight: normal;
        letter-spacing: 8px;
      }
      .login_btn {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        margin-top: 10px;
        line-height: 44px;
        height: 44px;
        background-image: linear-gradient(97deg, #4d9eff, #3b78fd);
        span {
          font-size: 16px;
          color: #fff;
        }
      }
    }
  }
  .copyright {
    width: 100%;
    display: flex;
    color: rgba(0, 0, 0, 0.45);
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 50px;
    left: 0;
  }
}
</style>
<style>
#login .el-input--small .el-input__inner {
  height: 40px;
}
</style>

