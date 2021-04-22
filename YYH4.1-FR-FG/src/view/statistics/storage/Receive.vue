<!--
@Author: ZJZ
@Date:   2019-08-22
@Filename: Access.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-11
-->
<!-- 领用 -->
<template>
  <div class="storage_access wrapper">
    <div class="top">
      <el-radio-group v-model="timeVal" size="small">
        <el-radio-button label="0">日</el-radio-button>
        <el-radio-button label="1">月</el-radio-button>
      </el-radio-group>

      <div class="time_chunk" v-if='timeVal==0'>
        <el-date-picker
         v-model="dayTime"
         type="daterange"
         value-format='yyyy-MM-dd'
         range-separator="至"
          size="small"
         start-placeholder="开始日期"
         end-placeholder="结束日期"
         @change='timeChange'>
       </el-date-picker>
      </div>
      <div class="time_chunk" v-if='timeVal==1'>
        <el-date-picker
          v-model="monthTime"
          type="monthrange"
          value-format='yyyy-MM-dd'
          range-separator="至"
          size="small"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
          @change='monthChange'>
        </el-date-picker>
      </div>
      <div class="search_chunk">
        <el-select size="small" v-model="searchForm.wareHouseId" placeholder="全部库房" @change='searchFun'>
          <el-option label="全部库房" value=""></el-option>
          <el-option
            v-for="item in wareHouseList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="search_chunk">
        <el-select size="small" v-model="searchForm.drugTypeId" placeholder="类别" @change='searchFun'>
          <el-option label="全部类别" value=""></el-option>
          <el-option
            v-for="item in drugTypeList"
            :key="item.id"
            :label="item.goodstypeName"
            :value="item.id">
          </el-option>
        </el-select>
      </div>


    </div>
    <div class="content main-content">

      <div class="title_text">
        <i></i> <span v-if='timeVal==1'>{{monthTime[0]}} ~ {{monthTime[1]}} 领用报表</span> <span v-if='timeVal==0'>{{dayTime[0]}} ~ {{dayTime[1]}} 领用报表</span>
        <a  @click='exportFun'>导出Excel</a>
      </div>
      <div class="table_list">
        <el-table
          highlight-current-row
          ref="table"
          :data="tableData"
          type='index'
          height="620"
          :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
        >
          <el-table-column prop="wareHouseText" label="所在库房" align="center" sortable></el-table-column>
          <el-table-column prop="drugTypeText" label="物品类别" align="center" sortable></el-table-column>
          <el-table-column prop="exportInventoryRecordItem.drug.drugCode" label="物品编号" align="center" sortable></el-table-column>
          <el-table-column prop="exportInventoryRecordItem.drug.drugName" label="物品名称" align="center" sortable></el-table-column>
          <el-table-column prop="exportInventoryRecordItem.drug.drugSpec" label="规格" align="center" sortable></el-table-column>
          <el-table-column prop="exportInventoryRecordItem.drug.drugUnitsConfig.unitName" label="单位" align="center" sortable></el-table-column>

          <el-table-column prop="exportInventoryRecordItem.quantity" label="领用数量" align="center" sortable></el-table-column>


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
              :total="searchForm.totalNumber"
              :current-page="searchForm.page"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import {importinventoryreportfilterdo,takeoutreportList,takeoutreportExport} from "@/api/index2.js";
