<!--
@Author: ZJZ
@Date:   2019-08-02
@Filename: callbackcfgIndex.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-11
-->

<template>
  <div class="cliniccfg_patient_chunk">
    <div class="main_top_title">回访配置</div>
    <div class="source">
      <div class="chunk">
        <p class="title_text">回访内容
          <img src="../../../assets/img/add.png" alt=""  @click="contentDialog('add','新增回访内容')">
        </p>
        <div class="content">
          <ul>
            <li v-for='(item,index) in contentData' :key='index'>
              {{item.name}}
              <div class="edit">
                <img src="../../../assets/img/edit.png" alt="" @click="contentDialog('edit','编辑回访内容',item.id)">
                <img src="../../../assets/img/delete.png" alt="" @click='Del(item.id,"content")'>
              </div>
            </li>

          </ul>
        </div>
      </div>
      <div class="chunk right">
        <p class="title_text">回访结果
          <img src="../../../assets/img/add.png" alt="" @click="resultDialog('add','新增回访结果')">
        </p>
        <div class="content">
          <ul>
            <li v-for='(item,index) in resultList' :key='index'>
              {{item.name}}
              <div class="edit">
                <img src="../../../assets/img/edit.png" alt="" @click="resultDialog('edit','编辑回访结果',item.id)">
                <img src="../../../assets/img/delete.png" alt="" @click='Del(item.id,"result")'>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="chunk right">
        <p class="title_text">回访计划
          <img src="../../../assets/img/add.png" alt="" @click="planDialog('add','新增回访计划')">
        </p>
        <div class="content">
          <ul>
            <li v-for='(item,index) in planList' :key='index'>
              {{item.name}}
              <div class="edit">
                <img src="../../../assets/img/edit.png" alt="" @click="planDialog('edit','编辑回访计划',item.id)">
                <img src="../../../assets/img/delete.png" alt="" @click='Del(item.id,"plan")'>
              </div>
            </li>
          </ul>
        </div>
      </div>

    </div>

<!-- 内容的弹窗 -->
      <el-dialog
        :title="contentDialogTitle"
        :visible.sync="contentDialogFla"
        width="450px"
        center>
        <div class="content">
          <el-form :model="contentForm" :rules="contentRules" ref="contentForm" label-width="55px" class="demo-ruleForm">
            <el-form-item label="名称" prop="name">
              <el-input v-model="contentForm.name" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" :rows="4" v-model="contentForm.remark"></el-input>
            </el-form-item>

          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="form('contentForm')">确 定</el-button>
          <el-button @click="close('contentForm')">取 消</el-button>
        </span>
      </el-dialog>
<!-- 结果的弹窗 -->
      <el-dialog
        :title="resultDialogTitle"
        :visible.sync="resultDialogFla"
        width="450px"
        center>
        <div class="content">
          <el-form :model="resultForm" :rules="resultRules" ref="resultForm" label-width="55px" class="demo-ruleForm">
            <el-form-item label="名称" prop="name">
              <el-input v-model="resultForm.name" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" :rows="4" v-model="resultForm.remark"></el-input>
            </el-form-item>

          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="form('resultForm')">确 定</el-button>
          <el-button @click="close('resultForm')">取 消</el-button>
        </span>
      </el-dialog>
<!-- 计划的弹窗 -->
      <el-dialog
        :title="planDialogTitle"
        :visible.sync="planDialogFla"
        width="450px"
        center>
        <div class="content">
          <el-form :model="planForm" :rules="planRules" ref="planForm" label-width="80px" class="demo-ruleForm">
            <el-form-item label="内容" prop="name">
              <el-input v-model="planForm.name"></el-input>
            </el-form-item>
            <el-form-item label="周期 (天)" prop="period">
              <el-input v-model="planForm.period"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="planForm.remark"></el-input>
            </el-form-item>

          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="form('planForm')">确 定</el-button>
          <el-button @click="close('planForm')">取 消</el-button>
        </span>
      </el-dialog>


  </div>
</template>


<script>
import {getContentlist,postCallbackContent,putCallbackContent,callbackcfgdoId,getCallbackperiodlist,postCallbackperiod,putCallbackperiod,getCallbackresultlist,deleteContentId,postCallbackresult,putCallbackresult} from "@/api";

