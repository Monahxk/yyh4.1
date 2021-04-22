<!--
@Author: ZJZ
@Date:   2019-08-01
@Filename: addphysical.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-07
-->

<template>
  <div class="wrapper" id="addphysical">
    <div>
      <el-dialog
        :title="datas.edit ? '体检详情' :'新增体检'"
        :visible.sync="isShow.register"
        width="960px"
        :close-on-click-modal="false"
        @open="openGetData"
      >
        <div>
          <el-form label-width="106px">
            <el-row class="select-pat-box">
              <el-col :span="8">
                <el-form-item label-width="20px">
                  <el-autocomplete
                    :disabled="editOnOff"
                    style="width:280px"
                    popper-class="my-autocomplete"
                    v-model="patientName"
                    :trigger-on-focus="false"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入患者姓名"
                    @select="handleSelect"
                    size="small"
                  >
                    <i class="el-icon-edit el-input__icon" slot="suffix" @click="handleIconClick"></i>
                    <template slot-scope="{ item }">
                      <div class="name_box">
                        <span>{{ item.patientName }}</span>
                      </div>
                    </template>
                  </el-autocomplete>
                </el-form-item>
              </el-col>
              <el-col :span="3" style="marginTop:4px;">
                <div class="addPatient" v-if="false">新建患者</div>
              </el-col>
            </el-row>

            <el-row class="select-pat-det">
              <el-col :span="5">
                <el-form-item label="患者：">
                  <span>{{stateDatas.patientName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="病历号：">
                  <span>{{stateDatas.emrNo}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="手机号：">
                  <span>{{stateDatas.mobilephone}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <div class="titles">
            <span>体检信息</span>
          </div>

          <el-form label-width="106px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="体检日期" :required="true">
                  <el-date-picker
                    :disabled="editOnOff"
                    v-model="sendData.physicalExaminationDate"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="date"
                    size="small"
                    placeholder="选择日期"
                  ></el-date-picker>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="检查医生" :required="true">
                  <el-select
                    v-model="sendData.doctorId"
                    placeholder="检查医生"
                    :disabled="editOnOff"
                    size="small"
                  >
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
                <el-form-item label="主述" :required="true">
                  <el-input
                    v-model="sendData.chiefComplaint"
                    size="small"
                    :disabled="editOnOff"
                    maxlength="190"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col>
                <el-form-item label="即往史" :required="true">
                  <el-input
                    v-model="sendData.pastHistory"
                    size="small"
                    :disabled="editOnOff"
                    maxlength="190"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="口腔颌面部检查" :required="true">
                  <el-checkbox-group
                    v-model="sendData.dentofacialInspect"
                    :disabled="editOnOff"
                    class="other_group"
                  >
                    <el-checkbox label="1" name="type">口腔颌面正常</el-checkbox>
                    <el-checkbox label="2" name="type">（头、颈）溃疡、疼痛、糜烂、裂纹</el-checkbox>
                    <el-checkbox label="3" name="type">（鼻、颊、颌）溃疡、疼痛、糜烂、裂纹</el-checkbox>
                    <el-checkbox label="4" name="type">（口、角）溃疡、疼痛、糜烂、裂纹</el-checkbox>
                    <el-checkbox label="5" name="type">（唇红缘）溃疡、疼痛、糜烂、裂纹</el-checkbox>
                    <el-checkbox label="6" name="type">上下唇畸形</el-checkbox>
                    <el-checkbox label="7" name="type">（头、颈）淋巴结肿大</el-checkbox>
                    <el-checkbox label="8" name="type">颌面部其他肿块</el-checkbox>
                    <el-checkbox label="9" name="type">其他异常</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="诊断" label-width="150px" :required="true">
                  <el-input
                    v-model="sendData.dentofacialDiagnosis"
                    size="small"
                    :disabled="editOnOff"
                    maxlength="250"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-form-item label="口腔黏膜检查" :required="true">
                <el-checkbox-group v-model="sendData.oralMucosaInspect" :disabled="editOnOff">
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
                <el-form-item label="诊断" label-width="150px" :required="true">
                  <el-input
                    v-model="sendData.oralMucosaDiagnosis"
                    size="small"
                    :disabled="editOnOff"
                    maxlength="230"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 需要打对勾的表格 -->
            <el-form-item label="牙周及牙体牙髓检查" :required="true">
              <el-row>
                <el-col :span="24">
                  <div class="table_box">
                    <table class="table" style>
                      <tr style="width:100px;">
                        <th v-for="(item,index) of tableTitle" :key="index">
                          <span :class="{'table-span-color': item == '上颌'}">{{item}}</span>
                        </th>
                      </tr>
                      <tr v-for="(item,index) in newDataList" :key="index">
                        <td class="table_head" style>{{item.title}}</td>
                        <td
                          class="tds"
                          v-for="(val,num) in item.data"
                          :key="num"
                          @click="openUpPopup(val)"
                          style="positon:relative"
                        >
                          <div class="popover_boxs" style="positon:relative">
                            <ul class="options" v-show="val.is">
                              <li
                                v-for="(v, index) in selectData"
                                :key="index"
                                @click.stop="handelTableFn(item,val, index,num, 0,v, $event)"
                              >{{v}}</li>
                            </ul>
                            <span
                              slot="reference"
                              class="popover_btn"
                              style="textAlign:center;"
                            >{{val.text}}</span>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <el-row>
                    <el-col>
                      <el-form-item style="marginBottom:20px;" label="其他" class="add_line">
                        <el-input
                          :disabled="editOnOff"
                          type="textarea"
                          :rows="2"
                          placeholder="请输入内容"
                          v-model="sendData.maxRemark"
                          maxlength="230"
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="阳性体征现病史" class="add_line">
                        <el-input
                          :disabled="editOnOff"
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
                      <el-radio-group v-model="sendData.maxProbingDepth" :disabled="editOnOff">
                        <el-radio label="1">上颌探诊深度所有牙<=4mm</el-radio>
                        <el-radio label="2">探诊深度任意牙 > 4mm: 详见牙周探诊记录表</el-radio>
                      </el-radio-group>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>

              <!-- 需要打对狗的表格 -->
              <el-row>
                <el-col :span="24">
                  <div class="my_table">
                    <table class="table" :disabled="editOnOff">
                      <tr style="width:100px;">
                        <th v-for="(item,index) of tableTitle1" :key="index">
                          <span :class="{'table-span-color': item == '下颌'}">{{item}}</span>
                        </th>
                      </tr>
                      <tr v-for="(item,index) in copyDataList" :key="index">
                        <td class="table_head">{{item.title}}</td>
                        <td
                          class="tds"
                          v-for="(val,num) in item.data"
                          :key="num"
                          style="positon:relative"
                          @click="openUpPopup(val)"
                        >
                          <div class="popover_boxs" style="positon:relative">
                            <ul class="options" v-show="val.is">
                              <li
                                v-for="(v, index) in selectData"
                                :key="index"
                                @click.stop="handelTableFn1(item,val, index,num, 1,v, $event)"
                              >{{v}}</li>
                            </ul>
                            <span
                              slot="reference"
                              class="popover_btn"
                              style="textAlign:center;"
                            >{{val.text}}</span>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <el-row>
                    <el-col>
                      <el-form-item style="marginBottom:20px;" label="其他" class="add_line">
                        <el-input
                          :disabled="editOnOff"
                          type="textarea"
                          :rows="2"
                          placeholder="请输入内容"
                          v-model="sendData.subRemark"
                          maxlength="230"
                        ></el-input>
                      </el-form-item>

                      <el-form-item label="阳性体征现病史" class="add_line">
                        <el-input
                          :disabled="editOnOff"
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
                      <el-radio-group v-model="sendData.subProbingDepth" :disabled="editOnOff">
                        <el-radio label="0">下颌探诊深度所有牙<=4mm</el-radio>
                        <el-radio label="1">探诊深度任意牙 > 4mm: 详见牙周探诊记录表</el-radio>
                      </el-radio-group>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-form-item>

            <el-form-item label="其他口腔情况" :required="true">
              <el-row>
                <el-col :span="24">
                  <el-checkbox-group
                    v-model="sendData.otherCavityConditions"
                    class="other_group"
                    :disabled="editOnOff"
                  >
                    <el-checkbox label="1" name="type">轻度牙颌畸形（轻度牙列拥挤或空隙）</el-checkbox>
                    <el-checkbox label="2" name="type">中度牙颌畸形（中度牙列拥挤或空隙）</el-checkbox>
                    <el-checkbox label="3" name="type">中度牙颌畸形（重度牙列拥挤或空隙，反颌，开颌等）</el-checkbox>
                    <el-checkbox label="4" name="type">有颞下颌关节疼痛，弹响等</el-checkbox>
                    <el-checkbox label="5" name="type">有急需处理的疼痛，感染等</el-checkbox>
                  </el-checkbox-group>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-row>
                    <el-col>
                      <el-form-item label="智齿情况" style="margin-bottom: 30px;">
                        <el-input
                          :disabled="editOnOff"
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
                      <el-form-item label="全景片描述" style="margin-bottom: 30px;">
                        <el-input
                          :disabled="editOnOff"
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
                      <el-form-item label="其他补充情况" style="margin-bottom: 10px;">
                        <el-input
                          :disabled="editOnOff"
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
                :disabled="editOnOff"
              ></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="8" :offset="11">
                <el-form-item label="检查医生签名:"></el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <ul class="btns_wrap">
              <li @click="handleSave" v-if="!editOnOff" style="background:#3b78fd;color:#fff;">
                <span>保存</span>
              </li>
              <li @click="handleSavePrinting" v-if="!editOnOff">
                <span>保存并打印</span>
              </li>
              <li
                v-if="datas.edit"
                @click="editOnOff=!editOnOff"
                style="background:#3b78fd;color:#fff;"
              >
                <span>编辑</span>
              </li>
              <li @click="close">
                <span>取消</span>
              </li>
            </ul>
          </div>
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
  getPatientlists,
  updatephysicalexamination
} from "@/api";
export default {
  components: {},
  props: ["isShow", "datas", "visb"],
  data() {
    return {
      editOnOff: false,
      initData: {
        patientId: "", // 患者的ID
        patient:{id:''}, // 患者的ID
        doctor:{id:''}, // 患者的ID
        physicalExaminationDate: "", // yy-mm-dd hh:mm
        doctorId: "", // 医生的id
        chiefComplaint: "", // 主述
        pastHistory: "", // 既往史
        dentofacialInspect: [], // 口腔颌面部检查
        dentofacialDiagnosis: "", // 口腔颌面部诊断
        oralMucosaInspect: [], // 口腔黏膜检查
        oralMucosaDiagnosis: "", // 口腔黏膜诊断
        maxillaryTable: "", // 上颌检查表格 注：每个坐标用“,”隔开 (16:松弛度,14:附着丧失)
        maxRemark: "", // 上颌其他
        subRemark: "", // 下颌其他
        maxPositiveSignHistory: "", // 上颌阳性体征现病史
        maxProbingDepth: "", // 上颌探诊深度
        submaxilaryTable: "", //   下颌检查表格（同上颌）
        subPositiveSigHistory: "", // 下颌阳性体征现病史
        subProbingDepth: "", // 下颌探诊深度
        otherCavityConditions: [], // 其他空腔情况
        wisdomToothConditions: "", // 智齿情况
        panoramicDescription: "", // 全景片描述
        supplementarySituation: "", // 补充情况
        doctorAdvice: ""
      },
      selectData: ["√", "|°", "||°", "|||°", "+", "++", "+++", ""],
      sendData: {
        patientId: "", // 患者的ID
        patient:{id:''}, // 患者的ID
        doctor:{id:''}, // 患者的ID
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
        onOffPrint: false
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
      textarea: "",
      doctorlist: [],
      patientName: "",
      chiefComplaint: "",
      pastHistory: "",
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
      stateDatas: {}
    };
  },
  mounted() {},
  watch: {
    "isShow.register"() {
      if (!this.isShow.register) {
        this.close();
      }
    }
  },
  computed: {},
  mixins: [],
  methods: {
    // 這個是新增的
    openUpPopup(val) {
      if (!this.editOnOff) {
        this.newDataList.map(data => {
          data.data.map(v => {
            v.is = false;
          });
        });
        val.is = true;
      }
    },
    openDownPopup(val) {
      if (!this.editOnOff) {
        this.copyDataList.map(data => {
          data.data.map(v => {
            v.is = false;
          });
        });
        val.is = true;
      }
    },
    close() {
      this.sendData = JSON.parse(JSON.stringify(this.initData));
      this.isShow.register = false;
      this.stateDatas = {};
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
      this.onOffPrint = true;
      this.handleSave();
    },
    handelTableFn(item, val, index, num, state, v, e) {
      val.is = false;
      if (!this.editOnOff) {
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
      }
    },
    handelTableFn1(item, val, index, num, state, v, e) {
      val.is = false;
      if (!this.editOnOff) {
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
      }
    },
    sublimt() {},
    openGetData() {
      doctorlist().then(res => {
        let Data = res.data.data || [];
        this.doctorlist = Data.map(item => {
          item.id = Number(item.id);
          return item;
        });
      });
      if (this.visb) {
        this.editOnOff = false;
        let arr = [];
        let arr1 = [];
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
            item.data.push({ show: false, text: "", is: false });
          });
        });
        this.downNewDataTtle.map((val, index) => {
          arr1.map(item => {
            item.data.push({ show: false, text: "", is: false });
          });
        });

        this.newDataList = arr;
        this.copyDataList = arr1;
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
            item.data.push({ show: false, vals: val, text: "", is: "" });
          });
        });
        this.downNewDataTtle.map((val, index) => {
          arr1.map(item => {
            item.data.push({ show: false, vals: val, text: "", is: "" });
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

        // 用户信息回填 // 点击编辑时数据回填
        Object.assign(
          this.stateDatas,
          this.datas.data.physicalExamination.patient
        );
        // this.stateDatas.patientName = this.datas.data.physicalExamination.patient.patientName;
        // this.stateDatas.emrNo = this.datas.data.physicalExamination.patient.emrNo;
        // this.stateDatas.telephone = this.datas.data.physicalExamination.patient.mobilphone;
        this.sendData.patientId = this.datas.data.physicalExamination.patient.id;
        if (this.datas.data.physicalExamination.doctor) {
          this.sendData.doctorId = Number(
            this.datas.data.physicalExamination.doctor.id
          );
        } else {
          this.sendData.doctorId = "";
        }

        this.sendData.physicalExaminationDate = this.getTime(
          this.datas.data.physicalExamination.physicalExaminationDate
        ); //体检时间
        this.sendData.chiefComplaint = this.datas.data.physicalExamination.chiefComplaint; //主述
        this.sendData.pastHistory = this.datas.data.physicalExamination.pastHistory; //即往史
        // 口腔颌面部检查
        // if (this.datas.data.physicalExamination.dentofacialInspect.length > 1) {
        //   this.sendData.dentofacialInspect = this.datas.data.physicalExamination.dentofacialInspect.split(
        //     ","
        //   );
        // } else {
        //   this.sendData.dentofacialInspect.push(
        //     this.datas.data.physicalExamination.dentofacialInspect
        //   );
        // }
        this.sendData.dentofacialInspect = this.datas.data.physicalExamination.dentofacialInspect.split(",");

        this.sendData.dentofacialDiagnosis = this.datas.data.physicalExamination.dentofacialDiagnosis; //诊断
        //口腔黏膜检查
        // if (this.datas.data.physicalExamination.oralMucosaInspect.length > 1) {
        //   this.sendData.oralMucosaInspect = this.datas.data.physicalExamination.oralMucosaInspect.split(
        //     ","
        //   );
        // } else {
        //   this.sendData.oralMucosaInspect.push(
        //     this.datas.data.physicalExamination.oralMucosaInspect
        //   );
        // }
        this.sendData.oralMucosaInspect = this.datas.data.physicalExamination.oralMucosaInspect.split(  ",");
        this.sendData.oralMucosaDiagnosis = this.datas.data.physicalExamination.oralMucosaDiagnosis; //诊断
        // 髓检查上颌
        // if (this.datas.data.physicalExamination.maxillaryTable.length > 1) {
        //   this.stors = this.datas.data.physicalExamination.maxillaryTable.split(
        //     ","
        //   );
        // } else {
        //   this.stors.push(this.datas.data.physicalExamination.maxillaryTable);
        // }
        this.stors = this.datas.data.physicalExamination.maxillaryTable.split(",");
        // 髓检查下颌
        // if (this.datas.data.physicalExamination.submaxilaryTable.length > 1) {
        //   this.copyStors = this.datas.data.physicalExamination.submaxilaryTable.split(
        //     ","
        //   );
        // } else {
        //   this.copyStors.push(
        //     this.datas.data.physicalExamination.submaxilaryTable
        //   );
        // }
        this.copyStors = this.datas.data.physicalExamination.submaxilaryTable.split(",");
        // 阳性体征现病史  s
        this.sendData.maxPositiveSignHistory = this.datas.data.physicalExamination.maxPositiveSignHistory;
        this.sendData.maxProbingDepth = this.datas.data.physicalExamination.maxProbingDepth;
        // 阳性体征现病史  x
        this.sendData.subPositiveSigHistory = this.datas.data.physicalExamination.subPositiveSigHistory;
        this.sendData.subProbingDepth = this.datas.data.physicalExamination.subProbingDepth;
        // 其他
        // if (
        //   this.datas.data.physicalExamination.otherCavityConditions.length > 1
        // ) {
        //   this.sendData.otherCavityConditions = this.datas.data.physicalExamination.otherCavityConditions.split(",");
        // } else {
        //   this.sendData.otherCavityConditions.push(
        //     this.datas.data.physicalExamination.otherCavityConditions
        //   );
        // }
        this.sendData.otherCavityConditions = this.datas.data.physicalExamination.otherCavityConditions.split(",");
        console.log(this.sendData.otherCavityConditions)

        this.sendData.maxRemark = this.datas.data.physicalExamination.maxRemark;
        this.sendData.subRemark = this.datas.data.physicalExamination.subRemark;
        this.sendData.wisdomToothConditions = this.datas.data.physicalExamination.wisdomToothConditions;
        this.sendData.panoramicDescription = this.datas.data.physicalExamination.panoramicDescription;
        this.sendData.supplementarySituation = this.datas.data.physicalExamination.supplementarySituation; //其他补充情况
        this.sendData.doctorAdvice = this.datas.data.physicalExamination.doctorAdvice;
        this.sendData.textarea = this.datas.data.physicalExamination.doctorAdvice; //检查医生签名
      }
    },
    getTime(t) {
      return monment(t).format("YYYY-MM-DD HH:mm:ss");
    },
    handleSave() {
      if (checkData(this)) {
        let _D = JSON.parse(JSON.stringify(this.initData));
        this.sendData.dentofacialInspect = this.sendData.dentofacialInspect.join(',');
        this.sendData.oralMucosaInspect = this.sendData.oralMucosaInspect.join(',');
        this.sendData.otherCavityConditions = this.sendData.otherCavityConditions.join(',');
        this.sendData.maxillaryTable = this.stors.join(',');
        this.sendData.submaxilaryTable = this.copyStors.join(',');

        this.sendData.patient.id = this.sendData.patientId;
        this.sendData.doctor.id = this.sendData.doctorId;
        // delete this.sendData["patientId"];
        // delete this.sendData["doctorId"];
        // 编辑就添加id   updatephysicalexamination

        if (this.datas.edit) {
          this.sendData.id = this.datas.id;
          updatephysicalexamination(this.sendData).then(res => {
            if (res.data.code === 200) {
              if (this.datas.edit) {
                this.close();
                if (this.onOffPrint) {
                  this.$emit("printing", res.data.data);
                  this.onOffPrint = false;
                }
              }

              this.$emit("init");
            }
          });
        } else {
          saveorupdatephysicalexamination(this.sendData).then(res => {
            if (res.data.code === 200) {
              this.close();

              if (this.onOffPrint) {
                this.$emit("printing", res.data.data);
                this.onOffPrint = false;
              }

              this.$emit("init");
            }
          });
        }
      }
    },
    handleIconClick() {},
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
    },
    getSelectData() {},
    handleSelect(val) {
      console.log(val);
      Object.assign(this.stateDatas, val);
      this.sendData.patientId = val.id;
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
  if (v.sendData.dentofacialDiagnosis !== "") {
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
  if (v.sendData.oralMucosaDiagnosis !== "") {
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
.table_head {
  width: 90px;
  text-align: center;
}
.imgs {
  width: 36px;
  height: 39px;
}
.tds {
  position: relative;
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
  position: absolute;
  top: -32px;
  width: 200px;
  display: flex;
  justify-content: space-between;
  text-align: center;
  height: 30px;
  background: #fff;
  li {
    width: 12.5%;
    line-height: 30px;
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
  background: #f7f9ff;
  margin-bottom: 20px;
  color: #493bfd;
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
.table_box {
  margin-bottom: 20px;
  display: flex;
  li,
  span {
    // padding: 10px;
  }
}
table {
  tr {
    border: 1px solid #dee9fb;
  }
  td {
    border: 1px solid #dee9fb;
  }
  tr {
    th {
      border: 1px solid #dee9fb;
      text-align: center;
    }
  }
}
.table {
  padding-right: 25px;
  width: 100%;
}
.my_table {
  margin-bottom: 30px;
}
/deep/.el-dialog__body {
  padding-top: 0;
}
.el-select {
  width: 220px;
}
.select-pat-box,
.select-pat-det {
  background: #f7f5f9;
  padding: 10px 0;
  .el-form-item {
    margin-bottom: 0;
  }
}
.select-pat-det {
  background: #fff;
}
.table-span-color {
  color: #1b1e25;
  font-weight: bold;
}
</style>
<style>
.add_line label {
  line-height: 20px;
  margin-bottom: 30px;
}

@media screen and (max-width: 2000px) {
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
}
</style>
