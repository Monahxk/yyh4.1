<!--
 * @Descripttion: 病历查看日志
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-07 11:34:00
 -->
<template>
  <div class="wrapper adddiglog" v-if="isShow.show">
    <div class="warp">
      <header class="head">
        查看日志
        <span class="close" @click="isShow.show=false">x</span>
      </header>
      <div class="content">
        <div class="comp">
          <div v-if="data.length==0">无日志</div>
          <el-row class="comp_row" v-for="(item,index) in data" :key="index">
            <el-row>
              <el-col :span="3">
                <strong>修改时间：</strong>
              </el-col>
              <el-col :span="21">
                <span>{{item.emrLog.addTime}}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3">
                <strong>主诉：</strong>
              </el-col>
              <el-col :span="21">
                <span>{{item.emrLog.mainComplain ? item.emrLog.mainComplain : '无'}}</span>
                <span>→</span>
                <span>{{item.emrLog.mainComplainLog}}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3">
                <strong>既往史：</strong>
              </el-col>
              <el-col :span="21">
                <span>{{item.emrLog.pastIll ? item.emrLog.pastIll : '无'}}</span>
                <span>→</span>
                <span>{{item.emrLog.pastIllLog}}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3">
                <strong>现病史：</strong>
              </el-col>
              <el-col :span="21">
                <span>{{item.emrLog.presentIll ? item.emrLog.presentIll : '无'}}</span>
                <span>→</span>
                <span>{{item.emrLog.presentIllLog}}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3">
                <strong>口腔检查：</strong>
              </el-col>
              <el-col :span="21">
                <span v-for="(ToothCheckItem,indexa) in item.emrToothCheckLogList" :key="indexa">
                  <span
                    v-if="ToothCheckItem.leftDownValue ==null && ToothCheckItem.leftUpValue ==null  &&  ToothCheckItem.rightDownValue ==null &&  ToothCheckItem.rightUpValue ==null &&  ToothCheckItem.toothCheck ==null"
                  >无</span>
                  <span v-else>
                    {{ToothCheckItem.leftUpValue}}
                    {{ToothCheckItem.rightUpValue}}
                    {{ToothCheckItem.leftDownValue}}
                    {{ToothCheckItem.rightDownValue}}
                    {{ToothCheckItem.toothCheck}}
                  </span>
                </span>

                <span>→</span>
                <span
                  v-for="(ToothCheckItem,indexaa) in item.emrToothCheckLogList"
                  :key="indexaa+ToothCheckItem.id"
                >
                  {{ToothCheckItem.leftUpValueLog}}
                  {{ToothCheckItem.rightUpValueLog}}
                  {{ToothCheckItem.leftDownValueLog}}
                  {{ToothCheckItem.rightDownValueLog}}
                  {{ToothCheckItem.toothCheckLog}}
                </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3">
                <strong>辅助检查：</strong>
              </el-col>
              <el-col :span="21">
                <span v-for="(AssistCheckItem,indexb) in item.emrAssistCheckLogList" :key="indexb">
                  <span
                    v-if="AssistCheckItem.leftDownValue ==null && AssistCheckItem.leftUpValue ==null  &&  AssistCheckItem.rightDownValue ==null &&  AssistCheckItem.rightUpValue ==null &&  AssistCheckItem.toothCheck ==null"
                  >无</span>
                  <span v-else>
                    {{AssistCheckItem.leftUpValue}}
                    {{AssistCheckItem.rightUpValue}}
                    {{AssistCheckItem.leftDownValue}}
                    {{AssistCheckItem.rightDownValue}}
                    {{AssistCheckItem.toothCheck}}
                  </span>
                </span>
                <span>→</span>
                <span
                  v-for="(AssistCheckItem,indexbb) in item.emrAssistCheckLogList"
                  :key="indexbb+AssistCheckItem.id"
                >
                  {{AssistCheckItem.leftUpValueLog}}
                  {{AssistCheckItem.rightUpValueLog}}
                  {{AssistCheckItem.leftDownValueLog}}
                  {{AssistCheckItem.rightDownValueLog}}
                  {{AssistCheckItem.toothCheckLog}}
                </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3">
                <strong>诊断：</strong>
              </el-col>
              <el-col :span="21">
                <span
                  v-for="(emrDiagnosisLogItem,indexc) in item.emrDiagnosisLogList"
                  :key="indexc"
                >
                  <span
                    v-if="emrDiagnosisLogItem.leftDownValue ==null && emrDiagnosisLogItem.leftUpValue ==null  &&  emrDiagnosisLogItem.rightDownValue ==null &&  emrDiagnosisLogItem.rightUpValue ==null &&  emrDiagnosisLogItem.diagnosisContentLog ==null"
                  >无</span>
                  <span v-else>
                    {{emrDiagnosisLogItem.leftUpValue}}
                    {{emrDiagnosisLogItem.rightUpValue}}
                    {{emrDiagnosisLogItem.leftDownValue}}
                    {{emrDiagnosisLogItem.rightDownValue}}
                    {{emrDiagnosisLogItem.diagnosisContent}}
                  </span>
                </span>
                <span>→</span>
                <span
                  v-for="(emrDiagnosisLogItem,indexcc) in item.emrDiagnosisLogList"
                  :key="indexcc+emrDiagnosisLogItem.id"
                >
                  {{emrDiagnosisLogItem.leftUpValueLog}}
                  {{emrDiagnosisLogItem.rightUpValueLog}}
                  {{emrDiagnosisLogItem.leftDownValueLog}}
                  {{emrDiagnosisLogItem.rightDownValueLog}}
                  {{emrDiagnosisLogItem.diagnosisContentLog}}
                </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3">
                <strong>治疗计划：</strong>
              </el-col>
              <el-col :span="21">
                <span v-for="(TreatPlanLogItem,indexd) in item.emrTreatPlanLogList" :key="indexd">
                  <span
                    v-if="TreatPlanLogItem.leftDownValue ==null && TreatPlanLogItem.leftUpValue ==null  &&  TreatPlanLogItem.rightDownValue ==null &&  TreatPlanLogItem.rightUpValue ==null &&  TreatPlanLogItem.treatPlan ==null"
                  >无</span>
                  <span v-else>
                    {{TreatPlanLogItem.leftUpValue}}
                    {{TreatPlanLogItem.rightUpValue}}
                    {{TreatPlanLogItem.leftDownValue}}
                    {{TreatPlanLogItem.rightDownValue}}
                    {{TreatPlanLogItem.treatPlan}}
                  </span>
                </span>

                <span>→</span>
                <span
                  v-for="(TreatPlanLogItem,indexdd) in item.emrTreatPlanLogList"
                  :key="indexdd+TreatPlanLogItem.id"
                >
                  {{TreatPlanLogItem.leftUpValueLog}}
                  {{TreatPlanLogItem.rightUpValueLog}}
                  {{TreatPlanLogItem.leftDownValueLog}}
                  {{TreatPlanLogItem.rightDownValueLog}}
                  {{TreatPlanLogItem.treatPlanLog}}
                </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3">
                <strong>处置：</strong>
              </el-col>
              <el-col :span="21">
                <span v-for="(DisposeLogItem,indexe) in item.emrDisposeLogList" :key="indexe">
                  <span
                    v-if="DisposeLogItem.leftDownValue ==null && DisposeLogItem.leftUpValue ==null  &&  DisposeLogItem.rightDownValue ==null &&  DisposeLogItem.rightUpValue ==null &&  DisposeLogItem.disposeContent ==null"
                  >无</span>
                  <span v-else>
                    {{DisposeLogItem.leftUpValue}}
                    {{DisposeLogItem.rightUpValue}}
                    {{DisposeLogItem.leftDownValue}}
                    {{DisposeLogItem.rightDownValue}}
                    {{DisposeLogItem.disposeContent}}
                  </span>
                </span>
                <span>→</span>
                <span
                  v-for="(DisposeLogItem,indexee) in item.emrDisposeLogList"
                  :key="indexee+DisposeLogItem.id"
                >
                  {{DisposeLogItem.leftUpValueLog}}
                  {{DisposeLogItem.rightUpValueLog}}
                  {{DisposeLogItem.leftDownValueLog}}
                  {{DisposeLogItem.rightDownValueLog}}
                  {{DisposeLogItem.disposeContentLog}}
                </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3">
                <strong>医嘱：</strong>
              </el-col>
              <el-col :span="21">
                <span>{{item.emrLog.advice ? item.emrLog.advice : '无'}}</span>
                <span>→</span>
                <span>{{item.emrLog.adviceLog}}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3">
                <strong>备注：</strong>
              </el-col>
              <el-col :span="21">
                <span>{{item.emrLog.remark}}</span>
              </el-col>
            </el-row>
          </el-row>
        </div>
      </div>
      <footer class="foot">
        <el-row>
          <el-col :offset="21" :span="3">
            <el-button size="medium" type="primary" @click="isShow.show=false" plain>关闭</el-button>
          </el-col>
        </el-row>
      </footer>
    </div>
  </div>
