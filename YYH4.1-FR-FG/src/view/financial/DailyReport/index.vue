<!--
 * @Descripttion: 收费日报
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-10-30 13:38:37
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-14 15:04:09
 -->
<template>
  <div class="wrapper daily">
    <base-tabs v-model="checkedIndex">
      <base-pane label="">
      <div class="time">
        <el-date-picker
          v-model="time"
          type="date"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          @change='changeTime'
          :clearable='false'
          placeholder="选择日期"
          :picker-options="pickerOptions"
          class="datepicker">
        </el-date-picker>
        <span class="weekText">{{weekText}}</span>
      </div>
      </base-pane>
    </base-tabs>
    <div class="wrok_bench_title">
      <div class="work_count_wrap">
        <div class="item">
          <p>预约人数</p>
          <p>
            <span class="orange">{{statistics.appointmentNumber   || 0}}</span>
            <span class="samlls orange">人</span>
          </p>
        </div>
        <div class="item">
          <p>就诊人数</p>
          <p>
            <span class="red">{{statistics.adviceNumber || 0}}</span>
            <span class="samlls red">人</span>
          </p>
        </div>
        <div class="item">
          <p>本日实收</p>
          <p>
            <span class="samlls blue">￥</span>
            <span class="blue">{{statistics.dailyRealResultFee || 0}}</span>
          </p>
        </div>
        <div class="item">
          <p>本月实收合计</p>
          <p>
            <span class="samlls violet">￥</span>
            <span class="violet">{{statistics.monthRealResultFee || 0}}</span>
          </p>
        </div>

      </div>
    </div>

    <div class="content">
      <header class="nav">
        <div class="left">收费日报表</div>
        <div class="right">
          <el-select v-model="listPage.doctorId" @change="search" class="select">
            <el-option label="全部医生" value=""></el-option>
            <el-option
            v-for="item in doctorList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            </el-option>
          </el-select>
          <el-button @click='exportFun'>导出Excel</el-button>
        </div>
      </header>
      <main class="main-content">
        <section class="table-box">
          <el-table
            highlight-current-row
            ref="singleTable"
            :data="list"
            style="font-size: 14px"
            height="100%"
            :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
          >
            <el-table-column width='150' prop="patient.patientName" label="姓名" align="center"></el-table-column>
            <el-table-column prop="patientSource" label="患者来源" align="center"></el-table-column>
            <el-table-column width='200' label="收费时间" sortable align="center">
              <template slot-scope="scope" >
                {{getTime(scope.row.chargeTime)}}
              </template>
            </el-table-column>
            <el-table-column prop="statusText" label="收费状态" align="center"> </el-table-column>
            <el-table-column prop="discount" label="折扣" align="center">
              <template slot-scope="scope" >
                {{scope.row.discount}}
              </template>
            </el-table-column>
            <el-table-column prop="fees" label="原价" align="center">
              <template slot-scope="scope" >
                <span>￥{{scope.row.amountYuan}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="countFee" label="折后价" align="center">
              <template slot-scope="scope" >
                <span>￥{{scope.row.discountAmountYuan}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="实收" align="center">
              <template slot-scope="scope" >
                <span>￥{{scope.row.receivedAmountYuan}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="arrears" label="欠费" align="center">
              <template slot-scope="scope" >
                <span class="red">￥{{scope.row.arrearsYuan}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="payWayName" label="收费方式" align="center"></el-table-column>
            <el-table-column prop="doctorUser.name" label="诊治医生" align="center"></el-table-column>
            <el-table-column prop="nurseUser.name" label="护士" align="center"></el-table-column>
            <el-table-column prop="remark" label="备注" align="center"></el-table-column>

            <el-table-column label="操作" width="100" align="center">
              <template slot-scope="scope" style="marginLeft:-25px">
                <el-button type="text" size="small" @click="dialog(scope.row.billId)">详情</el-button>

              </template>
            </el-table-column>
          </el-table>
        </section>
        <footer class="footer">
          <Pagination :pageConfig="pageConfig" @handleSizeChange="handleSizeChange" @handleChage="handleChage"></Pagination>
        </footer>
      </main>
    </div>

<!-- 详情 -->
      <el-dialog
        title="项目明细"
        :visible.sync="dialogFla"
        width="40%"
        center>
        <div class="">
          <p style="padding-bottom:20px">备注：{{info.remark}}</p>
          <el-table
            highlight-current-row
            ref="singleTable"
            :data="info.chargeBillItemTOList"
            style="font-size: 14px"
            max-height="300"
            :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
          >
            <el-table-column prop="itemName" label="项目" align="center"></el-table-column>
            <el-table-column prop="discount" label="折扣" align="center">
              <template slot-scope="scope" >
                {{scope.row.discount}}
              </template>
            </el-table-column>
            <el-table-column prop="itemPrice" label="原价" align="center">
              <template slot-scope="scope" >
                {{scope.row.itemPrice || 0}}
              </template>
            </el-table-column>
            <el-table-column prop="itemPrice" label="单价数量" align="center">
              <template slot-scope="scope" >
                {{scope.row.itemNum}}
              </template>
            </el-table-column>
            <el-table-column prop="discountMoney" label="折后价" sortable align="center">
              <template slot-scope="scope" >
                {{scope.row.discountMoney || 0}}
              </template>
            </el-table-column>

          </el-table>
        </div>
      </el-dialog>

  </div>
</template>

<script>

import { chargebillflowCount, chargebillflowList,chargebillflowInfo,chargebillflowExport,getCaseDoctor } from "@/api";
import Pagination from '@/components/commons/Pagination'
import monment from "moment";
import {MESSAGE_TABLE_STYLE,SYSTEM_HTTP_SUCCESS,PAGE_SIZE} from '@/constant'
export default {
  name: "ReceptionistBench",
  components: {Pagination},
  props: {},
  data() {
    return {
      checkedIndex:0,
      time:'',
      timeDay:'',
      weekText:'',
      statistics:{
        adviceNumber:0,
        appointmentNumber:0,
        arrears:0,
        countFee:0,
        fees:0,
        realResultFee:0
      },
      listPage:{
        time:'',
        page:1,
        pageSize:10,
        doctorId: ''
      },
      list: [],
      info:{},
      total:0,
      dialogFla:false,
      doctorList: [],
			pageConfig: {
				currentPage: 1,
				total: 0,
				pageSize: PAGE_SIZE
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  mounted() {
    let date = new Date();
    this.time=util.timestampDay(date)
    this.timeDay=this.time
    this.listPage.time=this.timeDay
    this.changeTime(this.timeDay);
    getCaseDoctor().then(res => {
      if(res.data.code == 200) {
        this.doctorList = res.data.data;
      }
    })
    // this.setData()
    // this.chargebillflowCountData()
  },
  methods: {
    exportFun(){
      chargebillflowExport(this.timeDay).then(res=>{
        let filename = decodeURI(res.headers['content-disposition'].split(';')[1].split('=')[1]) || '分拣表.xlsx'
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
		handleSizeChange(pageSize) {
      this.pageConfig.currentPage = 1;
      this.pageConfig.pageSize = pageSize;
      this.setData();
    },
     handleChage(page) {
      this.pageConfig.currentPage = page;
      this.setData();
    },
    dialog(id){
      this.dialogFla=true
      this.info={}
      chargebillflowInfo(id).then(res=>{
        this.info=res.data.data
      })
    },
    chargebillflowCountData(){
      chargebillflowCount({params:{time:this.timeDay,doctorId: this.listPage.doctorId}}).then(res=>{
        if(res.data.code==200){
          this.statistics=res.data.data
        }
      })
    },
    setData(){
      this.list=[]
      // this.total=0
      this.listPage.page = this.pageConfig.currentPage;
      this.listPage.pageSize = this.pageConfig.pageSize;
      chargebillflowList({params:this.listPage}).then(res=>{
        if(res.data.code == SYSTEM_HTTP_SUCCESS){
          this.list=res.data.data
          this.pageConfig.total = res.data.totalNumber;
        }
      })
    },
    getTime(t) {
      return monment(t).format("YYYY-MM-DD HH:mm");
    },
    changeTime(val){
      let dateArray = val.split("-");
      dateArray[2]=dateArray[2].substring(0,2)
      let  date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
      let weekText="星期" + "日一二三四五六".charAt(date.getDay())
      this.weekText= weekText
      this.listPage.time=val
      this.timeDay=val
      this.listPage.page=1;
      this.pageConfig.currentPage = 1;
      this.setData()
      this.chargebillflowCountData()
    },
    search() {
      this.setData()
      this.chargebillflowCountData()
    }
  }
};
</script>
<style lang="less" scoped>
.daily {
  height: 100%;
  width: 100%;

  .export{
    height:30px;
    position: absolute;
    top: 25px;
    right: 20px;
  }
  .content{
    position: relative;
    margin-top: 30px;
    padding-top: 60px;
    height: calc(100% - 215px);
    .red {
      color: #ff4871;
    }
  }
  .wrok_bench_title {
    display: flex;
    align-items: flex-end;
    margin-top: 30px;
    .work_count_wrap {
      color: #1b1e25;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .item {
        display: flex;
        flex-flow: column;
        justify-content: center;
        height: 96px;
        margin-right: 20px;
        padding: 0 30px;
        box-shadow: 0 0 6px 0 #e4e9ff;
        background-color: #ffffff;
        p:nth-child(1) {
          font-size: 16px;
          padding-bottom: 10px;
        }
        p:nth-child(2) {
          font-size: 40px;
        }
        .samlls {
          font-size: 14px;
        }
        * {
          -moz-user-select: none; /*火狐*/
          -webkit-user-select: none; /*webkit浏览器*/
          -ms-user-select: none; /*IE10*/
          -khtml-user-select: none; /*早期浏览器*/
          user-select: none;
        }
      }
      .orange {
        color: #f77e1b;
      }
      .red {
        color: #ff4871;
      }
      .blue {
        color: #28c0f5;
      }
      .violet {
        color: #aa70ff;
      }
    }
    .handle_btn_wrap {
      li {
        cursor: pointer;
        color: #3b78fd;
        width: 88px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px solid #3b78fd;
        &:hover {
          background: #fff;
        }
      }
      li:nth-child(1) {
        margin-bottom: 20px;
      }
    }
  }

}
.daily{
  .time{
    position: absolute;
    top: 25px;
    left: 40%;
    width: 500px;
    font-family:Gotham-Medium;
    font-weight: bold;
    font-size: 25px;
    color: #1B1E25;
    .el-input{
      height: 40px;
      width: 300px;
      font-size: 25px;
      margin-right: 10px;
      .el-input__inner{
        font-family:Gotham-Medium;
        font-weight: bold;
        font-size: 25px;
        color: #1B1E25;
        padding-left: 35px;
        cursor: pointer;
        background: white;
      }
    }
  }
}
.nav {
  display: flex;
  justify-content: space-between;
  height: 40px;
  width: 100%;
  line-height: 40px;
  position: absolute;
  top: 0;
  left: 0;

  .left{
    font-weight:500;
    &::before {
      content: '';
      height: 14px;
      width: 0;
      border: 0;
      border-left: 5px solid #3B78FD;
      margin-right: 5px;
    }
  }
  .select {
    width: 110px;
  }
}
.datepicker{
  /deep/.el-input__inner {
    padding-left: 50px;
    padding-right: 0;
    color: #1b1e25;
    font-weight: bold;
  }
  /deep/.el-input__prefix {
    left: 15px;
  }
}
.weekText {
  color: #1b1e25;
}
</style>
