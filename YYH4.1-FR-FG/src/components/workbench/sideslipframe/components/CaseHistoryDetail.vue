<template>
    <div>
      <div class="medical_record" v-for="(item,index)  in emrOtherInstitutionList" :key="index">
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
                    </div>
                  </el-col>
                </el-row>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>
      </div>
    </div>
</template>
<script>
export default {
	props: ['emrOtherInstitutionList'],
	methods: {
		handleChange(item, index) {
      if (item.zk == "展开") {
        item.zk = "收起";
      } else {
        item.zk = "展开";
      }
		},
		openPrinting(id) {
			this.$emit('openPrinting', id);
		},
		openFolog(id) {
			this.$emit('openFolog', id);
		}
	}
}
</script>
<style lang="less" scoped>
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
</style>

