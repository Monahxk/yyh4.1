<!--
 * @Descripttion: 
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-11 09:00:12
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-13 15:57:39
 -->
<template>
  <div class="wrapper" id="workaddphysical" v-if="isShow.physical">
    <div class="wrapper--main">
      <ul class="header_wrap">
        <li>
          <span @click="backPhy">体检记录></span>
        </li>
        <li>
          <span>{{visb ? '新增体检' : '编辑体检'}}</span>
        </li>
      </ul>
      <main class="main">
        <div class="main-box">
          <el-form :label-width="labelWidth">
            <el-row>
              <el-col :span="12">
                <el-form-item label="体检日期" :required="true">
                  <el-date-picker
                    v-model="sendData.physicalExaminationDate"
                    value-format="yyyy-MM-dd hh:mm:ss"
                    type="date"
                    size="small"
                    placeholder="选择日期"
                  ></el-date-picker>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="检查医生" :label-width="labelWidth" :required="true">
                  <el-select v-model="sendData.doctorId" placeholder="检查医生" size="small">
                    <el-option
                      v-for="(item,index) in doctorlist"
                      :key="index"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="主述" :label-width="labelWidth" :required="true">
                  <el-input v-model="sendData.chiefComplaint" size="small" maxlength="190"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col>
                <el-form-item label="既往史" :label-width="labelWidth" :required="true">
                  <el-input v-model="sendData.pastHistory" size="small" maxlength="190"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="口腔颌面部检查" :label-width="labelWidth" :required="true">
                  <el-checkbox-group v-model="sendData.dentofacialInspect" class="other_group">
                    <el-checkbox label="1" name="type" style>口腔颌面正常</el-checkbox>
                    <el-checkbox label="2" name="type">（头、颈）溃疡、疼痛、糜烂、裂纹</el-checkbox>
                    <el-checkbox label="3" name="type" class="ml0">（鼻、颊、颌）溃疡、疼痛、糜烂、裂纹</el-checkbox>
                    <el-checkbox label="4" name="type">（口、角）溃疡、疼痛、糜烂、裂纹</el-checkbox>
                    <el-checkbox label="5" name="type" class="ml0">（唇红缘）溃疡、疼痛、糜烂、裂纹</el-checkbox>
                    <el-checkbox label="6" name="type">上下唇畸形</el-checkbox>
                    <el-checkbox label="7" name="type" class="ml0">（头、颈）淋巴结肿大</el-checkbox>
                    <el-checkbox label="8" name="type">颌面部其他肿块</el-checkbox>
                    <el-checkbox label="9" name="type" class="ml0">其他异常</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="诊断" :label-width="labelWidth" :required="true">
                  <el-input v-model="sendData.dentofacialDiagnosis" size="small" maxlength="250"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-form-item label="口腔黏膜检查" :label-width="labelWidth" :required="true">
                <el-checkbox-group v-model="sendData.oralMucosaInspect">
                  <el-checkbox label="1" name="type">无异常</el-checkbox>
                  <el-checkbox label="2" name="type">口腔癌</el-checkbox>
                  <el-checkbox label="3" name="type">白斑</el-checkbox>
                  <el-checkbox label="4" name="type">扁平苔藓</el-checkbox>
                  <el-checkbox label="5" name="type">溃疡</el-checkbox>
                  <el-checkbox label="6" name="type">急性坏死性龈炎</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="诊断" :label-width="labelWidth" :required="true">
                  <el-input v-model="sendData.oralMucosaDiagnosis" size="small" maxlength="230"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 需要打对勾的表格 -->
            <el-form-item label="牙周及牙体牙髓检查" :label-width="labelWidth" :required="true">
              <el-row>
                <el-col :span="24">
                  <div class="my_table">
                    <table style="paddingRight:25px;marginTop:50px;width:100%;">
                      <tr style="width:100px;">
                        <th v-for="(item,index) of upTitle" :key="index">
                          <span>{{item}}</span>
                        </th>
                      </tr>
                      <tr v-for="(item,index) in newDataList" :key="index">
                        <td style="width:250px;textAlign:center;">{{item.title}}</td>
                        <td class="tds" v-for="(val,num) in item.data" :key="num">
                          <el-popover
                            placement="top-start"
                            width="320"
                            trigger="hover"
                            popper-class="suspension"
                            v-model="val.is"
                            transition="none"
                          >
                            <ul class="options">
                              <li
                                v-for="(v, index) in selectData"
                                :key="index"
                                @click="handelTableFn(item,val, index,num, 0,v, $event)"
                              >{{v}}</li>
                            </ul>
                            <span slot="reference" class="popover_btn">{{val.text}}</span>
                          </el-popover>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <el-row>
                    <el-col>
                      <el-form-item style="marginBottom:20px;" label="其他" class="add_line width0">
                        <el-input
                          class="ml0"
                          type="textarea"
                          :rows="2"
                          placeholder="请输入内容"
                          v-model="sendData.maxRemark"
                          maxlength="230"
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="阳性体征现病史" class="add_line width0">
                        <el-input
                          class="ml0"
                          type="textarea"
                          :rows="2"
                          placeholder="请输入内容"
                          v-model="sendData.maxPositiveSignHistory"
                          maxlength="230"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col>
                      <el-radio-group v-model="sendData.maxProbingDepth">
                        <el-radio label="1">上颌探诊深度所有牙<=4mm</el-radio>
                        <el-radio label="2">探诊深度任意牙 > 4mm: 详见牙周探诊记录表</el-radio>
                      </el-radio-group>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>

              <!-- 需要打对勾的表格 -->
              <el-row>
                <el-col :span="24">
                  <div class="my_table">
                    <table style="paddingRight:25px;marginTop:50px;width:100%;">
                      <tr style="width:100px;">
                        <th v-for="(item,index) of downTitle" :key="index">
                          <span>{{item}}</span>
                        </th>
                      </tr>

                      <tr v-for="(item,index) in copyDataList" :key="index">
                        <td style="width:250px;textAlign:center;">{{item.title}}</td>
                        <td class="tds" v-for="(val,num) in item.data" :key="num">
                          <el-popover
                            placement="top-start"
                            width="320"
                            trigger="hover"
                            popper-class="suspension"
                            v-model="val.is"
                            transition="none"
                          >
                            <ul class="options">
                              <li
                                v-for="(v, index) in selectData"
                                :key="index"
                                @click="handelTableFn1(item,val, index,num, 1,v, $event)"
                              >{{v}}</li>
                            </ul>
                            <span slot="reference" class="popover_btn">{{val.text}}</span>
                          </el-popover>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <el-row>
                    <el-col>
                      <el-form-item style="marginBottom:20px;" label="其他" class="add_line width0">
                        <el-input
                          class="ml0"
                          type="textarea"
                          :rows="2"
                          placeholder="请输入内容"
                          v-model="sendData.subRemark"
                          maxlength="230"
                        ></el-input>
                      </el-form-item>

                      <el-form-item label="阳性体征现病史" class="add_line width0">
                        <el-input
                          class="ml0"
                          type="textarea"
                          :rows="2"
                          placeholder="请输入内容"
                          v-model="sendData.subPositiveSigHistory"
                          maxlength="230"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col>
                      <el-radio-group v-model="sendData.subProbingDepth">
                        <el-radio label="0">下颌探诊深度所有牙<=4mm</el-radio>
                        <el-radio label="1">探诊深度任意牙 > 4mm: 详见牙周探诊记录表</el-radio>
                      </el-radio-group>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-form-item>

            <el-form-item label="其他口腔情况" :label-width="labelWidth" :required="true">
              <el-row>
                <el-col :span="24">
                  <el-checkbox-group v-model="sendData.otherCavityConditions" class="other_group">
                    <el-checkbox label="1" name="type">轻度牙颌畸形（轻度牙列拥挤或空隙）</el-checkbox>
                    <el-checkbox label="2" name="type">中度牙颌畸形（中度牙列拥挤或空隙）</el-checkbox>
                    <el-checkbox label="3" name="type" class="ml0">中度牙颌畸形（重度牙列拥挤或空隙，反颌，开颌等）</el-checkbox>
                    <el-checkbox label="4" name="type">有颞下颌关节疼痛，弹响等</el-checkbox>
                    <el-checkbox label="5" name="type" class="ml0">有急需处理的疼痛，感染等</el-checkbox>
                  </el-checkbox-group>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-row>
                    <el-col>
                      <el-form-item label="智齿情况" class="width0 add_line" style="margin-bottom: 30px;">
                        <el-input
                          type="textarea"
                          :rows="2"
                          placeholder="请输入内容"
                          v-model="sendData.wisdomToothConditions"
                          maxlength="90"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col>
                      <el-form-item label="全景片描述" class="width0 add_line" style="margin-bottom: 30px;">
                        <el-input
                          type="textarea"
                          :rows="2"
                          placeholder="请输入内容"
                          v-model="sendData.panoramicDescription"
                          maxlength="90"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col>
                      <el-form-item label="其他补充情况" class="width0 add_line" style="margin-bottom: 10px;">
                        <el-input
                          type="textarea"
                          :rows="2"
                          placeholder="请输入内容"
                          v-model="sendData.supplementarySituation"
                          maxlength="90"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-form-item>

            <el-form-item label="医生建议">
              <el-input
                type="textarea"
                maxlength="240"
                :rows="2"
                placeholder="请输入内容"
                v-model="sendData.doctorAdvice"
              ></el-input>
            </el-form-item>
          </el-form>

        </div>
        <div class="footer-box">
          <ul class="btns_wrap">
            <li>
              <el-button @click="handleSave" type="primary">保存</el-button>
            </li>
            <li>
              <el-button @click="handleSavePrinting">保存并打印</el-button>
            </li>
            <li>
              <el-button @click="backPhy">取消</el-button>
            </li>
          </ul>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import monment from "moment";
