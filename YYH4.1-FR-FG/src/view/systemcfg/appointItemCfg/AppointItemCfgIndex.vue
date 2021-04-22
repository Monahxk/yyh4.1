<!--
@Author: ZJZ
@Date:   2019-08-12
@Filename: AppointItemCfgIndex.vue
@Last modified by:   ZJZ
@Last modified time: 2019-09-12
-->

<template>
  <div class="wrapper">
    <div class="appointItemCfg">

      <div class="left">
        <p class="title_text">预约大类 <img src="../../../assets/img/white_add.png" alt=""  @click="addClass"> </p>
        <el-tree
            :data="dataList"
            node-key="id"
            :default-expand-all='true'
            :filter-node-method="filterNode"
            ref="tree"
            :props="defaultProps"
            @node-click='nodeClick'
            @node-contextmenu="rightClick">
           <span class="custom-tree-node" slot-scope="{ node, data }">
             <span>{{node.label}}</span>
           </span>
         </el-tree>

         <div v-show="menuVisible">
          <ul id="menu" class="menu">
            <li class="menu__item" @click="itemDialog('add')">新增项目</li>
            <li class="menu__item" @click="Rename">修改名称</li>
            <li class="menu__item" @click="deleteCard" >删除此条目</li>
          </ul>
         </div>
      </div>

      <div class="right">
        <p class="title">预约项目</p>
        <div class="right_content">
          <ul>
            <li v-for='(item,index) in detailList' :key='index'>
              {{item.name}}
              <div class="edit">
                <img src="../../../assets/img/edit.png" alt="" @click="itemDialog('edit',item.id)">
                <img src="../../../assets/img/delete.png" alt="" @click='itemDel(item.id)'>
              </div>
            </li>
          </ul>
        </div>
      </div>
<!-- 收费项目的弹窗 -->
      <el-dialog
        :title="itemDialogTitle"
        :visible.sync="itemDialogFla"
        width="440px"
        center>
        <div class="content">
          <el-form :model="itemRuleForm" :rules="rules" ref="itemRuleForm" label-width="110px" class="demo-ruleForm">
            <el-form-item label="预约项目名称" prop="name">
              <el-input v-model="itemRuleForm.name" placeholder="请输入预约项目名称"></el-input>
            </el-form-item>
            <el-form-item label="所属预约大类" prop="treatTypeId">
              <el-select v-model="itemRuleForm.treatTypeId" placeholder="请选择所属预约大类" @change='categoryNameChange'>
                <el-option
                  :label="item.categoryName"
                  :value="item.id"
                  v-for="(item, index) of dataList"
                  :key="index"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" :rows="4" v-model="itemRuleForm.remark"></el-input>
            </el-form-item>

          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="itemForm('itemRuleForm')">确 定</el-button>
          <el-button @click="itemDialogFla = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>

  </div>
</template>



