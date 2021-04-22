<!--
@Author: ZJZ
@Date:   2019-08-14
@Filename: Registration.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-08
-->

<template>
    <div class="charge_item">
      <div class="box_header">
        <div class="add_btn" @click="classDialog('add')">新增挂号费</div>
        <div class="box_right">

        </div>
      </div>
        <div class="wrapper1">
          <el-table
            highlight-current-row
            ref="singleTable"
            :data="list"
            height="700"
            :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
          >
            <el-table-column prop="typeName" label="类别名称" sortable align="center"></el-table-column>
            <el-table-column label="挂号费" align="center">
              <template slot-scope="scope" >
                ￥{{scope.row.feeYuan}}
              </template>
            </el-table-column>
            <el-table-column sortable label="操作" width="150">
              <template slot-scope="scope" style="marginLeft:-25px">
                <el-button type="text" size="small" @click="classDialog('edit',scope.row.id)">编辑</el-button>
                <span class="line">|</span>
                <el-button type="text" size="small" @click="classDel(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

        </div>

<!-- 大类的弹窗 -->
      <el-dialog
        :title="classDialogTitle"
        :visible.sync="classDialogFla"
        width="440px"
        center>
        <div class="content">
          <el-form :model="classRuleForm" :rules="classRules" ref="classForm" label-width="80px" class="demo-ruleForm">
            <el-form-item label="类别名称" prop="typeName">
              <el-input v-model="classRuleForm.typeName" placeholder="请输入类别名称"></el-input>
            </el-form-item>
            <el-form-item label="挂号费" prop="feeYuan">
              <el-input v-model="classRuleForm.feeYuan" placeholder="请输入挂号费"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="classForm('classForm')">保 存</el-button>
          <el-button @click="classDialogFla = false">取 消</el-button>
        </span>
      </el-dialog>


  </div>
</template>



<script>

import {regfeeconfigList,addRegfeeconfig,putRegfeeconfig,regfeeconfigDo,deleteRegfeeconfig} from "@/api";
export default {
  name:'class',
  data() {
    return {
      classDialogFla:false,
      classDialogTitle:'新增挂号费',

      classRuleForm: { //表单
        typeName: '',
        feeYuan: '',
      },
      classRules: {
         typeName: [
           { required: true, message: '请输入名称', trigger: 'blur' }
         ],
         feeYuan: [
           { required: true, message: '请输入挂号费', trigger: 'blur' }
         ],


       },
      list: [],

    };
  },
  computed: {},
  mounted() {
    this.setData();
  },
  methods: {
    setData(){
      regfeeconfigList({params:this.formSearch}).then(res=>{
        if(res.data.code==200){
          this.list=res.data.data
        }
      })
    },
    classForm(formName) {  //项目表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.classDialogTitle=='新增挂号费'){
            addRegfeeconfig(this.classRuleForm).then(res=>{
              if(res.data.code==200){
                this.classDialogFla=false
                this.setData()
              }
            })
          }else{
            putRegfeeconfig(this.classRuleForm).then(res=>{
              if(res.data.code==200){
                this.classDialogFla=false
                this.setData()
              }
            })
          }

        } else {
          return false;
        }
      });
    },
    classDialog(type,id){
      let _this=this
      _this.classDialogFla=true
      if(type == 'add'){
        _this.classDialogTitle='新增挂号费'
        setTimeout(function(){
          _this.$refs['classForm'].resetFields();
        },100)
        this.$delete(this.classRuleForm,'id');
      }else{
        _this.classDialogTitle='修改挂号费'
        regfeeconfigDo(id).then(res=>{
          this.classRuleForm=res.data.data
          this.$set(this.classRuleForm,'id',res.data.data.id)
        })
      }

    },
    classDel(id){
      this.$confirm("此操作将删除该挂号费, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteRegfeeconfig(id).then(res=>{
          if(res.data.code==200){
            this.setData()
          }
        })
      }).catch(() => {});
    },

  },
};
</script>
<style lang="less" scoped>
.charge_item {
  .box_header{
    padding:0;
    margin:0;
  }
  .add_btn{
    top: 20px!important;
  }
  .wrapper1{
    background: white
  }
  .el-dialog{
    .el-select{
      width: 100%;
    }
  }
}

</style>
