<!--
 * @Descripttion: 口腔体检报告,打印
 * @version: v4.1
 * @Author: hzj
 * @Date: 2019-08-01 14:52:35
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-13 15:56:30
 -->
<template>
  <div class="wrapper" id="physicalReport" v-show="isShow.dialogVisible">
    <div>
        <asideDialog title="打印预览" :isShow="isShow">
            <div id="printTest">
            <section class="content">
                <div style="height:1050px;">
                <el-row class="content_title"  style="" >
                <el-col :span="24">
                    <p class="physical_report">{{currentinstitution.name}} -- 口腔体检报告</p>
                    <p class="date" >日期： {{getDate}}</p>
                </el-col>
                </el-row>
                
                <el-row class="userinfo">
                    <el-col :span="4">姓名</el-col>
                    <el-col :span="8">{{stateDatas.patientName}}</el-col>
                    <el-col :span="6">性别</el-col>
                    <el-col :span="6">{{sex}}</el-col>
                </el-row>

                <el-row class="userinfo">
                    <el-col :span="4">联系电话</el-col>
                    <el-col :span="8">{{stateDatas.telephone}}</el-col>
                    <el-col :span="6">年龄</el-col>
                    <el-col :span="6">{{stateDatas.patientBirth}}</el-col>
                </el-row>

                <el-row class="chiefcomplaint">
                    <el-col :span="4">主述</el-col>
                    <el-col :span="20">{{sendData.chiefComplaint}}</el-col>
                </el-row>

                <el-row class="chiefcomplaint">
                    <el-col :span="4">既往史</el-col>
                    <el-col :span="20">{{sendData.pastHistory}}</el-col>
                </el-row>

                <el-row class="dentofacialInspect">
                    <el-col :span="4" class="key">口腔颌面部检查</el-col>
                    <el-col :span="20">
                    <el-row>
                        <div class="selt">
                        <p class="checkboxLine" v-for="(item,index) in sendData.dentofacialInspect" :key="index">{{item}}</p>
                        </div>
                        <div class="diagnosis">
                        <span style="">诊断：</span>
                        </div>
                        <div class="result">
                        <span class="underline">{{sendData.dentofacialDiagnosis}}</span>
                        </div>                       
                    </el-row>
                    </el-col>
                </el-row>

                <el-row class="oralmucosadiagnosis">
                    <el-col :span="4" class="key">口腔黏膜检查</el-col>
                    <el-col :span="20">
                    <el-row>
                        <el-col :span="24">
                        <div class="selt">
                            <p v-for="(item,index) in sendData.oralMucosaInspect" :key="index">{{item}}</p>
                        </div>
                        <div class="diagnosis">
                            <span style="">诊断：</span>
                        </div>
                        <div class="result">
                            <span class="underline">{{sendData.oralMucosaDiagnosis}}</span>
                        </div>                     
                        </el-col>
                    </el-row>
                    </el-col>
                </el-row>
            </div>
            <div style="height:1020px;">
            <el-row style="marginTop:16px;" >
                <el-col :span="24" >
                <p class="physical_report">{{currentinstitution.name}} -- 口腔体检报告</p>
                <p class="date">日期： {{getDate}}</p>
                </el-col>
            </el-row>

                <el-row class="submaxilarytable">
                <el-col :span="4" class="left borerNone" style="borderBottom:none;">
                  <span>牙周及牙体牙髓检查</span>
                  </el-col>
                <el-col :span="20" class="right">
                    <el-row>
                    <el-col :span="24">
                        <div class="my_table">
                        <table class="mytable_uptable" style="paddingRight:25px;marginTop:16px;width:100%;">
                          <tr style="width:100px;height:40px;">
                            <th v-for="(item,index) of upTitle  " :key="index">
                              <span>{{item}}</span>
                            </th>
                          </tr>
                          <tr v-for="(item,index) in newDataList" :key="index">
                            <td style="width:250px;textAlign:center;">{{item.title}}</td>
                            <td class="tds" v-for="(val,num) in item.data" :key="num">
                              <el-popover placement="top-start" width="300" trigger="click" v-model="val.is" :disabled="editOnOff">
                                <span slot="reference" class="popover_btn">{{val.text}}</span>
                              </el-popover>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </el-col>
                    <p class="other_row">
                        <span class>其他：</span>
                        <span class="underline">{{sendData.maxRemark}}</span>
                    </p>
                    <p class="other_row">
                        <span class>阳性体征现病史：</span>
                        <span class="underline">{{sendData.maxPositiveSignHistory}}</span>
                    </p>
                    <p class="other_row">
                        {{maxProbingDepthArr[sendData.maxProbingDepth]}}

                    </p>
                    </el-row>
                </el-col>
                </el-row>
                </div>
            
            <div style="height:1018px;">
            <el-row style="marginTop:16px;"   >
                <el-col :span="24" >
                <p class="physical_report">{{currentinstitution.name}} -- 口腔体检报告</p>
                <p class="date">日期： {{getDate}}</p>
                </el-col>
            </el-row>

                <el-row class="submaxilarytable">
                <el-col :span="4" class="left">
                  <span>牙周及牙体牙髓检查</span>
                  </el-col>
                <el-col :span="20" class="right">
                    <el-row>
                    <el-col :span="24">
                        <div class="my_table">
                          <table class="mytable_downtable" style="">
                            <tr style="width:100px;height:40px;">
                              <th v-for="(item,index) of downTitle  " :key="index">
                                <span>{{item}}</span>
                              </th>
                            </tr>
                            <tr v-for="(item,index) in copyDataList" :key="index">
                              <td style="width:250px;textAlign:center;">{{item.title}}</td>
                              <td class="tds" v-for="(val,num) in item.data" :key="num">
                                <el-popover placement="top-start" width="300" trigger="click" v-model="val.is" :disabled="editOnOff">
                                  <span slot="reference" class="popover_btn">{{val.text}}</span>
                                </el-popover>
                              </td>
                            </tr>
                          </table>
                        </div>
                    </el-col>
                    <p  class="other_row">
                        <span class>其他：</span>
                        <span class="underline">{{sendData.subRemark}}</span>
                    </p>
                    <p class="other_row">
                        <span class>阳性体征现病史：</span>
                        <span class="underline">{{sendData.subPositiveSigHistory}}</span>
                    </p>
                    <p class="other_row">
                        {{subProbingDepthArr[sendData.subProbingDepth]}}

                    </p>
                    </el-row>
                </el-col>
                </el-row>
                </div>

                <div style="height:610px;">
                <el-row style="marginTop:40px;" >
                    <el-col :span="24" >
                    <p class="physical_report">{{currentinstitution.name}} -- 口腔体检报告</p>
                    <p class="date">日期： {{getDate}}</p>
                    </el-col>
                </el-row>               
                <el-row class="lasth">             
                <el-col :span="4" class="key">其他口腔情况</el-col>
                <el-col :span="20">
                    <el-row>
                    <div class="selt">
                        <p v-for="(item,index) in sendData.otherCavityConditions" :key="index">{{item}}</p>
                    </div>
                    <div>
                        <div class="diagnosis">
                        <span style="">智齿情况：</span>
                        </div>
                        <div class="result">
                        <span class="underline">{{sendData.wisdomToothConditions}}</span>
                        </div>
                    </div> 
                    <div>   
                        <div class="diagnosis" style="width:80px;">
                        <span style="">全景片描述：</span>
                        </div>
                        <div class="result">
                        <span class="underline">{{sendData.panoramicDescription}}</span>
                        </div>
                    </div> 
                    <div> 
                        <div class="diagnosis" style="width:90px;">
                        <span style="">其他补充情况：</span>
                        </div>
                        <div class="result">
                        <span class="underline">{{sendData.supplementarySituation}}</span>
                        </div> 
                    </div>                                                   
                    </el-row>
                </el-col>
                </el-row>

                <el-row class="proposal">
                <el-col :span="4" class="left">医生建议</el-col>
                <el-col :span="20" class="right">{{sendData.doctorAdvice}}</el-col>
                </el-row>

                <el-row>
                <el-col :span="8" :offset="14" style="marginTop:20px;">
                    <span>检查医生签名:</span>
                </el-col>
                </el-row>
                </div>
            </section>
            </div>

            <div slot="footer" class="">
            <ul class="btns_wrap">
                <li v-print="'#printTest'">
                <span>打印</span>
                </li>
                <li @click="close">
                <span>取消</span>
                </li>
            </ul>
            </div>
        </asideDialog>
    </div>
  </div>
