<template>
  <div class="wrapper" id="workbench_physicalList">
    <ul class="header_wrap">
      <li>
        <span>体检记录</span>
      </li>
      <li @click="add">
        <span class="btns">新增体检</span>
      </li>
    </ul>
    <div class="main" id="mains" style>
      <div v-if="phyData.length==0 && !isshowOther">
        <div class="main_bgbox">
          <p class="main_bg">
            <img src="../../../../assets/img/workbench/img_workbench_table_bg.png" alt>
          </p>
          <p class="other-msg" 
          v-if="otherInstitutionPhysicalExaminationList.length>0" 
          :class="{isactive: isshowOther}" 
          @click="showOther">
            <span>查看以往记录<i class="el-icon-arrow-down icon-arrow"></i></span>
          </p>
        </div>
      </div>
      <div class="physical_info" v-for="(item,index) in phyData" :key="index">
        <el-row>
          <el-col :span="3">
            <div class="time_left">
              <p>{{item.physicalExaminationDate}}</p>
            </div>
          </el-col>
          <el-col :span="21" class="list">
            <el-collapse accordion @change="handleChange(item)">
              <el-collapse-item>
                <template slot="title">
                  <el-row class="title">
                    <el-col :span="10">检查医生：{{item.doctorName}}</el-col>
                    <el-col @click="openMore(index)" class="open" :offset="8" :span="2">{{item.zk}}</el-col>
                    <el-col :span="4">
                      <span @click.stop="edit(item.id)" class="icon el-icon-edit"></span>
                      <span @click.stop="del(item.id)" class="icon el-icon-delete"></span>
                    </el-col>
                  </el-row>
                </template>
                <el-row class="major">
                  <el-col :span="23">
                    <span class="section_title">主诉：</span>
                    <span>{{item.chiefComplaint}}</span>
                  </el-col>
                </el-row>
                <el-row class="other_info">
                  <el-col :span="23">
                    <p>
                      <span class="section_title">既往史：</span>
                      <span>{{item.pastHistory}}</span>
                    </p>
                    <p>
                      <span class="section_title">口腔颌面部检查：</span>
                      <span>{{item.dentofacialInspectTxt}}}</span>
                    </p>
                    <p>
                      <span class="diagnosis">诊断:</span>
                      <span>{{item.dentofacialDiagnosis}}</span>
                    </p>
                    <p></p>
                    <p>
                      <span class="section_title">口腔粘膜检查：</span>
                      <span>{{item.oralMucosaInspectTxt}}</span>
                    </p>
                    <p>
                      <span class="diagnosis">诊断:</span>
                      <span>{{item.oralMucosaDiagnosis}}</span>
                    </p>
                    <p></p>
                    <p>
                      <span class="section_title">牙周及牙体牙髓检查（上颌）：</span>
                      <span>{{item.maxillaryTable}}</span>
                    </p>
                    <p>
                      <span class="section_title">上颌阳性体征现病史：</span>
                      <span>{{item.maxPositiveSignHistory}}</span>
                    </p>
                    <p>
                      <span class="section_title">上颌探诊深度：</span>
                      <span>{{maxProbingDepthArr[item.maxProbingDepth]}}</span>
                    </p>
                    <p>
                      <span class="section_title">牙周及牙体牙髓检查（下颌）：</span>
                      <span>{{item.submaxilaryTable}}</span>
                    </p>
                    <p>
                      <span class="section_title">下颌阳性体征现病史：</span>
                      <span>{{item.subPositiveSigHistory}}</span>
                    </p>
                    <p>
                      <span class="section_title">下颌探诊深度：</span>
                      <span>{{subProbingDepth[item.subProbingDepth]}}</span>
                    </p>
                    <p>
                      <span class="section_title">其他口腔情况：</span>
                      <span>{{item.otherCavityConditionsTxt}}</span>
                    </p>
                    <p>
                      <span class="section_title">医生建议：</span>
                      <span>{{item.doctorAdvice}}</span>
                    </p>
                    <div class="doctor">
                      <el-row>
                        <el-col :span="10">
                          <span
                            class="section_title"
                          >{{item.doctorName}}创建于 {{item.physicalExaminationDate}}</span>
                        </el-col>
                        <el-col :offset="10" :span="1">
                          <div class="printing" @click="printing(item.id)">打印</div>
                        </el-col>
                      </el-row>
                    </div>
                  </el-col>
                </el-row>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>
      </div>
      <div class="other-msg" v-if="otherInstitutionPhysicalExaminationList.length>0" :class="{isactive: isshowOther}" @click="showOther">
        <caseHistoryDetail :otherInstitutionPhysicalExaminationList="otherInstitutionPhysicalExaminationList" v-show="isshowOther"></caseHistoryDetail>
        <span>查看以往记录<i class="el-icon-arrow-down icon-arrow"></i></span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getPhysical,
  editphysicalexamination,
  deletephysicalexamination
} from "@/api";
import monment from "moment";
import { mapState } from "vuex";
import addphysical from "./addphysical.vue";
import physicalReport from "./physicalReport.vue";
import physicalDetail from "./../components/PhysicalDetail";
import { SYSTEM_HTTP_SUCCESS } from "@/constant";
export default {
  components: { physicalReport, addphysical },
  props: ["isShow", "propsPatientId",'physicalDetail'],
  data() {
    return {
      dialogVisible: false,
      show: true,
      leftup: "",
      leftdown: "",
      rightup: "",
      rightdown: "",
      committime: "",
      remark: "",
      stors: [],
      copyStors: [],
      // 渲染的数据
      newDataList: [],
      copyDataList: [],
      restaurants: [],
      doctorlist: [],
      pId: "",
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
      stateDatas: {},
      phyData: [],
      otherInstitutionPhysicalExaminationList: [],
      isShowDialog: {
        register: false,
        detail: false,
        physicalReport: false
      },
      editData: {
        id: "",
        data: [],
        edit: false
      },
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
      subProbingDepth: [
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
      ],
      isshowOther: false
    };
  },
  computed: mapState({
    patientsMsg: state => state.signal.patientsMsg,
    patientId: state => state.signal.patientId,
    rowId: state => state.signal.rowId
  }),

  watch: {
    patientId: {
      handler(val) {
        this.pId = val;
        this.init();
      },
      immediate: true
    }
  },
  computed: mapState({
    patientId: state => state.signal.patientId
  }),
  mounted() {},
  methods: {
    add() {
      this.$emit("showFn", true);
    },
    handleChange(item, index) {
      if (item.zk == "展开") {
        item.zk = "收起";
      } else {
        item.zk = "展开";
      }
    },
    edit(id) {
      editphysicalexamination(id).then(res => {
        if (res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.editData.data = res.data.data;
          let data = res.data.data;
          this.$emit("showFn", true, data, id);
        }
      });
    },
    del(a) {
      this.$confirm("此操作将删除该员工, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deletephysicalexamination({ id: a }).then(res => {
            if (res.data.code === SYSTEM_HTTP_SUCCESS) {
              this.init();
            }
          });
        })
        .catch(() => {});
    },
    printing(id) {
      this.$emit("printing", id);
    },
    showDialogFn() {
      this.show = true;
      this.isShowDialog.register = true;
      this.editData.data = "";
      this.editData.edit = false;
      this.editData.id = "";
    },
    getTime1(t) {
      return monment(t).format("YYYY-MM-DD ");
    },
    getTime(t, v) {
      return v ? monment(t).format("HH:mm") : monment(t).format("YYYY-MM-DD");
    },
    init() {
      getPhysical({ patientId: this.pId }).then(res => {
        
        this.phyData = res.data.data.physicalExaminationList.map(v => {
          v.zk = "展开";
          let str = "";
          v.doctor ? v.doctorName=v.doctor.name : v.doctorName=""
          v.dentofacialInspect.split(",").map(val => {
            let n = parseInt(val);
            str += this.dentofacialInspectArr[val];
          });

          let str1 = "";
          v.oralMucosaInspect.split(",").map(val => {
            let n = parseInt(val);
            str1 += this.oralMucosaInspectArr[val];
          });
          v.oralMucosaInspectTxt = str;
          let str2 = "";
          v.otherCavityConditions.split(",").map(val => {
            let n = parseInt(val);
            str2 += this.otherCavityConditionsArr[val];
          });
          v.otherCavityConditionsTxt = str2;
          v.oralMucosaInspectTxt= str1;
          v.physicalExaminationDate = this.getTime1(v.physicalExaminationDate);
          v.dentofacialInspectTxt = str;

          return v;
        });

        this.otherInstitutionPhysicalExaminationList = res.data.data.otherInstitutionPhysicalExaminationList.map(v => {
          v.zk = "展开";
          let str = "";
          v.doctor ? v.doctorName=v.doctor.name : v.doctorName=""
          v.dentofacialInspect.split(",").map(val => {
            let n = parseInt(val);
            str += this.dentofacialInspectArr[val];
          });

          let str1 = "";
          v.oralMucosaInspect.split(",").map(val => {
            let n = parseInt(val);
            str1 += this.oralMucosaInspectArr[val];
          });
          v.oralMucosaInspectTxt = str;
          let str2 = "";
          v.otherCavityConditions.split(",").map(val => {
            let n = parseInt(val);
            str2 += this.otherCavityConditionsArr[val];
          });
          v.otherCavityConditionsTxt = str2;
          v.oralMucosaInspectTxt= str1;
          v.physicalExaminationDate = this.getTime1(v.physicalExaminationDate);
          v.dentofacialInspectTxt = str;

          return v;
        });
      });
    },
    openMore(i) {},
    showOther() {
      //查询以往记录'
      this.isshowOther = !this.isshowOther;
    }
  },
  mixins: []
};
</script>
<style lang="less" scoped>
.wrapper {
  padding-bottom: 30px;
}
.header_wrap {
  color: #3b78fd;
  padding-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  li:nth-child(1) {
    font-size: 16px;
    padding-left: 10px;
  }
  li:nth-child(2) {
    cursor: pointer;
    width: 88px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    font-size: 16px;
    border: 1px solid #3b78fd;
  }
}
.btns {
  font-size: 14px;
  display: block;
  cursor: pointer;
  width: 80px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: rgb(59, 120, 253);
  border: 1px solidrgb(59, 120, 253);
}
.main {
  height: 650px;
  overflow-y: scroll;
  .time_left {
    width: 100px;
    p {
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      height: 20px;
      line-height: 20px;
    }
  }
  .main_bgbox{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 350px; 
    padding-top: 50px;
  }
  .main_bg{
    width:350px;
    margin:auto;
  }
  .physical_info {
    width: 100%;
    margin-bottom: 30px;
    .list {
      box-shadow: 0 0 6px 0 #e4e9ff;
      border-radius: 4px;
      overflow: hidden;
      .title {
        width: 100%;
        height: 40px;
        background: #f7f9ff;
        line-height: 40px;
        padding-left: 10px;
        .open {
          cursor: pointer;
          text-align: right;
        }
        .icon:nth-child(1) {
          margin: 0 0px 0 70px;
        }
        .icon {
          display: inline-block;
          width: 30px;
          height: 30px;
          color: #3b78fd;
          font-size: 16px;
        }
      }
    }
    .major {
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
    }
    .other_info {
      padding-left: 10px;
      .section_title {
        font-weight: bold;
      }
      p {
        margin-bottom: 10px;
        .diagnosis {
          padding-left: 10px;
        }
      }
      .doctor {
        margin: 40px 0 20px 0;
      }
      .printing {
        cursor: pointer;
        width: 88px;
        height: 32px;
        text-align: center;
        line-height: 32px;
        font-size: 14px;
        border: 1px solid #3b78fd;
      }
    }
  }

  .list-item {
    display: flex;
    margin-bottom: 20px;
    .timer {
      width: 100px;
      color: #1b1e25;
      font-size: 14px;
      font-weight: bold;
    }
    .list-content {
      width: 650px;
      padding: 10px;
      color: #1b1e25;
      font-size: 14px;
      box-shadow: 0 0 6px 0 #e4e9ff;
      background-color: #ffffff;

      li {
        display: flex;
        line-height: 30px;
      }
      li span:nth-child(1) {
        margin-right: 10px;
      }
      .other {
        justify-content: space-between;
        div {
          display: flex;
          p {
            cursor: pointer;
            width: 88px;
            height: 32px;
            border: 1px solid #3b78fd;
            color: #3b78fd;
            text-align: center;
            line-height: 32px;
          }
          p:nth-child(1) {
            margin-right: 20px;
          }
        }
      }
    }
  }

  .other-msg {
    border-top: 1px solid #DFE7F0;
    width: 100%;
    text-align: center;
    margin-top: 20px;
    padding-top: 20px;
    cursor: pointer;
    
    .icon-arrow {
      transform:rotate(0deg);
      transform-origin: center;
      transition: all .2s;
      margin-left: 5px;
      &::before {
        margin-right: 0 !important;
      }
    }

    &.isactive {
      .icon-arrow {
        transform:rotate(-180deg);
        transform-origin: center;
      }
    }
  }
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
</style>
<style>
#workbench_physicalList .el-collapse-item .el-collapse-item__wrap {
  display: block !important;
  height: 40px;
}
#workbench_physicalList .is-active .el-collapse-item__wrap {
  height: auto !important;
}
#workbench_physicalList .el-collapse-item__arrow {
  display: none;
}
#workbench_physicalList .el-collapse-item__header {
  border: none;
}
#workbench_physicalList .el-collapse {
  border: none;
}
</style>
