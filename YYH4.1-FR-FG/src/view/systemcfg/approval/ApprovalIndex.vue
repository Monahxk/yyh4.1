<!--
@Author: ZJZ
@Date:   2019-08-14
@Filename: ApprovalIndex.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-08
-->

<template>
  <div class="wrapper">
    <div class="main_top_title">审批流配置
      <div class="box_right">
        <el-select v-model="valueSearch"
        size='small' placeholder="全部状态" @change='statusSearchChange'>
        <el-option label="全部" value=""></el-option>
        <el-option
          :label="item.label"
          :value="item.value"
          v-for="(item, index) of statusList"
          :key="index"></el-option>
        </el-select>
        <router-link :to="{path:'Addapproval'}">
          <el-button  size='small' type="primary">+ 创建新审批</el-button>
        </router-link>

      </div>
    </div>

    <div class="approval">
      <div class="approval_chunk" v-for='(item,index) in dataList' :key='index'  >
        <p class="title" :class="item.status?'off':''">{{item.name}} <span v-if='item.status'>停用</span> </p>
        <p class="hidden">关联业务：{{item.approvableTypesText}}</p>
        <p class="hidden">审批节点：{{item.approvalNodeText}}</p>
        <div class="chunk_footer">
          <ul>
            <li>
              <!-- <el-select v-model="item.status"
              size='small' @change='statusChange(item)'>
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="(item, index) of statusList"
                :key="index"></el-option>
              </el-select> -->
              <span @click='statusChange(item)'>{{item.status?'启用':'停用'}}</span>
            </li>
            <li><router-link :to="{path:'Addapproval',query:{id:item.id}}">
              <span>编辑</span>
            </router-link></li>
            <li @click='itemDel(item.id)'>删除</li>
          </ul>
        </div>
      </div>


    </div>

  </div>
</template>



<script>
import {approvalcfgList,approvalcfgStatus,approvalcfgDel} from "@/api";
export default {
  name:'caseTemplate',
  data() {
      return {
        dataList: [],
        hover:false,
        statusList:[
          {value: 0,label: '启用'},
          {value: 1,label: '停用'},
        ],
        valueSearch:'',
        valueChunk:'',
        formSearch: { //项目搜索
          status: '',
          totalNumber:10,
          page: 1,
          pageSize: 10,
        },



      }
  },
  mounted() {
    this.setData()
    // this.$router.push('Addapproval')
  },
  methods: {
    setData(){
      approvalcfgList({params:this.formSearch}).then(res=>{
        // res.data.data.map(item=>{
        //   console.log(item)
        //   item.status=item.status.toString()
        // })
        this.dataList=res.data.data
      })
    },
    statusSearchChange(val){
      console.log(val)
      this.formSearch.status=val
      this.setData()
    },
    statusChange(val){
      console.log(val)
      let status=val.status?'enable':'disable'
      approvalcfgStatus({id:val.id,status:status}).then(res=>{
        console.log(res)
        this.setData()
      })
    },

    itemDel(id){
      this.$confirm("此操作将删除该审批, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        approvalcfgDel(id).then(res=>{
          if(res.data.code==200){
            this.setData()
          }
        })
      }).catch(() => {});;
    }

  },
};
</script>
<style lang="less" scoped>
.main_top_title{
  .box_right{
    float: right;
    .el-select{
      width: 100px;
    }
  }
}
.approval {
  position: relative;
  overflow: hidden;
  // box-shadow:0px 0px 6px 0px rgba(228,233,255,1);
  // background: white;
  // display: flex;
  // display: -webkit-flex;
  // display: -o-flex;
  // display: -moz-flex;
  // display: -ms-flex;
  // align-items: stretch;
  margin-bottom: 30px;
  .approval_chunk{
    float: left;
    padding:20px;
    border-radius: 2px;
    border:1px solid #DFE7F0;
    background: white;
    width: 260px;
    margin-right: 25px;
    position: relative;
    height: 150px;
    margin-bottom: 20px;
    .title{
      font-weight:500;
      color: #000;
      font-size: 16px;
      opacity: 1;
      margin-bottom: 15px;
      &.off{
        text-decoration:line-through;
        color: #8C8C8C;
        span{
          display: inline-block;
          margin-left: 5px;
          border-radius: 9px;
          background: #3B78FD;
          width: 40px;
          text-align: center;
          height: 18px;
          line-height: 18px;
          color: white;
          font-size: 12px;
        }
      }
    }
    p{
      font-size: 14px;
      color: #000;
      opacity: .45;
      margin-bottom: 10px;
      width: 100%;
      &:last-child{
        margin-bottom: 0;
      }
    }
    .chunk_footer{
      position: absolute;
      overflow: hidden;
      background: #F7F9FA;
      left: 0;
      width: 100%;
      bottom: 0;
      // display: none;
      li{
        float: left;
        width: 33.3%;
        height: 20px;
        line-height: 20px;
        cursor: pointer;
        margin: 10px 0;
        text-align: center;
        border-right: 1px solid #E8E8E8;
        color: #3B78FD;
        a{
          color: #3B78FD;
        }
        &:last-child{
          border-right: 0;
        }
      }
    }
  }
  &.chunk_show{
    display: block;
  }


}

</style>
<style lang="less">
  .approval{

    .chunk_footer{
      li{
        .el-select{
          height: 20px;
          // margin-top: 4px;
          .el-input__inner{
            background: none;
            border: 0;
            color: #3B78FD;
            position: relative;
            top: -5px;
          }
          .el-input__suffix{
            top: -5px;
          }
        }
      }
    }
  }
</style>
