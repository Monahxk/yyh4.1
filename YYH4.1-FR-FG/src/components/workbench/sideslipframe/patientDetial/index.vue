<!--
<<<<<<< HEAD
@Author: ZJZ
@Date:   2019-08-01
@Filename: index.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-11
-->

<template>
  <div class="wrapper_patient">
    <div >
      <el-form ref="formRules" :rules="rules" :disabled="isEdit" :model="form" label-width="80px">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="个人信息" name="1">
            <el-row>
              <el-col :span="11">
                <el-form-item label="患者姓名"  prop="patientName">
                  <el-input v-model="form.patientName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="病历号"  prop="ordern">
                  <el-input v-model="form.ordern" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="11">
                <el-form-item label="患者来源" prop="patientSourceId">
                  <el-select v-model="form.patientSourceId" placeholder="请选择">
                    <el-option
                      :label="item.sourceName"
                      :value="item.id"
                      v-for="(item, index) in acceptData.PatientSourceConfig"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>

              </el-col>
              <el-col :span="11">
                <el-form-item label="性别"  prop="gender">
                  <el-radio-group v-model="form.gender">
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="2">女</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="手机号"  prop="mobilephone">
                  <el-input v-model="form.mobilephone" maxlength="13" @keyup.native="phoneKeyup" @change='phoneChange'></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="电话" prop="telephone">
                  <el-input v-model="form.telephone"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="患者生日"  prop="birthDate">
                  <el-date-picker
                    @change="patientBirthFn"
                    v-model="form.birthDate"
                    align="right"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    :picker-options="pickerOptions1"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="年龄"  prop="age">
                  <el-input v-model="form.age" @input="ageFn"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="身份证号" prop="idCard">
                  <el-input v-model="form.idCard" maxlength="18" @blur="idCardFn"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="患者备注" prop="remark">
                  <el-input v-model="form.remark"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
        </el-collapse-item>
        <el-collapse-item title="患者标签" name="2">
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
            <li class="clearfix" v-if="!isEdit">
              <span class="fl">具体标签:</span>
              <div class="labels_box">
                <span
                  class="labels_item"
                  @click="addlabel(item)"
                  v-for="(item, index) in labelsArr"
                  :key="index"
                  :style="{background:item.isChecked? item.color : '#eee', color:item.isChecked? '#fff':'#4a4a4a' }"
                >{{item.abbreviate}}</span>
              </div>
            </li>
          </ul>
        </el-collapse-item>
        <el-collapse-item title="联系方式" name="3">

            <el-row>
              <el-col :span="10">
                <el-form-item label="微信">
                  <el-input v-model="form.wechat"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10" :push="2">
                <el-form-item label="QQ">
                  <el-input v-model="form.qq"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="邮箱">
                  <el-input v-model="form.email"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="家庭地址" class="inline-select">
              <el-row>
                <el-col :span="14">
                  <el-select v-model="form.addressProvince" placeholder="请选择省" class="address_chunk">
                    <el-option
                      :label="item.name"
                      :value="item.code"
                      v-for="(item, index) in area"
                      :key="index"
                    ></el-option>
                  </el-select>
                  <el-select
                    v-model="form.addressCity"
                    placeholder="请选择市"
                    :disabled="isCity"
                   class="address_chunk">
                    <el-option
                      :label="item.name"
                      :value="item.code"
                      v-for="(item, index) in addressCity"
                      :key="index"
                    ></el-option>
                  </el-select>
                  <el-select
                    v-model="form.addressCounty"
                    placeholder="请选择区"
                    :disabled="isCount"
                   class="address_chunk">
                    <el-option
                      :label="item.name"
                      :value="item.code"
                      v-for="(item, index) in addressCountry"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="" prop="address">
                    <el-input v-model="form.address" placeholder='请输入详细地址'></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
        </el-collapse-item>
        <el-collapse-item title="首诊信息" name="4">
            <el-row>
              <el-col :span="10">
                <el-form-item label="责任医生">
                  <el-select v-model="form.doctorId" placeholder="请选责任医生">
                    <el-option
                      :label="item.name"
                      :value="item.id"
                      v-for="(item, index) in acceptData.Doctor"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10" :push="2">
                <el-form-item label="咨询师">
                  <el-select v-model="form.postcounselorId" placeholder="请选咨询师">
                    <el-option
                      :label="item.name"
                      :value="item.id"
                      v-for="(item, index) in acceptData.Consultant"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="专属顾问">
                  <el-select v-model="form.precounselorId" placeholder="请选专属顾问">
                    <el-option
                      :label="item.name"
                      :value="item.id"
                      v-for="(item, index) in acceptData.Adviser"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
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
                    @click.native.prevent="cellCliclFn(scope.row)"
                    readonly
                    v-model="scope.row.relationPatientName"
                    v-if="item.prop == 'relationPatient'"
                    suffix-icon="el-icon-search"
                  ></el-input>

                  <!-- 备注 -->
                  <el-input
                    v-model="scope.row.remark"
                    v-if="item.prop == 'remark' "
                  ></el-input>

                  <!-- 性别 -->
                  <span v-if="item.prop == 'gender' ">{{scope.row[item.prop]}}</span>

                  <!-- 卡名称 -->
                  <span v-if="item.prop == 'card' ">{{scope.row[item.prop]}}</span>

                  <!-- 余额 -->
                  <span v-if="item.prop == 'balance' ">{{scope.row[item.prop]}}</span>

                  <div v-if="item.isTemp">
                    <el-button
                      type="text"
                      @click="deleteRow(scope.$index,tableData )"
                      v-show="!isEdit"
                    >删除</el-button>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="btns_wraps" v-show="!isEdit">
            <el-button @click="addFrom">添加新关系</el-button>
          </div>
        </el-collapse-item>


      </el-collapse>
      </el-form>
    </div>
    <div class="dialog-footer">
      <ul class="btns_wrap">
        <li class="actives" @click="fromData">
          <span>{{isEdit? '修改' : '保存'}}</span>
        </li>

        <li class="actives" v-show="!isEdit" @click="cancelEdit">
          <span>取消</span>
        </li>
      </ul>
    </div>

    <selectPatients :isShow="show" @sendData="handelChild"/>
    <labelDialog :isShow="show" @sendLabelData="updateDataFn"/>
  </div>
