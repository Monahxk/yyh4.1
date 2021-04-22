<!--
@Author: ZJZ
@Date:   2019-08-05
@Filename: Patient.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-12
-->

<template>
  <div class="cliniccfg_patient_chunk">
    <div class="main_top_title">患者配置</div>
    <div class="source">
      <div class="chunk">
        <p class="title_text">患者来源
          <img src="../../../assets/img/add.png" alt=""  @click="sourceDialog('add','新增患者来源')">
        </p>
        <div class="content">
          <ul>
            <li v-for='(item,index) in sourceList' :key='index'>
              {{item.sourceName}}
              <div class="edit">
                <img src="../../../assets/img/edit.png" alt="" @click="sourceDialog('edit','编辑患者来源',item.id)">
                <img src="../../../assets/img/delete.png" alt="" @click='sourceDel(item.id)'>
              </div>
            </li>

          </ul>
        </div>
      </div>
      <div class="chunk right">
        <p class="title_text">患者关系
          <img src="../../../assets/img/add.png" alt="" @click="relationDialog('add','新增关系来源')">
        </p>
        <div class="content">
          <ul>
            <li v-for='(item,index) in relationList' :key='index'>
              {{item.relationName}}
              <div class="edit">
                <img src="../../../assets/img/edit.png" alt="" @click="relationDialog('edit','编辑患者关系',item.id)">
                <img src="../../../assets/img/delete.png" alt="" @click='relationDel(item.id)'>
              </div>
            </li>

          </ul>
        </div>

      </div>

    </div>

<!-- 患者来源的弹窗 -->
      <el-dialog
        :title="sourceDialogTitle"
        :visible.sync="sourceDialogFla"
        width="440px"
        center>
        <div class="content">
          <el-form :model="sourceForm" :rules="sourceRules" ref="sourceForm" label-width="55px" class="demo-ruleForm">
            <el-form-item label="名称" prop="sourceName">
              <el-input v-model="sourceForm.sourceName" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="desc">
              <el-input type="textarea" :rows="4" v-model="sourceForm.desc"></el-input>
            </el-form-item>

          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="form('sourceForm')">确 定</el-button>
          <el-button @click="close('sourceForm')">取 消</el-button>
        </span>
      </el-dialog>
<!-- 患者关系的弹窗 -->
      <el-dialog
        :title="relationDialogTitle"
        :visible.sync="relationDialogFla"
        width="40%"
        center>
        <div class="content">
          <el-form :model="relationForm" :rules="relationRules" ref="relationForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="名称" prop="relationName">
              <el-input v-model="relationForm.relationName" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="desc">
              <el-input type="textarea" :rows="4" v-model="relationForm.desc"></el-input>
            </el-form-item>

          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="form('relationForm')">确 定</el-button>
          <el-button @click="close('relationForm')">取 消</el-button>
        </span>
      </el-dialog>


  </div>
</template>


<script>
import {patientrelationconfigList,addPatientrelationconfig,putPatientrelationconfig,deletePatientrelationconfig,patientrelationconfigVo,patientsourceconfigList,addPatientsourceconfig,putPatientsourceconfig,deletePatientsourceconfig,patientsourceconfigVo} from "@/api";

