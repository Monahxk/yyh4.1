<template>
  <div class="wrapper">
    <div class="stockpile">
      <div class="box_header">
        <el-form :inline="true" :model="formSearch" class="demo-form-inline">
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="配置名称">
                <el-input v-model="formSearch.configName" clearable placeholder="关键词/拼音查询"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3" :push="14">
              <el-form-item>
                <el-button type="primary" class="search_btn" round @click="inquire">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
        <div class="add_btn" @click="dialog('add')">新增配置</div>
      </div>


      <div class="table_list">
        <el-table
          highlight-current-row
          ref="singleTable"
          :data="list"
          height="740"
          :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
        >
          <el-table-column prop="configName" label="配置名称" sortable align="center"></el-table-column>
          <el-table-column prop="configCode" label="配置编码" sortable align="center"></el-table-column>
          <el-table-column prop="configValue" label="配置项值"  align="center"></el-table-column>
          <el-table-column prop="configUnit" label="单位"  align="center"></el-table-column>
          <el-table-column prop="remark" label="备注"  align="center"></el-table-column>
          <el-table-column prop="abc" label="状态"  align="center">
            <template slot-scope="scope" >
              {{scope.row.delFlag == 0?'启用':'禁用'}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope" style="marginLeft:-25px">
              <el-button type="text" size="small" @click="dialog('edit',scope.row.id)">修改</el-button>
              <span class="line">|</span>
              <el-button type="text" size="small" @click="Del(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination_box">
          <div class="block">
            <el-pagination
              prev-text="上一页"
              next-text="下一页"
              background
              layout="total,prev,pager,next,sizes,jumper"
              :page-sizes="[4, 10, 15, 20]"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :pager-count="9"
              :total="formSearch.totalNumber"
              :current-page="formSearch.page"
            ></el-pagination>
          </div>
        </div>
      </div>



    </div>

    <el-dialog
      :title="DialogTitle"
      :visible.sync="DialogFla"
      width="40%"
      center>
      <div class="content">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
          <el-form-item label="配置名称"  prop="configName">
            <el-input v-model="form.configName" placeholder="请输入配置名称"></el-input>
          </el-form-item>
          <el-form-item label="配置编码" prop="configCode">
            <el-input v-model="form.configCode" placeholder="请输入配置编码"></el-input>
          </el-form-item>
          <el-form-item label="配置值" prop="configValue">
            <el-input v-model="form.configValue" placeholder="请输入配置值"></el-input>
          </el-form-item>
          <el-form-item label="单位" prop="configUnit">
            <el-input v-model="form.configUnit" placeholder="请输入单位"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" :rows="4" v-model="form.remark"></el-input>
          </el-form-item>

        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogForm('form')">确 定</el-button>
        <el-button @click="DialogFla=false">取 消</el-button>
      </span>
    </el-dialog>

  </div>
</template>



<script>
import {globalparamList,addGlobalparam,globalparamId,deleteGlobalparam } from "@/api";
export default {
  name:'stockpile',
  data() {

    return {
      formSearch: { //筛选搜索
        configName: '',
        configCode: '',
        totalNumber:0,
        page: 1,
        pageSize: 10,
      },
      list: [],
      DialogTitle:'新增配置',
      DialogFla:false,
      form: { //表单
        configName: '',
        configCode: '',
        configValue: '',
        configUnit: '',
        remark: ''
      },
      rules: {
         configName: [
           { required: true, message: '请输入配置名称', trigger: 'blur' }
         ],

       },
    };
  },
  mounted() {
    this.setData()
  },
  methods: {
    setData(){
      globalparamList({params:this.formSearch}).then(res=>{
        this.list=res.data.data
        this.formSearch.totalNumber=res.data.totalNumber
      })
    },
    dialogForm(formName) {  //表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addGlobalparam(this.form).then(res=>{
            if(res.data.code==200){
              this.DialogFla=false
              this.setData()
            }
          })
        } else {
          return false;
        }
      });
    },

    dialog(type,id){ //弹窗
      let _this=this
      _this.DialogFla=true
      if(type == 'add'){
        _this.DialogTitle='新增配置'
        setTimeout(function(){
          _this.$refs['form'].resetFields();
        },100)
        this.$delete(this.form,'id');
      }else{
        _this.DialogTitle='修改配置'

        globalparamId(id).then(res=>{
          this.form=res.data.data
          this.$set(this.form,'id',res.data.data.id)
        })
      }
    },
    Del(id){
      this.$confirm("此操作将删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteGlobalparam(id).then(res=>{
          if(res.data.code==200){
            this.setData()
          }
        })
      }).catch(() => {});;
    },
    handleSizeChange(pageSize) {
      this.formSearch.pageSize=pageSize
      this.setData()
    },
    handleCurrentChange(val) {
      this.formSearch.page = val;
      this.setData()
    },
    inquire(){
      this.formSearch.page = 1;
      this.setData()
    }

  },
};
</script>
<style lang="less" scoped>
  .stockpile{

    background: white;
    // position: relative;

  }
</style>
