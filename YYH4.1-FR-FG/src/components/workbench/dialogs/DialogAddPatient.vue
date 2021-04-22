<!--
<<<<<<< HEAD
@Author: ZJZ
@Date:   2019-08-01
@Filename: DialogAddPatient.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-11
-->

<template>
  <div class="wrapper dialog_add_patient">
    <el-dialog title="新增患者" :visible.sync="isShow.patient" @open="openDialog" width="960px">
      <div class="patient_chunk">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-collapse v-model="activeNames" @change="handleChange">
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
                      :picker-options="pickerOptions"
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
                    :style="{background:item.color}"
                  >{{item.abbreviate}}</span>
                </div>
                <span class="fr">
                  <span style="cursor: pointer;" @click="openLabel">标签管理</span>
                  <span class="el-icon-arrow-right"></span>
                </span>
              </li>
              <li class="clearfix">
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
                <el-col :span="11">
                  <el-form-item label="微信" prop="wechat">
                    <el-input v-model="form.wechat"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="QQ" prop="qq">
                    <el-input v-model="form.qq"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="家庭地址" prop="addressProvince">
                <el-row>
                  <el-col :span="24">
                    <el-select v-model="form.addressProvince" placeholder="请选择省" class="address_chunk">
                      <el-option
                        :label="item.name"
                        :value="item.code"
                        v-for="(item, index) in area"
                        :key="index"
                      ></el-option>
                    </el-select>
                    <el-select v-model="form.addressCity" placeholder="请选择市" :disabled="isCity" class="address_chunk">
                      <el-option
                        :label="item.name"
                        :value="item.code"
                        v-for="(item, index) in addressCity"
                        :key="index"
                      ></el-option>
                    </el-select>
                    <el-select v-model="form.addressCounty" placeholder="请选择区" :disabled="isCount" class="address_chunk">
                      <el-option
                        :label="item.name"
                        :value="item.code"
                        v-for="(item, index) in addressCounty"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-row>
                <el-col :span="20">
                  <el-form-item label="详细地址" prop="address" class="address">
                    <el-input v-model="form.address" placeholder='请输入详细地址'></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
          </el-collapse-item>
          <el-collapse-item title="首诊信息" name="4">
              <el-row>
                <el-col :span="11">
                  <el-form-item label="责任医生" prop="doctorId">
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
                <el-col :span="11">
                  <el-form-item label="咨询师" prop="postcounselorId">
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
                <!-- <el-col :span="11">
                  <el-form-item label="专属客服">
                    <el-select v-model="form.clientId" placeholder="请选专属客服">
                      <el-option
                        :label="item.name"
                        :value="item.id"
                        v-for="(item, index) in acceptData.Client"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col> -->
                <el-col :span="11">
                  <el-form-item label="专属顾问" prop="precounselorId">
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
                      v-model="scope.row.relation"
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
                      v-model="scope.row.relationPatient"
                      v-if="item.prop == 'relationPatient'"
                      suffix-icon="el-icon-search"
                    ></el-input>

                    <!-- 说明 -->
                    <el-input v-model="scope.row.explain" v-if="item.prop == 'explain' "></el-input>

                    <!-- 性别 -->
                    <span v-if="item.prop == 'gender' ">{{scope.row[item.prop]}}</span>

                    <!-- 卡名称 -->
                    <span v-if="item.prop == 'card' ">{{scope.row[item.prop]}}</span>

                    <!-- 余额 -->
                    <span v-if="item.prop == 'balance' ">{{scope.row[item.prop]}}</span>

                    <div v-if="item.isTemp">
                      <el-button type="text" @click="deleteRow(scope.$index,tableData )">删除</el-button>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div class="btns_wraps">
              <el-button @click="addFrom">添加新关系</el-button>
            </div>
          </el-collapse-item>


        </el-collapse>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <ul class="btns_wrap">
          <li class="actives" @click="sendData">
            <span>保存</span>
          </li>
          <li>
            <span @click="savebespeak">保存并预约</span>
          </li>
          <li>
            <span @click="saveRegister">保存并挂号</span>
          </li>
          <li @click="isShow.patient = !isShow.patient">
            <span>取消</span>
          </li>
        </ul>
      </div>
    </el-dialog>
    <labelDialog :isShow="show" @sendLabelData="updateDataFn"/>
    <selectPatients :isShow="show" @sendData="handelChild"/>
    <registerDialogs :isShow="isShowDialog" :userinfo="userinfo" v-bind="$attrs"/>

    <!-- 预约 -->
    <addBespeakDialog
      :isShow="bespeakDialog"
      :info="userinfo"
      :rowId="rowId"
      :isAdd="isAdd"
      :isEdit="true"
      v-bind="$attrs"
    ></addBespeakDialog>
  </div>
