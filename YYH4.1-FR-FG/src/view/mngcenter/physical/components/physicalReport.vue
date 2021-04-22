<!--
@Author: ZJZ
@Date:   2019-08-01
@Filename: physicalReport.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-07
-->

<template>
  <div class="wrapper" id="physicalReport">
    <div>
      <el-dialog
        :visible.sync="isShow.physicalReport"
        width="900px"
        :close-on-click-modal="false"
        @open="getData"
      >
        <div id="printTest">
          <section class="content">
            <div class="content_page">
              <el-row class="content_page_title" style>
                <el-col :span="24">
                  <img src="../../../../static/cliniclogo.png" class="clinic_logo" alt />
                  <h3 class="clinicName">
                    <img src="../../../../static/clinicTiele.png" alt />
                  </h3>
                  <p class="physical_report">口腔体检报告</p>
                  <p class="date">日期： {{getDate}}</p>
                </el-col>
              </el-row>

              <el-row class="base_info">
                <el-col :span="4">姓名</el-col>
                <el-col :span="8">{{stateDatas.patientName}}</el-col>
                <el-col :span="6">性别</el-col>
                <el-col :span="6">{{sex}}</el-col>
              </el-row>

              <el-row class="base_info">
                <el-col :span="4">联系电话</el-col>
                <el-col :span="8">{{stateDatas.mobilephone}}</el-col>
                <el-col :span="6">年龄</el-col>
                <el-col :span="6">{{stateDatas.patientBirth}}</el-col>
              </el-row>

              <el-row class="base_casehistory_info">
                <el-col :span="4">主述</el-col>
                <el-col :span="20">{{sendData.chiefComplaint}}</el-col>
              </el-row>

              <el-row class="base_casehistory_info">
                <el-col :span="4">既往史</el-col>
                <el-col :span="20">{{sendData.pastHistory}}</el-col>
              </el-row>

              <el-row class="faceexamination">
                <el-col :span="4" class="key">口腔颌面部检查</el-col>
                <el-col :span="20">
                  <el-row>
                    <div class="selt">
                      <p
                        class="checkboxLine"
                        v-for="(item,index) in sendData.dentofacialInspect"
                        :key="index"
                      >{{item}}</p>
                    </div>
                    <div class="diagnosis">
                      <span style>诊断：</span>
                    </div>
                    <div class="result">
                      <span class="underline">{{sendData.dentofacialDiagnosis}}</span>
                    </div>
                  </el-row>
                </el-col>
              </el-row>

              <el-row class="oralexamination">
                <el-col :span="4" class="key">口腔黏膜检查</el-col>
                <el-col :span="20">
                  <el-row>
                    <el-col :span="24">
                      <div class="selt">
                        <p v-for="(item,index) in sendData.oralMucosaInspect" :key="index">{{item}}</p>
                      </div>
                      <div class="diagnosis">
                        <span style>诊断：</span>
                      </div>
                      <div class="result">
                        <span class="underline">{{sendData.oralMucosaDiagnosis}}</span>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
            <div class="content_pagetwo">
              <el-row class="title_box" style>
                <el-col :span="24">
                  <img src="../../../../static/cliniclogo.png" class="clinic_logo" alt />
                  <h3 class="clinicName">
                    <img src="../../../../static/clinicTiele.png" alt />
                  </h3>

                  <p class="physical_report">口腔体检报告</p>
                  <p class="date">日期： {{getDate}}</p>
                </el-col>
              </el-row>

              <el-row class="table_box">
                <el-col :span="4" class="left borerNone" style="border-bottom:none;">
                  <span>牙周及牙体牙髓检查</span>
                </el-col>
                <el-col :span="20" class="right">
                  <el-row>
                    <el-col :span="24">
                      <div class="my_table">
                        <table style>
                          <tr class="table_head" style>
                            <th v-for="(item,index) of tableTitle" :key="index">
                              <span>{{item}}</span>
                            </th>
                          </tr>
                          <tr v-for="(item,index) in newDataList" :key="index">
                            <td class="table_item" style>{{item.title}}</td>
                            <td class="tds" v-for="(val,num) in item.data" :key="num">{{val.text}}</td>
                          </tr>
                        </table>
                      </div>
                    </el-col>
                    <p class="adjusting_position">
                      <span class>其他：</span>
                      <span class="underline">{{sendData.maxRemark}}</span>
                    </p>
                    <p class="adjusting_position">
                      <span class>阳性体征现病史：</span>
                      <span class="underline">{{sendData.maxPositiveSignHistory}}</span>
                    </p>
                    <p class="adjusting_position">{{maxProbingDepthArr[sendData.maxProbingDepth]}}</p>
                  </el-row>
                </el-col>
              </el-row>
            </div>

            <div class="content_pagethree" style>
              <el-row class="title_box" style>
                <el-col :span="24">
                  <img src="../../../../static/cliniclogo.png" class="clinic_logo" alt />
                  <h3 class="clinicName">
                    <img src="../../../../static/clinicTiele.png" alt />
                  </h3>

                  <p class="physical_report">口腔体检报告</p>
                  <p class="date">日期： {{getDate}}</p>
                </el-col>
              </el-row>

              <el-row class="table_box">
                <el-col :span="4" class="left">牙周及牙体牙髓检查</el-col>
                <el-col :span="20" class="right">
                  <el-row>
                    <el-col :span="24">
                      <div class="my_table">
                        <table style>
                          <tr class="table_head">
                            <th v-for="(item,index) of tableTitle1" :key="index">
                              <span>{{item}}</span>
                            </th>
                          </tr>
                          <tr v-for="(item,index) in copyDataList" :key="index">
                            <td class="table_item">{{item.title}}</td>
                            <td class="tds" v-for="(val,num) in item.data" :key="num">{{val.text}}</td>
                          </tr>
                        </table>
                      </div>
                    </el-col>
                    <p class="adjusting_position">
                      <span class>其他：</span>
                      <span class="underline">{{sendData.subRemark}}</span>
                    </p>
                    <p class="adjusting_position">
                      <span class>阳性体征现病史：</span>
                      <span class="underline">{{sendData.subPositiveSigHistory}}</span>
                    </p>
                    <p class="adjusting_position">{{subProbingDepthArr[sendData.subProbingDepth]}}</p>
                  </el-row>
                </el-col>
              </el-row>
            </div>

            <div class="content_pagefour" style>
              <el-row style="marginTop:40px;">
                <el-col :span="24">
                  <img src="../../../../static/cliniclogo.png" class="clinic_logo" alt />
                  <h3 class="clinicName">
                    <img src="../../../../static/clinicTiele.png" alt />
                  </h3>

                  <p class="physical_report">口腔体检报告</p>
                  <p class="date">日期： {{getDate}}</p>
                </el-col>
              </el-row>
              <el-row class="lasth">
                <el-col :span="4" class="key">其他口腔情况</el-col>
                <el-col :span="20">
                  <el-row>
                    <div class="selt">
                      <p
                        v-for="(item,index) in sendData.otherCavityConditions"
                        :key="index"
                      >{{item}}</p>
                    </div>
                    <div>
                      <div class="diagnosis">
                        <span style>智齿情况：</span>
                      </div>
                      <div class="result">
                        <span class="underline">{{sendData.wisdomToothConditions}}</span>
                      </div>
                    </div>
                    <div>
                      <div class="diagnosis" style="width:80px;">
                        <span style>全景片描述：</span>
                      </div>
                      <div class="result">
                        <span class="underline">{{sendData.panoramicDescription}}</span>
                      </div>
                    </div>
                    <div>
                      <div class="diagnosis" style="width:90px;">
                        <span style>其他补充情况：</span>
                      </div>
                      <div class="result">
                        <span class="underline">{{sendData.supplementarySituation}}</span>
                      </div>
                    </div>
                  </el-row>
                </el-col>
              </el-row>

              <el-row class="proposal">
                <el-col :span="4" class="proposal_left">医生建议</el-col>
                <el-col :span="20" class="proposal_right">{{sendData.doctorAdvice}}</el-col>
              </el-row>

              <el-row>
                <el-col :span="8" :offset="14" style="marginTop:20px;">
                  <span>检查医生签名:</span>
                </el-col>
              </el-row>
            </div>
          </section>
        </div>

        <div slot="footer" class="dialog-footer">
          <ul class="btns_wrap">
            <li v-print="'#printTest'">
              <span>打印</span>
            </li>
            <li @click="close">
              <span>取消</span>
            </li>
          </ul>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import monment from "moment";
