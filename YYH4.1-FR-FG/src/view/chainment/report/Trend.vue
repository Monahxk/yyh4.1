<template>
  <div class="report_trend wrapper">
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
      <div class="shop_chunk">
        <span class="shop_list">
          <span class="show_shop" @click='shopFla=true'>选择门店：</span>
          <ul >
            <li v-for='(item,index) in shopListText' v-if='index<3'>
              <span>{{item.label}}</span> <i class="el-icon-close" @click="delShop(item.id)"></i>
              <span v-if='index==2'>...</span>
            </li>
          </ul>
          <i class="show_shop el-icon-caret-bottom" @click='shopFla=true'></i>
          <div class="shop_content" v-if='shopFla'>
            <el-input
              placeholder="输入关键字进行过滤"
              v-model="filterText" class="filter_text">
            </el-input>
            <div class="tree">
              <el-tree
                  :data="dataList"
                  :props="defaultProps"
                  node-key="id"
                  show-checkbox
                  :default-expand-all='true'
                  :filter-node-method="filterNode"
                  ref="tree"
                  @check='nodeClick'>
                 <span class="custom-tree-node" slot-scope="{ node, data }">
                   <span>{{data.chainLevel ? data.chainLevel.name : data.name }}</span>
                 </span>
               </el-tree>
            </div>
          </div>
        </span>
      </div>

    </div>
    <div class="content">
      <div class="title_text">
        <i></i> <span>趋势图</span>
      </div>
      <div id="myChart" :style="{width: '100%',background: 'white', height: '500px'}"></div>
      <div class="footer_num">
        原价总计： <span>¥{{amountSum}}</span>
        折后价总计： <span>¥{{discountAmountSum}}</span>
        实收总计： <span>¥{{receivedAmountSum}}</span>
      </div>
      <p class="bg_gray"></p>
      <div class="title_text">
        <i></i> <span>详细数据</span>
        <a  @click='exportFun'>导出Excel</a>
      </div>
      <div class="table_list">
        <el-table
          highlight-current-row
          ref="singleTable"
          :data="chargeChartList"
          max-height="500"
          :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
        >
          <el-table-column prop="dateTime" label="时间\类型" align="center"></el-table-column>
          <el-table-column prop="amountYuan" label="原价"></el-table-column></el-table-column>
          <el-table-column prop="discountAmountYuan" label="折后价" align="center"></el-table-column>
          <el-table-column prop="receivedAmountYuan" label="实收" align="center"></el-table-column>

        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import {chargeTrend,treeInstitutions,trendExcel} from "@/api";
