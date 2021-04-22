<template>
  <div>
		<div class="physical_info" v-for="(item,index) in otherInstitutionPhysicalExaminationList" :key="index">
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
                    <el-col  class="open" :offset="8" :span="2">{{item.zk}}</el-col>
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
                      </el-row>
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
		props: ['otherInstitutionPhysicalExaminationList'],
		methods: {
			handleChange(item, index) {
				if (item.zk == "展开") {
					item.zk = "收起";
				} else {
					item.zk = "展开";
				}
			},
		}
}
</script>
