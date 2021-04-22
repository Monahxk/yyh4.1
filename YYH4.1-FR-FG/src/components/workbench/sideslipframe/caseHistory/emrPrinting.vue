<!--
 * @Descripttion: 病历打印
 * @version: v4.1
 * @Author: hzj
 * @Date: 2019-08-01 14:52:35
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-07 11:36:17
 -->
<template>
  <div class="wrapper emrPrinting">
    <asideDialog title="打印预览" :isShow="isShow" @on-close="cancelPrintFn">
      <div id="printTest">
        <section>
          <div style>
            <div class="content" v-for="(item,index) in data" :key="index">
              <el-row class="content_row" style="">
                <p style="marginTop:20px;" class="physical_report">{{currentinstitution.name}} -- 就诊病历</p>
                <p class="date">日期： {{item.emrDO.emr.visitTime}}</p>
              </el-row>
              <el-row class="userinfo">
                <el-col :span="3">姓名</el-col>
                <el-col :span="8">{{item.patientName}}</el-col>
                <el-col :span="6">性别</el-col>
                <el-col :span="7">{{item.sex == 1 ? '男' : '女'}}</el-col>
              </el-row>

              <el-row class="userinfo">
                <el-col :span="3">出生日期</el-col>
                <el-col :span="8">{{item.patientBirth}}</el-col>
                <el-col :span="6">就诊日期</el-col>
                <el-col :span="7">{{item.emrDO.emr.visitTime}}</el-col>
              </el-row>

              <el-row class="userinfo">
                <el-col :span="3">病历号</el-col>
                <el-col :span="8">{{item.clinicNo}}</el-col>
                <el-col :span="6">医生</el-col>
                <el-col :span="7">{{item.doctorName}}</el-col>
              </el-row>
              <el-row class="diseaseinfo">
                <el-col :span="3" class="key">主诉：</el-col>
                <el-col :span="21">
                  <el-row>{{item.emrDO.emr.mainComplain}}</el-row>
                </el-col>
              </el-row>
              <el-row class="diseaseinfo">
                <el-col :span="3" class="key">现病史：</el-col>
                <el-col :span="21">
                  <el-row>{{item.emrDO.emr.presentIll}}</el-row>
                </el-col>
              </el-row>
              <el-row class="diseaseinfo">
                <el-col :span="3" class="key">既往史：</el-col>
                <el-col :span="21">
                  <el-row>{{item.emrDO.emr.pastIll}}</el-row>
                </el-col>
              </el-row>

              <el-row class="diseaseinfo">
                <el-col :span="3" class="key">口腔检查：</el-col>
                <el-col :span="21">
                  <el-row v-for="(emritem,index) in item.emrDO.emrToothCheckList" :key="index">
                    <div
                      class="item"
                      v-if="emritem.leftDownValue !=='' || emritem.leftUpValue !==''  || emritem.rightDownValue !=='' || emritem.rightUpValue !=='' || emritem.toothCheck !=='' "
                    >
                      <el-row>
                        <el-col :span="5">
                          <div class="position">
                            <span>{{emritem.leftUpValue}}</span>
                            <span>{{emritem.rightUpValue}}</span>
                            <span>{{emritem.leftDownValue}}</span>
                            <span>{{emritem.rightDownValue}}</span>
                          </div>
                        </el-col>
                        <el-col :span="18">{{emritem.toothCheck}}</el-col>
                      </el-row>
                    </div>
                  </el-row>
                </el-col>
              </el-row>

              <el-row class="diseaseinfo">
                <el-col :span="3" class="key">辅助检查：</el-col>
                <el-col :span="21">
                  <el-row v-for="(emritem,index) in item.emrDO.emrAssistCheckList" :key="index">
                    <div
                      class="item"
                      v-if="emritem.leftDownValue !=='' || emritem.leftUpValue !==''  || emritem.rightDownValue !=='' || emritem.rightUpValue !=='' || emritem.toothCheck !==''"
                    >
                      <el-row>
                        <el-col :span="5">
                          <div class="position">
                            <span>{{emritem.leftUpValue}}</span>
                            <span>{{emritem.rightUpValue}}</span>
                            <span>{{emritem.leftDownValue}}</span>
                            <span>{{emritem.rightDownValue}}</span>
                          </div>
                        </el-col>
                        <el-col :span="18">{{emritem.toothCheck}}</el-col>
                      </el-row>
                    </div>
                  </el-row>
                </el-col>
              </el-row>

              <el-row class="diseaseinfo">
                <el-col :span="3" class="key">诊断：</el-col>
                <el-col :span="21">
                  <el-row v-for="(emritem,index) in item.emrDO.emrDiagnosisList" :key="index">
                    <div
                      class="item"
                      v-if="emritem.leftDownValue !=='' || emritem.leftUpValue !==''  || emritem.rightDownValue !=='' || emritem.rightUpValue !=='' || emritem.diagnosisContent !==''"
                    >
                      <el-row>
                        <el-col :span="5">
                          <div class="position">
                            <span>{{emritem.leftUpValue}}</span>
                            <span>{{emritem.rightUpValue}}</span>
                            <span>{{emritem.leftDownValue}}</span>
                            <span>{{emritem.rightDownValue}}</span>
                          </div>
                        </el-col>
                        <el-col :span="18">{{emritem.diagnosisContent}}</el-col>
                      </el-row>
                    </div>
                  </el-row>
                </el-col>
              </el-row>

              <el-row class="diseaseinfo">
                <el-col :span="3" class="key">治疗计划：</el-col>
                <el-col :span="21">
                  <el-row v-for="(emritem,index) in item.emrDO.emrTreatPlanList" :key="index">
                    <div
                      class="item"
                      v-if="emritem.leftDownValue !=='' || emritem.leftUpValue !==''  || emritem.rightDownValue !=='' || emritem.rightUpValue !=='' || emritem.treatPlan !==''"
                    >
                      <el-row>
                        <el-col :span="5">
                          <div class="position">
                            <span>{{emritem.leftUpValue}}</span>
                            <span>{{emritem.rightUpValue}}</span>
                            <span>{{emritem.leftDownValue}}</span>
                            <span>{{emritem.rightDownValue}}</span>
                          </div>
                        </el-col>
                        <el-col :span="18">{{emritem.treatPlan}}</el-col>
                      </el-row>
                    </div>
                  </el-row>
                </el-col>
              </el-row>

              <el-row class="diseaseinfo">
                <el-col :span="3" class="key">处置：</el-col>
                <el-col :span="21">
                  <el-row v-for="(emritem,index) in item.emrDO.emrDisposeList" :key="index">
                    <div
                      class="item"
                      v-if="emritem.leftDownValue !=='' || emritem.leftUpValue !==''  || emritem.rightDownValue !=='' || emritem.rightUpValue !=='' || emritem.disposeContent !==''"
                    >
                      <el-row>
                        <el-col :span="5">
                          <div class="position">
                            <span>{{emritem.leftUpValue}}</span>
                            <span>{{emritem.rightUpValue}}</span>
                            <span>{{emritem.leftDownValue}}</span>
                            <span>{{emritem.rightDownValue}}</span>
                          </div>
                        </el-col>
                        <el-col :span="18">{{emritem.disposeContent}}</el-col>
                      </el-row>
                    </div>
                  </el-row>
                </el-col>
              </el-row>

              <el-row class="diseaseinfo">
                <el-col :span="3" class="key">医嘱：</el-col>
                <el-col :span="21">
                  <el-row>{{item.emrDO.emr.advice}}</el-row>
                </el-col>
              </el-row>

              <el-row class="diseaseinfo">
                <el-col :span="3" class="key">备注：</el-col>
                <el-col :span="21">
                  <el-row>{{item.emrDO.emr.remark}}</el-row>
                </el-col>
              </el-row>
            </div>
          </div>
        </section>
        <el-row type="flex" class="row-bg" justify="space-between" style="marginBottom:10px;">
          <el-col :span="10">
            <div>联系电话：{{currentinstitution.teleno}}</div>
          </el-col>
          <el-col :offset="3" :span="7">
            <div style="text-align:right;">接诊时间： 周一 ~ 周五 09:00-18:00</div>
          </el-col>
        </el-row>
        <el-row class="row-bg">
          <el-col :span="20">
            <div>地址：{{currentinstitution.addr}}</div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <ul class="btns_wrap">
          <li v-print="'#printTest'">
            <span>打印</span>
          </li>
          <li @click="cancelPrintFn">
            <span >取消</span>
          </li>
        </ul>
      </div>
    </asideDialog>
  </div>