import {
  saveorupdatephysicalexamination,
  doctorlist,
  patientlist,
  getPatientlists
} from "@/api";
export default {
  components: {},
  props: ["isShow", "datas", "visb"],
  data() {
    return {
      editOnOff: false,
      initData: {
        patientId: "", // 患者的ID
        physicalExaminationDate: "", // yy-mm-dd hh:mm
        doctorId: "", // 医生的id
        chiefComplaint: "", // 主述
        pastHistory: "", // 既往史
        dentofacialInspect: [], // 口腔颌面部检查
        dentofacialDiagnosis: "", // 口腔颌面部诊断
        oralMucosaInspect: [], // 口腔黏膜检查
        oralMucosaDiagnosis: "", // 口腔黏膜诊断
        maxillaryTable: "", // 上颌检查表格 注：每个坐标用“,”隔开 (16:松弛度,14:附着丧失)
        maxPositiveSignHistory: "", // 上颌阳性体征现病史
        maxProbingDepth: "", // 上颌探诊深度
        submaxilaryTable: "", //   下颌检查表格（同上颌）
        subPositiveSigHistory: "", // 下颌阳性体征现病史
        subProbingDepth: "", // 下颌探诊深度
        otherCavityConditions: [], // 其他空腔情况
        wisdomToothConditions: "", // 智齿情况
        panoramicDescription: "", // 全景片描述
        supplementarySituation: "", // 补充情况
        doctorAdvice: "",
        subRemark: "",
        maxRemark: ""
      },
      sendData: {
        patientId: "", // 患者的ID
        physicalExaminationDate: "", // yy-mm-dd hh:mm
        doctorId: "", // 医生的id
        chiefComplaint: "", // 主述
        pastHistory: "", // 既往史
        dentofacialInspect: [], // 口腔颌面部检查
        dentofacialDiagnosis: "", // 口腔颌面部诊断
        oralMucosaInspect: [], // 口腔黏膜检查
        oralMucosaDiagnosis: "", // 口腔黏膜诊断
        maxillaryTable: "", // 上颌检查表格 注：每个坐标用“,”隔开 (16:松弛度,14:附着丧失)
        maxPositiveSignHistory: "", // 上颌阳性体征现病史
        maxProbingDepth: "", // 上颌探诊深度
        submaxilaryTable: "", //   下颌检查表格（同上颌）
        subPositiveSigHistory: "", // 下颌阳性体征现病史
        subProbingDepth: "", // 下颌探诊深度
        otherCavityConditions: [], // 其他空腔情况
        wisdomToothConditions: "", // 智齿情况
        panoramicDescription: "", // 全景片描述
        supplementarySituation: "", // 补充情况
        doctorAdvice: "",
        subRemark: "",
        maxRemark: ""
      },
      // 顶部title
      tableTitle: [
        "上颌",
        17,
        16,
        15,
        14,
        13,
        12,
        11,
        21,
        22,
        23,
        24,
        25,
        26,
        27
      ],
      tableTitle1: [
        "下颌",
        47,
        46,
        45,
        44,
        43,
        42,
        41,
        31,
        32,
        33,
        34,
        35,
        36,
        37
      ],
      // 循环数据
      newDataTtle: [17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27],
      downNewDataTtle: [47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37],
      // 侧边data
      readyData: [
        "正常",
        "松动度",
        "叩痛",
        "扪痛",
        "牙结石",
        "附着丧失",
        "探诊出血",
        "缺失及原因",
        "龋",
        "牙髓炎",
        "根尖周炎",
        "楔状缺损",
        "牙外伤"
      ],
      stors: [],
      copyStors: [],
      // 渲染的数据
      newDataList: [],
      copyDataList: [],
      restaurants: [],
      doctorlist: [],
      userInfo: "",
      physicalExaminationDate: "",
      chiefComplaint: "",
      chiefComplaint: "",
      pastHistory: "",
      doctorId: "",
      dentofacialInspect: [],
      dentofacialDiagnosis: "",
      oralMucosaInspect: [],
      oralMucosaDiagnosis: "",
      maxPositiveSignHistory: "",
      maxProbingDepth: [],
      subPositiveSigHistory: "",
      subProbingDepth: [],
      otherCavityConditions: [],
      wisdomToothConditions: "",
      panoramicDescription: "",
      supplementarySituation: "",
      doctorAdvice: "",
      maxillaryTable: [],
      newArr: [],
      sex: "",
      stateDatas: {},
      sexArr: ["", "男", "女"],
      getDate: "",
      selectData: ["√", "|°", "||°", "|||°", "+", "++", "+++", ""],
      dentofacialInspectArr: [
        "",
        "口腔颌面正常",
        "头、颈）溃疡、疼痛、糜烂、裂纹",
        "（鼻、颊、颌）溃疡、疼痛、糜烂、裂纹",
        "（口、角）溃疡、疼痛、糜烂、裂纹",
        "（唇红缘）溃疡、疼痛、糜烂、裂纹",
        "上下唇畸形",
        "（头、颈）淋巴结肿大",
        "颌面部其他肿块",
        "其他异常"
      ],
      oralMucosaInspectArr: [
        "",
        "无异常",
        "口腔癌",
        "白斑",
        "扁平苔藓",
        "溃疡",
        "急性坏死性龈炎"
      ],
      maxProbingDepthArr: [
        "",
        "上颌探诊深度所有牙<=4mm",
        "探诊深度任意牙 > 4mm: 详见牙周探诊记录表"
      ],
      subProbingDepthArr: [
        "下颌探诊深度所有牙<=4mm",
        "探诊深度任意牙 > 4mm: 详见牙周探诊记录表"
      ],
      otherCavityConditionsArr: [
        "",
        "轻度牙颌畸形（轻度牙列拥挤或空隙）",
        "中度牙颌畸形（中度牙列拥挤或空隙）",
        "中度牙颌畸形（重度牙列拥挤或空隙，反颌，开颌等）",
        "有颞下颌关节疼痛，弹响等",
        "有急需处理的疼痛，感染等"
      ]
    };
  },
  mounted() {},
  watch: {},
  computed: {},
  mixins: [],
  methods: {
    close() {
      this.sendData = JSON.parse(JSON.stringify(this.initData));
      this.isShow.physicalReport = false;
      this.stateDatas.patientName = "";
      this.stateDatas.clinicNo = "";
      this.stateDatas.mobilephone = "";
      this.stors = [];
      this.copyStors = [];
    },
    openMsg(msg, type) {
      this.$message({
        message: msg,
        type: type
      });
    },
    // openUpPopup(item, val, index, num, state, v, e) {
    //   if (!this.editOnOff) {
    //     let nums = this.newDataTtle[num];
    //     let title = item.title;
    //     let keys = nums + title;
    //     let vals = nums + ":" + title + ":" + v;
    //     val.text = v;
    //     if (!state) {
    //       this.stors.push(vals);
    //     } else {
    //       this.copyStors.push(vals);
    //     }
    //     val.is = false;
    //   }
    // },
    // openDownPopup(item, val, index, num, state, v, e) {
    //   if (!this.editOnOff) {
    //     let nums = this.downNewDataTtle[num];
    //     let title = item.title;
    //     let keys = nums + title;
    //     let vals = nums + ":" + title + ":" + v;
    //     val.text = v;
    //     if (!state) {
    //       this.stors.push(vals);
    //     } else {
    //       this.copyStors.push(vals);
    //     }
    //   }
    // },
    getData() {
      this.editOnOff = true;
      let arr = [];
      let arr1 = [];
      let dataArr = this.datas.data.physicalExamination.maxillaryTable.split(
        ","
      );
      let dataArr1 = this.datas.data.physicalExamination.submaxilaryTable.split(
        ","
      );
      this.readyData.map(val => {
        arr.push({
          title: val,
          data: []
        });
        arr1.push({
          title: val,
          data: []
        });
      });

      this.newDataTtle.map((val, index) => {
        arr.map(item => {
          item.data.push({ show: false, vals: val, text: "" });
        });
      });
      this.downNewDataTtle.map((val, index) => {
        arr1.map(item => {
          item.data.push({ show: false, vals: val, text: "" });
        });
      });

      let newDataList = arr;
      let copyDataList = arr1;

      for (let i = 0; i < newDataList.length; i++) {
        for (let j = 0; j < dataArr.length; j++) {
          if (newDataList[i].title == dataArr[j].split(":")[1]) {
            for (let a = 0; a < newDataList[i].data.length; a++) {
              if (newDataList[i].data[a].vals == dataArr[j].split(":")[0]) {
                newDataList[i].data[a].text = dataArr[j].split(":")[2];
              }
            }
          }
        }
      }

      this.newDataList = newDataList;
      // 第二个表格回填数据
      for (let i = 0; i < copyDataList.length; i++) {
        for (let j = 0; j < dataArr1.length; j++) {
          if (copyDataList[i].title == dataArr1[j].split(":")[1]) {
            for (let a = 0; a < copyDataList[i].data.length; a++) {
              if (copyDataList[i].data[a].vals == dataArr1[j].split(":")[0]) {
                copyDataList[i].data[a].text = dataArr1[j].split(":")[2];
              }
            }
          }
        }
      }

      this.copyDataList = copyDataList;

      function getNowFormatDate() {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        var currentdate = year;
        return currentdate;
      }
      let d = getNowFormatDate();

      this.getDate = getDate();
      function getDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
      }
      // 点击编辑时数据回填
      // 用户信息回填

      this.stateDatas.patientName = this.datas.data.physicalExamination.patient.patientName;
      this.stateDatas.clinicNo = this.datas.data.physicalExamination.patient.emrNo;
      this.stateDatas.mobilephone = this.datas.data.physicalExamination.patient.mobilphone;
      this.sendData.patientId = this.datas.data.physicalExamination.patient.id;
      let date = this.datas.data.physicalExamination.physicalExaminationDate;
      this.getDate = date.substring(0, date.length - 9);

      var s1 = (this.sex = this.sexArr[
        this.datas.data.physicalExamination.patient.gender
      ]);
      this.stateDatas.mobilephone=this.datas.data.physicalExamination.patient.mobilephone||"无记录"

      // 获取医生列表回填id
      doctorlist().then(res => {
        this.doctorlist = res.data.data;
        this.sendData.doctorId = this.datas.data.physicalExamination.doctorId;
      });
      if (this.datas.data.physicalExamination.patient.birthDate) {
        this.stateDatas.patientBirth =
          d -
          this.datas.data.physicalExamination.patient.birthDate.substring(0, 4);
      }
      //体检时间
      let str = "";
      str = this.datas.data.physicalExamination.dentofacialInspect
        .split(",")
        .map(val => {
          let n = "";
          n += this.dentofacialInspectArr[val];
          val = n;
          return val;
        });
      this.sendData.dentofacialInspect = str;

      let str1 = "";
      str1 = this.datas.data.physicalExamination.oralMucosaInspect
        .split(",")
        .map(val => {
          let n = "";
          n += this.oralMucosaInspectArr[val];
          val = n;

          return val;
        });
      this.sendData.oralMucosaInspect = str1;

      let str2 = "";
      str2 = this.datas.data.physicalExamination.otherCavityConditions
        .split(",")
        .map(val => {
          let n = "";
          n += this.otherCavityConditionsArr[val];
          val = n;

          return val;
        });
      this.sendData.otherCavityConditions = str2;
      this.sendData.chiefComplaint = this.datas.data.physicalExamination.chiefComplaint; //主述
      this.sendData.pastHistory = this.datas.data.physicalExamination.pastHistory; //即往史
      this.sendData.dentofacialDiagnosis = this.datas.data.physicalExamination.dentofacialDiagnosis; //诊断
      this.sendData.oralMucosaDiagnosis = this.datas.data.physicalExamination.oralMucosaDiagnosis; //诊断
      // 髓检查上颌
      if (this.datas.data.physicalExamination.maxillaryTable.length > 1) {
        this.stors = this.datas.data.physicalExamination.maxillaryTable.split(
          ","
        );
      } else {
        this.stors.push(this.datas.data.physicalExamination.maxillaryTable);
      }
      // 髓检查下颌
      if (this.datas.data.physicalExamination.submaxilaryTable.length > 1) {
        this.copyStors = this.datas.data.physicalExamination.submaxilaryTable.split(
          ","
        );
      } else {
        this.copyStors.push(
          this.datas.data.physicalExamination.submaxilaryTable
        );
      }
      // 阳性体征现病史  s
      this.sendData.maxPositiveSignHistory = this.datas.data.physicalExamination.maxPositiveSignHistory;
      this.sendData.maxProbingDepth = this.datas.data.physicalExamination.maxProbingDepth;
      // 阳性体征现病史  x
      this.sendData.subPositiveSigHistory = this.datas.data.physicalExamination.subPositiveSigHistory;
      this.sendData.subProbingDepth = this.datas.data.physicalExamination.subProbingDepth;
      this.sendData.subRemark = this.datas.data.physicalExamination.subRemark;
      this.sendData.maxRemark = this.datas.data.physicalExamination.maxRemark;
      this.sendData.wisdomToothConditions = this.datas.data.physicalExamination.wisdomToothConditions;
      this.sendData.panoramicDescription = this.datas.data.physicalExamination.panoramicDescription;
      this.sendData.supplementarySituation = this.datas.data.physicalExamination.supplementarySituation; //其他补充情况
      this.sendData.doctorAdvice = this.datas.data.physicalExamination.doctorAdvice;
    },
    getTime(t) {
      return monment(t).format("YYYY-MM-DD HH:mm:ss");
    },
    querySearch(queryString, cb) {
      getPatientlists(this.userInfo).then(res => {
        if (res.data.code === 200) cb(res.data.data);
      });
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    handleSelect(val) {
      this.sendData.patientId = val.id;
      this.userInfo = val.patientName;
      this.stateDatas = val;
    }
  }
};
function checkData(v) {
  let cd = false;
  if (v.sendData.patientId != "") {
    cd = true;
  } else {
    cd = false;
    v.openMsg("患者不能为空！", "warning");
    return cd;
  }

  if (v.sendData.physicalExaminationDate != "") {
    cd = true;
  } else {
    cd = false;
    v.openMsg("体检日期不能为空！", "warning");
    return cd;
  }

  if (v.sendData.doctorId != "") {
    cd = true;
  } else {
    cd = false;
    v.openMsg("检查医生不能为空！", "warning");
    return cd;
  }
  if (v.sendData.chiefComplaint !== "") {
    cd = true;
  } else {
    cd = false;
    v.openMsg("主述不能为空！", "warning");
    return cd;
  }
  if (v.sendData.pastHistory != "") {
    cd = true;
  } else {
    cd = false;
    v.openMsg("既往史不能为空！", "warning");
    return cd;
  }
  if (v.sendData.dentofacialInspect.length > 0) {
    cd = true;
  } else {
    cd = false;
    v.openMsg("请勾选口腔颌面部检查！", "warning");
    return cd;
  }

  if (v.sendData.dentofacialDiagnosis.length != "") {
    cd = true;
  } else {
    cd = false;
    v.openMsg("口腔颌面部诊断不能为空！", "warning");
    return cd;
  }

  if (v.sendData.oralMucosaInspect.length > 0) {
    cd = true;
  } else {
    cd = false;
    v.openMsg("请勾选口腔黏膜检查！", "warning");
    return cd;
  }

  if (v.sendData.oralMucosaDiagnosis.length != "") {
    cd = true;
  } else {
    cd = false;
    v.openMsg("口腔黏膜诊断不能为空！", "warning");
    return cd;
  }
  if (v.stors.length > 0) {
    cd = true;
  } else {
    cd = false;
    v.openMsg("请勾选上颌检查！", "warning");
    return cd;
  }

  if (v.sendData.maxPositiveSignHistory != "") {
    cd = true;
  } else {
    cd = false;
    v.openMsg("上颌阳性体征现病史不能为空！", "warning");
    return cd;
  }

  if (v.sendData.maxProbingDepth != "") {
    cd = true;
  } else {
    cd = false;
    v.openMsg("请勾选上颌探诊深度！", "warning");
    return cd;
  }

  if (v.copyStors.length > 0) {
    cd = true;
  } else {
    cd = false;
    v.openMsg("请勾选下颌检查！", "warning");
    return cd;
  }

  if (v.sendData.subPositiveSigHistory != "") {
    cd = true;
  } else {
    cd = false;
    v.openMsg("下颌阳性体征现病史不能为空！！", "warning");
    return cd;
  }

  if (v.sendData.subProbingDepth != "") {
    cd = true;
  } else {
    cd = false;
    v.openMsg("请勾选下颌探诊深度！", "warning");
    return cd;
  }

  if (v.sendData.otherCavityConditions.length > 0) {
    cd = true;
  } else {
    cd = false;
    v.openMsg("请勾选其他口腔情况！", "warning");
    return cd;
  }

  if (v.sendData.wisdomToothConditions != "") {
    cd = true;
  } else {
    cd = false;
    v.openMsg("智齿情况不能为空！", "warning");
    return cd;
  }

  if (v.sendData.panoramicDescription != "") {
    cd = true;
  } else {
    cd = false;
    v.openMsg("全景片描述不能为空！", "warning");
    return cd;
  }

  return cd;
}
</script>
<style lang="less" scoped>
.borderBottom {
  border-bottom: 1px solid #000;
  height: 40px;
}
.borderRight {
  border-right: none;
}

