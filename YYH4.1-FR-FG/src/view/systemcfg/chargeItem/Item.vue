<!--
@Author: ZJZ
@Date:   2019-08-05
@Filename: Item.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-15
-->

<template>
  <div class="wrapper">
    <div class="charge_item">

      <div class="left">
        <p class="title_text">诊疗服务<img src="../../../assets/img/white_add.png" alt=""  @click="addClass"> </p>
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
            <!-- <li class="menu__item" @click="itemDialog('add')">新增项目</li> -->
            <li class="menu__item" @click="Rename">修改名称</li>
            <li class="menu__item" @click="deleteCard" >删除此条目</li>
          </ul>
         </div>
      </div>

      <div class="right">
        <div class="right_content">
          <div class="box_header">
            <el-form :inline="true" ref='formSearch' :model="formSearch" class="demo-form-inline">
              <el-row :gutter="24">
                <el-col :span="6">
                  <el-form-item label="编码" prop='itemCode'>
                    <el-input v-model="formSearch.itemCode" clearable  placeholder="请输入编码"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="名称" prop='expName'>
                    <el-input v-model="formSearch.expName" clearable  placeholder="请输入名称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-button type="primary"  @click="inquire">搜索</el-button>
                    <el-button  @click="empty">清空</el-button>
                  </el-form-item>
                </el-col>
                <el-col :span="2" :push='6'>
                  <el-form-item>
                    <el-button type="primary" @click="itemDialog('add')" v-if="itemEditable == 1">新增项目</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>

          </div>
          <div class="wrapper_table1">
            <el-table
              highlight-current-row
              ref="singleTable"
              :data="detailList"
              style="font-size: 14px"
              height="600"
              :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
            >
              <el-table-column prop="itemCode" label="编码"  align="center"></el-table-column>
              <el-table-column prop="itemName" label="名称"  align="center"></el-table-column>
              <el-table-column prop="chargingTypeName" label="所属子类"  align="center"></el-table-column>
              <el-table-column prop="itemSpec" label="规格" sortable align="center"></el-table-column>
              <el-table-column prop="unit" label="单位" sortable align="center"></el-table-column>
              <el-table-column prop="retailPriceYuan" label="价格（元）" sortable align="center"></el-table-column>
              <el-table-column label="状态" sortable align="center">
                <template slot-scope="scope" >
                  {{scope.row.discountFlag == 0?'可以折扣':'无折扣'}}
                </template>
              </el-table-column>

              <el-table-column label="操作" width="150" v-if="itemEditable == 1">
                <template slot-scope="scope" style="marginLeft:-25px">
                  <el-button type="text" size="small" @click="itemDialog('edit',scope.row.id)">编辑</el-button>
                  <span class="line">|</span>
                  <el-button type="text" size="small" @click="itemDel(scope.row.id)">删除</el-button>
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
      </div>