export default {
  name: 'report_trend',
  components: {

  },
  data () {
    return {
      dayTime:[],
      monthTime:'',
      filterText:'',
      dataList:[],
      defaultProps: {
        children: 'subLevelList',
        disabled: this.disabledFn,
        label: 'name'
			},
      timeVal:'0',
      shopListText:[],
      chargeChartList:[],
      shopFla:false,//新增患者门店选择显示
      totle:{},
      amountSum:'',
      discountAmountSum:'',
      receivedAmountSum:'',
      searchForm:{
        queryFlag:'',//0 为日  1 月
        startTime:'',
        endTime:'',
        institutionId:'',
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    let _this=this
    document.addEventListener('click',function(e){
      if(e.target.className!='show_shop'&& e.target.className!='el-input__inner'&& e.target.className!='el-icon-close'){
          _this.sourceShopFla=false;
          _this.shopFla=false;
      }
    })
    this.searchForm.startTime=this.getDay(-29)
    this.searchForm.endTime=this.getDay(0)
    this.setData()
    treeInstitutions().then(res=>{
      this.dataList=res.data.data.subLevelList
    })

    this.dayTime=[this.getDay(-29), this.getDay(0)]

  },
  methods: {

    setData(){
      let shopList=[['product','原价', '折后价', '实收']]
      chargeTrend({params:this.searchForm}).then(res=>{
        res.data.data.chargeTrendData.map(res=>{
          shopList.push([res.dateTime,parseInt(res.amountYuan),parseInt(res.discountAmountYuan),parseInt(res.receivedAmountYuan)])
        })
        this.amountSum=res.data.data.amountSum
        this.discountAmountSum=res.data.data.discountAmountSum
        this.receivedAmountSum=res.data.data.receivedAmountSum
        this.chargeChartList=res.data.data.chargeTrendData
        this.EchartsData(shopList)

      })
    },
    monthChange(val){
        this.searchForm.startTime=val[0]
        this.searchForm.endTime=val[1]
        this.searchForm.queryFlag=1
        this.setData()
    },
    timeChange(val){
        this.searchForm.startTime=val[0]
        this.searchForm.endTime=val[1]
        this.searchForm.queryFlag=0
        this.setData()
    },
    EchartsData(shopList){
      let myChart =echarts.init(document.getElementById('myChart'))
          // 绘制图表
        let  option = {
          title: {
              text: '单位:万元',
              right:'15%',
              top:'5%',
          },
            tooltip : {
                trigger: 'axis',
                axisPointer : {type : 'line'}
            },
            xAxis : {type: 'category'},
            legend: {
              orient: 'vertical',
              top:'20%',
              right:'30px',
              textStyle:{
                fontSize:14,
              },
              data: ['原价','折后价','实收']
            },

            yAxis : {},
            grid:{
                left:'70px',
            },
            dataset: {
                source: shopList
            },
            series : [
              {
                type: 'line',
                label: {normal: {position: 'top',show: true}},
                itemStyle: {color: '#5A99FC'}
              },
              {
                type: 'line',
                label: {normal: {position: 'top',show: true}},
                itemStyle: {color: '#FF5B5A'}
              },
              {
                type: 'line',
                label: {normal: {position: 'top',show: true}},
                itemStyle: {color: '#FFC598'}
              },

            ]
          };

          myChart.setOption(option);

        window.addEventListener('resize',function() {myChart.resize()});
    },
    delShop(id){  //取消门店
      this.shopListText.map((item,index)=>{
        if(id==item.id){
          this.shopListText.splice(index, 1)
        }
      })
      this.$refs.tree.setCheckedNodes(this.shopListText);

    },
    filterNode(value, data) {
      if (!value) return true;
      let fla;
      if(data.name){
        if(data.name.indexOf(value) !== -1){
          fla=true
        }
      }else{
        fla=false
      }
      return fla
    },
    nodeClick(data,node){
      this.shopListText=[]
      this.shopListText.push({label:data.name,id:data.id})
      this.$refs.tree.setCheckedKeys([]);
      this.$refs.tree.setCheckedNodes(this.shopListText);
      this.searchForm.institutionId=data.id
      this.setData()
    },
    disabledFn(data, node) {
      if (!data.alias) {  return true; } else { return false; }
    },
    exportFun(){
      this.searchForm.queryFlag=this.timeVal
      trendExcel(this.searchForm).then(res=>{
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

  .report_trend{
    position: relative;
    box-shadow:0px 0px 6px 0px rgba(228,233,255,1);
    border: 1px solid #dcdfe6;
    overflow: hidden;
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
        .shop_chunk{
          display: inline-block;
          padding:0 15px;
          .shop_list{
            position: relative;
            cursor: pointer;
            ul{
              display: inline-block;
              li{
                float: left;
                background:rgba(181,190,209,0.44);
                border-radius:5px;
                padding:0 5px;
                height: 25px;
                line-height: 25px;
                position: relative;
                top:7px;
                margin-left: 10px;
                span{
                  margin-right: 5px;
                }
              }
            }
            .shop_content{
              position: absolute;
              top: 35px;
              left: 0;
              box-shadow: 0 0 6px 0 #e4e9ff;
              z-index: 9;
              min-width: 300px;
              background: white;
              .tree{
                overflow-y: auto;
                padding-bottom: 10px;
                max-height: 500px;
              }
              .filter_text{
                background: white;
                .el-input__inner{
                  width: 90%;
                  margin:auto;
                  display: block;
                  margin-top: 10px;
                }
              }

            }
          }
        }
      }
      .content{
        margin:auto;
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
            font-size: 18px;
            color: #1B1E25;
            position: relative;
            top: -2px;
          }
          a{
            position: absolute;
            right: 20px;
            color: #3B78FD;
            cursor: pointer;
          }
        }
        .footer_num{
          position: absolute;
          right: 20px;
          font-size: 18px;
          font-weight: bold;
          span{
            color: #3B78FD;
            margin-right: 20px;
          }
        }
        .bg_gray{
          height: 10px;
          background:rgba(181,190,209,0.14);
          margin:10px 0;
          margin-top: 50px;
        }
        .table_list{
          margin-top: 20px;
        }
      }
  }
  </style>
  <style lang="less" >
  .report_trend{
    position: relative;

    .filter_text{
      .el-input__inner{
        width: 90%;
        margin:auto;
        display: block;
        margin-top: 10px;
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
