<!--
 * @Descripttion: 电子病历列表
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-05 17:02:00
 -->
<template>
  <div class="wrapper" id="workbench_caseHistoryList">
    <ul class="header_wrap">
      <li>
        <span>病历记录</span>
      </li>
      <li>
        <span @click="printAllEmr">打印所有病历</span>
      </li>
      <li @click="addrvd">
        <span class="add_bt">新增病历</span>
      </li>
    </ul>
    <div class="main" id="mains" style>
      <div v-if="dataList.length==0 && !isshowOther" class="empt-img-box">
        <div class="main_bgbox">
          <p class="main_bg" >
            <img src="../../../../assets/img/workbench/img_workbench_table_bg.png" alt>
          </p>
          <p class="other-msg" 
          :class="{isactive: isshowOther}" 
          v-if="emrOtherInstitutionList.length>0" 
          @click="showOther">
            <span>查看以往记录<i class="el-icon-arrow-down icon-arrow"></i></span>
          </p>
        </div>
      </div>
      <div class="medical_record" v-for="(item,index)  in dataList" :key="index">
        <el-row>
          <el-col :span="3">
            <div class="time_left">
              <p>{{item.emr.visitTime}}</p>
            </div>
          </el-col>
          <el-col :span="21" class="list">
            <el-collapse
              accordion
              @change="handleChange(item,index)"
              class="caseHistoryList_collapse"
            >
              <el-collapse-item>
                <template slot="title">
                  <el-row class="title">
                    <el-col :span="10">{{item.emr.checkFlag==0 ? "初诊" : "复诊" }}</el-col>
                    <el-col class="open" :offset="9" :span="2">{{item.zk}}</el-col>
                    <el-col :span="3">
                      <span
                        @click.stop="edit(item.emr.id,item.editFlag)"
                        class="icon el-icon-edit"
                        v-if="item.editFlag ==1"
                      ></span>
                      <span
                        @click.stop="del(item.emr.id,item.editFlag)"
                        class="icon el-icon-delete"
                        v-if="item.editFlag ==1"
                      ></span>
                    </el-col>
                  </el-row>
                </template>
                <el-row class="major">
                  <el-col :span="19">
                    <p>
                      <span class="section_title">主诉：</span>
                      <span>{{item.emr.mainComplain}}</span>
                    </p>
                    <p>
                      <span class="section_title">既往史：</span>
                      <span>{{item.emr.pastIll}}</span>
                    </p>
                  </el-col>
                  <el-col class="info" :span="5">
                    <p>
                      <span class="section_title">诊治医生：</span>
                      <span>{{item.doctorName}}</span>
                    </p>
                    <p>
                      <span class="section_title">护士：</span>
                      <span>{{item.nurseName}}</span>
                    </p>
                  </el-col>
                </el-row>
                <div class="item">
                  <el-row class="other_info">
                    <el-col :span="23">
                      <span class="section_title">口腔检查：</span>
                    </el-col>
                  </el-row>
                  <el-row v-for="(tcItem,index)  in item.emrToothCheckList" :key="index">
                    <el-col :span="5">
                      <div class="position">
                        <span>{{tcItem.leftUpValue}}</span>
                        <span>{{tcItem.rightUpValue}}</span>
                        <span>{{tcItem.leftDownValue}}</span>
                        <span>{{tcItem.rightDownValue}}</span>
                      </div>
                    </el-col>
                    <el-col :span="18">{{tcItem.toothCheck}}</el-col>
                  </el-row>
                </div>

                <div class="item">
                  <el-row class="other_info">
                    <el-col :span="23">
                      <span class="section_title">辅助检查：</span>
                    </el-col>
                  </el-row>
                  <el-row v-for="(tcItem,index)  in item.emrAssistCheckList" :key="index">
                    <el-col :span="5">
                      <div class="position">
                        <span>{{tcItem.leftUpValue}}</span>
                        <span>{{tcItem.rightUpValue}}</span>
                        <span>{{tcItem.leftDownValue}}</span>
                        <span>{{tcItem.rightDownValue}}</span>
                      </div>
                    </el-col>
                    <el-col :span="18">{{tcItem.toothCheck}}</el-col>
                  </el-row>
                </div>

                <div class="item">
                  <el-row class="other_info">
                    <el-col :span="23">
                      <span class="section_title">诊断：</span>
                    </el-col>
                  </el-row>
                  <el-row v-for="(tcItem,index)  in item.emrDiagnosisList" :key="index">
                    <el-col :span="5">
                      <div class="position">
                        <span>{{tcItem.leftUpValue}}</span>
                        <span>{{tcItem.rightUpValue}}</span>
                        <span>{{tcItem.leftDownValue}}</span>
                        <span>{{tcItem.rightDownValue}}</span>
                      </div>
                    </el-col>
                    <el-col :span="18">{{tcItem.diagnosisContent}}</el-col>
                  </el-row>
                </div>
                <div class="item">
                  <el-row class="other_info">
                    <el-col :span="23">
                      <span class="section_title">治疗计划：</span>
                    </el-col>
                  </el-row>
                  <el-row v-for="(tcItem,index)  in item.emrTreatPlanList" :key="index">
                    <el-col :span="5">
                      <div class="position">
                        <span>{{tcItem.leftUpValue}}</span>
                        <span>{{tcItem.rightUpValue}}</span>
                        <span>{{tcItem.leftDownValue}}</span>
                        <span>{{tcItem.rightDownValue}}</span>
                      </div>
                    </el-col>
                    <el-col :span="18">{{tcItem.treatPlan}}</el-col>
                  </el-row>
                </div>

                <div class="item">
                  <el-row class="other_info">
                    <el-col :span="23">
                      <span class="section_title">处置：</span>
                    </el-col>
                  </el-row>
                  <el-row v-for="(tcItem,index)  in item.emrDisposeList" :key="index">
                    <el-col :span="5">
                      <div class="position">
                        <span>{{tcItem.leftUpValue}}</span>
                        <span>{{tcItem.rightUpValue}}</span>
                        <span>{{tcItem.leftDownValue}}</span>
                        <span>{{tcItem.rightDownValue}}</span>
                      </div>
                    </el-col>
                    <el-col :span="18">{{tcItem.disposeContent}}</el-col>
                  </el-row>
                </div>
                <div class="item">
                  <el-row class="other_info">
                    <span class="section_title">医嘱：</span>
                    <span>{{item.emr.advice}}</span>
                  </el-row>
                </div>
                <div class="item">
                  <el-row class="other_info">
                    <span class="section_title">备注:</span>
                    <span>{{item.emr.remark}}</span>
                  </el-row>
                </div>
                <el-row>
                  <el-col :span="24">
                    <div class="foot">
                      <button @click="openPrinting(item.emr.id)">打印</button>
                      <button @click="openFolog(item.emr.id)">查看日志</button>
                    </div>
                  </el-col>
                </el-row>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>
      </div>
      <div class="other-msg" v-if="emrOtherInstitutionList.length>0" :class="{isactive: isshowOther}" @click="showOther">
        <caseHistoryDetail :emrOtherInstitutionList="emrOtherInstitutionList" v-show="isshowOther"></caseHistoryDetail>
        <span>查看以往记录<i class="el-icon-arrow-down icon-arrow"></i></span>
      </div>
    </div>
    <emrPrinting :isShow="isShowDialog"></emrPrinting>
    <folog :isShow="diglogShow"></folog>
  </div>