</template>

<script>
import { getFologlist } from "@/api";
import {SYSTEM_HTTP_SUCCESS} from "@/constant";
export default {
  components: {},
  props: ["isShow", "other"],
  data() {
    return {
      form: {},
      data: []
    };
  },

  watch: {
    "isShow.id"() {
      getFologlist(this.isShow.id).then(res => {
        this.data = res.data.data.map(val => {
          return val;
        });
      });
    }
  },
  computed: {},
  methods: {},
  mixins: [],
  created() {}
};
</script>
<style lang="less" scoped>
.adddiglog {
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  z-index: 1000;
  .warp {
    width: 750px;
    height: 550px;
    background: #fff;
    margin: 0 auto;
    margin-top: 15vh;
    padding-bottom: 10px;
    .head {
      position: relative;
      height: 50px;
      border-bottom: 1px solid #ccc;
      line-height: 50px;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      .close {
        position: absolute;
        top: 2px;
        right: 20px;
        cursor: pointer;
      }
    }
    .content {
      width: 100%;
      height: 80%;
      padding: 10px 20px;

      .comp {
        box-shadow: 0 0 6px 0 #84ace8;
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        .comp_row {
          padding: 6px;
          .el-col:nth-child(1) {
            height: 30px;
            line-height: 30px;
            text-align: center;
          }
          .el-col:nth-child(2) {
            line-height: 30px;
          }
        }
      }
    }
    .foot {
      width: 100%;
      height: 50px;
      padding: 8px 20px 0px 20px;
    }
  }
  .comp::-webkit-scrollbar {
    width: 2px;
    height: 2px;
    background: #ccc;
    border-radius: 1px;
  }
  .comp::-webkit-scrollbar-thumb {
    display: block;
    width: 1px;
    margin: 0 auto;
    border-radius: 1px;
    background: #3b78fd;
  }
}
</style>