.clinicName {
  height: 30px;
  margin-bottom: 20px;
  text-align: center;
  padding-left: 100px;
  img {
    width: 90%;
  }
}
.clinic_logo {
  position: absolute;
  left: 10px;
  top: 0px;
  width: 78px;
  height: 80px;
}
.physical_report {
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 20px;
  margin-bottom: 10px;
  font-weight: bold;
}
.date {
  text-align: right;
  font-weight: bold;
  margin-bottom: 10px;
}
.content {
  width: 100%;
  margin: 10px auto;
  font-weight: bold;
  .content_page {
    height: 1050px;
    .content_page_title {
      border-bottom: 2px solid #000;
      margin-top: 20px;
    }
  }
  .content_pagetwo {
    height: 1020px;
    .title_box {
      margin-top: 16px;
    }
    .my_table {
      table {
        padding-right: 25px;
        margin-top: 10px;
        width: 100%;
      }
      .table_head {
        width: 100px;
        height: 40px;
      }
      .table_item {
        width: 250px;
        text-align: center;
      }
    }
  }
  .content_pagethree {
    height: 1018px;
    .my_table {
      table {
        padding-right: 25px;
        margin-top: 10px;
        width: 100%;
      }
    }
    .title_box {
      margin-top: 16px;
    }
    .table_head {
      width: 100px;
      height: 40px;
    }
    .table_item {
      width: 250px;
      text-align: center;
    }
  }
  .content_pagefour {
    height: 610px;
  }
  .adjusting_position {
    margin-top: 20px;
    margin-left: 10px;
  }

  .base_info {
    .borderBottom;
    border-left: 2px solid #000;
    border-right: 2px solid #000;
    .el-col:nth-child(4) {
      .borderRight;
    }
    .el-col {
      border-right: 1px solid #000;
      box-sizing: border-box;
      text-align: center;
      line-height: 40px;
    }
  }
  .base_casehistory_info {
    border-left: 2px solid #000;
    border-right: 2px solid #000;
    border-bottom: 1px solid #000;
    height: 80px;
    .el-col {
      height: 80px;
      border-right: 1px solid #000;
      box-sizing: border-box;
      text-align: center;
      line-height: 80px;
      padding-top: 6px;
    }
    .el-col:nth-child(2) {
      .borderRight;
      text-align: left;
      line-height: normal;
      padding-left: 10px;
    }
  }
  .faceexamination {
    border-bottom: 1px solid #000;
    border-left: 2px solid #000;
    border-right: 2px solid #000;
    overflow: hidden;
    height: 360px;
    .key {
      height: 360px;
      box-sizing: border-box;
      text-align: center;
      line-height: 360px;
      border-right: 1px solid #000;
    }
    .el-col:nth-child(2) {
    }
    .selt {
      margin-top: 10px;

      p {
        width: 500px;
        display: inline-block;
        margin-top: 5px;
        margin-bottom: 5px;
        text-indent: 10px;
      }
    }
    .diagnosis {
      display: inline-block;
      width: 38px;
      height: 20px;
      margin-left: 10px;
      margin-top: 20px;
    }
    .result {
      display: inline-block;
      text-decoration: underline;
      line-height: 20px;
      padding-left: 10px;
    }
  }

  .oralexamination {
    border-left: 2px solid #000;
    border-right: 2px solid #000;
    border-bottom: 2px solid #000;
    overflow: hidden;
    height: 300px;
    .key {
      height: 300px;
      box-sizing: border-box;
      text-align: center;
      line-height: 300px;
      border-right: 1px solid #000;
    }
    .el-col:nth-child(2) {
      .borderRight;
    }
    .selt {
      margin-top: 10px;
      p {
        width: 500px;
        display: inline-block;
        margin-top: 5px;
        margin-bottom: 5px;
        text-indent: 10px;
      }
    }
    .diagnosis {
      display: inline-block;
      width: 38px;
      height: 20px;
      margin-left: 10px;
      margin-top: 20px;
    }
    .result {
      display: inline-block;
      text-decoration: underline;
      line-height: 20px;
      padding-left: 10px;
    }
  }
  .table_box {
    height: 800px;
    border: 2px solid #000;
    border-bottom: 1px solid #000;
    overflow: hidden;
    .left {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 798px;
      border-bottom: 1px solid #000;
      border-right: 1px solid #000;
      box-sizing: border-box;
      text-align: center;
    }
    .right {
      height: 800px;
    }
  }
}
.lasth {
  height: 370px;
  border: 2px solid #000;
  border-bottom: 1px solid #000;
  border-top: 2px solid #000;
  .key {
    height: 367px;
    box-sizing: border-box;
    text-align: center;
    line-height: 114px;
    border-right: 1px solid #000;
  }
  .el-col:nth-child(2) {
    .borderRight;
  }
  .selt {
    margin-top: 10px;
    p {
      display: inline-block;
    }
  }
  .diagnosis {
    display: inline-block;
    width: 60px;
    height: 20px;
    margin-left: 10px;
    margin-top: 20px;
  }
  .result {
    display: inline-block;
    text-decoration: underline;
    line-height: 20px;
    padding-left: 10px;
  }
  p {
    width: 500px;
    display: inline-block;
    margin-top: 5px;
    margin-bottom: 5px;
    text-indent: 10px;
  }
}
.proposal {
  height: 100px;
  border-left: 2px solid #000;
  border-right: 2px solid #000;
  border-bottom: 2px solid #000;
  .proposal_left {
    height: 100px;
    line-height: 100px;
    text-align: center;
    border-right: 1px solid #000;
  }
  .proposal_right {
    line-height: 20px;
    padding-left: 10px;
  }
}
.borerNone {
  border: none;
}

