<!--
@Author: ZJZ
@Date:   2019-08-01
@Filename: index.vue
@Last modified by:   ZJZ
@Last modified time: 2019-09-11
-->

<template>
  <div class="wrapper_patient chain_patient_detail">
    <div :class="{isEdit:isEdit}">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="个人信息" name="1">
          <el-form ref="form" :inline="true" :model="form" label-width="80px">
            <el-form-item label="患者姓名">
              <span>{{form.patientName}}</span>
            </el-form-item>
            <el-form-item label="病历号">
              <span>{{form.emrNo}}</span>
            </el-form-item>
            <el-form-item label="患者来源">
              <span>{{form.sourceName}}</span>
            </el-form-item>
            <el-form-item label="性别">
              <span>{{form.gender==1?'男':'女'}}</span>
            </el-form-item>
            <el-form-item label="患者生日">
              <span>{{form.patientBirth}}</span>
            </el-form-item>
            <el-form-item label="年龄">
              <span>{{form.age}}</span>
            </el-form-item>
            <el-form-item label="手机号">
              <span>{{form.mobilephone}}</span>
            </el-form-item>
            <el-form-item label="身份证号">
              <span>{{form.idCard}}</span>
            </el-form-item>

            <el-form-item label="家庭地址">
              <span>{{form.address}}</span>
            </el-form-item>
            <el-form-item label="患者备注">
              <span>{{form.remark}}</span>
            </el-form-item>
          </el-form>
        </el-collapse-item>

        <el-collapse-item title="联系方式" name="2">
          <el-form ref="form" :model="form" label-width="80px">
            <el-row>
              <el-col :span="11">
                <el-form-item label="微信">
                  <span>{{form.wechat}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="电话">
                  <span>{{form.telephone}}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="11">
                <el-form-item label="QQ">
                  <span>{{form.qq}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="邮箱">
                  <span>{{form.email}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>

        <el-collapse-item title="首诊信息" name="4">
          <el-form ref="form" :model="form" label-width="80px">
            <el-row>
              <el-col :span="11">
                <el-form-item label="责任医生">
                  <span>{{form.doctorName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="咨询师">
                  <span>{{form.postcounselorName}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="专属顾问">
                  <span>{{form.precounselorName}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>

        <el-collapse-item title="亲友关系" name="5">
          <el-table
            :header-cell-style="{background:'#F7F9FF'}"
            :data="tableData"
            style="width: 100%"
            class="tables"
          >
            <el-table-column
              fixed
              align="center"
              :prop="item.prop"
              :label="item.label"
              v-for="(item,index) in tableHeader"
              :key="index"
            >
              <template slot-scope="scope">
                <div>
                  <!-- 关系 -->
                  <el-select
                    :disabled="isEdit"
                    v-model="scope.row.relationId"
                    placeholder="请选择"
                    v-if="item.prop == 'relation' "
                  >
                    <el-option
                      v-for="(item, index) in acceptData.PatientRelationship"
                      :key="index"
                      :label="item.relationName"
                      :value="item.id"
                    ></el-option>
                  </el-select>

                  <!-- 相关人员姓名 -->
                  <el-input
                    readonly
                    v-model="scope.row.relationPatientName"
                    v-if="item.prop == 'relationPatient'"
                    suffix-icon="el-icon-search"
                  ></el-input>

                  <!-- 备注 -->
                  <el-input
                    v-model="scope.row.remark"
                    v-if="item.prop == 'remark' "
                    :readonly="isEdit"
                  ></el-input>

                  <!-- 性别 -->
                  <span v-if="item.prop == 'gender' ">{{scope.row[item.prop]}}</span>

                  <!-- 卡名称 -->
                  <span v-if="item.prop == 'card' ">{{scope.row[item.prop]}}</span>

                  <!-- 余额 -->
                  <span v-if="item.prop == 'balance' ">{{scope.row[item.prop]}}</span>


                </div>
              </template>
            </el-table-column>
          </el-table>

        </el-collapse-item>

        <el-collapse-item title="患者标签" name="6">
          <ul class="label">
            <li class="clearfix">
              <span class="fl">标签缩写:</span>
              <div class="label_box">
                <span
                  class="label_item"
                  v-for="(item, index ) in labelArr"
                  :key="index"
                  :style="{background:item.labelConfig.color}"
                >{{item.labelConfig.abbreviate}}</span>
              </div>
              <span class="fr" v-show="!isEdit">
                <span style="cursor: pointer;" @click="openLabel">标签管理</span>
                <span class="el-icon-arrow-right"></span>
              </span>
            </li>
            <li class="clearfix" v-show="!isEdit">
              <span class="fl">具体标签:</span>
              <div class="labels_box">
                <span
                  class="labels_item"
                  v-for="(item, index) in labelsArr"
                  :key="index"
                  :style="{background:item.isChecked? item.color : '#eee', color:item.isChecked? '#fff':'#4a4a4a' }"
                >{{item.abbreviate}}</span>
              </div>
            </li>
          </ul>
        </el-collapse-item>
        <el-collapse-item title="所属门店" name="7">
          <el-table
            :header-cell-style="{background:'#F7F9FF'}"
            :data="listPatientInstitution"
            style="width: 100%"
            class="tables"
          >
            <el-table-column type="index" width='100' label="序号"  align="center"></el-table-column>
            <el-table-column prop="institution.name" label="所属门店"  align="center"></el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>


    <labelDialog :isShow="show" @sendLabelData="updateDataFn"/>
  </div>
</template>

<script>
import { AREADATA } from "@/assets/js/areadata.js";
import moment from "moment";
import labelDialog from "@/components/workbench/dialogs/DialogLabel";

import {getLabelConfigList,savePatient, getPatientDetial,chainPatientDetail} from "@/api";
export default {
  components: {
    labelDialog,
  },
  props: ["isShow"],
  name: "addPatientDialogs",
  data() {
    return {
      area: AREADATA,
      currentIndex: "",
      pIds: null,
      pId: true,
      jump: false,
      isBespeak: false,
      labelData: [],
      isEdit: true,
      userinfo: {
        patientId: "",
        patientName: "xx",
        clinicNo: "",
        telephone: ""
      },
      rowId: null,
      isAdd: null,
      bespeakDialog: {
        visibility: false,
        isSearch: true
      },
      isShowDialog: {
        patient: false,
        addPatientpage: false,
        register: false,
        addPatientpageId: "",
        add: false,
        registerId: "",
        bespeak: false,
        visibility: false
      },
      isOffClick: false,
      labelArr: [],
      labelsArr: [],
      gender: 1,
      show: {
        register: false,
        label: false
      },
      addressProvince: [],
      addressCity: [],
      addressCountry: [],
      source: [],
      doctorId: [],
      postcounselorId: [],
      clientId: [],
      precounselorId: [],
      listPatientInstitution: [],//所属门店
      tableHeader: [
        { prop: "relation", label: "关系" },
        { prop: "relationPatient", label: "相关人员姓名" },
        { prop: "remark", label: "备注" },
        { prop: "gender", label: "性别" },
        { prop: "card", label: "卡名称" },
        { prop: "balance", label: "余额" },
        { prop: "i", label: "操作", isTemp: true }
      ],
      tableData: [],
      currentNum: 0,
      acceptData: {
        emrNo: "",
        CommConfigSex: [], // 性别集合
        PatientSourceConfig: [], // 患者来源集合
        CommConfigLocation: [], // 省的集合
        Doctor: [], // 医生集合
        Consultant: [], // 咨询师集合
        Client: [], // 专属客服集合
        Adviser: [], // 专属顾问 集合
        PatientRelationship: [] // 患者关系
      },
      form: {
        emrNo: "", // 病历号
        patientName: "", // 患者姓名
        CommConfigSex: "",
        gender: "",
        patientType: "", // 患者类型
        idCard: "", //身份证号码
        age: "", // 年龄
        patientBirth: "", //患者生日
        mobilephone: "", // 手机号
        addressProvince: "", // 省
        addressCity: "", // 市
        addressCountry: "1", // 区
        address:{}, // 详细地址
        wechat: "", // 微信
        telephone: "", // 电话
        qq: "", //qq
        email: "", //邮箱
        source: [], // 患者来源
        patientMark: "", // 患者标签
        remark: "", // 备注
        doctorId: "", // 责任医生
        postcounselorId: "", // 咨询师
        clientId: "", // 专属客服
        precounselorId: "" // 专属顾问
      },
      iDs: "",
      value2: null,
      pickerOptions1: "",
      activeNames: ["1"]
    };
  },
  watch: {
    labelsArr(val) {
      if (!val.length) this.labelArr = [];
    },
    patientId: {
      handler(val) {
        this.iDs = val;
        this.tableData = [];
        this.clear();
        this.isOffClick = false;
        this.queryPatientFn(val);
      },
      deep: true,
      immediate: true
    }
  },
  computed: {

    patientId() {
      return this.$store.state.signal.patientId;
    }
  },
  methods: {
    ChangeRefresh() {
      this.$root.Bus.$emit("ChangeConstRefresh");
    },
    clear() {
      let data = this.form;
      for (const key in data) {
        data[key] = "";
      }
      this.labelsArr = [];
      this.getLabelConfigListFn();
    },
    openLabel() {
      this.show.label = true;
    },

    open(msg, type) {
      this.$message({
        message: msg,
        type: type
      });
    },

    updateDataFn(data) {
      this.getLabelConfigListFn();
    },
    queryPatientFn(id) {

      chainPatientDetail(id).then(res => {
        Object.assign(this.acceptData, res.data.data);
        let _d = res.data.data.Patient || null;
        this.form = _d;
        this.form.emrNo = _d.emrNo;
        this.form.gender = _d.gender;
        this.form.patientBirth = _d.birthDate;
        this.form.patientType = Number(_d.type);
        this.form.age = moment.duration(moment().diff(_d.birthDate)).years();

        this.listPatientInstitution = res.data.data.listPatientInstitution

        //hzj,2019-6-19,修改
        let patientProfile = res.data.data.patientInfo;
        this.form.wechat = patientProfile.patientProfile.wechat;
        this.form.qq = patientProfile.patientProfile.qq
        this.form.email = patientProfile.patientProfile.email
        this.form.sourceName = patientProfile.sourceName

        this.form.doctorName = patientProfile.doctorName
        this.form.postcounselorName = patientProfile.postcounselorName
        this.form.precounselorName = patientProfile.precounselorName

        this.form.address = patientProfile.addressProvinceName+patientProfile.addressCityName+patientProfile.addressCountyName+patientProfile.patientProfile.address

        this.tableData = res.data.data.patientInfo.listPatientRelationship;
        this.labelArr = res.data.data.patientInfo.listLabel;
        this.getLabelConfigListFn();
      });


    },
    getLabelConfigListFn() {
      getLabelConfigList().then(res => {
        let _D = res.data.data;
        if (!_D.length) return;
        this.labelsArr = _D.map(val => {
          val.isChecked = false;
          return val;
        });
      });
    },
  },
  mixins: [],
  created() {
    this.getLabelConfigListFn();
  }
};

</script>
<style lang="less" scoped>
.dialog-footer {
  padding: 20px 0;
}
.wrapper_patient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: scroll;
}
.wrapper_patient::-webkit-scrollbar {
  display: none;
}
.clearfix:after {
  content: ".";
  display: block;
  height: 0;
  visibility: hidden;
  clear: both;
}
.btns_wraps {
  padding: 20px 0;
}
.usernames {
  display: flex;
  align-items: center;
}
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
  .label {
    li {
      height: 50px;
      // line-height: 50px;
      font-size: 13px;
      .fr {
        margin-right: 7px;
        margin-top: 15px;
      }
      .fl {
        margin-top: 15px;
      }
      .label_box {
        float: left;
        width: 300px;
        // background: red;
        padding-left: 10px;
        width: 84%;
        .label_item {
          width: 30px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          font-size: 12px;
          border-radius: 15px;
          // background: red;
          display: inline-block;
          margin: 10px 8px;
          color: #fff;
          cursor: pointer;
        }
      }
      .labels_box {
        width: 86%;
        height: 50px;
        float: left;
        padding-left: 10px;
        .labels_item {
          float: left;
          width: 80px;
          height: 30px;
          border-radius: 15px;
          color: #fff;
          line-height: 30px;
          text-align: center;
          margin: 10px 8px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
<style lang="less">
.chain_patient_detail .isEdit{
  .el-form-item__label{
    color: #737B8D !important;
  }
  .el-form-item__content{
    width: 300px;
  }
}

.isEdit .el-input__inner:hover {
  cursor: no-drop;
}
.isEdit .el-radio__input.is-disabled + span.el-radio__label {
  /* color:#606266; */
}
.isEdit .is-checked .el-radio__input.is-disabled .el-radio__inner,
.el-radio__input.is-disabled.is-checked .el-radio__inner {
  background: #409eff;
}
.isEdit .is-checked .el-radio__input.is-disabled + span.el-radio__label {
  color: #409eff !important;
}


.isEdit .el-input.is-disabled .el-input__inner {
  background: #fff;
}

</style>