import { mapState } from "vuex";
import { SYSTEM_HTTP_SUCCESS } from "@/constant";
import {
  saveorupdatephysicalexamination,
  updatephysicalexamination,
  doctorlist,
  patientlist,
  getPatientlists
} from "@/api";
export default {
  components: {  },
  props: ["isShow", "datas", "visb"],
  data() {
    return {
      labelWidth: "130px",
      editOnOff: true,
      resetData: {
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
        maxRemark: "",
        subRemark: "",
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
        doctor: {
          id: ''
        },
        patient: {
          id: ''
        }
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
        maxRemark: "", // 上颌其他
        subRemark: "", // 下颌其他
        submaxilaryTable: "", //   下颌检查表格（同上颌）
        subPositiveSigHistory: "", // 下颌阳性体征现病史
        subProbingDepth: "", // 下颌探诊深度
        otherCavityConditions: [], // 其他空腔情况
        wisdomToothConditions: "", // 智齿情况
        panoramicDescription: "", // 全景片描述
        supplementarySituation: "", // 补充情况
        doctorAdvice: "",
        jumpPrinting: false,
        doctor: {
          id: ''
        },
        patient: {
          id: ''
        }
      },
      // 顶部title
      upTitle: ["上颌", 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27],
      downTitle: [
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
      newDataList: [],
      copyDataList: [],
      restaurants: [],
      doctorlist: [],
      patientName: "",
      physicalExaminationDate: "",
      doctorId: "",
      stateDatas: {}
    };
  },
  watch: {
    "isShow.physical"() {
      if (this.isShow.physical) {
        this.close();
        this.openGetData();
      } else {
        this.datas.edit = null;
      }
    },
    patientId: {
      handler(val) {
        this.sendData.patientId = val;
      },
      immediate: true
    }
  },
  computed: mapState({
    patientId: state => state.signal.patientId
  }),
  mixins: [],
  methods: {
    backPhy() {
      this.$emit("showFn", false);
      this.isShow.physical = false;
    },
    close() {
      this.sendData = JSON.parse(JSON.stringify(this.resetData));
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
    handleSavePrinting() {
      this.jumpPrinting = true;
      this.handleSave();
    },
    handelTableFn(item, val, index, num, state, v, e) {
      let nums = this.newDataTtle[num];
      let title = item.title;
      let keys = nums + title;
      let vals = nums + ":" + title + ":" + v;
      val.text = v;
      if (!state) {
        this.stors.push(vals);
      } else {
        this.copyStors.push(vals);
      }

      val.is = false;
    },
    handelTableFn1(item, val, index, num, state, v, e) {
      let nums = this.downNewDataTtle[num];
      let title = item.title;
      let keys = nums + title;
      let vals = nums + ":" + title + ":" + v;
      val.text = v;
      if (!state) {
        this.stors.push(vals);
      } else {
        this.copyStors.push(vals);
      }

      val.is = false;
    },
    sublimt() {},
    openGetData() {
      if (this.visb) {
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
            item.data.push({ show: false, text: "", is: false });
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
        // 获取医生列表回填id
        doctorlist().then(res => {
          
          this.doctorlist = res.data.data;
          this.sendData.doctorId = this.datas.data.physicalExamination.doctor.id;
        });
        // 点击编辑时数据回填
        this.sendData.patientId = this.datas.data.physicalExamination.patient.id;
        this.sendData.doctorId = this.datas.data.physicalExamination.doctor.id;

        this.sendData.physicalExaminationDate = this.getTime(
          this.datas.data.physicalExamination.physicalExaminationDate
        ); //体检时间
        this.sendData.chiefComplaint = this.datas.data.physicalExamination.chiefComplaint; //主述
        this.sendData.pastHistory = this.datas.data.physicalExamination.pastHistory; //即往史
        // 口腔颌面部检查
        if (this.datas.data.physicalExamination.dentofacialInspect.length > 1) {
          this.sendData.dentofacialInspect = this.datas.data.physicalExamination.dentofacialInspect.split(
            ","
          );
        } else {
          this.sendData.dentofacialInspect.push(
            this.datas.data.physicalExamination.dentofacialInspect
          );
        }
        this.sendData.dentofacialDiagnosis = this.datas.data.physicalExamination.dentofacialDiagnosis; //诊断
        //口腔黏膜检查
        if (this.datas.data.physicalExamination.oralMucosaInspect.length > 1) {
          this.sendData.oralMucosaInspect = this.datas.data.physicalExamination.oralMucosaInspect.split(
            ","
          );
        } else {
          this.sendData.oralMucosaInspect.push(
            this.datas.data.physicalExamination.oralMucosaInspect
          );
        }
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

        if (
          this.datas.data.physicalExamination.otherCavityConditions.length > 1
        ) {
          this.sendData.otherCavityConditions = this.datas.data.physicalExamination.otherCavityConditions.split(
            ","
          );
        } else {
          this.sendData.otherCavityConditions.push(
            this.datas.data.physicalExamination.otherCavityConditions
          );
        }
        this.sendData.maxRemark = this.datas.data.physicalExamination.maxRemark;
        this.sendData.subRemark = this.datas.data.physicalExamination.subRemark;
        this.sendData.wisdomToothConditions = this.datas.data.physicalExamination.wisdomToothConditions;
        this.sendData.panoramicDescription = this.datas.data.physicalExamination.panoramicDescription;
        this.sendData.supplementarySituation = this.datas.data.physicalExamination.supplementarySituation;
        this.sendData.doctorAdvice = this.datas.data.physicalExamination.doctorAdvice;
        this.sendData.textarea = this.datas.data.physicalExamination.doctorAdvice;
      }
    },
    getTime(t) {
      return monment(t).format("YYYY-MM-DD HH:mm:ss");
    },
    handleSave() {
      this.sendData.patientId = this.$store.state.signal.patientId;
      if (checkData(this)) {
        let _D = JSON.parse(JSON.stringify(this.resetData));
        this.sendData.dentofacialInspect = this.sendData.dentofacialInspect.toString();
        this.sendData.oralMucosaInspect = this.sendData.oralMucosaInspect.toString();
        this.sendData.otherCavityConditions = this.sendData.otherCavityConditions.toString();
        this.sendData.maxillaryTable = this.stors.join();
        this.sendData.submaxilaryTable = this.copyStors.join();
        this.sendData.doctor.id = this.sendData.doctorId;
        this.sendData.patient.id = this.sendData.patientId;
        delete this.sendData["patientId"];
        delete this.sendData["doctorId"];
        if (this.datas.edit) {
          this.sendData.id = this.datas.id;
          updatephysicalexamination(this.sendData).then(res => {
            if (res.data.code === SYSTEM_HTTP_SUCCESS) {
              this.saveEndInit(res);
            } 
          });
        } else {
          saveorupdatephysicalexamination(this.sendData).then(res => {
            if (res.data.code === SYSTEM_HTTP_SUCCESS) {
              this.saveEndInit(res);
            } 
          });
        }

      }
    },
    saveEndInit(res) {
      if (this.datas.edit) {
        this.close();
        this.$emit("showFn", false);
        this.datas.edit = null;
        if (this.jumpPrinting) {
          this.$emit("printing", res.data.data);
          this.jumpPrinting = false;
          this.close();
          this.datas.edit = null;
        }
        this.$emit("showFn", false);
        this.isShow.physical = false;
      } else {
        this.close();
        this.$emit("showFn", false);
        this.isShow.physical = false;

        if (this.jumpPrinting) {
          this.$emit("printing", res.data.data);
          this.jumpPrinting = false;
          this.close();
        }
        this.$emit("showFn", false);
        this.isShow.physical = false;
      }

      this.$emit("init");
    },
    querySearch(queryString, cb) {
      getPatientlists(this.patientName).then(res => {
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
    }
  }
};
function checkData(v) {
  let cd = false;
  if (v.sendData.physicalExaminationDate != "") {
    cd = true;
  } else {
    cd = false;
    v.open("体检日期不能为空！", "warning");
    return cd;
  }
  if (v.sendData.patientId != "") {
    cd = true;
  } else {
    cd = false;
    v.open("患者不能为空！", "warning");
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
  if (v.sendData.pastHistory !== "") {
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
  if (v.sendData.dentofacialDiagnosis !=="") {
    cd = true;
  } else {
    cd = false;
    v.open("请填写诊断！", "warning");
    return cd;
  }
  if (v.sendData.oralMucosaInspect.length > 0) {
    cd = true;
  } else {
    cd = false;
    v.open("请勾选口腔黏膜检查！", "warning");
    return cd;
  }
  if (v.sendData.oralMucosaDiagnosis !=="") {
    cd = true;
  } else {
    cd = false;
    v.open("请填写诊断！", "warning");
    return cd;
  }
  if (v.stors.length > 0) {
    cd = true;
  } else {
    cd = false;
    v.open("请勾选上颌检查！", "warning");
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
  return cd;
}
</script>
<style lang="less" scoped>
/deep/.el-tab-pane {
  height: 100%;
}
#workaddphysical {
  display: block;
  .wrapper--main {
    height: 100%;
  }
  .main {
    height: calc(100% - 65px);
    position: relative;
    padding-bottom: 60px;
    .main-box {
      padding: 10px 20px 0 10px;
      height: 100%;
      overflow-y: scroll;
    }
  }
  .footer-box {
    position: absolute;
    bottom: 10px;
  }
  .main::-webkit-scrollbar {
    width: 2px;
    height: 2px;
    background: #ccc;
    border-radius: 1px;
  }
  .main::-webkit-scrollbar-thumb {
    display: block;
    width: 1px;
    margin: 0 auto;
    border-radius: 1px;
    background: #3b78fd;
  }
  .header_wrap {
    padding-bottom: 30px;
    display: flex;
    align-items: center;
    justify-content: start;
    li:nth-child(1) {
      font-size: 18px;
      padding-left: 10px;
      cursor: pointer;
      font-size: 18px;
    }
    li:nth-child(2) {
      cursor: pointer;
      width: 88px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      font-size: 16px;
      color: #3b78fd;
    }
  }
  .imgs {
    width: 36px;
    height: 39px;
  }
  .tds > span {
    display: block;
    height: 100%;
    text-align: center;
  }
  .popover_btn {
    display: block;
    height: 100%;
  }
  .options {
    width: 400px;
    text-align: center;
    height: 40px;
    background: #fff;
    li {
      width: 40px;
      text-align: center;
      height: 40px;
      line-height: 40px;
      cursor: pointer;
      &:hover {
        color: #3b78fd;
        background: #eee;
      }
    }
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
  .addPatient {
    cursor: pointer;
    background: #3b78fd;
    width: 80px;
    height: 32px;
    color: #fff;
    line-height: 32px;
    text-align: center;
  }
  .tds {
    width: 38px;
    height: 41px;
  }
  .titles {
    padding: 10px 0 10px 20px;
    background: #e4e9ff;
    margin-bottom: 20px;
  }
  .other_group {
    .el-checkbox {
      width: 360px;
    }
  }
  .my_table {
    width: 100%;
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
    li {
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
}
</style>
<style scoped lang="less">
.suspension {
}
.ml0 {
  margin-left: 0 !important;
}
.width0 .el-form-item__label {
  width: auto !important;
}
.width0 .el-form-item__content {
  margin-left: 110px !important;
}
.suspension {
  position: relative;
}
.suspension .options {
  justify-content: space-between;
  display: flex;
  position: relative;
  background: #fff;
  cursor: pointer;
}
.suspension .options li {
  width: 40px;
  text-align: center;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
}
.suspension .options li:hover {
  color: #3b78fd;
  background: #eee;
}
/deep/.add_line {
  /deep/.el-form-item__label {
    line-height: 54px !important;
    text-align: left !important;
  }
}

/* @media screen and (max-width: 2000px) {
  #addphysical div {
    font-size: 12px;
  }
  #addphysical span {
    font-size: 12px;
  }
  #addphysical p {
    font-size: 12px;
  }
  #addphysical .el-form-item__label {
    font-size: 12px;
  }
  #addphysical .el-dialog__title {
    font-size: 18px;
  }
} */
</style>