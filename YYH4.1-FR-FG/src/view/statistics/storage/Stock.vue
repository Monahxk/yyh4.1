<!--
@Author: ZJZ
@Date:   2019-08-26
@Filename: Stock.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-15
-->

<template>
  <div class="storage_stock wrapper">
    <div class="top">

      <div class="search_chunk">
        <el-select size="small" v-model="searchForm.wareHouseId" placeholder="选择库房" @change='wareHouseChange'>
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
        <el-select style='width:100px' size="small" v-model="searchForm.drugTypeId" placeholder="类别" @change='drugTypeChange'>
          <el-option label="全部类别" value=""></el-option>
          <el-option
            v-for="item in drugTypeList"
            :key="item.id"
            :label="item.goodstypeName"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="search_chunk">
        <el-input size="small"
          placeholder="物品名称/编码"
          suffix-icon="el-icon-search"
          v-model="searchForm.drugInfo">
          <el-button @click='searchFun' slot="append"  icon="el-icon-search"></el-button>
        </el-input>
      </div>


    </div>
    <div class="content main-content">

      <div class="title_text">
        <i></i>  <span>库存报表</span>
        <a  @click='exportFun'>导出Excel</a>
      </div>
      <div class="table_list">
        <el-table
          highlight-current-row
          ref="singleTable"
          :data="tableData"
          height="620"
          :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
        >
          <el-table-column  type="expand" align="center">
            <template slot-scope="scope">
              <el-table
                highlight-current-row
                ref="singleTable"
                :data="scope.row.drugBatchLineitemlist"
                style="font-size: 14px"
                height="300"
                :header-cell-style="{background:'#B5BED1',color:'#000'}"
              >
                <el-table-column prop="batchNumber" label="批号"  align="center" sortable></el-table-column>
                <el-table-column prop="effectiveTime" label="有效期"  align="center" sortable></el-table-column>
                <el-table-column prop="priceYuan" label="单价"  align="center" sortable></el-table-column>
                <el-table-column prop="quantity" label="库存" align="center" sortable></el-table-column>
              </el-table>
              <!-- <ul class="table_footer">
                <li>种类：5</li>
                <li>总数量：200</li>
                <li>总金额：￥34252</li>
              </ul> -->
            </template>
          </el-table-column>
          <el-table-column prop="wareHouseText" label="所在库房" align="center" sortable></el-table-column>
          <el-table-column align="center" prop="drugTypeText" label="物品类别"></el-table-column sortable></el-table-column>
          <el-table-column prop="drugInventory.drug.drugCode" label="物品编号" align="center" sortable></el-table-column>
          <el-table-column prop="drugInventory.drug.drugName" label="物品名称" align="center" sortable></el-table-column>
          <el-table-column prop="drugInventory.drug.drugSpec" label="规格" align="center" sortable></el-table-column>
          <el-table-column prop="drugInventory.drug.drugBrand.brandName" label="品牌" align="center" sortable></el-table-column>
          <el-table-column prop="drugInventory.drug.drugUnitsConfig.unitName" label="单位" align="center" sortable></el-table-column>
          <el-table-column prop="drugInventory.quantity" label="库存数量" align="center" sortable></el-table-column>
          <el-table-column prop="drugInventory.averagePriceYuan" label="均价" align="center" sortable></el-table-column>
          <el-table-column prop="drugInventory.amountYuan" label="金额" align="center" sortable></el-table-column>
          <el-table-column align="center" label="操作" width="150">
            <template slot-scope="scope" style="marginLeft:-25px">
              <el-button type="text" size="small" @click="look(scope.row.drugInventory.drug.id,scope.row.drugInventory.wareHouseId)">查看</el-button>
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
              :total="searchForm.totalNumber"
              :current-page="searchForm.page"
            ></el-pagination>
          </div>
        </div>

      </div>
    </div>

    <el-dialog
      title="出入库记录"
      :visible.sync="itemDialogFla"
      width="1000px" class="nodeDialog"
      center>
      <div class="content">
        <div class="title_text">
          <i></i> <span>入库记录</span>
        </div>
        <el-table
          highlight-current-row
          v-if=''
          ref="singleTable"
          :data="listImport"
          height="330"
          :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
        >
          <el-table-column prop="putDate" label="入库日期" align="center" width='230px'></el-table-column>
          <el-table-column align="center" prop="providerName" label="供应商"></el-table-column></el-table-column>
          <el-table-column prop="importInventoryBatch.batchNumber" label="入库数量" align="center"></el-table-column>
          <el-table-column prop="importInventoryBatch.priceYuan" label="入库单价" align="center"></el-table-column>
          <el-table-column prop="importInventoryBatch.amountYuan" label="金额" align="center"></el-table-column>
        </el-table>
        <div class="title_text">
          <i></i> <span>出库记录</span>
        </div>
        <el-table
          highlight-current-row
          ref="singleTable"
          :data="listExport"
          height="330"
          :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
        >
          <el-table-column prop="getDate" label="出库日期" align="center" width='230px'></el-table-column>
          <el-table-column align="center" prop="applyEmployeeName" label="领用人"></el-table-column></el-table-column>
          <el-table-column prop="exportInventoryBatch.quantity" label="出库数量" align="center"></el-table-column>
          <!-- <el-table-column prop="receivedAmountYuan" label="出库单价" align="center"></el-table-column> -->
          <el-table-column prop="exportInventoryBatch.amountYuan" label="金额" align="center"></el-table-column>
        </el-table>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {chargeTrend,treeInstitutions,trendExcel} from "@/api";
import {inventroyreportfilterdo,inventroyreportList,batchlineitemId,inventoryreportdetaildoId,fileExport} from "@/api/index2.js";
export default {
  name: 'stock',
  components: {

  },
  data () {
    return {
      itemDialogFla:false,
      listExport:[],//出库记录的集合
      listImport:[],//入库记录的集合
      amountSum:'',
      discountAmountSum:'',
      receivedAmountSum:'',
      searchForm:{
        wareHouseId:'',//查询的库房的id
        drugTypeId:'',//查询的物品类别的
        drugInfo:'',//物品的名称编码
        page:1,
        totalNumber:1,
        pageSize:10,
      },
      drugTypeList:[],//物品的类别
      wareHouseList:[],//库房的集合
      tableData: [],
    }
  },

  mounted() {
    let _this=this


    this.setData()
    inventroyreportfilterdo().then(res=>{
      this.drugTypeList=res.data.data.drugTypeList
      this.wareHouseList=res.data.data.wareHouseList
    })

  },
  methods: {

    setData(){
      inventroyreportList({params:this.searchForm}).then(res=>{
        this.tableData=res.data.data
        this.searchForm.totalNumber=res.data.totalNumber
      })
    },
    look(drugId,wareHouseId){
      this.itemDialogFla=true
      inventoryreportdetaildoId({drugId:drugId,wareHouseId:wareHouseId}).then(res=>{
        this.listImport=res.data.data.listImport
        this.listExport=res.data.data.listExport
      })
    },
    searchFun(){
      this.setData()
    },
    wareHouseChange(){
      this.setData()
    },
    drugTypeChange(){
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
      // this.searchForm.queryFlag=this.timeVal
      fileExport(this.searchForm).then(res=>{
        let filename = decodeURI(res.headers['content-disposition'].split(';')[1].split('=')[1]) || '库存报表.xlsx'
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
  .storage_stock{
    position: relative;
    // box-shadow:0px 0px 6px 0px rgba(228,233,255,1);
    border: 1px solid #dcdfe6;
    overflow: hidden;
    height: 100%;
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
  .storage_stock{
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
      width: 100px;
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
