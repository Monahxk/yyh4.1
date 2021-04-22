<!--
@Author: ZJZ
@Date:   2019-08-12
@Filename: Process.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-06
-->

<template>
  <div class="wrapper">
    <div class="main_top_title">技加工配置</div>
    <div class="source">
      <div class="chunk">
        <p class="title_text">加工材料
          <img src="../../../assets/img/add.png" alt=""  @click="dialog('material','add','新增加工材料')">
        </p>
        <div class="content">
          <ul>
            <li v-for='(item,index) in materialList' :key='index'>
              {{item.name}}
              <div class="edit">
                <img src="../../../assets/img/edit.png" alt="" @click="dialog('material','edit','编辑加工材料',item.id)">
                <img src="../../../assets/img/delete.png" alt="" @click='Del("material",item.id)'>
              </div>
            </li>

          </ul>
        </div>
      </div>
      <div class="chunk right">
        <p class="title_text">规格管理
          <img src="../../../assets/img/add.png" alt="" @click="dialog('model','add','新增规格管理')">
        </p>
        <div class="content">
          <ul>
            <li v-for='(item,index) in modelList' :key='index'>
              {{item.name}}
              <div class="edit">
                <img src="../../../assets/img/edit.png" alt="" @click="dialog('model','edit','编辑规格管理',item.id)">
                <img src="../../../assets/img/delete.png" alt="" @click='Del("model",item.id)'>
              </div>
            </li>

          </ul>
        </div>
      </div>
      <div class="chunk right">
        <p class="title_text">加工单位
          <img src="../../../assets/img/add.png" alt="" @click="dialog('unit','add','新增加工单位')">
        </p>
        <div class="content">
          <ul>
            <li v-for='(item,index) in unitList' :key='index'>
              {{item.name}}
              <div class="edit">
                <img src="../../../assets/img/edit.png" alt="" @click="dialog('unit','edit','编辑加工单位',item.id)">
                <img src="../../../assets/img/delete.png" alt="" @click='Del("unit",item.id)'>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="chunk right">
        <p class="title_text">取件人
          <img src="../../../assets/img/add.png" alt="" @click="dialog('contacts','add','新增取件人')">
        </p>
        <div class="content">
          <ul>
            <li v-for='(item,index) in contactsList' :key='index'>
              {{item.name}}
              <div class="edit">
                <img src="../../../assets/img/edit.png" alt="" @click="dialog('contacts','edit','编辑取件人',item.id)">
                <img src="../../../assets/img/delete.png" alt="" @click='Del("contacts",item.id)'>
              </div>
            </li>
          </ul>
        </div>
      </div>

    </div>

<!-- 患者来源的弹窗 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogFla"
        width="440px"
        center>
        <div class="content">
          <el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="55px" class="demo-ruleForm">
            <el-form-item label="名称" prop="name">
              <el-input v-model="dialogForm.name" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" :rows="4" v-model="dialogForm.remark"></el-input>
            </el-form-item>

          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="form('dialogForm')">确 定</el-button>
          <el-button @click="close('dialogForm')">取 消</el-button>
        </span>
      </el-dialog>


  </div>
</template>


<script>
import {machiningconfigList,addMachiningconfig,putMachiningconfig,deleteMachiningconfig,machiningconfigVo} from "@/api";

export default {
  name:'cliniccfgProcess',
  data() {
    return {
      materialList:[],//材料列表
      modelList:[],//规格列表
      unitList:[],//单位列表
      contactsList:[],//取件人列表
      dialogFla:false,
      dialogTitle:'新增患者来源',
      Class:'', //那个配置
      formType:'', //新增修改
      dialogForm: { //表单
        name: '',
        typeFlag: '',
        remark: '',
      },
      rules: {
         name: [
           { required: true, message: '请输入名称', trigger: 'blur' }
         ],
       },

    };
  },
  mounted() {
    this.setData('material')
    this.setData('model')
    this.setData('unit')
    this.setData('contacts')
  },
  methods: {
    dialog(Class,type,title,id){ //来源弹窗
      let _this=this
      _this.dialogFla=true
      _this.dialogTitle=title
      _this.formType=type
      _this.Class=Class
      _this.dialogForm.typeFlag=Class

      if(type == 'add'){
        setTimeout(function(){
          _this.$refs['dialogForm'].resetFields();
        },200)
      }else{
        machiningconfigVo(id).then(res=>{
          this.dialogForm=res.data.data
          _this.dialogForm.typeFlag=Class
        })
      }
    },
    setData(type){
      machiningconfigList(type).then(res=>{
        if(type == 'material'){
          this.materialList=res.data.data
        }else if(type == 'model'){
          this.modelList=res.data.data
        }else if(type == 'unit'){
          this.unitList=res.data.data
        }else if(type == 'contacts'){
          this.contactsList=res.data.data
        }
      })
    },
    form(formName) {
      let _this=this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(_this.formType=='add'){
            this.$delete(this.dialogForm,'id')
            this.$delete(this.dialogForm,'orderNo')

            addMachiningconfig(this.dialogForm).then(res=>{
              if(res.data.code==200){
                _this.dialogFla=false
                if(_this.Class == 'material'){
                  this.setData('material')
                }else if(_this.Class == 'model'){
                  this.setData('model')
                }else if(_this.Class == 'unit'){
                  this.setData('unit')
                }else if(_this.Class == 'contacts'){
                  this.setData('contacts')
                }
              }
            })
          }else{
            putMachiningconfig(this.dialogForm).then(res=>{
              if(res.data.code==200){
                _this.dialogFla=false
                if(_this.Class == 'material'){
                  this.setData('material')
                }else if(_this.Class == 'model'){
                  this.setData('model')
                }else if(_this.Class == 'unit'){
                  this.setData('unit')
                }else if(_this.Class == 'contacts'){
                  this.setData('contacts')
                }
              }
            })
          }

        } else {
          return false;
        }
      });
    },
    Del(typeFlag,id){//来源删除
      this.$confirm("此操作将删除该条信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteMachiningconfig(id).then(res=>{
          if(res.data.code==200){
            console.log(typeFlag)
            if(typeFlag == 'material'){
              this.setData('material')
            }else if(typeFlag == 'model'){
              this.setData('model')
            }else if(typeFlag == 'unit'){
              this.setData('unit')
            }else if(typeFlag == 'contacts'){
              this.setData('contacts')
            }
          }
        })
      }).catch(() => {});
    },

    close(formName) {
      this.dialogFla=false
      this.$refs[formName].resetFields();
    },

  }
};
</script>
<style lang="less" scoped>
.source {
  position: relative;
  display: flex;
  align-items: stretch;
  margin-top: -10px;
  .chunk{
    width: 23%;
    box-shadow:0px 0px 6px 0px rgba(228,233,255,1);
    .title_text{
      padding: 0 25px;
      height: 48px;
      line-height: 48px;
      background: #F7F9FF;
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
      height: 700px;
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

</style>
