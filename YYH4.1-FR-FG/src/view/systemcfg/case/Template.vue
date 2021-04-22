<!--
@Author: ZJZ
@Date:   2019-08-05
@Filename: Template.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-12
-->

<template>
  <div class="wrapper">
    <div class="case_template">

      <div class="left">
        <p class="title_text">病历分组</p>
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText" class="filter_text">
        </el-input>
        <el-tree
            :data="dataList"
            node-key="id"
            :filter-node-method="filterNode"
            ref="tree2"
            @node-click='nodeClick'
            @node-contextmenu="rightClick">
           <span class="custom-tree-node" slot-scope="{ node, data }">
             <i v-if='data.isLeaf == 0' class="group">组</i>
             <span>  {{ node.label }}</span>
           </span>
         </el-tree>
         <el-button type="primary" @click="btnAddGroup" class="add_group">添加组</el-button>

         <div v-show="menuVisible">
          <ul id="menu" class="menu">
            <li class="menu__item" @click="Rename">重命名该组</li>
            <li class="menu__item" v-show='sonCard' @click="addCard">添加模板</li>
            <li class="menu__item" @click="deleteCard">删除该组</li>
            <li class="menu__item" v-show='sonCard&&twoGroup' @click="addGroup">添加组</li>
          </ul>
         </div>
      </div>

      <div class="right">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  label-width="120px" class="demo-ruleForm">
          <el-form-item label="模版名称" prop="className">
            <el-input v-model="ruleForm.className"></el-input>
          </el-form-item>

          <el-form-item label="主诉" prop="mainComplain">
            <el-input type="textarea" v-model="ruleForm.mainComplain"></el-input>
          </el-form-item>
          <el-form-item label="现病史" prop="presentIll">
            <el-input type="textarea" v-model="ruleForm.presentIll"></el-input>
          </el-form-item>
          <el-form-item label="既往史" prop="pastIll">
            <el-input type="textarea" v-model="ruleForm.pastIll"></el-input>
          </el-form-item>
          <el-form-item label="口腔检查" prop="toothCheck">
            <el-input type="textarea" v-model="ruleForm.toothCheck"></el-input>
          </el-form-item>
          <el-form-item label="辅助检查" prop="assistCheck">
            <el-input type="textarea" v-model="ruleForm.assistCheck"></el-input>
          </el-form-item>
          <el-form-item label="诊断" prop="diagnosis">
            <el-input type="textarea" v-model="ruleForm.diagnosis"></el-input>
          </el-form-item>
          <el-form-item label="治疗计划" prop="treatPlan">
            <el-input type="textarea" v-model="ruleForm.treatPlan"></el-input>
          </el-form-item>
          <el-form-item label="处置" prop="dispose">
            <el-input type="textarea" v-model="ruleForm.dispose"></el-input>
          </el-form-item>
          <el-form-item label="医嘱" prop="advice">
            <el-input type="textarea" v-model="ruleForm.advice"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          </el-form-item>
        </el-form>
      </div>

    </div>

  </div>
</template>



<script>
import { templateclassList,systemcfgTemplateId,addTemplateclass,putTemplateclass,deleteTemplateclass,addTemplateForm } from "@/api";