</template>

<script>
import monment from "moment";
import {SYSTEM_HTTP_SUCCESS} from "@/constant";
import {
  saveorupdatephysicalexamination,
  doctorlist,
  patientlist,
  getPatientlists,
  getCurrentClinic
} from "@/api";
import asideDialog from "../../asideDialog.vue";
export default {
  components: { asideDialog },
  props: ["isShow", "datas", "visb"],
  data() {
    return {
      currentinstitution: {},
      editOnOff: false,
      sendData2: {
        patientId: "", 
        physicalExaminationDate: "",  
        doctorId: "", 
        chiefComplaint: "",  
        pastHistory: "", 
        dentofacialInspect: [], 
        dentofacialDiagnosis: "",  
        oralMucosaInspect: [],  
        oralMucosaDiagnosis: "",  
        maxillaryTable: "", 
        maxPositiveSignHistory: "",  
        maxProbingDepth: "",  
        submaxilaryTable: "", 
        subPositiveSigHistory: "", 
        subProbingDepth: "",  
        otherCavityConditions: [], 
        wisdomToothConditions: "",  
        panoramicDescription: "",  
        supplementarySituation: "",  
        doctorAdvice: "",
        subRemark:'',
        maxRemark:''
      },
      selectData: ["√", "|°", "||°", "|||°", "+", "++", "+++", ""],
      sendData: {
        patientId: "", 
        physicalExaminationDate: "",  
        doctorId: "",  
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
        subRemark:'',
        maxRemark:''
      },
      // 顶部title
      upTitle  : [
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
      downTitle  : [
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
      physicalExaminationDate: "",
      chiefComplaint: "",
      chiefComplaint: "",
      pastHistory: "",
      doctorId: "",
      sex:'',
      stateDatas: {},
      sexArr:['','男','女'],
      getDate:'',
      dentofacialInspectArr:['','口腔颌面正常','头、颈）溃疡、疼痛、糜烂、裂纹','（鼻、颊、颌）溃疡、疼痛、糜烂、裂纹','（口、角）溃疡、疼痛、糜烂、裂纹','（唇红缘）溃疡、疼痛、糜烂、裂纹','上下唇畸形','（头、颈）淋巴结肿大','颌面部其他肿块','其他异常'],
      oralMucosaInspectArr:['','无异常','口腔癌','白斑','扁平苔藓','溃疡','急性坏死性龈炎'], 
      maxProbingDepthArr:['','上颌探诊深度所有牙<=4mm','探诊深度任意牙 > 4mm: 详见牙周探诊记录表'], 
      subProbingDepthArr:['下颌探诊深度所有牙<=4mm','探诊深度任意牙 > 4mm: 详见牙周探诊记录表'], 
      otherCavityConditionsArr:['','轻度牙颌畸形（轻度牙列拥挤或空隙）','中度牙颌畸形（中度牙列拥挤或空隙）','中度牙颌畸形（重度牙列拥挤或空隙，反颌，开颌等）','有颞下颌关节疼痛，弹响等','有急需处理的疼痛，感染等']           
    };
  },
  mounted() {
    this.getCurrentinstitution();
  },
  
  watch: {
      'isShow.dialogVisible'(){
          this.openGetData()
      }
  },
  computed: {},
  mixins: [],
  methods: {
    close() {
      this.isShow.dialogVisible=false;
      this.sendData = JSON.parse(JSON.stringify(this.sendData2));
      this.stateDatas.patientName = "";
      this.stateDatas.clinicNo = "";
      this.stateDatas.telephone = "";
      this.stors = [];
      this.copyStors = [];
    },
    open(msg, type) {
      this.$message({
        message: msg,
        type: type
      });
    },
    upTableSelect(item, val, index, num, state, e) {
      if (!this.editOnOff) {
        let nums = this.newDataTtle[num];
        let title = item.title;
        let keys = nums + title;
        let vals = nums + ":" + title;
        if (val.show) {
          if (!state) {
            this.stors = this.stors.filter((item, index) => item !== vals);
          } else {
            this.copyStors = this.copyStors.filter(
              (item, index) => item !== vals
            );
          }
        } else {
          if (!state) {
            this.stors.push(vals);
          } else {
            this.copyStors.push(vals);
          }
        }
        val.show = !val.show;
      }
    },
    downTableSelect(item, val, index, num, state, e) {
      if (!this.editOnOff) {
        let nums = this.newDataTtle[num];
        let title = item.title;
        let keys = nums + title;
        let vals = nums + ":" + title;
        if (val.show) {
          if (!state) {
            this.stors = this.stors.filter((item, index) => item !== vals);
          } else {
            this.copyStors = this.copyStors.filter(
              (item, index) => item !== vals
            );
          }
        } else {
          if (!state) {
            this.stors.push(vals);
          } else {
            this.copyStors.push(vals);
          }
        }
        val.show = !val.show;
      }
    },
    sublimt() {},
    openGetData() {
      if (false) {
        this.editOnOff = false;
        let arr = [];
        this.readyData.map(val => {
          arr.push({
            title: val,
            data: []
          });
        });

        this.newDataTtle.map((val, index) => {
          arr.map(item => {
            item.data.push({ show: false });
          });
        });
        this.newDataList = arr;
        this.copyDataList = JSON.parse(JSON.stringify(arr));
        doctorlist().then(res => {
          this.doctorlist = res.data.data;
        });
      } else {
        //--------------编辑------------------------
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
            item.data.push({ show: false, vals: val ,text:'' });
          });
        });
        this.downNewDataTtle.map((val, index) => {
          arr1.map(item => {
            item.data.push({ show: false, vals: val ,text:'' });
          });
        });

        let newDataList = arr;
        let copyDataList = arr1;
        
        for (let i = 0; i < newDataList.length; i++) {
          for (let j = 0; j < dataArr.length; j++) {
            if (newDataList[i].title == dataArr[j].split(":")[1]) {
              for (let a = 0; a < newDataList[i].data.length; a++) {
                if (
                  newDataList[i].data[a].vals == dataArr[j].split(":")[0]
                ) {
                  newDataList[i].data[a].text = dataArr[j].split(":")[2];
                }
              }
            }
          }
        }
       
        this.newDataList = newDataList
        // 第二个表格回填数据
        for (let i = 0; i < copyDataList.length; i++) {
          for (let j = 0; j < dataArr1.length; j++) {
            if (copyDataList[i].title == dataArr1[j].split(":")[1]) {
              for (let a = 0; a < copyDataList[i].data.length; a++) {
                if (
                  copyDataList[i].data[a].vals == dataArr1[j].split(":")[0]
                ) {
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
      let d=getNowFormatDate();
      
      this.getDate=getDate();
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
        
        this.sendData.patientId = this.datas.data.physicalExamination.patient.id;
        var s1 = (this.sex = this.sexArr[
          this.datas.data.physicalExamination.patient.gender
        ]);
        if(this.datas.data.physicalExamination.patient.mobilephone ){
          this.stateDatas.telephone = this.datas.data.physicalExamination.patient.mobilephone;
        }else{
          this.stateDatas.telephone ='无记录'
        }
        
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
      }
    },
    getTime(t) {
      return monment(t).format("YYYY-MM-DD HH:mm:ss");
    },

    dayin() {},
    handleIconClick() {},
    querySearch(queryString, cb) {
      getPatientlists(this.state3).then(res => {
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
    getSelectData() {},
    handleSelect(val) {
      this.sendData.patientId = val.id;
      this.state3 = val.patientName;
      this.stateDatas = val;
    },
    getCurrentinstitution() {
      let currentinstitution = sessionStorage.getItem('currentinstitution');
      if(currentinstitution) {
        this.currentinstitution = JSON.parse(currentinstitution);
      } else {
        getCurrentClinic().then(res => {
          if(res.data.code == SYSTEM_HTTP_SUCCESS) {
            this.currentinstitution = res.data.data;
            sessionStorage.setItem("currentinstitution", JSON.stringify(this.currentinstitution));
          }
        })
      }
    }
  }
};
function checkData(v) {
  let cd = false;

  if (v.sendData.patientId != "") {
    cd = true;
  } else {
    cd = false;
    v.open("患者不能为空！", "warning");
    return cd;
  }

  if (v.sendData.physicalExaminationDate != "") {
    cd = true;
  } else {
    cd = false;
    v.open("体检日期不能为空！", "warning");
    return cd;
  }

  if (v.sendData.doctorId != "") {
    cd = true;
  } else {
    cd = false;
    v.open("检查医生不能为空！", "warning");
    return cd;
  }
  if (v.sendData.chiefComplaint !== "") {
    cd = true;
  } else {
    cd = false;
    v.open("主述不能为空！", "warning");
    return cd;
  }
  if (v.sendData.pastHistory != "") {
    cd = true;
  } else {
    cd = false;
    v.open("既往史不能为空！", "warning");
    return cd;
  }
  if (v.sendData.dentofacialInspect.length > 0) {
    cd = true;
  } else {
    cd = false;
    v.open("请勾选口腔颌面部检查！", "warning");
    return cd;
  }

  if (v.sendData.dentofacialDiagnosis.length != "") {
    cd = true;
  } else {
    cd = false;
    v.open("口腔颌面部诊断不能为空！", "warning");
    return cd;
  }

  if (v.sendData.oralMucosaInspect.length > 0) {
    cd = true;
  } else {
    cd = false;
    v.open("请勾选口腔黏膜检查！", "warning");
    return cd;
  }

  if (v.sendData.oralMucosaDiagnosis.length != "") {
    cd = true;
  } else {
    cd = false;
    v.open("口腔黏膜诊断不能为空！", "warning");
    return cd;
  }
  if (v.stors.length > 0) {
    cd = true;
  } else {
    cd = false;
    v.open("请勾选上颌检查！", "warning");
    return cd;
  }

  if (v.sendData.maxPositiveSignHistory != "") {
    cd = true;
  } else {
    cd = false;
    v.open("上颌阳性体征现病史不能为空！", "warning");
    return cd;
  }

  if (v.sendData.maxProbingDepth != "") {
    cd = true;
  } else {
    cd = false;
    v.open("请勾选上颌探诊深度！", "warning");
    return cd;
  }

  if (v.copyStors.length > 0) {
    cd = true;
  } else {
    cd = false;
    v.open("请勾选下颌检查！", "warning");
    return cd;
  }

  if (v.sendData.subPositiveSigHistory != "") {
    cd = true;
  } else {
    cd = false;
    v.open("下颌阳性体征现病史不能为空！！", "warning");
    return cd;
  }

  if (v.sendData.subProbingDepth != "") {
    cd = true;
  } else {
    cd = false;
    v.open("请勾选下颌探诊深度！", "warning");
    return cd;
  }

  if (v.sendData.otherCavityConditions.length > 0) {
    cd = true;
  } else {
    cd = false;
    v.open("请勾选其他口腔情况！", "warning");
    return cd;
  }

  if (v.sendData.wisdomToothConditions != "") {
    cd = true;
  } else {
    cd = false;
    v.open("智齿情况不能为空！", "warning");
    return cd;
  }

  if (v.sendData.panoramicDescription != "") {
    cd = true;
  } else {
    cd = false;
    v.open("全景片描述不能为空！", "warning");
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
  img{
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
  margin-bottom:10px;
}
.content {
  width: 100%;
  margin: 10px auto;
  font-weight: bold;
  .content_title{
    border-bottom:2px solid #000;
    margin-top:20px;
  }
  .userinfo {
    .borderBottom;
    
    border-left:2px solid #000;
    border-right:2px solid #000;
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
  .chiefcomplaint {
      border-left:2px solid #000;
      border-right:2px solid #000;
      border-bottom: 1px solid #000;
      height:80px;
    .el-col {
      height:80px;
      border-right: 1px solid #000;
      box-sizing: border-box;
      text-align: center;
      line-height: 80px;
      padding-top: 6px;
      
    }
    .el-col:nth-child(2) {
      .borderRight;
      text-align: left;
      line-height:normal;
      padding-left: 10px;
    }
  }
  .dentofacialInspect {
    border-bottom: 1px solid #000;
    border-left:2px solid #000;
    border-right:2px solid #000;
    overflow: hidden;
    height: 360px;
    .key {
      height: 360px;
      box-sizing: border-box;
      text-align: center;
      line-height: 360px;
      border-right: 1px solid #000;
    }
    .selt {
      margin-top: 10px;

      p{
        width: 500px;
        display: inline-block;
        margin-top: 5px;
        margin-bottom: 5px;
        text-indent: 10px;
      }
    }
      .diagnosis{
        display: inline-block;
        width: 38px;
        height: 20px;
        margin-left: 10px;
        margin-top: 20px;

      }
      .result{
        display: inline-block;
        text-decoration:underline;
        line-height:20px;
        padding-left: 10px;
      }
 
  }

  .oralmucosadiagnosis {
    border-left:2px solid #000;
    border-right:2px solid #000;    
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
    .selt {
      margin-top: 10px;
      p{
        width: 500px;
        display: inline-block;
        margin-top: 5px;
        margin-bottom: 5px;
        text-indent: 10px;
      }
    }
      .diagnosis{
        display: inline-block;
        width: 38px;
        height: 20px;
        margin-left: 10px;
        margin-top: 20px;

      }
      .result{
        display: inline-block;
        text-decoration:underline;
        line-height:20px;
        padding-left: 10px;
        

      }   
  }
  .submaxilarytable {
    height: 800px;
    border:2px solid #000;
    border-bottom:1px solid #000;
    overflow: hidden;
    .left {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 798px;
      border-bottom: 1px solid #000;
      border-right: 1px solid #000;
      text-align: center;
    }
    .right {
      
      height: 800px;
    }
  }
}
.lasth {
  height: 370px;
  border:2px solid #000;
  border-bottom: 1px solid #000;
  border-top:2px solid #000;;
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
      p{
     
        display: inline-block;
      }
  }
  .diagnosis{
    display: inline-block;
    width: 60px;
    height: 20px;
    margin-left: 10px;
    margin-top: 20px;

  }
  .result{
    display: inline-block;
    text-decoration:underline;
    line-height:20px;
    padding-left: 10px;
    

  } 
  p{
    width: 500px;
    display: inline-block;
    margin-top: 5px;
    margin-bottom: 5px;
    text-indent: 10px;
  }
}
.proposal {
  height: 100px;
  border-left:2px solid #000;
  border-right:2px solid #000;
  border-bottom: 2px solid #000;
  .left {
    height: 100px;
    line-height: 100px;
    text-align: center;
    border-right: 1px solid #000;
  }
  .right {
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
  display:inline-block;
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
.dentofacialInspect .other_group {
  .el-checkbox {
    width: 340px;
    text-align: left;
    margin-left: 10px;
    .el-checkbox__label {
      font-size: 16px;
    }
  }
}
.oralmucosadiagnosis label {
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
  .mytable_uptable{
    padding-right:25px;
    margin-top:16px;
    width:100%;
  }
  .mytable_downtable{
    padding-right:25px;
    margin-top:10px;
    width:100%;
  }
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
  margin: 70px 0 30px 0;
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
.table_box {
  display: flex;
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
<style scoped lang="less">

.add_line label {
  line-height: 20px;
  margin-bottom: 30px;
}
#physicalReport .el-dialog__header {
  /* height: 0px; */
  .el-dialog__title {
    font-size: 18px;
  }
}
#physicalReport .el-dialog__body {
  padding: 0px 20px;
}
#physicalReport .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  border: 7px solid red !important;
  background-color: transparent;
}
#physicalReport .el-checkbox__inner::after {
  border: 1px solid #000;
}
</style>
<style scoped>
#physicalReport .el-checkbox__inner.el-checkbox__inner::after {
  display: none;
}
@media screen and (max-width: 2000px) {

    #physicalReport div{
      font-size: 12px;
     
    }
    #physicalReport span{
      font-size: 12px;
     
    }
    #physicalReport p{
      font-size: 12px;
     
    } 
    #physicalReport .physical_report {
      font-size: 18px;

    }
    #physicalReport .el-form-item__label{
      font-size: 12px;
     
    }       
}
</style>