.imgs {
  width: 30px;
  height: 32px;
  margin: 0;
  display: inline-block;
  border: none;
}
.editBtn {
  cursor: pointer;
  background: #3b78fd;
  width: 60px;
  height: 32px;
  color: #fff;
  line-height: 32px;
  text-align: center;
}
.tds {
  width: 34px;
  height: 41px;
  text-align: center;
}
.titles {
  padding: 10px 0 10px 20px;
  background: #e4e9ff;
  margin-bottom: 20px;
}
.faceexamination .other_group {
  .el-checkbox {
    width: 340px;
    text-align: left;
    margin-left: 10px;
    .el-checkbox__label {
      font-size: 16px;
    }
  }
}
.oralexamination label {
  width: 240px;
  text-align: left;
  margin-left: 10px;
  .el-checkbox__label {
    font-size: 16px;
  }
}
.lasth label {
  width: 400px;
  text-align: left;
  margin-left: 10px;
  .el-checkbox__label {
    font-size: 16px;
  }
}
.my_table {
  width: 100%;
  padding: 0 10px 0 10px;
}
.my_title {
  display: flex;
  justify-content: space-between;
  li {
    width: 44px;
    height: 44px;
    text-align: center;
    line-height: 44px;
  }
}
.btns_wrap {
  display: flex;
  justify-content: flex-start;
  text-align: center;
  line-height: 32px;
  margin-top: 70px;
  li {
    cursor: pointer;
    color: #3b78fd;
    width: 88px;
    height: 32px;
    border: 1px solid #3b78fd;
    margin-right: 20px;
  }
  li:nth-child(1) {
    margin-left: 400px;
  }
  .actives {
    color: #fff;
  }
}

table {
  tr {
    border: 1px solid #000;
  }
  td {
    border: 1px solid #000;
  }
  tr {
    th {
      border: 1px solid #000;
      text-align: center;
    }
  }
}

.my_table {
  margin-bottom: 30px;
}
</style>
<style>
.add_line label {
  line-height: 20px;
  margin-bottom: 30px;
}
#physicalReport .el-dialog__header {
  height: 0px;
}
#physicalReport .el-dialog__body {
  padding: 0px 20px;
}
#physicalReport .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  /* background-color: #000;
  border-color: #000; */
  /* border: 7px solid red !important; */
  background-color: transparent;
}
.el-checkbox__input {
}
#physicalReport .el-checkbox__inner::after {
  border: 1px solid #000;
}
</style>
<style>
#physicalReport .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
}
#physicalReport .el-checkbox__inner.el-checkbox__inner::after {
  display: none;
}
@media screen and (max-width: 2000px) {
  #physicalReport div {
    font-size: 12px;
  }
  #physicalReport span {
    font-size: 12px;
  }
  #physicalReport p {
    font-size: 12px;
  }
  #physicalReport .physical_report {
    font-size: 18px;
  }
  #physicalReport .el-form-item__label {
    font-size: 12px;
  }
}
</style>