export default {
  name:'patient',
  data() {
    return {
      sourceList:[],//来源
      relationList:[],//关系
      sourceDialogFla:false,
      sourceDialogTitle:'新增患者来源',
      relationDialogFla:false,
      relationDialogTitle:'新增关系来源',
      Class:'', //那个配置
      sourceForm: { //来源表单
        sourceName: '',
        desc: ''
      },
      sourceRules: {
         sourceName: [
           { required: true, message: '请输入名称', trigger: 'blur' }
         ],
       },
      relationForm: { //关系表单
        relationName: '',
        desc: ''
      },
      relationRules: {
         relationName: [
           { required: true, message: '请输入名称', trigger: 'blur' }
         ],
       },

    };
  },
  mounted() {
    this.setSourceData()
    this.setRelationData()
  },
  methods: {
    sourceDialog(type,title,id){ //来源弹窗
      let _this=this
      _this.sourceDialogFla=true
      _this.sourceDialogTitle=title
      if(type == 'add'){
        setTimeout(function(){
          _this.$refs['sourceForm'].resetFields();
        },100)
        this.$delete(this.sourceForm,'id');
      }else{
        patientsourceconfigVo(id).then(res=>{
          this.sourceForm=res.data.data
          this.$set(this.sourceForm,'id',res.data.data.id)
        })
      }
    },
    relationDialog(type,title,id){ //关系弹窗
      let _this=this
      _this.relationDialogFla=true
      _this.relationDialogTitle=title
      if(type == 'add'){
        setTimeout(function(){
          _this.$refs['relationForm'].resetFields();
        },100)
        this.$delete(this.relationForm,'id');
      }else{
        patientrelationconfigVo(id).then(res=>{
          this.relationForm=res.data.data
          this.$set(this.relationForm,'id',res.data.data.id)
        })
      }
    },
    setSourceData(){
      patientsourceconfigList().then(res=>{
        if(res.data.code==200){
          this.sourceList=res.data.data
        }
      })
    },
    setRelationData(){
      patientrelationconfigList().then(res=>{
        if(res.data.code==200){
          this.relationList=res.data.data
        }
      })
    },
    form(formName) {  //来源表单
      let _this=this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(formName=='sourceForm'){
            if(this.sourceDialogTitle=='新增患者来源'){
              addPatientsourceconfig(this.sourceForm).then(res=>{
                if(res.data.code==200){
                  this.setSourceData()
                  this.sourceDialogFla=false
                }
              })
            }else{
              putPatientsourceconfig(this.sourceForm).then(res=>{
                if(res.data.code==200){
                  this.setSourceData()
                  this.sourceDialogFla=false
                }
              })
            }

          }else{
            if(this.relationDialogTitle=='新增关系来源'){
              addPatientrelationconfig(this.relationForm).then(res=>{
                if(res.data.code==200){
                  this.setRelationData()
                  this.relationDialogFla=false
                }
              })
            }else{
              putPatientrelationconfig(this.relationForm).then(res=>{
                if(res.data.code==200){
                  this.setRelationData()
                  this.relationDialogFla=false
                }
              })
            }

          }
        } else {
          return false;
        }
      });
    },
    sourceDel(id){//来源删除
      this.$confirm("此操作将删除该条信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deletePatientsourceconfig(id).then(res=>{
          if(res.data.code==200){
            this.setSourceData()
          }
        })
      }).catch(() => {});
    },
    relationDel(id){//关系删除
      this.$confirm("此操作将删除该条信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deletePatientrelationconfig(id).then(res=>{
          if(res.data.code==200){
            this.setRelationData()
          }
        })
      }).catch(() => {});
    },
    close(formName) {
      if(formName=='sourceForm'){
        this.sourceDialogFla=false
      }else{
        this.relationDialogFla=false
      }
      this.$refs[formName].resetFields();
    },

  }
};
</script>
<style lang="less" scoped>
.cliniccfg_patient_chunk .source{
  position: relative;
  display: flex;
  align-items: stretch;
  margin-top: -10px;
  .chunk{
    width: 47%;
    box-shadow:0px 0px 6px 0px rgba(228,233,255,1);
    .title_text{
      padding: 0 25px;
      background: #F7F9FF;
      height: 48px;
      line-height: 48px;
      font-size: 14px;
      font-weight:bold;
      position: relative;
      img{
        width: 24px;
        position: absolute;
        right: 10px;
        top: 11px;
        cursor: pointer;
      }
    }
    .content{
      max-height: 700px;
      background: white;
      padding:10px 10px;
      overflow-y: auto;
      li{
        height: 35px;
        line-height: 35px;
        padding-left: 20px;
        overflow: hidden;
        .edit{
          float: right;
          display: none;
          align-items:center;
          height: 35px;
          img{
            width: 24px;
            margin-right: 10px;
            cursor: pointer;
          }
        }
      }
      li:hover{
        box-shadow:0px 0px 2px 0px rgba(59,120,253,0.56);
        .edit{
          display: flex;
        }
      }
    }
  }
  .right{
    margin-left: 3%;
  }


}
.sourceTitle {

  font-size: 18px;
  font-weight: bold;
  color: #4e81f2;
  margin-right: 20px;
  padding-bottom: 20px;
}

</style>
