<!--
@Author: ZJZ
@Date:   2019-08-26
@Filename: Await.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-12
-->

<template>
  <div class="wrapper await">
    <header class="header-page" :class="{'show-query': showQuery}">
			<div class="nav_wrap">
				<div class="nav_right_box">
					<div class="nav_item">
						<el-button type="text" icon="el-icon-search" @click="showQuery=!showQuery">搜索</el-button>
					</div>

				</div>
			</div>
			<div class="query-box">
        <el-form :inline="true" :model="formSearch" @keyup.enter.native="search" >
						<el-form-item label="">
							<el-date-picker
								v-model="timeValue"
								value-format="yyyy-MM-dd HH:mm:ss"
								type="daterange"
								range-separator="-"
								start-placeholder="开始日期"
								end-placeholder="结束日期">
							</el-date-picker>
						</el-form-item>
            <el-form-item label="">
							<el-input placeholder="名称/单号/姓名" v-model="formSearch.nameOrNoOrItemName" clearable></el-input>
						</el-form-item>
						<el-form-item label="">
              <el-select v-model="formSearch.approvableTypeId" placeholder="审批类型" clearable>
								<el-option label="全部类型" value=""></el-option>
                <el-option
                  v-for="item in approvableList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
						<el-form-item label="">
              <el-select v-model="formSearch.status" placeholder="全部状态" clearable>
								<el-option label="全部状态" value=""></el-option>
                <el-option
                  v-for="(item,key,index) in approveStatusMap"
                  :key="index"
                  :label="item"
                  :value="key">
                </el-option>
              </el-select>
            </el-form-item>

						<el-form-item>
							<el-button type="primary" class="search_btn"  @click="search">搜索</el-button>
						</el-form-item>
				</el-form>
      </div>
		</header>
    <div class="await_chunk_Fla " :class="{'re-ren': showQuery}">
      <div class="await_chunk" v-for='(item,index) in dataList' @click='dialog(item,true)'>
        <img src="../../../assets/img/approval/seal-red.png" class="right_img" alt="" v-if='item.curStatus==0'>
        <img src="../../../assets/img/approval/seal-yiwancheng.png" class="right_img" alt="" v-if='item.curStatus==1'>
        <img src="../../../assets/img/approval/seal-shenouzhong.png" class="right_img" alt="" v-if='item.curStatus==3'>
        <img src="../../../assets/img/approval/seal-orange.png" class="right_img" alt="" v-if='item.curStatus==2'>
        <img src="../../../assets/img/approval/seal-chexiao.png" class="right_img" alt="" v-if='item.curStatus==4'>
        <img src="../../../assets/img/approval/seal-green.png" class="right_img" alt="" v-if='item.curStatus==5'>
        <p class="title">
          <img src="../../../assets/img/approval/allocation.png" alt="" v-if='item.approvableTypeId==15'>
          <img src="../../../assets/img/approval/storage.png" alt="" v-if='item.approvableTypeId==12 || item.approvableTypeId==18'>
          <img src="../../../assets/img/approval/deposit.png" alt="" v-if='item.approvableTypeId==13 || item.approvableTypeId==14 || item.approvableTypeId==17'>
          <img src="../../../assets/img/approval/purchase.png" alt="" v-if='item.approvableTypeId==11'>
          <img src="../../../assets/img/approval/qita.png" alt="" v-if='item.approvableTypeId==1 || item.approvableTypeId==2 || item.approvableTypeId==3 || item.approvableTypeId==16 || item.approvableTypeId==19'>
          {{item.name}}
        </p>
        <p>关联单号：<span>{{item.formNo}}</span> </p>
        <p>提交时间：<span>{{item.requestTime}}</span></p>
        <p>审批时间：<span>{{item.apprivalTime}}</span> <i></i>发起人：<span>{{item.requestorName}}</span></p>
      </div>
    </div>
    <div class="pagination_box">
      <div class="block">
        <el-pagination
          prev-text="上一页"
          next-text="下一页"
          background
          layout="total,prev,pager,next,jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pager-count="9"
          :page-size="12"
          :total="formSearch.totalNumber"
          :current-page="formSearch.page"
        ></el-pagination>
      </div>
    </div>

    <DetailsDialog @setDataFun='setDataFun' :infoData='DetailsDialogInfo'></DetailsDialog>

  </div>
</template>



<script>
import DetailsDialog from "./DetailsDialog.vue";
import {approvalitemList,approvalitemfilterdo} from "@/api/index2.js";
export default {
  name:'Await',
  components:{
    DetailsDialog
  },
  data() {
      return {
        dataList:[],
        DetailsDialogInfo:{
          DialogFla:false,
          id:'',
          me:'',
          type:'11',
        },
        formSearch: { //项目搜索
          category:'',
          nameOrNoOrItemName: '',
          approvableTypeId: '',
          status: '',
          page: 1,
          totalNumber: 1,
          pageSize: 12,
        },
        showQuery: false,
        timeValue:[],
        approvableList:[],
        approveStatusMap:[],
      }
  },

  mounted() {
    this.setData()
    approvalitemfilterdo().then(res=>{
      this.approvableList=res.data.data.approvableList
      this.approveStatusMap=res.data.data.approveStatusMap
    })
  },
  methods: {
    setData(){
      approvalitemList({params:this.formSearch}).then(res=>{
        this.dataList=res.data.data
        this.formSearch.totalNumber=res.data.totalNumber
        console.log(this.formSearch)

      })
    },
    search() {
			this.formSearch.page = 1;
			this.formSearch.begDate =  this.timeValue ? this.timeValue[0] : '';
      this.formSearch.endDate = this.timeValue ? this.timeValue[1] : '';
      this.setData();
    },
    dialog(item,fla){
      this.DetailsDialogInfo.DialogFla = true
      this.DetailsDialogInfo.id = item.id
      this.DetailsDialogInfo.type = item.approvableTypeId
      this.DetailsDialogInfo.me = fla
    },
    handleSizeChange(pageSize) {
      this.formSearch.pageSize = pageSize;
      this.setData();
    },
    handleCurrentChange(val) {
      this.formSearch.page = val;
      this.setData();
    },
    setDataFun(){
      this.setData();
    }

  },

};
</script>
<style lang="less" scoped>
.await{
  position: relative;
  // overflow: hidden;
  display: block;
  .await_chunk_Fla{
    overflow: hidden;
  }
  .re-ren{
    height: 80%;
    overflow-y:auto;
  }
  .nav_right_box{
    right: 90px !important;
  }
  .await_chunk{
    float: left;
    cursor: pointer;
    padding:20px;
    border-radius: 2px;
    border:1px solid #DFE7F0;
    background: white;
    width: 32%;
    margin-right: 1%;
    position: relative;
    // height: 150px;
    margin-bottom: 20px;
    min-width: 400px;
    .right_img{
      position: absolute;
      top: 13px;
      right: 16px;
      width: 46px;
    }
    .title{
      color: #000;
      font-size: 16px;
      font-weight: bold;
      line-height: 23px;
      display: flex;
      margin-bottom: 10px;
      img{
        width: 20px;
        margin-right: 3px;
      }
    }
    p{
      margin-top: 6px;
      height: 22px;
      line-height: 22px;
      i{
        margin-right: 30px;
      }
      span{
        color: #737B8D;
      }
    }
  }
  .pagination_box{
    background: none;
  }

}

</style>
<style lang="less">
  .await{


  }
</style>
