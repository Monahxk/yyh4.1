<!--
 * @Author:jyp
 * @LastEditors: hzj
 * @Description: 用户信息窗口
 * @Date: 2019-04-02 16:01:39
 * @LastEditTime: 2019-11-12 15:47:36
 -->
<template>
  <div class="userInfo_diolog_wrapper">
    <el-dialog :visible.sync="isShow.userInfoDiolog" width="960px;">
      <div class="dialog">
        <header class="head">
          <el-row>
            <el-col :offset="2" :span="3">
              <div class="head_img">
                <img :src="headImgSrc" class="head_icon" alt>
                <el-upload
                  class="upload-demo"
                  action
                  :http-request="uploadFilezs"
                  :before-upload="handleFilezs"
                  :on-remove="removeFile"
                  :multiple="false"
                  :limit="1"
                  :file-list="fileList"
                  :on-change="handchange"
                  :auto-upload="true"
                  list-type="picture"
                >
                  <div v-if=" passWordShow" class="mask">修改头像</div>
                </el-upload>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <p class="user_name">
                  <span>{{userInfo.employee.name}}</span>，
                  <span>你好</span>
                </p>
                <p>
                  <span>{{userInfo.positionName }}</span>
                </p>
              </div>
            </el-col>
          </el-row>
        </header>
        <div class="user_info_content">
          <el-row>
            <el-col :offset="2" :span="10">
              <p>
                <span class="key">工号</span>
                <span class="val">{{userInfo.employee.workno}}</span>
              </p>
            </el-col>
            <el-col :span="10">
              <p>
                <span class="key">手机号</span>
                <span class="val">{{userInfo.employee.teleno}}</span>
              </p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :offset="2" :span="10">
              <p>
                <span class="key">科室</span>
                <span class="val">{{userInfo.membership.departmentName}}</span>
              </p>
            </el-col>
            <el-col :span="10">
              <p>
                <span class="key">岗位</span>
                <span class="val">{{userInfo.membership.positionName}}</span>
              </p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :offset="2" :span="10">
              <p>
                <span class="key">登录账号</span>
                <span class="val">{{userInfo.employee.username}}</span>
              </p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :offset="2" :span="10">
              <p>
                <span class="key">登录密码</span>
                <span v-if=" !passWordShow" class="val">******</span>
                <span v-if=" !passWordShow" @click="changePassWord" class="val change_password">修改</span>
              </p>
            </el-col>
          </el-row>
          <el-row class="password_box" v-if="passWordShow">
            <el-col :offset="2" :span="7">当前密码</el-col>
            <el-col :span="7">新密码</el-col>
            <el-col :span="7">确认密码</el-col>
            <el-col class="input_col" :offset="2" :span="7">
              <input type="password" v-model="oldPassWord" value>
            </el-col>
            <el-col class="input_col" :span="7">
              <input type="password" v-model="newPassWord" value>
            </el-col>
            <el-col class="input_col" :span="7">
              <input type="password" value v-model='againPassWord'>
            </el-col>
            <el-col class="check_tips" :offset="2" :span="7">
            </el-col>
            <el-col class="check_tips" :span="7">
            </el-col>
            <el-col class="check_tips" :span="7">
            </el-col>
            <el-col class="btn-content" :offset="2" align="right" :span="21">
              <span @click="savePassWord" class="preservation">保存</span>
              <span @click="changePassWord" class="cancel">取消</span>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserInfo, upDataHeadImgFn, upPassWordFn } from "@/api";