export default {
  name:'caseTemplate',
  data() {

      return {
        dataList: [],
        menuVisible:false,
        sonCard:false,//三级不能创建
        twoGroup:false,//二级不能创建组
        filterText:'',
        clickObject:{},//右键被点击的object
        node:{},//右键被点击的value
        leftNode:{},//左键被点击的value

        ruleForm: {
          className: '',
          parentId: '',
          parentName: '',
          id: '',
          mainComplain: '',
          presentIll: '',
          pastIll: '',
          toothCheck: '',
          assistCheck: '',
          diagnosis: '',
          treatPlan: '',
          dispose: '',
          advice: '',
          tag: '',
          remark: '',
        },
        rules: {
          className: [
            { required: true, message: '请输入模版名称', trigger: 'blur' }
          ],
          mainComplain: [
            { required: true, message: '请输入主诉', trigger: 'blur' }
          ]
        },
        classForm:{
          // id:'',
          parentId:'',
          className:'',
          isLeaf:0,
          templateType:0,
        }



      }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },
  mounted() {
    this.setData()
  },
  methods: {
    setData(){
      templateclassList().then(res=>{
        this.dataList=res.data.data
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addTemplateForm(this.ruleForm).then(res=>{
            if(res.data.code==200){
              this.setData()
            }
          })
        } else {
          return false;
        }
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    rightClick(MouseEvent, object, Node, element) { // 鼠标右击触发事件
    if(object.isLeaf==1){
      this.sonCard=false
    }else{
      this.sonCard=true
      if(Node.level>1){
        this.twoGroup=false
      }else{
        this.twoGroup=true
      }
    }
    this.menuVisible = false // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
    this.menuVisible = true  // 显示模态窗口，跳出自定义菜单栏
    var menu = document.querySelector('#menu')
    menu.style.left = MouseEvent.clientX - 200 + 'px'
    document.addEventListener('click', this.foo) // 给整个document添加监听鼠标事件，点击任何位置执行foo方法
    menu.style.top = MouseEvent.clientY - 140 + 'px'
    // console.log('右键被点击的object:', object)

    this.clickObject=object
    this.node=Node
    },
   foo() { // 取消鼠标监听事件 菜单栏
      this.menuVisible = false
      document.removeEventListener('click', this.foo) // 要及时关掉监听，不关掉的是一个坑，不信你试试，虽然前台显示的时候没有啥毛病，加一个alert你就知道了
    },

    addCard() {
      let _this=this
      this.classForm.parentId=this.clickObject.id
      this.classForm.isLeaf=1
      this.$delete(this.classForm,'id')
      this.$prompt('', '添加模板', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern:/\S/,
        inputErrorMessage: '名称不能为空'
      }).then(({ value }) => {
        _this.classForm.className=value
        addTemplateclass(_this.classForm).then(res=>{
          if(res.data.code==200){
            this.setData()
          }
        })
      }).catch(() => {});

    },
    nodeClick(data,node,element){
      this.leftNode=data
      this.leftNode.level=node.level
      let _this=this;
      if(data.isLeaf==1){
        systemcfgTemplateId(data.templateId).then(res=>{
          if(res.data.code==200){
            if(res.data.data){
              this.ruleForm={}
              _this.ruleForm=res.data.data;
              _this.$set(_this.ruleForm,'classId',res.data.data.emrTemplateClass.id)
              _this.$set(_this.ruleForm,'parentId',res.data.data.emrTemplateClass.parentId)
              _this.$set(_this.ruleForm,'templateId',res.data.data.emrTemplateClass.templateId)
            }else{
              _this.$refs['ruleForm'].resetFields()
              this.$delete(this.ruleForm,'id')
              this.$set(_this.ruleForm,'classId',data.id)
              this.$set(_this.ruleForm,'parentId',data.parentId)
              this.$set(_this.ruleForm,'templateId',data.templateId)
            }
            this.$set(_this.ruleForm,'className',data.label)
          }
        })
      }

    },
    btnAddGroup(){
      let _this=this
      if(Object.keys(this.leftNode).length  == 0){
        _this.classForm.parentId=0
      }else{
        _this.classForm.parentId=_this.leftNode.parentId
      }
      if(this.leftNode.level>2){
        this.$message.error('只能添加两级组');
        return
      }
      _this.classForm.isLeaf=0
      this.$prompt('', '添加组', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern:/\S/,
        inputErrorMessage: '名称不能为空'
      }).then(({ value }) => {
        _this.classForm.className=value
        addTemplateclass(_this.classForm).then(res=>{
          if(res.data.code==200){
            this.setData()
          }
        })

      }).catch(() => {});
    },
    addGroup(){
      let _this=this
      this.classForm.parentId=this.clickObject.id
      this.classForm.isLeaf=0
      this.$prompt('', '添加组', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern:/\S/,
        inputErrorMessage: '名称不能为空'
      }).then(({ value }) => {
        _this.classForm.className=value
        addTemplateclass(_this.classForm).then(res=>{
          if(res.data.code==200){
            this.setData()
          }
        })

      }).catch(() => {});
    },
    Rename(){
      let _this=this
      this.classForm.parentId=this.clickObject.parentId
      this.classForm.isLeaf=parseInt(this.clickObject.isLeaf)
      this.classForm.id=this.clickObject.id
      this.$prompt('', '重命名该组', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue:_this.clickObject.label,
        inputPattern:/\S/,
        inputErrorMessage: '名称不能为空'
      }).then(({ value }) => {
        _this.classForm.className=value
        putTemplateclass(_this.classForm).then(res=>{
          if(res.data.code==200){
            this.setData()
          }
        })

      }).catch(() => {});
    },
    deleteCard() {
      this.$confirm("此操作将删除该条信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteTemplateclass(this.clickObject.id).then(res=>{
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
.case_template {
  position: relative;
  // overflow: hidden;
  box-shadow:0px 0px 6px 0px rgba(228,233,255,1);
  background: white;
  display: flex;
  display: -webkit-flex;
  display: -o-flex;
  display: -moz-flex;
  display: -ms-flex;
  align-items: stretch;
  margin-bottom: 30px;

  .left{
    width: 20%;
    padding:5px;
    text-align: center;
    box-shadow:1px 0px 0px 0px rgba(228,233,255,1);
    position: relative;
    padding-bottom: 90px;

    .title_text{
      color: #B5BED1;
      padding: 10px;
      text-align: left;
    }
    .filter_text{
      margin: 10px 0px;
    }
    .add_group{
      position: absolute;
      bottom: 40px;
      left: 50%;
      width: 100px;
      margin-left: -50px;
    }
    .el-tree{
      font-size:16px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(27,30,37,1);
      line-height:22px;
      max-height: 600px;
      overflow-y: auto;
      .group{
        display: inline-block;
        height: 25px;
        width: 25px;
        background: rgb(126, 211, 33);
        border-radius: 50%;
        text-align: center;
        line-height: 25px;
        color: white;
        font-size: 12px;
      }
    }
    .menu__item {
      display: block;
      line-height: 20px;
      text-align: center;
      margin-top: 10px;
    }
    .menu {
      width: 100px;
      position: absolute;
      background: white;
      box-shadow:0px 0px 6px 0px rgba(228,233,255,1);
      padding:0 0 10px 0;
    }
     li:hover {
      background-color: #1790ff;
      color: white;
    }
  }
  .right{
    // border:1px solid red;
    width: 79%;
    max-height: 810px;
    overflow-y: auto;
    .el-form{
      width: 95%;
      padding:20px 0;
    }
  }


}

</style>
<style lang="less">
  .case_template{
    .el-tree{
      .el-tree-node__content{
        padding:18px 0;
      }
    }
  }
</style>