export default {
  name: 'stock',
  components: {

  },
  data () {
    return {
      itemDialogFla:false,
      dayTime:[],
      showId: '',
      monthTime:'',
      timeVal:'0',
      searchForm:{
        queryType:'0',//0 为日  1 月
        startDay:'',//查询的开始日期
        endDay:'',//查询的结束日期
        wareHouseId:'',//查询的库房的id
        drugTypeId:'',//查询的物品类别的
        totalNumber:1,
        page:1,
        pageSize:10,
      },
      drugTypeList:[],//物品的类别
      inventoryOrderMapList:[],//类型的集合
      wareHouseList:[],//库房的集合
      tableData: [],
      childrenTable: [],

    }
  },

  mounted() {
    let _this=this

    importinventoryreportfilterdo().then(res=>{
      this.drugTypeList=res.data.data.drugTypeList
      this.wareHouseList=res.data.data.wareHouseList
    })

    this.searchForm.startDay=this.getDay(-29)
    this.searchForm.endDay=this.getDay(0)
    this.setData()

    this.dayTime=[this.getDay(-29), this.getDay(0)]
    this.monthTime=[this.getDay(-29), this.getDay(0)]

  },
  methods: {
    setData(){
      takeoutreportList({params:this.searchForm}).then(res=>{
        this.tableData=res.data.data
        this.searchForm.totalNumber=res.data.totalNumber
      })
    },
    monthChange(val){
        this.searchForm.startDay=val[0]
        this.searchForm.endDay=val[1]
        this.searchForm.queryType=1
        this.setData()
    },
    timeChange(val){
        this.searchForm.startDay=val[0]
        this.searchForm.endDay=val[1]
        this.searchForm.queryType=0
        this.setData()
    },
    searchFun(){
      this.setData()
    },
    handleSizeChange(pageSize) {
      this.searchForm.pageSize=pageSize
      this.setData()
    },
    handleCurrentChange(val) {
      this.searchForm.page = val;
      this.setData()
    },
    exportFun(){
      this.searchForm.queryType=this.timeVal
      takeoutreportExport(this.searchForm).then(res=>{
        let filename = decodeURI(res.headers['content-disposition'].split(';')[1].split('=')[1]) || '出入库报表.xlsx'
          this.fileDownload(res.data, filename) // response.data是后端返回的二进制数据流，filename是获取到的导出文件名，获取失败使用默认值
      })
    },
    fileDownload(data, fileName) {
      const blob = new Blob([data], {
        type: 'application/octet-stream'
      })
      const filename = fileName || 'filename.xlsx'
      if (typeof window.navigator.msSaveBlob !== 'undefined') {
        window.navigator.msSaveBlob(blob, filename)
      } else {
        var blobURL = window.URL.createObjectURL(blob)
        var tempLink = document.createElement('a')
        tempLink.style.display = 'none'
        tempLink.href = blobURL
        tempLink.setAttribute('download', filename)
        if (typeof tempLink.download === 'undefined') {
          tempLink.setAttribute('target', '_blank')
        }
        document.body.appendChild(tempLink)
        tempLink.click()
        document.body.removeChild(tempLink)
        window.URL.revokeObjectURL(blobURL)
      }
    },
    getDay(day){
      var today = new Date();
      var targetday_milliseconds=today.getTime() + 1000*60*60*24*day;
      today.setTime(targetday_milliseconds);
      var tYear = today.getFullYear();
      var tMonth = today.getMonth();
      var tDate = today.getDate();
      tMonth = this.doHandleMonth(tMonth + 1);
      tDate = this.doHandleMonth(tDate);
      return tYear+"-"+tMonth+"-"+tDate;
    },
    doHandleMonth(month){
      var m = month;
      if(month.toString().length == 1){
       m = "0" + month;
      }
      return m;
    }

  }
}
</script>
<style lang="less" scoped>

  .storage_access{
    position: relative;
    border: 1px solid #dcdfe6;
    overflow: hidden;
    .main-content{
      border:0;
    }
      .top{
        height:48px;
        background:rgba(247,249,255,1);
        line-height: 48px;
        padding:0 10px;
        .time_chunk{
          display: inline-block;
          padding:0 15px;
          border-right: 1px solid #DFE7F0;
          .el-date-editor{
            width: 250px;

          }
        }
        .search_chunk{
          display: inline-block;
          padding:0 15px;
          border-right: 1px solid #DFE7F0;
          .el-input-group__append{
            position: relative;
            left: -20px;
          }
        }
      }
      .content{
        position: relative;
        background: white;
        .title_text{
          position: relative;
          width: 95%;
          margin:auto;
          margin-top: 20px;
          i{
            display: inline-block;
            width:5px;
            height:16px;
            background:rgba(59,120,253,1);
          }
          span{
            font-size: 14px;
            color: #1B1E25;
            position: relative;
            top: -2px;
            font-weight: bold;
          }
          a{
            position: absolute;
            right: 20px;
            top: -5px;
            color: #3B78FD;
            cursor: pointer;
            border:1px solid #3B78FD;
            width:90px;
            height:32px;
            border-radius:3px;
            text-align: center;
            line-height: 32px;
          }
        }
        .table_list{
          margin-top: 20px;
          padding-bottom: 70px;
        }
      }
  }
  </style>
  <style lang="less" >
  .storage_access{
    position: relative;
      .row-expand-cover .el-table__expand-icon{visibility:hidden;}
      .el-table__expanded-cell{
        position: relative;
        padding-bottom: 45px;
        .table_footer{
          background: #F7F9FF;
          position: absolute;
          width: 100%;
          left: 0;
          bottom: 0;
          li{
            float: left;
            width: 33.3%;
            text-align: center;
            height: 40px;
            line-height: 40px;
            color: #1B1E25;
          }
        }
      }

    .nodeDialog{

      .el-dialog{
        position: fixed;
        right: 0;
        top: 0 ;
        margin-top: 0 !important;
        height: 100%;
        .el-dialog__header{
          text-align: left !important;
          border-bottom:1px solid #DFE7F0;
          padding:20px;
        }
        .el-dialog__body{
          padding:20px;
          background: #FCFDFF;
          .content{
            background: white;
            padding:20px;
            border:1px solid #DFE7F0;
            .title_text{
              width: 100%;
            }
            .el-table{
              margin: 20px 0;
            }
          }
        }
      }
    }
    .el-select{
      width: 110px;
      .el-input__inner{
        background: none;
        border:0;
        color: #3B78FD;
      }
    }
    .search_chunk{
      .el-input-group__append{
        position: relative;
        left: -20px;
        width: 20px;
        border:1px solid red;
        opacity: 0;
        padding:0;
      }
    }
    .el-date-editor{
      position: relative;
      top: 1px;
      .el-range-separator{
        width: 10%;
      }
    }
  }
  </style>
