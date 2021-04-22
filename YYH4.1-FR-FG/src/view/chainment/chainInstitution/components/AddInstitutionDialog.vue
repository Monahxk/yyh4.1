<template>
  <el-dialog
    :title="dialogCfg.addInstitutionDialog.dialogTitle"
    :visible.sync="dialogCfg.addInstitutionDialog.isshow"
    :close-on-click-modal="false"
    @open="openDialog"
    width="900px"
  >
    <div class="content">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
        <el-row>
          <el-col :span="11">
            <el-form-item label="名称" prop="name" label-width="55px">
              <el-input v-model="form.name" class="left-input" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :push="2">
            <el-form-item label="简称" prop="alias" label-width="80px">
              <el-input v-model="form.alias" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="标识" prop="identifier" label-width="55px">
              <el-input v-model="form.identifier" class="left-input" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :push="2">
						<el-form-item label="规模" prop="scale" label-width="80px">
							<el-select 
              v-model="form.scale" 
              filterable
              allow-create
              default-first-option
              placeholder="请选择">
                <el-option
                  v-for="(item,index) in scaleList"
                  :key="index"
                  :label="item.name"
                  :value="item.name">
                  <span>{{ item.name }}</span>
                  <span class="close-item" v-on:click.stop="delScale(item.name)"><i class="el-icon-close"></i></span>
                </el-option>
              </el-select>
						</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="联系人" prop="contacts" label-width="55px">
              <el-input v-model="form.contacts" class="left-input" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :push="2">
            <el-form-item label="联系电话" label-width="80px" prop="teleno">
              <el-input v-model="form.teleno" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="地址" label-width="55px">
              <el-input
                v-model="form.addr"
                id="suggestId"
                placeholder="请输入"
                v-show="dialogCfg.addInstitutionDialog.type == 'add' || showAddrInput"
              ></el-input>
              <div
                class="el-input el-input__inner"
                v-show="dialogCfg.addInstitutionDialog.type !== 'add' && !showAddrInput"
                @click="showAddrFn"
              >{{addrStr}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <div class="map-box" id="map"></div>
        </el-row>
        <el-row>
          <el-col :span="20">
            <div class="logo-box avatar-uploader">
              <el-form-item label="门店logo">
                <el-upload
                  class="avatar-uploader"
                  action
                  drag
                  :multiple="false"
                  :auto-upload="false"
                  :show-file-list="false"
                  :on-change="handleAvatarChange"
                >
                  <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon">
                    <p>点击或拖拽图片至此上传</p>
                  </i>
                </el-upload>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="this.dialogCfg.addInstitutionDialog.type == 'add'">
          <el-col :span="24">
            <div class="hr"></div>
          </el-col>
        </el-row>
        <el-row v-if="this.dialogCfg.addInstitutionDialog.type == 'add'">
          <el-col :span="24">
            <el-form-item label="管理员账号">
              <el-col :span="9">
                <el-form-item prop="admin">
                  <el-input v-model="form.admin" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="14" :push="1" class="item-inline">
                <span>
                  初始密码
                  <em>123456</em>
                </span>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="hr"></div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="法人姓名">
              <el-input v-model="form.legalPersonName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :push="2">
            <el-form-item label="法人证件号" prop="email">
              <el-input v-model="form.legalPersonIdentityNo" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="执业许可证号">
              <el-input v-model="form.licenseNo" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :push="2">
            <el-form-item label="社会信用代码" prop="email">
              <el-input v-model="form.socialCreditCode" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item class="label-out" label="组织机构代码证号">
              <el-input v-model="form.organizationalCode" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="formfn('form')" :loading="loading">确 定</el-button>
      <el-button @click="closeDialog">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  addInstitution,
  editInstitution,
  savefileImg,
  getInstitution,
  getInstitutionDo,
  delChainscale,
  getfileImg
} from "@/api";
import { IMGSRC_ROOT } from "@/api/config";
import util from "@/api/util";
import {SYSTEM_HTTP_SUCCESS} from '@/constant'
let form = {
  id: "",
  admin: "",
  name: "",
  alias: "",
  identifier: "",
  teleno: "",
  contacts: "",
  addr: "",
  longitude: "",
  latitude: "",
  legalPersonName: "",
  legalPersonIdentityNo: "",
  licenseNo: "",
  organizationalCode: "",
  socialCreditCode: "",
  logoPath: "",
  type: 0,
  scaleList: [],
  scale: '',
  chainLevel1Id: "",
  chainLevel2Id: "",
  chainLevel3Id: "",
  chainLevel4Id: "",
  headquartersId: ""
};
export default {
  name: "AddInstitutionDialog",
  props: ["dialogCfg"],
  components: {},
  data() {
    let identifier = (rule, value, callback) => {
      let reg = /^[0-9a-zA-Z]*$/g;
      if (!value) {
        return callback(new Error("标识不能为空"));
      } else if (!reg.test(value)) {
        callback(new Error("标识由字母或数字组成"));
      } else {
        callback();
      }
    };
    let phone = (rule, value, callback) => {
      let reg = /^[0-9]*$/g;
      if (!reg.test(value)) {
        return callback(new Error("联系电话只能是数字"));
      } else {
        callback();
      }
    };
    return {
      // 生产环境下api 开发为apis   jyp  7.3 
      headImg: IMGSRC_ROOT + "/common/file/",
      loading: false,
      imageUrl: "",
      form: Object.assign({}, form),
      addrStr: "",
      showAddrInput: false,
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 4, max: 40, message: "长度在 4 到 40 个字符", trigger: "blur" }
        ],
        alias: [
          { required: true, message: "请输入简称", trigger: "blur" },
          { min: 2, max: 12, message: "长度在 2 到 12 个字符", trigger: "blur" }
        ],
        identifier: [
          { required: true, validator: identifier, trigger: "blur" },
          { min: 4, max: 10, message: "长度在 4 到 10 个字符", trigger: "blur" }
        ],
        type: [{ type: "number", message: "请选择机构类型", trigger: "blur" }],
        teleno: [
          { min: 0, max: 31, message: "最大长度32个字符", trigger: "blur" }
        ],
        contacts: [
          { min: 0, max: 32, message: "最大长度32个字符", trigger: "blur" }
        ],
        admin: [
          { min: 0, max: 32, message: "最大长度32个字符", trigger: "blur" }
        ],
        scale: [
          { required: true, message: "请选择规模", trigger: "change" },
        ]
      },
      typeList: [
        {
          value: 0,
          name: "普通诊所"
        },
        {
          value: 1,
          name: "医院"
        },
        {
          value: 2,
          name: "连锁诊所总部"
        },
        {
          value: 3,
          name: "连锁诊所分部"
        }
      ],
      map: null,
      scaleList: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    openDialog() {
      let _this = this;
      this.$nextTick(function() {
        _this.mapinit();
      });
      setTimeout(function() {
        _this.$refs["form"].clearValidate();
        _this.$refs["form"].resetFields();
        _this.showAddrInput = false;
        _this.form = Object.assign({}, form);
        _this.imageUrl = "";
        if (_this.dialogCfg.addInstitutionDialog.type == "add") {
          _this.form.chainLevel1Id =
            _this.dialogCfg.addInstitutionDialog.data.chainLevel1Id;
          _this.form.chainLevel2Id =
            _this.dialogCfg.addInstitutionDialog.data.chainLevel2Id;
          _this.form.chainLevel3Id =
            _this.dialogCfg.addInstitutionDialog.data.chainLevel3Id;
          _this.form.chainLevel4Id =
            _this.dialogCfg.addInstitutionDialog.data.chainLevel4Id;
          _this.form.headquartersId =
          _this.dialogCfg.addInstitutionDialog.data.headquartersId;
          getInstitutionDo().then(res => {
            if(res.data.code == SYSTEM_HTTP_SUCCESS) {
              _this.scaleList = res.data.data.scaleList;
            }
          })
        } else {
          getInstitution(_this.dialogCfg.addInstitutionDialog.data.id)
            .then(res => {
              _this.addrStr = res.data.data.addr;
              let form = res.data.data;
              form.addr = "";
              _this.form = form;
              _this.imageUrl = _this.headImg + _this.form.logoPath;
              _this.creatPoint();
            })
            .catch(res => {});
        }
      }, 100);
    },
    closeDialog() {
      this.dialogCfg.addInstitutionDialog.isshow = false;
      this.loading = false;
      this.map = null;
    },
    upFileImg(img) {
      let formData = new FormData();
      formData.append("file", img);
      savefileImg(formData)
        .then(res => {
          if (res.data.code == SYSTEM_HTTP_SUCCESS) {
            this.form.logoPath = res.data.data;
            this.$message.success("logo上传成功!");
          } else {
            this.$message.error("logo上传失败!");
          }
        })
        .catch(res => {
          this.$message.error("logo上传失败!");
        });
    },
    //门店表单提交
    formfn(formName) {
      let _this = this;
      _this.loading = true;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          let hasScale = false;
           this.form.scaleList.map((item => {
            if(item.name === this.form.scale) {
              hasScale = true;
              return;
            }
          }));
          if(!hasScale) {
            this.form.scaleList = this.scaleList;
            this.form.scaleList.push({
              name: this.form.scale
            })
          }
          if (_this.dialogCfg.addInstitutionDialog.type === "add") {
            addInstitution(_this.form)
              .then(res => {
                if (res.data.code == SYSTEM_HTTP_SUCCESS) {
                  _this.init();
                  _this.$emit("getTableList");
                } else {
                  _this.loading = false;
                }
              })
              .catch(res => {
                _this.loading = false;
              });
          } else {
            if (_this.form.addr == "") _this.form.addr = _this.addrStr;
            editInstitution(_this.form)
              .then(res => {
                if (res.data.code == 200) {
                  _this.init();
                  _this.$emit("getTableList");
                } else {
                  _this.loading = false;
                }
              })
              .catch(res => {
                console.log(res)
                _this.loading = false;
              });
          }
        } else {
          console.log("error submit!!");
          _this.loading = false;
          return false;
        }
      });
    },
    init() {
      this.closeDialog();
    },
    handleAvatarChange(file, fileList) {
      const isLt2M = file.size / 1024 / 1024 < (1 / 1024) * 100;
      if (!isLt2M) {
        this.$message.error("请上传100k以内照片!");
        fileList = [];
      } else {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.upFileImg(file.raw);
      }
    },
    mapinit() {
      let _this = this;
      // 百度地图API功能
      function G(id) {
        return document.getElementById(id);
      }
      var map = new BMap.Map("map");
      _this.map = map;
      map.centerAndZoom("成都", 12); // 初始化地图,设置城市和地图级别。
      map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
      var ac = new BMap.Autocomplete({ input: "suggestId", location: map }); //建立一个自动完成的对象

      ac.addEventListener("onhighlight", function(e) {
        //鼠标放在下拉列表上的事件
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
          value =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;
        }
        str =
          "FromItem<br />index = " +
          e.fromitem.index +
          "<br />value = " +
          value;

        value = "";
        if (e.toitem.index > -1) {
          _value = e.toitem.value;
          value =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;
        }
        str +=
          "<br />ToItem<br />index = " +
          e.toitem.index +
          "<br />value = " +
          value;
      });

      var myValue;
      ac.addEventListener("onconfirm", function(e) {
        //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        myValue =
          _value.province +
          _value.city +
          _value.district +
          _value.street +
          _value.business;
        _this.form.addr = myValue;
        setPlace();
      });

      function setPlace() {
        map.clearOverlays(); //清除地图上所有覆盖物
        function myFun() {
          var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
          _this.form.longitude = pp.lng;
          _this.form.latitude = pp.lat;
          map.centerAndZoom(pp, 18);
          map.addOverlay(new BMap.Marker(pp)); //添加标注
        }
        var local = new BMap.LocalSearch(map, {
          //智能搜索
          onSearchComplete: myFun
        });
        local.search(myValue);
      }
    },
    creatPoint() {
      if (this.map) {
        if (this.form.longitude) {
          var point = new BMap.Point(this.form.longitude, this.form.latitude);
          this.map.centerAndZoom(point, 12);
          var marker = new BMap.Marker(point); // 创建标注
          this.map.addOverlay(marker); // 将标注添加到地图中
        }
      }
    },
    showAddrFn() {
      this.showAddrInput = true;
      this.form.addr = this.addrStr;
      document.getElementById("suggestId").focus();
    },
    delScale(scaleName) {
      this.$confirm("此操作将删除该门店规模, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delChainscale(scaleName).then(res => {
          if(res.data.code == SYSTEM_HTTP_SUCCESS) {
            let scaleList = [];
            this.scaleList.map((item => {
              if(item.name !== scaleName) {
                scaleList.push(item);
              }
            }))
            this.scaleList = scaleList;
          }
        })
      }).catch(() => {});
      
    }
  }
};
</script>
<style lang="less" scoped>
.hr {
  width: 100%;
  height: 0;
  margin: 10px 0 20px 0;
  border-bottom: 1px dashed #dcdfe6;
}
.content {
  height: 500px;
  overflow-y: auto;
  margin-right: -30px;
  padding-right: 30px;
  position: relative;
  .el-select {
    width: 100%;
  }
  .search-box {
    padding: 0 10px;
  }
  .map-box {
    height: 240px;
    width: 100%;
    div {
      height: 100%;
    }
  }
  .logo-box {
    padding-top: 20px;
    p {
	  line-height: 20px;
	  font-size: 14px;
    }
  }
  .avatar-uploader /deep/.el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 150px;
    height: 150px;
    line-height: normal !important;
    font-size: inherit !important;
  }
  .avatar-uploader-icon {
    color: #b5bed1;
    text-align: center;
    padding: 20px;
    margin-top: 25px;
  }
  .avatar {
    width: 150px;
    height: 150px;
    display: block;
  }

  .label-out {
    /deep/.el-form-item__label {
      line-height: 20px;
    }
  }
  .item-inline {
    span {
      padding-right: 20px;
      em {
        font-weight: normal;
      }
    }
    /deep/.el-form-item {
      display: inline-block;
    }
  }

  /deep/.el-upload-dragger {
    height: 100%;
    width: 100%;
    border: 0;
  }
  .left-input {
    width: 303px;
  }

  .map {
    width: 100%;
    height: 100%;
  }
}
/deep/.el-dialog__body {
  padding: 10px 30px 5px 30px;
}
.close-item {
  position: absolute;
  right: 10px;
  width: 20px;
  &:hover {
    color: #409EFF;
  }
}
.add-item {
  position: absolute;
  display: block;
  width: 100%;
  left: 0;
  padding: 0 20px;
  color: #409EFF;
}
</style>
<style>
.tangram-suggestion-main {
  z-index: 9999;
}
</style>