</template>

<script>
import {
  getElectronicMedicalRecordList,
  deletemr,
  getEmrInfo,
  getAllEmrList,
  getFologlist
} from "@/api";
import folog from "./folog.vue";
import emrPrinting from "./emrPrinting.vue";
import caseHistoryDetail from "./../components/CaseHistoryDetail";
import { mapState } from "vuex";
import monment from "moment";
import {SYSTEM_HTTP_SUCCESS} from "@/constant";
export default {
  components: { emrPrinting, folog,caseHistoryDetail },
  props: ["isShow", "isShowComp"],
  data() {
    return {
      list: {},
      loading: "",
      openText: "展开",
      dataList: [],
      emrOtherInstitutionList: [],
      pid: "",
      isShowDialog: {
        dialogVisible: false,
        id: "",
        pid: ""
      },
      diglogShow: {
        show: false,
        id: ""
      },
      isshowOther: false,
    };
  },
  watch: {
    patientId: {
      handler(val) {
        this.pid = val;
        this.init();
      },
      immediate: true
    },
    isShowComp() {
      if (!this.isShowComp) {
        this.init();
      }
    }
  },
  computed: mapState({
    patientsMsg: state => state.signal.patientsMsg,
    patientId: state => state.signal.patientId,
    rowId: state => state.signal.rowId
  }),
  computed: mapState({
    patientId: state => state.signal.patientId
  }),
  created() {
    this.init();
    
  },
  methods: {
    openMore(i) {},
    openloading() {
      this.loading = this.$loading({
        lock: true,
        text: "正在加载……",
        color: "#fff",
        spinner: "el-icon-loading",
        background: "rgba(0,0,0,.3)"
      });
    },
    printAllEmr() {
      this.isShowDialog.dialogVisible = true;
      this.isShowDialog.pid = this.pid;
    },
    openPrinting(id) {
      this.isShowDialog.dialogVisible = true;
      this.isShowDialog.id = id;
    },
    handleChange(item, index) {
      if (item.zk == "展开") {
        item.zk = "收起";
      } else {
        item.zk = "展开";
      }
    },
    del(id, del) {
      let data = {};
      data.id = id;
      if (del == 1) {
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            deletemr(data).then(res => {
              if (res.data.code == SYSTEM_HTTP_SUCCESS) {
                // this.$message({
                //   type: "success",
                //   message: "删除成功!"
                // });
                this.init();
              } else {
                // this.$message({
                //   type: "info",
                //   message: "删除失败！"
                // });
              }
            });
          })
          .catch(() => {
          });
      } else if (del == 0) {
        this.$message({
          type: "success",
          message: "该病历不可删除!"
        });
      }
    },
    getTime(t) {
      return monment(t).format("YYYY-MM-DD HH:mm:ss");
    },
    init() {
      getElectronicMedicalRecordList(this.pid).then(res => {
        console.log(res);
        
        if (res.data.code == SYSTEM_HTTP_SUCCESS) {
          let data = res.data.data.emrList;
          let emrOther = res.data.data.emrOtherInstitutionList;
          for (let i = 0; i < data.length; i++) {
            data[i].zk = "展开";
            data[i].emr.visitTime = this.getTime(data[i].emr.visitTime);
          }
          for (let i = 0; i < emrOther.length; i++) {
            emrOther[i].zk = "展开";
            emrOther[i].emr.visitTime = this.getTime(data[i].emr.visitTime);
          }
          this.dataList = data;
          this.emrOtherInstitutionList = emrOther;
        } else {
          // this.$message("获取病历数据失败！");
        }
      });
    },
    edit(id, edit) {
      if (edit == 1) {
        getEmrInfo(id).then(res => {
          let emrdata = res.data.data.emrDO;
          this.$emit("sendChange", true, emrdata);
        });
      } else if (edit == 0) {
        this.$message({
          type: "success",
          message: "该病历不可编辑!"
        });
      }
    },
    openFolog(id) {
      this.diglogShow.show = true;
      this.diglogShow.id = id;
    },
    addrvd() {
      this.$emit("sendChange", true, "");
    },
    showOther() {
      //查询以往记录'
      this.isshowOther = !this.isshowOther;
    }
  },
  mixins: []
};
</script>
<style lang="less" scoped>
.customClass {
  z-index: 9999;
}
.wrapper {
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
  padding-bottom: 30px;
  .section_title {
    font-weight: bold;
  }
  .foot {
    width: 150px;
    margin: 20px auto;
    button {
      display: inline-block;
      border: 1px solid #3b78fd;
      width: 70px;
      height: 30px;
      background: #fff;
      color: #3b78fd;
    }
  }
}
.add_bt {
  font-size: 14px;
  display: block;
  cursor: pointer;
  width: 80px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: rgb(59, 120, 253);
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
    cursor: pointer;
  }
  li:nth-child(3) {
    height: 32px;
    text-align: center;
    line-height: 32px;
    font-size: 14px;
    padding-left: 10px;
    padding: 0 4px 0 4px;
    border: 1px solid #3b78fd;
    margin-left: 700px;
    cursor: pointer;
  }
  li:nth-child(2) {
    cursor: pointer;
    height: 32px;
    text-align: center;
    line-height: 32px;
    font-size: 14px;
    border: 1px solid #3b78fd;
    padding: 0 4px 0 4px;
  }
}
.main {
  height: 700px !important;
  overflow-y: scroll;
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

  .medical_record {
    width: 100%;
    margin-bottom: 30px;
    .list {
      box-shadow: 0 0 6px 0 #e4e9ff;
      border-radius: 4px;
      overflow: hidden;
      .title {
        width: 100%;
        height: 48px;
        background: #f7f9ff;
        line-height: 48px;
        padding-left: 10px;
        .open {
          cursor: pointer;
        }
      }
      .icon:nth-child(1) {
        margin: 0 0px 0 20px;
      }
      .icon {
        display: inline-block;
        width: 30px;
        height: 30px;
        color: #3b78fd;
        font-size: 16px;
      }
    }
    .major {
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
      .info {
        background: #f7f9ff;
        padding-left: 10px;
        font-weight: bold;
      }
    }
    .item {
      width: 100%;
      margin-bottom: 20px;
    }
    .other_info {
      padding-left: 10px;
    }
    .position {
      width: 150px;
      height: 100px;
      margin: 10px auto;
      span {
        float: left;
        width: 50%;
        height: 40px;
        box-sizing: border-box;
      }
      span:nth-child(1) {
        border-right: 1px solid #3b78fd;
        border-bottom: 1px solid #3b78fd;
        text-align: right;
        line-height: 40px;
      }
      span:nth-child(2) {
        line-height: 40px;
        text-align: left;
      }
      span:nth-child(3) {
        line-height: 40px;
        text-align: right;
      }
      span:nth-child(4) {
        border-top: 1px solid #3b78fd;
        border-left: 1px solid #3b78fd;
        margin: -1px 0 0 -1px;
        line-height: 40px;
      }
    }
  }
  .empt-img-box {
    height: 100%;
    position: relative;
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
</style>
<style>
.caseHistoryList_collapse .el-collapse-item__arrow {
  display: none;
}
.el-message-box__wrapper {
  z-index: 9999 !important;
}
</style>
