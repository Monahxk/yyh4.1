<template>
  <div class="wrapper">
    <div class="case_entry">

      <div class="left">
        <p class="title_text">词条分组</p>
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText" class="filter_text">
        </el-input>
        <el-tree
            :data="dataList"
            node-key="id"
            :default-expand-all='true'
            :filter-node-method="filterNode"
            ref="tree"
            @node-click='nodeClick'
            @node-contextmenu="rightClick">
           <span class="custom-tree-node" slot-scope="{ node, data }">
             <span>{{node.label}}</span>
           </span>
         </el-tree>

         <div v-show="menuVisible">
          <ul id="menu" class="menu">
            <li class="menu__item" @click="addCard" v-if='addEdit'>新增子条目</li>
            <li class="menu__item" @click="Rename" v-if='!addEdit'>重命名该组</li>
            <li class="menu__item" @click="deleteCard" v-if='!addEdit'>删除该组</li>
          </ul>
         </div>
      </div>

      <div class="right">
        <p class="title">{{detailText}}</p>
        <div class="right_content">
          <div class="text_chunk" v-for='(item,index) in detailList'>{{item.termsDetail}} <span @click="deleteDetail(item.id)">×</span></div>
          <el-button type="primary" v-if='rightFla' @click="btnAddGroup" class="add_chunk_entry" round>新增</el-button>
        </div>
      </div>

    </div>

  </div>
</template>



<script>
import { emrentrysList,addEmrentryItem,putEmrentryItem,deleteEmrentry,emrentryItemId,addEmrentryDetailItem,deleteEmrentryDetail } from "@/api";
export default {
  name:'caseTemplate',
  data() {
      return {
        dataList: [],
        menuVisible:false,
        addEdit:false,
        filterText:'',
        clickObject:{},//右键被点击的object
        node:{},//右键被点击的value
        itemForm: {
          itemCode: '',
          itemName: '',
          classCode: '',
        },
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
        },
        detailList:[],
        detailText:'',
        rightFla:false,
        detailForm:{
          itemCode:'',
          termsDetail:'',
        },


      }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.setData()
  },
  methods: {
    setData(){
      emrentrysList().then(res=>{
        this.dataList=res.data.data
      })
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    rightClick(MouseEvent, object, Node, element) { // 鼠标右击触发事件
      if(object.classLevel ==2){
        this.addEdit=false
      }else{
        this.addEdit=true
      }
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
      if(data.classLevel==2){
        this.detailForm.itemCode=data.id
        this.detailData(data.id)
      }
    },
    detailData(id){
      emrentryItemId(id).then(res=>{
        if(res.data.code==200){
          this.detailList=res.data.data
          this.rightFla=true
        }
      })
    },
    btnAddGroup(itemCode){
      let _this=this
      this.$prompt('', '新增词条项目', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern:/\S/,
        inputErrorMessage: '项目名称不能为空'
      }).then(({ value }) => {
        this.detailForm.termsDetail=value
        addEmrentryDetailItem(this.detailForm).then(res=>{
          if(res.data.code==200){
            this.detailData(this.detailForm.itemCode)
          }
        })

      }).catch(() => {});
    },

    addCard(){
      let _this=this
      this.itemForm.classCode=this.clickObject.id
      this.$prompt('', '新增子条目', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // inputValue:'',
        inputPattern:/\S/,
        inputErrorMessage: '名称不能为空'
      }).then(({ value }) => {
        _this.itemForm.itemName=value
        _this.$delete(this.itemForm,'itemCode');
        addEmrentryItem(_this.itemForm).then(res=>{
          if(res.data.code==200){
            _this.setData()
          }
        })

      }).catch(() => {});
    },
    Rename(){
      let _this=this
      this.itemForm.classCode=this.clickObject.classCode
      _this.$set(this.itemForm,'itemCode',this.clickObject.id);
      this.$prompt('', '重命名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue:_this.clickObject.label,
        inputPattern:/\S/,
        inputErrorMessage: '名称不能为空'
      }).then(({ value }) => {
        _this.itemForm.itemName=value
        putEmrentryItem(_this.itemForm).then(res=>{
          if(res.data.code==200){
            _this.setData()
          }
        })

      }).catch(() => {});
    },
    deleteCard() {
      deleteEmrentry(this.clickObject.id).then(res=>{
        if(res.data.code==200){
          this.setData()
        }
      })
    },
    deleteDetail(id){
      this.$confirm("此操作将删除该条信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteEmrentryDetail(id).then(res=>{
          if(res.data.code==200){
            this.detailData(this.detailForm.itemCode)
          }
        })
      }).catch(() => {});
    }

  },
};
</script>
<style lang="less" scoped>
.case_entry {
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
    width: 20%;
    padding:5px;
    text-align: center;
    box-shadow:1px 0px 0px 0px rgba(228,233,255,1);
    position: relative;
    padding-bottom: 30px;

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
    width: 79%;
    min-height: 800px;
    padding:10px 20px;
    max-height: 810px;
    .title{
      color: #B5BED1;
    }
    .right_content{

      margin-top: 20px;
      .text_chunk{
        display: inline-block;
        height:32px;
        background:rgba(246,246,246,1);
        border-radius:16px;
        line-height: 32px;
        padding:0 15px;
        margin-bottom: 20px;
        margin-right: 20px;
        span{
          color: #999;
          font-size: 21px;
          float: right;
          margin-left: 11px;
          margin-top: -2px;
          cursor: pointer;
        }
      }
      .add_chunk_entry{
        height:32px;
        border-radius:16px;
        line-height: 32px;
        padding:0 15px;
      }
    }
  }


}

</style>
<style lang="less">
  .case_entry{
    .el-tree{
      .el-tree-node__content{
        padding:18px 0;
      }
    }
  }
</style>