export default {
  name:'patient',
  data() {
    return {
      contentData:[],//内容
      resultList:[],//关系
      planList:[],//计划
      contentDialogFla:false,
      contentDialogTitle:'新增回访内容',
      resultDialogFla:false,
      resultDialogTitle:'新增回访结果',
      planDialogFla:false,
      planDialogTitle:'新增回访计划',
      Class:'', //那个配置
      contentForm: { //内容表单
        name: "",
        remark: "",
        id: ""
      },
      contentRules: {
         name: [
           { required: true, message: '请输入名称', trigger: 'blur' }
         ],
       },
      resultForm: { //结果表单
        name: '',
        remark: ''
      },
      resultRules: {
         name: [
           { required: true, message: '请输入名称', trigger: 'blur' }
         ],
       },
      planForm: { //结果表单
        name: "",
        period: "",
        remark: "",
        id: ""
      },
      planRules: {
        name: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        period: [
          { required: true, message: '请输入周期', trigger: 'blur' }
        ],
       },

    };
  },
  mounted() {
    this.setContentData()
    this.setresultData()
    this.planData()
  },
  methods: {
    contentDialog(type,title,id){ //回访弹窗
      let _this=this
      _this.contentDialogFla=true
      _this.contentDialogTitle=title
      if(type == 'add'){
        setTimeout(function(){
          _this.$refs['contentForm'].resetFields();
        },100)
        this.$delete(this.contentForm,'id');
      }else{
        callbackcfgdoId(id).then(res=>{
          this.contentForm=res.data.data
          this.$set(this.contentForm,'id',res.data.data.id)
        })
      }
    },
    resultDialog(type,title,id){ //结果弹窗
      let _this=this
      _this.resultDialogFla=true
      _this.resultDialogTitle=title
      if(type == 'add'){
        setTimeout(function(){
          _this.$refs['resultForm'].resetFields();
        },100)
        this.$delete(this.resultForm,'id');
      }else{
        callbackcfgdoId(id).then(res=>{
          this.resultForm=res.data.data
          this.$set(this.resultForm,'id',res.data.data.id)
        })
      }
    },
    planDialog(type,title,id){ //计划弹窗
      let _this=this
      _this.planDialogFla=true
      _this.planDialogTitle=title
      if(type == 'add'){
        setTimeout(function(){
          _this.$refs['planForm'].resetFields();
        },100)
        this.$delete(this.planForm,'id');
      }else{
        callbackcfgdoId(id).then(res=>{
          this.planForm=res.data.data
          this.$set(this.planForm,'id',res.data.data.id)
        })
      }
    },
    setContentData(){
      getContentlist().then(res=>{
        if(res.data.code==200){
          this.contentData=res.data.data
        }
      })
    },
    setresultData(){
      getCallbackresultlist().then(res=>{
        if(res.data.code==200){
          this.resultList=res.data.data
        }
      })
    },
    planData(){
      getCallbackperiodlist().then(res=>{
        if(res.data.code==200){
          this.planList=res.data.data
        }
      })
    },
    form(formName) {  //表单
      let _this=this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(formName=='contentForm'){
            if(this.contentDialogTitle=='新增回访内容'){
              postCallbackContent(this.contentForm).then(res=>{
                if(res.data.code==200){
                  this.setContentData()
                  this.contentDialogFla=false
                }
              })
            }else{
              putCallbackContent(this.contentForm).then(res=>{
                if(res.data.code==200){
                  this.setContentData()
                  this.contentDialogFla=false
                }
              })
            }

          }else if(formName=='resultForm'){
            if(this.resultDialogTitle=='新增回访结果'){
              postCallbackresult(this.resultForm).then(res=>{
                if(res.data.code==200){
                  this.setresultData()
                  this.resultDialogFla=false
                }
              })
            }else{
              putCallbackresult(this.resultForm).then(res=>{
                if(res.data.code==200){
                  this.setresultData()
                  this.resultDialogFla=false
                }
              })
            }

          }else{
            if(this.planDialogTitle=='新增回访计划'){
              postCallbackperiod(this.planForm).then(res=>{
                if(res.data.code==200){
                  this.planData()
                  this.planDialogFla=false
                }
              })
            }else{
              putCallbackperiod(this.planForm).then(res=>{
                if(res.data.code==200){
                  this.planData()
                  this.planDialogFla=false
                }
              })
            }

          }
        } else {
          return false;
        }
      });
    },
    Del(id,type){//来源删除
      this.$confirm("此操作将删除该条信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteContentId(id).then(res=>{
          if(res.data.code==200){
            if(type=='content'){
              this.setContentData()
            }else if(type=='result'){
              this.setresultData()
            }else{
              this.planData()
            }

          }
        })
      }).catch(() => {});
    },

    close(formName) {
      if(formName=='contentForm'){
        this.contentDialogFla=false
      }else if(formName=='resultForm'){
        this.resultDialogFla=false
      }else{
        this.planDialogFla=false
      }
      this.$refs[formName].resetFields();
    },

  }
};
</script>
<style lang="less" scoped>
.cliniccfg_patient_chunk {
  height: 100%;
  .source{
    position: relative;
    margin-top: -10px;
    display: flex;
    background: white;
    height: 94%;
    .chunk{
      width:33.3%;
      border:1px solid #DFE7F0;
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
}


</style>