<script>
import {appointmenttypeanditemList,appointmentitemconfigId,appointmentitemconfigTypeId,putAppointmentitemconfig,addAppointmentitemconfig,deleteAppointmentitemconfig,deleteAppointmenttypeconfig,putAppointmenttypeconfig,addAppointmenttypeconfig} from "@/api";
export default {
  name:'caseTemplate',
  data() {
      return {
        itemDialogFla:false,
        itemDialogTitle:'新增预约项目',
        dataList: [],
        menuVisible:false,
        clickObject:{},//右键被点击的object
        node:{},//右键被点击的value
        treatTypeId: '',//大类id
        defaultProps: {
          value:'id',
          label: 'categoryName',
  			},
        itemRuleForm: { //表单
          name: '',
          treatTypeId: '',
          appointTypeName: '',
          remark: '',
        },
        rules: {
           name: [
             { required: true, message: '请输入编码', trigger: 'blur' }
           ],
           treatTypeId: [
             { required: true, message: '请选择预约项目类别', trigger: 'change' }
           ],
         },
        detailList:[],
        rightFla:false,
        classRuleForm: { //大类表单
          categoryName: '',
          remark: '',
        },


      }
  },
  mounted() {
    this.setData()
  },
  methods: {
    setData(){
      appointmenttypeanditemList().then(res=>{
        this.dataList=res.data.data
      })
    },
    categoryNameChange(val){
      this.dataList.map(res=>{
        if(res.id==val){
          this.itemRuleForm.appointTypeName=res.categoryName
        }
      })
    },
    itemDialog(type,id){
      let _this=this
      _this.itemDialogFla=true
      if(type == 'add'){
        _this.itemDialogTitle='新增预约项目'
        setTimeout(function(){
          _this.$refs['itemRuleForm'].resetFields();
          _this.itemRuleForm.treatTypeId=_this.clickObject.id
          _this.itemRuleForm.appointTypeName=_this.clickObject.categoryName
        },100)
        this.treatTypeId=this.clickObject.id

        // this.$set(this.itemRuleForm,'treatTypeId',this.clickObject.id)
        this.$delete(this.itemRuleForm,'id');
      }else{
        _this.itemDialogTitle='编辑预约项目'
        appointmentitemconfigId(id).then(res=>{
          this.itemRuleForm=res.data.data
          this.$set(this.itemRuleForm,'id',res.data.data.id)
        })
      }

    },
    itemForm(formName) {  //项目表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.itemDialogTitle=='新增预约项目'){
            addAppointmentitemconfig(this.itemRuleForm).then(res=>{
              if(res.data.code==200){
                this.itemDialogFla=false
                this.detailData()
              }
            })
          }else{
            putAppointmentitemconfig(this.itemRuleForm).then(res=>{
              if(res.data.code==200){
                this.itemDialogFla=false
                this.detailData()
              }
            })
          }

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
      this.menuVisible = false
      this.menuVisible = true
      var menu = document.querySelector('#menu')
      menu.style.left = MouseEvent.clientX - 200 + 'px'
      document.addEventListener('click', this.foo)
      menu.style.top = MouseEvent.clientY - 140 + 'px'
      this.clickObject=object
      this.node=Node
    },
   foo() { // 取消鼠标监听事件 菜单栏
      this.menuVisible = false
      document.removeEventListener('click', this.foo) // 要及时关掉监听，不关掉的是一个坑，不信你试试，虽然前台显示的时候没有啥毛病，加一个alert你就知道了
    },
    nodeClick(data,node,element){
      let _this=this
      this.treatTypeId=data.id
      this.detailData()
    },
    detailData(id){
      this.detailList=[]
      appointmentitemconfigTypeId(this.treatTypeId).then(res=>{
        if(res.data.code==200){
          this.detailList=res.data.data
          this.rightFla=true
        }
      })
    },

    addClass(){
      let _this=this
      this.$prompt('', '新增大类', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // inputValue:'',
        inputPattern:/\S/,
        inputErrorMessage: '名称不能为空'
      }).then(({ value }) => {
        _this.classRuleForm.categoryName=value
        _this.$delete(this.classRuleForm,'id');
        addAppointmenttypeconfig(_this.classRuleForm).then(res=>{
          if(res.data.code==200){
            _this.setData()
          }
        })

      }).catch(() => {});
    },
    Rename(){
      let _this=this
      this.classRuleForm.categoryName=this.clickObject.categoryName
      _this.$set(this.classRuleForm,'id',this.clickObject.id);
      this.$prompt('', '重命名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue:this.classRuleForm.categoryName,
        inputPattern:/\S/,
        inputErrorMessage: '名称不能为空'
      }).then(({ value }) => {
        _this.classRuleForm.categoryName=value
        putAppointmenttypeconfig(_this.classRuleForm).then(res=>{
          if(res.data.code==200){
            _this.setData()
          }
        })

      }).catch(() => {});
    },
    deleteCard(id) {
      this.$confirm("此操作将删除该大类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteAppointmenttypeconfig(this.clickObject.id).then(res=>{
          if(res.data.code==200){
            this.setData()
          }
        })
      }).catch(() => {});;

    },
    itemDel(id){
      this.$confirm("此操作将删除该预约项目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteAppointmentitemconfig(id).then(res=>{
          if(res.data.code==200){
            this.detailData()
          }
        })
      }).catch(() => {});;
    }

  },
};
</script>
<style lang="less" scoped>
.appointItemCfg {
  position: relative;
  overflow: hidden;
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
    width: 11%;
    min-width: 190px;
    padding:5px;
    text-align: center;
    box-shadow:1px 0px 0px 0px rgba(228,233,255,1);
    position: relative;
    padding-bottom: 30px;

    .title_text{
      color: #B5BED1;
      padding: 10px;
      text-align: left;
      position: relative;
      img{
        width: 24px;
        position: absolute;
        left: 150px;
        top: 5px;
        cursor: pointer;
      }
    }
    .filter_text{
      margin: 10px 0px;
    }
    .add_group{
      position: absolute;
      bottom: 20px;
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
      max-height: 670px;
      overflow-y: auto;
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
    width: 89%;
    min-height: 800px;
    padding:10px 20px;
    max-height: 810px;
    .title{
      color: #B5BED1;
    }
    .right_content{
      height: 700px;
      background: white;
      padding:10px 10px;
      overflow: hidden;
      li{
        height: 35px;
        line-height: 35px;
        padding-left: 20px;
        overflow: hidden;
        float: left;
        width: 270px;
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



}

</style>
<style lang="less">
  .appointItemCfg{
    .el-tree{
      margin-top: 20px;
      .el-tree-node__content{
        padding:18px 0;
      }
    }
    .el-dialog{
      .el-select{
        width: 100%;
      }
    }
  }
</style>