</template>

<script>
import selectPatients from "@/components/workbench/selectPatients";
import { AREADATA } from "@/assets/js/areadata.js";
import moment from "moment";
import labelDialog from "@/components/workbench/dialogs/DialogLabel";

import {
  // getPatientRelevant,
  // getPatientCicy,
  getLabelConfigList,
  savePatient,
  getPatientDetial
} from "@/api";
export default {
  components: {
    labelDialog,
    selectPatients
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
      listLabel: [],//缓存便签
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
        birthDate: "", //患者生日
        mobilephone: "", // 手机号
        addressProvince: "", // 省
        addressCity: "", // 市
        addressCounty: "1", // 区
        address: "", // 详细地址
        wechat: "", // 微信
        telephone: "", // 电话
        qq: "", //qq
        email: "", //邮箱
        patientSourceId: [], // 患者来源
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
      activeNames: ["1"],
      rules: {
        ordern: [
          { required: true, message: '请输入病历号', trigger: 'blur' }
        ],
        patientName: [
          { required: true, message: '请输入患者名称', trigger: 'blur' }
        ],
         gender: [
           { required: true, message: '请选择性别', trigger: 'change' }
         ],
         age: [
           { required: true, message: '请输入年龄', trigger: 'change' }
         ],
         birthDate: [
           { required: true, message: '请选择患者生日', trigger: 'change' }
         ],
         mobilephone: [
           { required: true, message: '请输入手机号', trigger: 'blur' },
           {
             pattern: /1\d{2}-[0-9]{4}-[0-9]{4}$/,
             message: "请输入正确的手机号",
             trigger: "blur"
           }
         ],
         patientSourceId: [
           { required: true, message: '请选择患者来源', trigger: 'blur' }
         ],
       },
    };
  },
  watch: {
    labelsArr(val) {
      if (!val.length) this.labelArr = [];
    },
    "form.birthDate": {
      handler(time) {
        // let duration  = moment.duration(moment().diff(time));
        // this.form.age = duration.years()
      },
      deep: true
    },
    "form.addressProvince": {
      handler(parentId) {
        // if (this.isEdit) return;
        // if (!parentId) return;
        this.area.map(item => {
          if (this.form.addressProvince == item.code) {
            this.addressCity = item.cityList;
            if (!this.isEdit){
              this.form.addressCity=this.addressCity[0].code
            }
            // this.form.addressCity=''
            // this.form.addressCounty=''
          }
        });

      },
      deep: true
    },
    "form.addressCity": {
      handler(parentId) {
        // if (this.isEdit) return;
        // if (!parentId) return;
        this.addressCity.map(item => {
          if (this.form.addressCity == item.code) {
            this.addressCountry = item.areaList;
            if (!this.isEdit){
              this.form.addressCounty=this.addressCountry[0].code
            }
          }
        });
      },
      deep: true
    },
    patientId: {
      handler(val) {
        this.iDs = val;
        this.tableData = [];
        // this.clear();
        this.isOffClick = false;
        this.queryPatientFn(val);
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    isCity() {
      return this.addressCity.length ? false : true;
    },
    isCount() {
      return this.addressCountry.length ? false : true;
    },
    patientId() {
      return this.$store.state.signal.patientId;
    }
  },
  methods: {
    phoneKeyup(e){
      var phoneNum = this.form.mobilephone.trim();
      if (e.keyCode === 8) {
          this.form.mobilephone = phoneNum;
          return;
      }
      var len = phoneNum.length;
      if (len === 3 || len === 8) {
          phoneNum += '-';
          this.form.mobilephone = phoneNum;
      }
    },
    phoneChange(){
      var phoneNum = this.form.mobilephone.trim();
      phoneNum=phoneNum.replace(/-/g,"");
      this.form.mobilephone=phoneNum.replace(/(\d{3})(\d{4})/,"$1-$2-");
      if(this.form.mobilephone.length>13){
        this.form.mobilephone=this.form.mobilephone.substring(0,13)
      }
    },
    ChangeRefresh() {
      this.$root.Bus.$emit("ChangeConstRefresh");
    },
    ageFn() {
      if (this.form.age) {
        let year = moment()
          .subtract(this.form.age, "years")
          .format("YYYY");
        this.form.birthDate = `${year}-01-01`;
      }
    },
    patientBirthFn(val) {
      let duration = moment.duration(moment().diff(val));
      this.form.age = duration.years();
    },
    idCardFn(val) {
      let duration
      if(this.form.idCard.length==18){
        duration=this.form.idCard.substring(6,14)
      }
      duration = moment.duration(moment().diff(duration));
      this.form.age = duration.years();
      let year = moment()
        .subtract(this.form.age, "years")
        .format("YYYY");
      this.form.birthDate = `${year}-`+this.form.idCard.substring(10,12)+`-`+this.form.idCard.substring(12,14);
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
    addlabel(item) {
      let _is = true;
      if (!item.isChecked) {
        if (this.labelArr.length < 9) {
          this.labelArr.map((val, index) => {
            if (item.id == val.labelConfig.id) {
              this.$message.error("已经添加过了");
              _is = false;
            }
          });
          if (_is) {
            item.isChecked = true;
            this.labelArr.push({
              id: "",
              institutionId: item.institutionId,
              labelConfig: item
            });
          }
        } else {
          this.$message.error("患者标签最多标记9个");
          return;
        }
      } else {
        this.labelArr = this.labelArr.filter(
          val => item.id != val.labelConfig.id
        );
        item.isChecked = false;
      }
    },
    addFrom() {
      let _is = true;
      if (this.tableData.length) {
        this.tableData.map(item => {
          if (!item.relationId) {
            this.$message.error("【错误】：请选择添加关系后 在进行新增");
            _is = false;
            return;
          }
          if (!item.relationPatientId) {
            this.$message.error("【错误】：请选择相关人员后 在进行新增");
            _is = false;
            return;
          }
        });
      }
      if (_is) {
        this.tableData.push({
          relationId: "",
          relationPatientId: "",
          remark: "",
          gender: "",
          card: "",
          balance: ""
        });
      }
    },
    cellCliclFn(row) {
      if (this.isEdit) return;
      this.tableData.map((val, i) => {
        if (val == row) {
          this.currentIndex = i;
        }
      });
      this.currentNum = this.tableData.indexOf(row);
      this.show.register = true;
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    handelChild(val) {
      let len = this.tableData.length - 1;
      this.tableData[this.currentIndex].relationPatientName = val.patientName;
      this.tableData[this.currentIndex].gender = val.gender;
      this.tableData[this.currentIndex].relationPatientId = val.patient.id;
    },
    updateDataFn(data) {
      this.getLabelConfigListFn();
    },
    // 取消编辑
    cancelEdit() {
      this.isEdit = true;
      this.$refs['formRules'].clearValidate();
      this.queryPatientFn(this.iDs);
    },
    // 提交保存数据
    fromData(callback) {
      if (this.isEdit) {
        this.isEdit = false;
        // this.$set(this,'isEdit',false)
        return;
      }
      this.$refs['formRules'].validate((valid) => {
        if(valid){
          if (this.isOffClick) return;
          this.isOffClick = true;
          let datas = {
            id: this.iDs,
            patientProfile: {
              address: "",
              addressCity: "",
              addressCounty: "",
              addressProvince: "",
              email: "",
              qq: "",
              wechat: ""
            },
            pVList: [],
            lList: []
          };
          this.form.mobilephone=this.form.mobilephone.replace(/-/g,"");
          Object.assign(datas, this.form);
          Object.assign(datas.patientProfile, this.form);
          if (this.tableData.length) {
            this.tableData.map(val => {
              datas.pVList.push({
                id: val.id,
                patientId: this.iDs,
                relationId: val.relationId,
                relationPatientId: val.relationPatientId,
                remark: val.remark
              });
            });
          }

          if (this.labelArr.length) {
            this.labelArr.map(res => {
              delete res.id;
              datas.lList.push(res);
            });
          }
          savePatient(datas).then(res => {
            if (res.data.code == 200) {
              this.isEdit = true;
              this.queryPatientFn(this.iDs);
            }
            this.isOffClick = false;
          });
        }else{
          return false
        }

      })
    },
    queryPatientFn(id) {
      getPatientDetial(id).then(res => {
        Object.assign(this.acceptData, res.data.data);
        let _d = res.data.data.Patient || null;
        this.form = _d;
        this.form.emrNo = _d.emrNo;
        this.form.gender = _d.gender;
        this.form.ordern = res.data.data.ordern
        // this.form.patientType = Number(_d.type);
        this.form.doctorId = Number(_d.doctorId);
        this.form.postcounselorId = _d.postcounselorId;
        this.form.precounselorId = _d.precounselorId;
        this.form.clinicId = _d.clinicId;
        // this.form.source = _d.patientSourceId;
        this.$set(this.form,'patientSourceId',_d.patientSourceId)
        this.$set(this.form,'patientType',Number(_d.type))
        this.$set(this.form,'age',moment.duration(moment().diff(_d.birthDate)).years() || 0)
        this.$set(this.form,'birthDate',_d.birthDate || 0)

        this.form.remark = _d.remark;
        this.phoneChange()
        //hzj,2019-6-19,修改
        let patientProfile = res.data.data.patientInfo.patientProfile;

        this.$set(this.form,'address',patientProfile ? patientProfile.address : '')
        this.$set(this.form,'addressProvince',patientProfile ? patientProfile.addressProvince : '')
        this.$set(this.form,'addressCity',patientProfile ? patientProfile.addressCity : '')
        this.$set(this.form,'addressCounty',patientProfile ? patientProfile.addressCounty : '')
        this.$set(this.form,'wechat',patientProfile ? patientProfile.wechat : '')
        this.$set(this.form,'qq',patientProfile ? patientProfile.qq : '')
        this.$set(this.form,'email',patientProfile ? patientProfile.email : '')

        this.listLabel=res.data.data.patientInfo.listLabel
        for (var i=0; i<this.labelsArr.length; i++) {
          for (var j=0; j<this.listLabel.length; j++) {
            if (this.labelsArr[i].id == this.listLabel[j].labelConfig.id) {
              this.$set(this.labelsArr[i],'isChecked',true)
            }
          }
        }
        this.tableData = res.data.data.patientInfo.listPatientRelationship;
        this.labelArr = res.data.data.patientInfo.listLabel;
        // this.getLabelConfigListFn();
      });
    },
    getLabelConfigListFn() {
      getLabelConfigList().then(res => {
        let _D = res.data.data;
        if (!_D.length) return;
        this.labelsArr = _D
        if(this.listLabel.length){
          for (var i=0; i<this.labelsArr.length; i++) {
            for (var j=0; j<this.listLabel.length; j++) {
              if (this.labelsArr[i].id == this.listLabel[j].labelConfig.id) {
                this.$set(this.labelsArr[i],'isChecked',true)
              }
            }
          }
        }
        // this.labelsArr = _D.map(val => {
        //   val.isChecked = false;
        //   return val;
        // });
      });
    },
    idcardBlur() {
      if(this.form.idCard && this.form.idCard.length == 18) {
        this.form.birthDate = util.getIdCardInfo(this.form.idCard,1);
        this.form.age = util.getIdCardInfo(this.form.idCard,3);
      }
    }

  },
  mixins: [],
  created() {
    this.getLabelConfigListFn();
  }
};

</script>
<style lang="less" scoped>
@input-width: 280px;
@select-width: 245px;
@long-width: 770px;
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

  .address_chunk{
    width: 150px;
    margin-right: 10px;
    .el-input__inner{
      width: 100%;
    }
  }
  /deep/.el-date-editor .el-input__inner,.el-input,.el-select {
    width: @input-width;
  }
  .inline-select .el-select {
    width: @select-width;
  }
  /deep/.el-collapse-item__header {
    font-size: 18px;
    &.is-active {
      color: #493bfd;
    }
  }
  .long-width {
    width: @long-width;
  }
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
.isEdit{
  .el-input.is-disabled .el-input__inner{
    color: #172440;
    border:0;
    background: white;
  }
  .el-input.is-disabled .el-input__icon{
    display: none;
  }
}
/* .isEdit .el-input__inner:hover {
  cursor: no-drop;
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
} */
.wrapper_patient {

  .inline-select{
    .el-select.address_chunk{
      width: 150px;
      margin-right: 10px;
      .el-input__inner{
        width: 100%;
      }
    }
  }

}
</style>