<!-- 收费项目的弹窗 -->
    <el-dialog
      :title="itemDialogTitle"
      :visible.sync="itemDialogFla"
      width="440px"
      center>
      <div class="content">
        <el-form :model="itemRuleForm" :rules="rules" ref="itemRuleForm" label-width="80px" class="demo-ruleForm">
          <el-form-item label="编码" prop="itemCode">
            <el-input v-model="itemRuleForm.itemCode" placeholder="请输入编码"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="itemName">
            <el-input v-model="itemRuleForm.itemName" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="所属子类" prop="chargingTypeId">
            <el-select v-model="itemRuleForm.chargingTypeId" placeholder="请选择所属子类">
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="(item, index) of dataList"
                :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="规格"  prop="itemSpec">
            <el-input v-model="itemRuleForm.itemSpec" placeholder="请输入规格"></el-input>
          </el-form-item>
          <el-form-item label="单位" prop="unit">
            <el-input v-model="itemRuleForm.unit" placeholder="请输入单位"></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="retailPriceYuan">
            <el-input v-model="itemRuleForm.retailPriceYuan" placeholder="请输入价格"></el-input>
          </el-form-item>
          <el-form-item label="" prop="discountFlag">
            <el-checkbox :true-label='1' :false-label='0' v-model="itemRuleForm.discountFlag">整单无折扣</el-checkbox>
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
import {chargetypeconfigListService,addChargetypeconfig,putChargetypeconfig,deleteChargetypeconfig,chargitemconfigList,addChargitemconfig,putChargitemconfig,chargitemconfigVo,getChargeitemconfigable,deleteChargeitemconfig} from "@/api";
export default {
  name:'caseTemplate',
  data() {
      return {
        itemDialogFla:false,
        itemDialogTitle:'新增收费项目',
        dataList: [],//左边大类列表
        classRuleForm: { //大类表单
          name: '',
          type: 0,
        },
        menuVisible:false,
        clickObject:{},//右键被点击的object
        node:{},//右键被点击的value
        appointTypeId: '',//大类id
        formSearch: { //项目搜索
          chargingTypeId: '',
          itemCode: '',
          expName: '',
          totalNumber:10,
          page: 1,
          pageSize: 10,
        },
        defaultProps: {
          value:'id',
          label: 'name',
  			},
        itemRuleForm: { //表单
          itemCode: '',
          itemName: '',
          chargingTypeId: '',
          itemSpec: '',
          unit: '',
          retailPriceYuan: '',
          discountFlag: '0',
        },
        rules: {
          itemCode: [
            { required: true, message: '请输入编码', trigger: 'blur' }
          ],
          itemName: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          retailPriceYuan: [
            { required: true, message: '请输入价格', trigger: 'blur' }
          ],
          chargingTypeId: [
            { required: true, message: '请选择所属子类', trigger: 'change' }
          ],
        },
        detailList:[],//右边列表
        itemEditable: 0,//收费项目编辑，新增，删除权限


      }
  },
  mounted() {
    this.setData()
    this.detailData()
    getChargeitemconfigable().then(res => {
      if(res.data.code == 200) {
        this.itemEditable = res.data.data
      }
    })
  },
  methods: {
    setData(){
      chargetypeconfigListService().then(res=>{
        this.dataList=res.data.data
        this.dataList.unshift({name:'全部',id:''})
      })
    },
    itemDialog(type,id){
      let _this=this
      _this.itemDialogFla=true
      if(type == 'add'){
        _this.itemDialogTitle='新增收费项目'
        setTimeout(function(){
          _this.$refs['itemRuleForm'].resetFields();
        },100)
        this.$delete(this.itemRuleForm,'id');
      }else{
        _this.itemDialogTitle='编辑收费项目'
        chargitemconfigVo(id).then(res=>{
          _this.$refs['itemRuleForm'].clearValidate();
          this.itemRuleForm=res.data.data
          this.$set(this.itemRuleForm,'id',res.data.data.id)
        })
      }

    },
    itemForm(formName) {  //项目表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.itemDialogTitle=='新增收费项目'){
            addChargitemconfig(this.itemRuleForm).then(res=>{
              if(res.data.code==200){
                this.itemDialogFla=false
                this.detailData()
              }
            })
          }else{
            putChargitemconfig(this.itemRuleForm).then(res=>{
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
      this.appointTypeId=data.id
      this.formSearch.chargingTypeId=data.id
      this.itemRuleForm.chargingTypeId=data.id
      this.detailData()
    },
    detailData(id){
      this.detailList=[]
      chargitemconfigList({params:this.formSearch}).then(res=>{
        if(res.data.code==200){
          this.detailList=res.data.data
          this.formSearch.totalNumber=res.data.totalNumber
        }
      })
    },
    itemDel(id){
      this.$confirm("此操作将删除该项目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteChargeitemconfig(id).then(res=>{
          if(res.data.code==200){
            this.detailData()
          }
        })
      }).catch(() => {});;
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
        _this.classRuleForm.name=value
        _this.$delete(this.classRuleForm,'id');
        addChargetypeconfig(_this.classRuleForm).then(res=>{
          if(res.data.code==200){
            _this.setData()
          }
        })

      }).catch(() => {});
    },
    Rename(){
      let _this=this
      this.classRuleForm.name=this.clickObject.name
      console.log(this.clickObject.name)
      _this.$set(this.classRuleForm,'id',this.clickObject.id);
      this.$prompt('', '重命名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue:this.classRuleForm.name,
        inputPattern:/\S/,
        inputErrorMessage: '名称不能为空'
      }).then(({ value }) => {
        _this.classRuleForm.name=value
        putChargetypeconfig(_this.classRuleForm).then(res=>{
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
        deleteChargetypeconfig(this.clickObject.id).then(res=>{
          if(res.data.code==200){
            this.setData()
          }
        })
      }).catch(() => {});;

    },
    handleSizeChange(pageSize) {
      this.formSearch.pageSize=pageSize
      this.detailData()
    },
    handleCurrentChange(val) {
      this.formSearch.page = val;
      this.detailData()
    },
    inquire(){
      this.formSearch.page = 1;
      this.detailData()
    },
    empty(){
      this.$refs['formSearch'].resetFields();
      this.formSearch.page = 1;
      this.detailData()
    },


  },
};
</script>
<style lang="less" scoped>
.wrapper{
  height: 100%;
  display: flex;
  flex-direction: column;
}
.charge_item {
  position: relative;
  // box-shadow:0px 0px 6px 0px rgba(228,233,255,1);
  border:1px solid #e4e9ff;
  background: white;
  height: 93%;

  // display: flex;
  // display: -webkit-flex;
  // display: -o-flex;
  // display: -moz-flex;
  // display: -ms-flex;
  // align-items: stretch;
  margin-bottom: 30px;
  .left{
    width: 200px;
    min-width: 200px;
    height: 100%;
    overflow-y: auto;
    border-right: 1px solid #DFE7F0;
    position: absolute;
    left: 0;
    top: 0;

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
    margin-left: 200px;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    position: relative;
    .title{
      color: #B5BED1;
    }
    .right_content{
      height: 700px;
      background: white;
      padding:10px 10px;
      // overflow: hidden;
      .box_header{
        box-shadow: none;
        padding:0;
        margin:0;
      }
      .wrapper_table1{
        box-shadow:none;
        border: 1px solid #DFE7F0;
        .pagination_box{
          right: 2%;
          width: 96%;
        }
      }

    }
  }



}

</style>
<style lang="less">
  .charge_item{
    .el-tree{
      margin-top: 20px;
      .el-tree-node__content{
        padding:22px 0;
      }
    }
    .el-dialog{
      .el-select{
        width: 100%;
      }
    }
  }
  .pagination_box{
    padding:0 !important;
    padding-right: 40px;
  }
</style>
