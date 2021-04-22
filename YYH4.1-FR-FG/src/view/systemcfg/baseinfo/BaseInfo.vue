<template>
  <div class="wrapper">
    <div class="header">
      <div class="header_left">
        <div>基本信息</div>
      </div>
    </div>

    <div class="content">
      <el-form label-width="130px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="门诊名称">
              <el-input :disabled="edit" class="input_width"  v-model="form.name" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="2">
            <el-form-item label="简称"  >
              <el-input :disabled="edit" class="input_width"  v-model="form.alias" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6" >
            <el-form-item label="类型">
              <el-input :disabled="edit" class="input_width" v-model="clinicType"  size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6" >
            <el-form-item label="标识">
              <el-input :disabled="edit" class="input_width" v-model="form.identifier" @blur=isIdentifier() size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="电话">
              <el-input :disabled="edit" class="input_width" v-model="form.teleno" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="17">
            <el-form-item label="地址">
              <el-input :disabled="edit"  v-model="form.addr" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row >
          <el-col :span="17">
            <el-form-item label="logo图片">
              <div class="upload_box">
                <el-upload
                  action
                  list-type="picture"
                  :before-upload="handleFile"
                  :multiple="false"
                  :limit="1"
                  :on-exceed="handleExceed"
                  :on-change="handchange"
                  :file-list="fileList"
                  :show-file-list="true"
                  ref="upload"
                  :auto-upload="true"
                  :http-request="uploadFile"
                  drag
                  :disabled="edit"
                >
                  <div >
                    将文件拖到此处，或
                    <em>点击上传</em>
                  </div>
                </el-upload>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <span :disabled="edit" class="moreinfo">更多信息</span>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="法人姓名">
              <el-input
                :disabled="edit"
                class="input_width"
                placeholder="请输入"
                v-model="form.legalPersonName"
                size="small"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="3">
            <el-form-item label="法人证件号码" >
              <el-input
                :disabled="edit"
                class="input_width"
                placeholder="请输入"
                v-model="form.legalPersonIdentityNo"
                size="small"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="执业许可证号">
              <el-input
                :disabled="edit"
                class="input_width"
                placeholder="请输入"
                v-model="form.licenseNo"
                size="small"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="3">
            <el-form-item label="组织机构代码证号" >
              <el-input
                :disabled="edit"
                class="input_width"
                placeholder="请输入"
                v-model="form.organizationalCode"
                size="small"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="社会信用代码">
              <el-input
                :disabled="edit"
                class="input_width"
                placeholder="请输入"
                v-model="form.socialCreditCode"
                size="small"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <ul class="btns_wrap">
      <li class="actives item" @click="editClinicInfo">
        <span>编辑</span>
      </li>
      <li class="item" @click="unique()">
        <span>保存</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { getCurrentClinic, isIdentifier, updateClinic,updateInstitutionLogo } from "@/api";