import { IMGSRC_ROOT } from "@/api/config";
import { SYSTEM_HTTP_SUCCESS } from "@/constant";
import sse from "sessionstorage";
export default {
  components: {},
  props: ["isShow", "formData"],
  data() {
    return {
      dialogTableVisible: false,
      dialogFormVisible: true,
      passWordShow: false,
      fileList: [],
      headImg: IMGSRC_ROOT+"/common/file/",
      oldHeadImgSrc: "",
      headImgSrc: "",
      iconFile: "",
      file: "",
      oldPassWord: "",
      newPassWord: "",
      againPassWord: "",
      editPhotoPath:'',
      userInfo: {
        departmentName: "",
        positionName: "",
        employee: {
          gender:"",
          id: "",
          name: "",
          photoPath: "",
          teleno: "",
          username: "",
          workno: ""      ,
        },
        membership: {

        }
      }
    };
  },
  created() {
    this.getInfo();
  },
  watch: {},
  computed: {},
  methods: {
    getInfo() {
      getUserInfo({}).then(res => {
        if (res.data.code === SYSTEM_HTTP_SUCCESS) {
          Object.assign(this.userInfo,res.data.data)
          // 判断是否有头像路径没有就走默认的
          if (res.data.data.employee.photoPath) {
            this.headImgSrc = this.headImg + res.data.data.employee.photoPath;
            this.oldHeadImgSrc = this.headImg + res.data.data.employee.photoPath;
            this.editPhotoPath=res.data.data.employee.photoPath;
             sse.setItem("headImgSrc", res.data.data.employee.photoPath);
          } else {
            this.headImgSrc = require("../../../assets/img/userFile_active.png");
            this.oldHeadImgSrc = require("../../../assets/img/userFile_active.png");
          }
        }
      });
    },
    open(msg, type) {
      this.$message({
        message: msg,
        type: type
      });
    },
    // 取消
    changePassWord() {
      this.passWordShow = !this.passWordShow;
      this.headImgSrc = this.oldHeadImgSrc;
      this.oldPassWord = "";
      this.newPassWord = "";
      this.againPassWord = "";
      this.file = "";
      this.getInfo();
    },
    // 点击保存
    savePassWord() {
      let msg = "";
      if (this.file !== "") {
        this.upDataHeadImg();
        return;
      } else {
      }
      if (this.oldPassWord !== "") {
        if(this.newPassWord==this.againPassWord){
          this.upDataPassWord();

        }else{
          this.$message.error('新密码和确认密码要保持一致');
        }
      } else {
        this.$message.error('请输入密码');
      }

    },
    // 修改密码
    upDataPassWord() {
      let formData = new FormData();
      formData.append("newPassword", this.newPassWord);
      formData.append("orginalPassword", this.oldPassWord);

      upPassWordFn(formData).then(res => {
        if (res.data.code === SYSTEM_HTTP_SUCCESS) {
          setTimeout(() => {
            this.$router.push({ path: "/" });
          }, 3000);
        } else {
        }
      });
    },
    // 修改头像提交数据
    upDataHeadImg() {
      let formData = new FormData();
      formData.append('iconFile', this.file)
      upDataHeadImgFn(formData).then(res => {
        if (res.data.code === SYSTEM_HTTP_SUCCESS) {
          this.passWordShow = false;
          this.getInfo();
        }
      });
    },
    // 上传事件
    uploadFilezs() {},
    handleFilezs(res) {
      let testmsg = res.name.substring(res.name.lastIndexOf(".") + 1);
      let extension = testmsg === "jpg";
      let extension2 = testmsg === "png";
      let extension3 = testmsg === "JPG";
      let extension4 = testmsg === "PNG";
      let isLt2M = res.size / 1024 < 1024;
      if (!extension && !extension2 && !extension4 && !extension3) {
        this.$message({
          message: "上传文件只能是 jpg、png格式!",
          type: "warning"
        });
      } else if (!isLt2M) {
        this.$message({
          message: "上传文件大小不能超过 1mb!",
          type: "warning"
        });
      } else {
        this.file = res;
      }
      return extension || extension2 || extension3 || (extension4 && isLt2M);
    },
    // 上传图片显示本地
    handchange(file, fileList) {
      this.headImgSrc = fileList[0].url;
      this.fileList = [];

    },
    // 文件移除
    removeFile(file, fileList) {
      this.file = "";
    }
  },
  mixins: [],
  mounted() {
  }
};
</script>
<style lang="less" scoped>
.dialog {
  width: 100%;
  .head {
    width: 100%;
    height: 80px;
    border-bottom: 1px solid#ccc;
    .head_img {
      width: 66px;
      height: 66px;
      border-radius: 50%;
      overflow: hidden;
      position: relative;

      .head_icon {
        width: 66px;
        height: 66px;
      }
      .mask {
        width: 66px;
        height: 66px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.5);
        position: absolute;
        left: 0;
        top: 0;
        line-height: 66px;
        color: #fff;
        text-align: center;
        font-size: 10px;
      }
    }
    p {
      height: 30px;
      line-height: 30px;
    }

    .user_name {
      margin-top: 10px;
      font-size: 16px;
      font-weight: bold;
    }
  }
  .user_info_content {
    margin-top: 20px;
    p {
      height: 40px;
      line-height: 40px;
      .key {
        padding-right: 20px;
        width: 80px;
        text-align: right;
        display: inline-block;
      }
      .change_password {
        color: #3b78fd;
        margin-left: 8px;
        cursor: pointer;
      }
    }
    .password_box {

      .el-col {
        background: #f7f9ff;
        padding: 20px 0 0 25px;
      }
    }
    .input_col {
      padding-top: 10px;
      input {
        height: 30px;
        width: 90%;
      }
    }
    .check_tips {
      padding: 5px 0 10px 0;
      color: red;
      font-size: 12px;
    }
    .preservation {
      margin-right: 20px;
      margin-bottom: 10px;
      color: #3b78fd;
      display: inline-block;
      cursor: pointer;
    }
    .cancel {
      margin-right: 30px;
      margin-bottom: 10px;
      display: inline-block;
      cursor: pointer;
    }
  }

  .btn-content {
    margin-top: -10px;
    padding-bottom: 15px !important;
  }
}
</style>
