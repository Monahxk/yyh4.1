<!--
 * @Descripttion: 转诊
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-05 14:13:30
 -->
<template>
  <div class="wrapper register" id="register">
    <el-dialog
      title="转诊"
      :visible.sync="isShow.addPage"
      :closeOnClickModal="false"
      width="850px"
      @open="openDialogs"
      @close="closeDialogs('form')"
    >
      <div>
        <div class="content_user">
          <ul class="user_msg">
            <li>
              <span>患者姓名：</span>
              <span>{{stateDatas.patientName}}</span>
            </li>
            <li>
              <span>病历号：</span>
              <span>{{stateDatas.emrNo}}</span>
            </li>
            <li>
              <span>手机号：</span>
              <span>{{stateDatas.mobilephone}}</span>
            </li>
          </ul>
          <div></div>
        </div>

        <div class="add_reg">
          <div class="header">
            <span>转诊</span>
          </div>
          <div class="form_box">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="demo-ruleForm">
              <el-row>
                <el-col :span="11" >
                  <el-form-item label="就诊科室" prop="deparentmentId">
                    <el-select v-model="form.deparentmentId" placeholder="请选择">
                      <el-option
                        :label="item.name"
                        :value=" item.id"
                        v-for="(item,index) in Department "
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="11" :push="1">
                  <el-form-item label="诊治医生" prop="doctorId">
                    <el-select v-model="form.doctorId" placeholder="请选择科室">
                      <el-option
                        :label="item.registerDisplayText"
                        :value="item.id"
                        v-for="(item,index) in Doctor "
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="备注" >
                    <el-input type="textarea" v-model="form.remark" :rows="5" placeholder="请输入备注信息" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="btns_wrap"></div>
        <ul class="btns_wrap">
          <li class="actives item" @click="submitFn('form')" :loading="loading">
            <span>确认转诊</span>
          </li>
          <li class="item" @click="isShow.addPage = !isShow.addPage">
            <span>取消</span>
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { SYSTEM_HTTP_SUCCESS } from "@/constant";
import areaTree from '@/components/chainment/areaTree'
import vuescroll from "vuescroll";
import {
  getPatientDetail,
  getInstitutionsById,
  getDepartmentsById,
  getDoctorsById,
  saveReferral,
  getRelevant,
  treeInstitutionsSimple
} from "@/api";
export default {
  components: {areaTree,vuescroll},
  name: "dialogsAddReferral",
  props: ["isShow", "userinfo"],
  data() {
    return {
      loading: false,
      stateDatas: {
        patientName: "",
        emrNo: "",
        mobilephone: ""
      },
      visitStatus: "",
      form: {
        appointmentVisitTrackId: '',
        deparentmentId: '',
        doctorId: '',
        institutionId: '',
        institutionName: '',
        patientId: '',
        remark: '',
      },
      rules: {
        doctorId: [
          { required: true, message: '请选择医生', trigger: 'change' }
        ],
        institutionName: [
          { required: true, message: '请选择门店', trigger: 'change' }
        ],
        deparentmentId: [
          { required: true, message: '请选择科室', trigger: 'change' }
        ],
      },
      Doctor: [],
      Department: [],
      treeCfg: {
				isshowAddBtn: false,
				hasInstitution: true,
        select: true,
        isGettable: false,
      },
      isShowTree: false,
      ops: {
        mode: "native",
        sizeStrategy: "percent",
        detectResize: true,
        bar: {
          background: "#F0F0F0",
          keepShow: false,
          size: "6px",
          minSize: 0.2
        }
      },
      institutionIdArr: [],
      institutionList: [],
      isChain: sessionStorage.getItem('isChain'),
      loginInstitutionId: sessionStorage.getItem('institutionId')
    };
  },
  watch: {
    // 'form.institutionId': {
    //   handler() {
    //     this.getDepartments(this.form.institutionId);
    //   },
    //   deep: true
    // },
    'form.deparentmentId': {
      handler() {
        if(this.form.deparentmentId) {
          this.getDoctors({
            institutionId: this.form.institutionId,
            deparentmentId: this.form.deparentmentId
          });
        }
      },
      deep: true
    }
  },
  computed: {},
  methods: {
    openDialogs() {
      this.init();
      if (this.userinfo) {
        this.form.appointmentVisitTrackId = this.userinfo.id;
        this.form.patientId = this.userinfo.patientId;
        Object.assign(this.stateDatas, this.userinfo);
      } 
    },
    closeDialogs(formRule) {
      this.$nextTick(() => {
        this.$refs[formRule].resetFields();
      });
    },
    submitFn(formName) {
      this.loading = true;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveReferral(this.form).then(res => {
            this.loading = false;
            if(res.data.code == SYSTEM_HTTP_SUCCESS) {
              this.$emit('event-refresh','referral');
              this.isShow.addPage = false;
            }
          })
        } else {
					console.log('error submit!!');
					this.loading = false;
          return false;
        }
      });
    },
    init() {
      this.form.institutionId = this.userinfo.appointmentVisitTrack.institutionId;
      this.getSelectInfo(this.form.institutionId);
    },
    getSelectInfo(institutionId) {
      getRelevant(institutionId).then(res => {
        //   this.form.institutionId = res.data.data.id;
        //   this.form.institutionName = res.data.data.name;

        //  //0.普通诊所 1.医院  2.连锁诊所总部 3.连锁诊所分部
        //   if(res.data.data.type == '2' || res.data.data.type == '3') {
        //     // this.getInstitutions(this.form.institutionId);
        //   }
        this.Department = res.data.data.Department;
        if(this.Department.length > 0) {
          this.form.deparentmentId = this.Department[0].id;
        }
      });
    },
    getDepartments(id) {
      getDepartmentsById(id).then(res =>{
        this.Department = res.data.data;
      })
    },
    getDoctors(params) {
      getDoctorsById(params).then(res => {
        this.Doctor = res.data.data;
      })
    },
    getInstitutions(id) {
      getInstitutionsById(id).then(res => {
        console.log(res.data.data);
      })
    },
    recursionFn(arr,institutionId) {
      let ids = [],isbreak = false;
			var forFn = function(data,a){
					for (var i in data) {
            let result = a ? new Array(a.join(',')) : new Array();
            result.push(data[i].value);
            if (data[i].value == institutionId) {
              ids = result;
              return result;
            }
            if (data[i].children) {
              forFn(data[i].children,result);
            }
        }
			};
      forFn(arr);

			return ids;
    },
    institutionChange(val) {
      this.form.institutionId = val[val.length-1];
      this.getSelectInfo(this.form.institutionId);
    }
  },
  mixins: [],
  mounted() {
    // this.handleContent()
  }
};
</script>
<style lang="less" scoped>
.el-row {
  // margin-bottom: 10px;hzj
  &:last-child {
    margin-bottom: 0;
  }
}
.wrapper {
  .blue {
    cursor: pointer;
    color: #3b78fd;
  }
  .form_box {
    padding-top: 20px;
    .el-row {
      // margin-left: 132px;hzj
      /deep/.el-select,.el-cascader {
        width: 100%;
      }
    }
  }
  .header {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 60px;
    background: #f7f9ff;
    .btns {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      line-height: 36px;
      li {
        cursor: pointer;
        width: 100px;
        height: 36px;
        margin-left: 20px;
        color: #3b78fd;
        border: 1px solid #3b78fd;
      }
      li:nth-child(1) {
        color: #fff;
        background: #3b78fd;
      }
    }
  }
  .content_user {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    .user_msg {
      display: flex;
      li {
        margin-right: 30px;
      }
    }
  }
  .add_reg {
    padding: 0 20px;
    .header {
      height: 60px;
      background: #f7f9ff;
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: space-between;
    .btns_wrap {
      display: flex;
      justify-content: flex-end;
      text-align: center;
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
        background-image: linear-gradient(
          110deg,
          #4d9eff,
          #3c79fd 99%,
          #3b78fd
        );
      }
    }
  }

  .shop_content{
    position: absolute;
    top: 40px;
    left: 0;
    box-shadow: 0 0 6px 0 #e4e9ff;
    z-index: 9;
    min-width: 300px;
    background: white;
    overflow-y: auto;
    height: 300px;
  }
  .institution {
    /deep/.el-input__inner {
      cursor: pointer;
    }
    
  }
}
</style>
<style>
.register .el-dialog__wrapper .el-dialog__body {
  padding: 0;
}
.el-form-item.is-success .el-input__inner,
.el-form-item.is-success .el-input__inner:focus,
.el-form-item.is-success .el-textarea__inner,
.el-form-item.is-success .el-textarea__inner:focus {
  border-color: #dcdfe6;
}
</style>
