<!--
@Author: ZJZ
@Date:   2019-08-13
@Filename: DialogsAddRegister.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-13
-->

<template>
  <div class="wrapper register" id="register">
    <el-dialog
      :title="stateDatas.edit ? '修改挂号' :'新增挂号'"
      :visible.sync="isShow.register"
      :closeOnClickModal="false"
      width="850px"
      @open="openDialogs"
      @close="closeDialogs('form')"
    >
      <div>
        <div class="header" v-show="isTitle">
          <el-autocomplete
            style="width:280px"
            popper-class="my-autocomplete"
            v-model="user"
            :trigger-on-focus="false"
            :fetch-suggestions="searchPatient"
            placeholder="请输入患者姓名"
            @select="selectPatient"
            size="small"
          >
            <i class="el-icon-search el-input__icon" slot="suffix" @click="handleIconClick"></i>
            <template slot-scope="{ item }">
              <div class="name_box">
                <span>{{ item.patientName }}</span>
              </div>
            </template>
          </el-autocomplete>
        </div>
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
            <span>新增挂号</span>
          </div>
          <div class="form_box">
            <el-form ref="form" :show-message="false" :model="form" label-width="100px">
              <el-row>
                <el-col :span="11">
                  <el-form-item label="类别" prop="type" :required="true">
                    <el-radio @change="change" v-model="form.type" label="0">初诊</el-radio>
                    <el-radio @change="change" v-model="form.type" label="1">复诊</el-radio>
                    <el-radio @change="change" v-model="form.type" label="2">再诊</el-radio>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="11" :push="1" v-if="isChain == 'true'">
                  <el-form-item label="就诊门店" class="mt10" required>
                    <el-cascader
                    v-model='institutionIdArr'
                    :options="institutionList"
                    expand-trigger="hover"
                    :show-all-levels='false'
                    @change="institutionChange">
                    </el-cascader>
                  </el-form-item>
                </el-col> -->
              </el-row>

              <el-row>
                <el-col :span="11">
                  <el-form-item label="挂号类型" prop="mode" :required="true">
                    <el-select v-model="form.mode" @change="regTypeChange" placeholder="请选择">
                      <el-option
                      :label="item.typeName"
                      :value="item.id+''"
                      v-for="(item,index) in regTypeList"
                      :key="index"
                     >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="11" :push="1">
                  <el-form-item label="就诊目的" prop="target" :required="true">
                    <el-select v-model="form.target" @change="change" placeholder="请选择">
                      <el-option
                        :label="item.name"
                        :value="item.id+''"
                        v-for="(item,index) in AppointmentItemConfig "
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item label="就诊科室" prop="Departments" :required="true">
                    <el-select v-model="form.Departments" @change="change" placeholder="请选择">
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
                  <el-form-item label="诊治医生" prop="doctor" :required="true">
                    <el-select v-model="form.doctor" @change="change" placeholder="请选择">
                      <el-option
                        :label="item.registerDisplayText"
                        :value="item.id+''"
                        v-for="(item,index) in Doctor "
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item label="导诊员" prop="guide">
                    <el-select v-model="form.guide" @change="change" placeholder="请选择">
                      <el-option
                        :label="item.name"
                        :value=" item.id"
                        v-for="(item,index) in Guide "
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="11" :push="1">
                  <el-form-item label="应收挂号费">
                    <span>
                      <strong style="color:red;">￥{{receivableCost}}</strong>
                    </span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item label="实收金额" prop="realCost">
                    ￥
                    <el-input v-model="form.realCost" maxlength="12" style="width:182px;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11" :push="1">
                  <el-form-item label="支付方式" prop="chargeWay">
                    <el-select v-model="form.chargeWay" @change="change" placeholder="请选择">
                      <el-option
                        :label="item.name"
                        :value="item.id"
                        v-for="(item,index) in PayWay "
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-form-item label="找零" label-width="82px">
                  <span>
                    <strong style="color:red;">￥ {{giveChange}}</strong>
                  </span>
                </el-form-item>
              </el-row>
            </el-form>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="btns_wrap"></div>
        <ul class="btns_wrap">
          <li class="actives item" @click="saveRegister">
            <span>确认挂号</span>
          </li>
          <li class="item" @click="isShow.register = !isShow.register">
            <span>取消</span>
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import areaTree from "@/components/chainment/areaTree";
import { SYSTEM_HTTP_SUCCESS, POSITION_ID_DOCTOR } from "@/constant";
import vuescroll from "vuescroll";
import sse from "sessionstorage";
import {
  getPatientlists,
  getRegisterInfo,
  getRelevant,
  addRegister,
  getEditRegisterInfo,
  putRegisterupdata,
  registrationdoIdInfo,
  getRegisterPatientIdInfo
} from "@/api";
export default {
  components: { vuescroll },
  name: "register-dialogs",
  props: ["isShow", "userinfo"],
  data() {
    return {
      stateDatas: {
        patientName: "",
        emrNo: "",
        patientId: "",
        mobilephone: ""
      },
      isTitle: true,
      sendData: {
        patientId: ""
      },
      user: "",
      visitStatus: "",
      form: {
        type: "0",
        target: "",
        guide: "",
        chargeWay: "",
        realCost: 0,
        mode: "",
        Departments: "",
        doctor: "",
        appointmentVisitTrackid: '',
        visitTrackLineitemid: ''
      },

      isOffClick: false,
      AppointmentItemConfig: [],
      Guide: [],
      Doctor: [],
      PayWay: [],
      Department: [],
      regTypeList: [],
      masterId: "",
      receivableCost: 0,
      isShowDialog: {
        patient: false,
        addPatientpage: false,
        register: false,
        addPatientpageId: "",
        add: false,
        registerId: ""
      },
      show: {
        register: false,
        label: false
      },
      giveChange: "",
      fifty: 0,
      institutionId: "",
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
    userinfo: {
      handler(val, oldVal) {},
      deep: true
    },
    form: {
      handler(val, oldVal) {
        if (this.form.realCost) {
          this.giveChange = this.form.realCost - this.fifty;
        } else {
          this.giveChange = "";
        }
      },
      deep: true
    },
    "isShow.register"() {
      if (!this.isShow.register) {
      }
    }
  },

  created() {
    this.init(this.loginInstitutionId);
  },
  computed: {},
  methods: {
    openDialogs() {
      if (this.userinfo) Object.assign(this.stateDatas, this.userinfo);
      // console.log(this.stateDatas);
      if (this.userinfo && this.userinfo.edit) {
        // 编辑挂号
        getEditRegisterInfo({ id: this.stateDatas.id }).then(res => {
          this.form.doctor = res.data.data.appointmentVisitTrack.doctorId.toString();
          if (res.data.data.visitTrackLineitem) {
            this.form.Departments =
              res.data.data.visitTrackLineitem.departmentId || '1';
            this.form.guide = res.data.data.visitTrackLineitem.guiderId;
            this.form.patientId = res.data.data.visitTrackLineitem.patientId;
            this.receivableCost =
              res.data.data.visitTrackLineitem.receivableCostYuan;
            this.form.realCost = res.data.data.visitTrackLineitem.realCostYuan;
            this.form.chargeWay = res.data.data.visitTrackLineitem.payWayId;
            this.form.visitTrackLineitemid =
              res.data.data.visitTrackLineitem.id;
            this.form.mode = res.data.data.visitTrackLineitem.registerTypeId + '';
          }
          if(res.data.data.appointmentVisitTrack) {
            let track = res.data.data.appointmentVisitTrack;
            this.form.target = track.treatItemIds
             this.form.appointmentVisitTrackid =
              res.data.data.appointmentVisitTrack.id;
            this.form.type = String(
              res.data.data.appointmentVisitTrack.returnVisit
            );
          }
          this.init(0);
        });
      } else {

        // 列表和患者详情里新增挂号
        //   if (this.userinfo && this.userinfo.appointmentVisitTrack) {
        //   this.form.type = this.userinfo.appointmentVisitTrack.returnVisit.toString();
        // }
        if (this.userinfo && this.userinfo.appointmentVisitTrack) {

          if(this.userinfo.appointmentVisitTrack.doctorId) {
            this.form.doctor = this.userinfo.appointmentVisitTrack.doctorId.toString();
          }
          if(this.userinfo.appointmentVisitTrack.departmentId) {
            this.form.Departments = this.userinfo.appointmentVisitTrack.departmentId;
          }
        }

        //患者详情，新增挂号，查询挂号类别
        if(this.userinfo.patientId && !this.userinfo.appointmentVisitTrack) {
          getRegisterPatientIdInfo(this.userinfo.patientId).then(res => {
            if(res.data.code == SYSTEM_HTTP_SUCCESS) {
              this.form.type = res.data.data.returnVisit + '';
            }
          }).catch(err => {
            console.log(err)
          })
        }
        // 列表和患者详情里新增挂号
        if(this.userinfo && this.userinfo.appointmentVisitTrack){
          registrationdoIdInfo(this.userinfo.appointmentVisitTrack.id).then(res => {
            if(res.data.code == SYSTEM_HTTP_SUCCESS) {
              this.form.type = res.data.data.appointmentVisitTrack.returnVisit + '';
            }
          }).catch(err => {
            console.log(err)
          })
        }

        let powerId = sse.getItem("powerId");
        if (powerId == POSITION_ID_DOCTOR) {
          this.form.doctor = sse.getItem("userId");
          this.form.Departments = sse.getItem("departmentId") - 0;
        }
      }
      this.init(this.loginInstitutionId);
      this.form.institutionId = this.loginInstitutionId;
    },
    closeDialogs(formRule) {
      this.user = "";
      this.$nextTick(() => {
        this.$refs[formRule].resetFields();
      });

      this.stateDatas.patientName = "";
      this.stateDatas.emrNo = "";
      this.stateDatas.mobilephone = "";
    },
    change() {
      this.$forceUpdate();
    },
    workrelationReceptionistAllTableRefresh() {
      this.$root.Bus.$emit("ChangeRefresh");
      this.$root.Bus.$emit("VisitRecordRefresh");
    },
    open(msg, type) {
      this.$message({
        message: msg,
        type: type
      });
    },
    init(institutionId) {
      // if(this.isChain == 'true') {
      //   getRelevant(institutionId).then(res => {
      //     this.setData(res.data.data);
      //   });
      // } else {
      //   getRegisterInfo().then(res => {
      //     this.setData(res.data.data);
      //   })
      // }

      getRegisterInfo().then(res => {
        this.setData(res.data.data);
      })

    },
    setData(data) {
      this.AppointmentItemConfig = data.treatItemConfigList;
        this.Guide = data.guidancerList;
        this.Doctor = data.doctorList;
        this.PayWay = data.paywayList;
        this.Department = data.departmentList;
        this.regTypeList = data.regTypeList;
        if (
          data.treatItemConfigList.length > 0 &&
          data.treatItemConfigList[0].institutionId
        ) {
          if (this.userinfo && !this.userinfo.edit)this.form.target = data.treatItemConfigList[0].id + '';
        }

        if (
          data.departmentList.length > 0 &&
          data.departmentList[0].id
        ) {
          if (this.userinfo && !this.userinfo.edit) {
            let powerId = sse.getItem("powerId");
            if (powerId == POSITION_ID_DOCTOR) {
              this.form.Departments = sse.getItem("departmentId") - 0;
            } else {
              this.form.Departments = data.departmentList[0].id;
            }
          }
        }
        if (
          data.regTypeList.length > 0 &&
          data.regTypeList[0].id
        ) {
          if (this.userinfo && !this.userinfo.edit)this.form.mode = data.regTypeList[0].id + '';
          this.receivableCost=data.regTypeList[0].feeYuan
        }
    },
    handleIconClick() {},
    searchPatient(queryString, cb) {
      this.init(this.form.institutionId);
      getPatientlists(this.user).then(res => {
        if (res.data.code === SYSTEM_HTTP_SUCCESS) cb(res.data.data);
      });
    },
    selectPatient(val) {
      this.sendData.patientId = val.id;
      this.user = val.patientName;
      this.stateDatas = val;
      this.stateDatas.patientId = val.id;
      this.form.type = val.returnVisit + '';
    },
    clear() {},
    saveRegister() {
      if (checkData(this)) {
        if (this.isOffClick) return;
        this.isOffClick = true;

        /**
         * 4.1新格式
         * hzj
         * 2019-09-11
         * 还未调好，后台需修改
         * 2019-09-12
         * 对接好
         */
        let data = {
          appointmentVisitTrack: {
            id: this.stateDatas.rowId || '',
            doctorId: this.form.doctor,//医生id
            patientId: this.stateDatas.patientId,//患者id
            returnVisit: Number(this.form.type), //初诊标识
            treatItemIds: this.form.target, //就诊目的
            departmentId: this.form.Departments, //部门
            patientName: this.stateDatas.patientName,
          }
        };
        data.visitTrackLineitem = {
          id: 0,
          guiderId: this.form.guide, // 导诊员id
          receivableCostYuan: this.receivableCost,// 应收挂号费
          realCostYuan: this.form.realCost, // 实收金额
          payWayId: this.form.chargeWay, //收费方式id
          institutionId: this.institutionId,
          registerTypeId: this.form.mode, //挂号方式
          departmentId: this.form.Departments, //部门
          doctorId: this.form.doctor,//医生id
          patientId: this.stateDatas.patientId,//患者id
        }
        if (this.stateDatas.edit) {
          data.visitTrackLineitem.id = this.form.visitTrackLineitemid;
          data.appointmentVisitTrack.id = this.form.appointmentVisitTrackid;
          putRegisterupdata(data).then(res => {
            if (res.data.code == SYSTEM_HTTP_SUCCESS) {
              this.workrelationReceptionistAllTableRefresh();
              if (this.$attrs["event-refresh"]) this.$attrs["event-refresh"]();
              this.isShow.register = false;
            } else {
            }
            setTimeout(() => {
              this.isOffClick = false;
            }, 1000);
          });
        } else {
          if (this.stateDatas.add) {
            data.id = this.stateDatas.rowId;
            data.patientId = this.stateDatas.patientId;
          }
          // 患者详情下不需要传id该字段用做挂号时判断
          if (this.stateDatas.addNoId) {
            data.id = 0;
            data.appointmentVisitTrack.id = 0;
            data.visitTrackLineitem.id = 0;
          }
          // console.log(JSON.stringify(data))
          addRegister(data).then(res => {
            if (res.data.code == SYSTEM_HTTP_SUCCESS) {
              this.workrelationReceptionistAllTableRefresh();
              if (this.$attrs["event-refresh"]) this.$attrs["event-refresh"]();
              this.isShow.register = false;
            } else {
            }
            setTimeout(() => {
              this.isOffClick = false;
            }, 1000);
          });
        }
      }
    },
    institutionChange(val) {
      this.form.institutionId = val[val.length-1];
      this.init(this.form.institutionId);
    },
    regTypeChange() {
      let feeYuan = '';
      this.regTypeList.map((item)=> {
        if(item.id == this.form.mode) {
          feeYuan = item.feeYuan;
        }
      })
      this.receivableCost = feeYuan;
    }
  },
  mixins: [],
  mounted() {
  }
};
function checkData(v) {
  let cd = false;
  if (v.stateDatas.patientId) {
    cd = true;
  } else {
    cd = false;
    v.open("患者不能为空！", "warning");
    return cd;
  }

  if (v.form.type) {
    cd = true;
  } else {
    cd = false;
    v.open("请选择类别！", "warning");
    return cd;
  }

  if (v.form.target) {
    cd = true;
  } else {
    cd = false;
    v.open("请选择就诊目的！", "warning");
    return cd;
  }
  if (v.form.Departments) {
    cd = true;
  } else {
    cd = false;
    v.open("请选择科室！", "warning");
    return cd;
  }
  if (v.form.doctor) {
    cd = true;
  } else {
    cd = false;
    v.open("请选择医生！", "warning");
    return cd;
  }

  return cd;
}
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
      /deep/.el-select {
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

  .shop_content {
    position: absolute;
    top: 40px;
    left: 0;
    box-shadow: 0 0 6px 0 #e4e9ff;
    z-index: 9;
    min-width: 300px;
    background: white;
    overflow-y: auto;
    height: 300px;
    ::-webkit-scrollbar-track-piece {
      //滚动条凹槽的颜色，还可以设置边框属性
      background-color: #f8f8f8;
    }
    ::-webkit-scrollbar {
      //滚动条的宽度
      width: 4px;
      height: 8px;
    }
    ::-webkit-scrollbar-thumb {
      //滚动条的设置
      background-color: #dddddd;
      background-clip: padding-box;
      min-height: 28px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background-color: #bbb;
    }
  }
  .institution {
    /deep/.el-input__inner {
      cursor: pointer;
    }
  }
  .el-cascader {
    width: 100%;
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