import { SYSTEM_HTTP_SUCCESS } from "@/constant";
export default {
  components: {},
  props: {},
  data() {
    return {
      fileList: [],
      showDialog: { register: false },
      file: "",
      form: {},
      dialogVisible: false,
      photoPath:'',
      edit: true,
      identifier:'',
      clinicType:'普通诊所'
    };
    
  },
  watch: {

  },
  computed: {},
  mounted() {
    this.getClinicInfo();
  },
  methods: {
    handleExceed(file) {
      this.$message({
        message: "警告，当前只允许上传一张图片",
        type: "warning"
      });
    },
    handleFile(res) {
      const isLt2M = res.size / 1024 / 1024 < 3;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 3MB!");
        return isLt2M;
      } else {
        this.file = res;
        let formData = new FormData();
        formData.append("file", this.file);
        updateInstitutionLogo(formData).then(res=>{
        })
      }
    },
    uploadFile(file) {

    },
    // 上传图片显示本地
    handchange(file, fileList) {

      
    },
    // 文件移除
    removeFile(file, fileList) {
      this.file = "";
    },
    getClinicInfo() {
      getCurrentClinic({}).then(res => {
        this.form = res.data.data;
        if (this.form.legalPersonName == null) {
          this.form.legalPersonName = "";
        }
        if (this.form.legalPersonIdentityNo == null) {
          this.form.legalPersonIdentityNo = "";
        }
        if (this.form.licenseNo == null) {
          this.form.licenseNo = "";
        }
        
      });
    },
    isIdentifier(){
      isIdentifier({
        id: this.form.id,
        identifier: this.form.identifier
      }).then(res => {
        this.identifier=res.data.data;
        if( ! res.data.data){
          this.$message.error('该标识已被占用！');
          this.form.identifier='';
        }
      });
    },
    editClinicInfo() {
      this.edit = !this.edit;
    },
    unique() {
      let data={
        id: this.form.id,
        name : this.form.name,
        alias : this.form.alias,
        identifier : this.form.identifier,
        teleno :this.form.teleno,
        addr : this.form.addr,
        longitude : "",
        latitude : "",
        legalPersonName :this.form.legalPersonName,
        legalPersonIdentityNo :this.form.legalPersonIdentityNo,
        licenseNo :this.form.licenseNo,
        organizationalCode :this.form.organizationalCode,
        socialCreditCode :this.form.socialCreditCode  ,      
      };
      if(!this.edit){
        updateClinic(data).then(res => {
          if(res.data.code==SYSTEM_HTTP_SUCCESS){
            this.getClinicInfo();
            this.$root.Bus.$emit('ChangeMainpageFn')
            this.edit = true;
          }

        });
      }
    }
  },
  mixins: []
};
</script>
<style lang="less" scoped>
.wrapper{
  height: 100%;
}
.header {
  height: 18px;
  font-size: 16px;
  display: flex;
  justify-content: space-between;

  .header_left {
    display: flex;

    align-items: center;
    div {
      margin-right: 80px;
      font-size: 16px;
      color: #493bfd;
    }
    .edit {
      display: flex;
      align-items: center;
      span:nth-child(2) {
        margin-right: 20px;
      }
      span:nth-child(3) {
        width: 26px;
        height: 26px;
        cursor: pointer;
        background: url("../../../assets/img/edit.png") no-repeat center center;
        background-size: 100% 100%;
      }
    }
  }
  .header_right {
    height: 48px;
    padding: 25px 20px;
    cursor: pointer;
    color: #493bfd;
    font-size: 16px;
    line-height: 48px;
    text-align: center;
    box-shadow: 0 1px 4px 0 #b9cdf9;
  }
}
.content {
  margin-top: 20px;
  padding: 30px;
  padding-bottom: 20px;
  background: #fff;
  box-shadow: 0 1px 4px 0 #b9cdf9;
  height:90%;
  overflow-y: scroll;
  .input_width{
    width:300px;
  }
  .userLogo{
    width: 300px;
    height: 300px;
  }
  .moreinfo{
    color: #493bfd;
    font-size:16px;
  }
}
.pagination_box {
  height: 70px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.btns_wrap {
  display: flex;
  justify-content: flex-end;
  text-align: center;
  margin-top: 20px;
  line-height: 32px;
  .item {
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
</style>
<style>
.upload_box .el-upload--picture {
  height: 50px;
  width: 100% !important;
  border: 0;
  line-height: 50px;
}
.upload_box .el-upload .el-upload-dragger {
  width: 100%;
  height: 100%;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
.avatar {
  width: 150px;
  height: 150px;
  display: block;
}
.pagination_box .el-pagination span {
  color: #4d9eff;
}
.pagination_box .el-input__inner {
  color: #4d9eff;
  border: 1px solid #4d9eff;
}
.pagination_box .el-select .el-input .el-select__carett {
  color: #4d9eff !important;
}
.pagination_box .number {
  color: #4d9eff !important;
  background: #fff !important;
  border: 1px solid #4d9eff !important ;
}
.pagination_box .el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
  color: #4d9eff !important;
}
.pagination_box
  .el-pagination.is-background
  .el-pager
  li:not(.disabled).active {
  color: #fff !important;
  background: #4d9eff !important;
  border: none;
}
.pagination_box .btn-next,
.pagination_box .btn-prev {
  border: 1px solid #4d9eff;
  padding: 0 10px !important;
  background: #fff !important;
}
</style>