</template>

<script>
import {
  getDoctorList,
  getNurseList,
  getEmrentryList,
  getTemplatelist,
  getTemplate,
  emrsave,
  getEmrInfo,
  getAllEmrList,
  getCurrentClinic
} from "@/api";
import {SYSTEM_HTTP_SUCCESS} from "@/constant";
import asideDialog from "../../asideDialog.vue";
export default {
  components: { asideDialog },
  props: ["isShow"],
  data() {
    return {
      data: [],
      currentinstitution: {}
    };
  },

  watch: {
    "isShow.id"() {
      this.data = [];
      getEmrInfo(this.isShow.id).then(res => {
        let emrData = res.data.data;
        emrData.emrDO.emr.visitTime = util.timestampToTime(
          res.data.data.emrDO.emr.visitTime
        );
        this.data.push(emrData);
      });
    },
    "isShow.pid"() {
      this.data = [];
      getAllEmrList(this.isShow.pid).then(res => {
        let emrData = res.data.data;
        emrData.map(val => {
          if (val.emrDO.emr.visitTime) {
            val.emrDO.emr.visitTime = util.timestampToTime(
              val.emrDO.emr.visitTime
            );
            return val;
          }
        });
        this.data = emrData;
      });
    },
    "isShow.data"() {
      this.data = [];
    }
  },
  computed: {},
  created() {},
  methods: {
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
    },
    //取消打印
    cancelPrintFn() {
      this.isShow.dialogVisible=false
      this.$emit('closeAdd');
    },
  },
  mixins: [],
  mounted() {
    this.getCurrentinstitution();
  }
};
</script>
<style lang="less" scoped>
.printTest {
  width: 850px;
}
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
  border-bottom: 1px solid #000;
  margin-bottom: 10px;
  .content_row{
    border-bottom:2px solid #000;
  }
  .userinfo {
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
  .eh {
    border-left: 2px solid #000;
    border-right: 2px solid #000;
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
  .diseaseinfo {
    border-bottom: 1px solid #000;
    overflow: hidden;

    .key {
      height: 40px;
      box-sizing: border-box;
      text-align: center;
      line-height: 40px;
      font-weight: bold;
    }
    .el-col:nth-child(2) {
      padding: 10px 0 10px 10px;
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
  }
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
}
.titles {
  padding: 10px 0 10px 20px;
  background: #e4e9ff;
  margin-bottom: 20px;
}
.diseaseinfo .other_group {
  .el-checkbox {
    width: 340px;
    text-align: left;
    margin-left: 10px;
    .el-checkbox__label {
      font-size: 16px;
    }
  }
}
.sih label {
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
  margin-top: 20px;
  margin-bottom: 70px;
  li {
    cursor: pointer;
    color: #3b78fd;
    width: 88px;
    height: 32px;
    border: 1px solid #3b78fd;
    margin-right: 20px;
    line-height: 32px;
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
<style>
#emrPrinting .el-dialog__header .el-dialog__header {
  border: none;
}
</style>