</template>

<script>
import selectPatients from "@/components/workbench/selectPatients";
import moment from "moment";
import { AREADATA } from "@/assets/js/areadata.js";
import labelDialog from "./DialogLabel";
import registerDialogs from "./DialogsAddRegister";
import addBespeakDialog from "./DialogAddBespeak";
import { getPatientRelevant, getLabelConfigList, savePatient } from "@/api";
import { SYSTEM_HTTP_SUCCESS } from "@/constant";
export default {
  components: {
    registerDialogs,
    selectPatients,
    labelDialog,
    addBespeakDialog
  },
  props: ["isShow"],
  name: "addPatientDialogs",
  data() {
    return {
      area: AREADATA,
      jump: false,
      isBespeak: false,
      labelData: [],
      isEdit: false,
      userinfo: {
        patientId: '',
        id: "",
        patientName: "xx",
        emrNo: "",
        telephone: "",
        add: false
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
      labelArr: [],
      labelsArr: [],
      gender: 1,
      show: {
        register: false,
        label: false
      },
      addressCity: [],
      addressCounty: [],
      patientSourceId: [],
      doctorId: [],
      precounselorId: [],
      clientId: [],
      postcounselorId: [],
      tableHeader: [
        { prop: "relation", label: "关系" },
        { prop: "relationPatient", label: "相关人员姓名" },
        { prop: "explain", label: "备注" },
        { prop: "gender", label: "性别" },
        { prop: "card", label: "卡名称" },
        { prop: "balance", label: "余额" },
        { prop: "i", label: "操作", isTemp: true }
      ],
      tableData: [],
      currentNum: 0,
      acceptData: {
        ordern: "",
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
        ordern: "", // 病历号
        patientName: "", // 患者姓名
        CommConfigSex: "",
        gender: 1,
        type: 0, // 患者类型
        idCard: "", //身份证号码
        age: "", // 年龄
        birthDate: "", //患者生日
        mobilephone: "", // 手机号
        telephone: "",
        addressProvince: "", // 省
        addressCity: "", // 市
        addressCounty: "", // 区
        address: "", // 详细地址
        wechat: "", // 微信
        telephone: "", // 电话
        qq: "", //qq
        email: "", //邮箱
        patientSourceId: [], // 患者来源
        patientMark: "", // 患者标签
        remark: "", // 备注
        doctorId: "", // 责任医生
        precounselorId: "", // 专属顾问
        // clientId: "", // 专属客服
        postcounselorId: "" // 咨询师
      },
      pickerOptions: "",
      activeNames: ["1", "2", "3", "4", "5"],
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
           { required: true, message: '请选择患者来源', trigger: 'change' }
         ],
       },
    };
  },
  watch: {
    "form.age": {
      handler(val) {
        if (val) {
        }
      },
      deep: true
    },
    labelsArr(val) {
      if (!val.length) this.labelArr = [];
    },
    "isShow.patient"() {
      // this.initDataFn();
    },
    "form.birthDate": {
      handler(time) {},
      deep: true
    },
    "form.addressProvince": {
      handler(parentId) {
        this.area.map(item => {
          if (this.form.addressProvince == item.code) {
            this.addressCity = item.cityList;
          }
        });
        this.form.addressCity = "";
        this.form.addressCounty = "";
      },
      deep: true
    },
    "form.addressCity": {
      handler(parentId) {
        this.addressCity.map(item => {
          if (this.form.addressCity == item.code) {
            this.addressCounty = item.areaList;
          }
        });
        this.form.addressCounty = "";
      },
      deep: true
    }
  },
  computed: {
    isCity() {
      return this.addressCity.length ? false : true;
    },
    isCount() {
      return this.addressCounty.length ? false : true;
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
    openDialog() {
      this.labelArr=[]
      this.labelsArr=[]
      this.getLabelConfigListFn();
      let _this=this
      setTimeout(function(){
        _this.$refs['form'].resetFields();
        _this.initDataFn();
        _this.tableData=[];
      },100)
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
      // this.initDataFn();
    },
    savebespeak() {
      this.jump = true;
      this.sendData(() => {
        this.bespeakDialog.visibility = true;
      });
    },
    openLabel() {
      this.show.label = true;
    },
    saveRegister() {
      this.jump = true;
      this.sendData(() => {
        this.isShowDialog.register = true;
      });
    },
    addlabel(item) {
      let _is = true;
      if (!item.isChecked) {
        if (this.labelArr.length < 9) {
          this.labelArr.map((val, index) => {
            if (item == val) {
              this.open("已经添加过了");
              _is = false;
            }
          });
          if (_is) {
            this.labelArr.push(item);
          }
        } else {
          this.open("患者标签最多标记9个");
          return;
        }
      } else {
        this.labelArr = this.labelArr.filter(val => item != val);
      }
      item.isChecked = !item.isChecked;
    },
    open(msg, type) {
      this.$message({
        message: msg,
        type: type
      });
    },
    addFrom() {
      let _is = true;
      if (this.tableData.length) {
        this.tableData.map(item => {
          if (!item.relation) {
            this.$message.error("【错误】：请选择添加关系后 在进行新增");
            _is = false;
            return;
          }
          if (!item.relationPatient) {
            this.$message.error("【错误】：请选择相关人员后 在进行新增");
            _is = false;
            return;
          }
        });
      }
      if (_is) {
        this.tableData.push({
          relation: "",
          relationPatient: "",
          explain: "",
          gender: "",
          card: "",
          balance: ""
        });
      }
    },
    cellCliclFn(row) {
      this.currentNum = this.tableData.indexOf(row);
      this.show.register = true;
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    handelChild(val) {
      let len = this.tableData.length - 1;
      this.tableData[len].relationPatient = val.patientName;
      this.tableData[len].id = val.patient.id;
      this.tableData[len].gender = val.gender;
    },
    handleDetailsFn() {},
    handleChange() {},
    updateDataFn(val) {
      // this.labelArr = [];
      this.getLabelConfigListFn();
    },
    // 提交保存数据
    sendData(callback) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let datas = {
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
                id: "",
                patientId: "",
                relationId: val.relation,
                relationPatientId: val.id,
                remark: val.explain
              });
            });
          }
          if (this.labelArr.length) {
            this.labelArr.map(res => {
              res["labelConfig"] = { id: res.id };
              delete res.id;
              datas.lList.push(res);
            });
          }
          datas.emrNo = this.form.ordern;
          savePatient(datas).then(res => {
            if (res.data.code == SYSTEM_HTTP_SUCCESS) {
              this.ChangeRefresh();
              this.isShow.patient = false;
              if (this.jump) {
                // this.userinfo.id = res.data.data.id;
                this.userinfo.patientId = res.data.data.id;
                this.userinfo.patientName = res.data.data.patientName;
                this.userinfo.emrNo = res.data.data.emrNo;
                this.userinfo.mobilephone = res.data.data.mobilephone;
                this.userinfo.add = true;
                this.isShow.patient = false;
                this.isAdd = true;
                if (callback) callback();
              }
            }
          });

        } else {
          return false;
        }
      });

    },
    // 初始化 数据
    initDataFn() {
      getPatientRelevant(0).then(res => {
        this.acceptData = res.data.data;
        this.form.ordern = res.data.data.ordern;
      });
    },
    // 获取label 数据
    getLabelConfigListFn() {
      getLabelConfigList().then(res => {
        let _D = res.data.data;
        if (!_D.length) return;
        // this.labelsArr = _D.map(val => {
        //   val.hide = "";
        //   val.btnTxt = "编辑";
        //   val.bottomTxt = "删除";
        //   val.isSave = 0;
        //   val.isChecked = false;
        //   val.isClinic = true; // 后端数据
        //   return val;
        // });
        this.labelsArr=getArrEqual(this.labelsArr,_D)

        let labelsArr = this.labelsArr.concat(_D);
        let newJson = [];
        labelsArr.map(item1=>{
          	let flag = true;
            newJson.map(item2=>{
              if(item1.name==item2.name){
          			flag = false;
          		}
            })
            if(flag){
          		newJson.push(item1);
          	}
        })
        this.labelsArr=newJson

      });
    }
  },
  mixins: [],
  created() {
    this.getLabelConfigListFn();

  }
};
function getArrEqual(arr1, arr2) {
        let newArr = [];
        for (let i = 0; i < arr2.length; i++) {
            for (let j = 0; j < arr1.length; j++) {
                if(arr1[j].name === arr2[i].name){
                    newArr.push(arr1[j]);
                }
        }
     }
     return newArr;
}
</script>
<style lang="less" scoped>
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

  .patient_chunk{
    height: 500px;
    overflow-y: auto;
    padding: 0 30px;
    /deep/.el-icon-arrow-right {
      color: #909399;
    }
  }
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
        // height: 50px;
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
  .dialog_add_patient{
    .el-collapse-item__header{
      font-size: 20px;
      color: #493BFD;
    }
    .el-dialog__body{
      padding:2px 0;
    }
    .address_chunk{
      width: 150px;
      margin-right: 10px;
      .el-input__inner{
        width: 100%;
      }
    }
    .el-input__inner{
      width: 216px;
    }
  }
  .address {
    .el-input__inner {
      width: 100%;
    }
  }
</style>
