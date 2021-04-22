<template>
  <div class="report_appointment wrapper">
    <div class="top">
      <el-dropdown trigger="click" @command='timeCommand'>
         <span class="el-dropdown-link">
           <span v-if='timeVal==7'>最近7天</span>
           <span v-else-if='timeVal==15'>最近15天</span>
           <span v-else>最近30天</span>
           <i class="el-icon-caret-bottom"></i>
         </span>
         <el-dropdown-menu slot="dropdown">
           <el-dropdown-item command='7'>最近7天</el-dropdown-item>
           <el-dropdown-item command='15'>最近15天</el-dropdown-item>
           <el-dropdown-item command='30'>最近30天</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="time_chunk">
        <el-date-picker
         v-model="time"
         type="daterange"
         value-format='yyyy-MM-dd'
         range-separator="至"
         size="small"
         start-placeholder="开始日期"
         end-placeholder="结束日期"
         @change='timeChange'>
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
      <div id="myChart" :style="{width: '100%', height: '500px'}"></div>
      <div class="footer_num">
        总计预约：<span>{{appointmentCountSum}}人</span>
        总计就诊：<span>{{visitCountSum}}人</span>
        ( 初诊：<span>{{firstVisitCountSum}}人</span>
        复诊：<span>{{returnVisitCountSum}}人</span>)
      </div>
      <p class="bg_gray"></p>
      <div class="title_text">
        <i></i> <span>详细数据</span>
        <a @click='exportFun'>导出Excel</a>
      </div>
      <div class="table_list">
        <el-table
          highlight-current-row
          ref="singleTable"
          :data="chargeChartList"
          max-height="500"
          :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
        >
          <el-table-column prop="institutionName" label="门店\类型" align="center"></el-table-column>
          <el-table-column prop="visitCount" label="就诊" align="center"></el-table-column>
          <el-table-column prop="firstVisitCount" label="初诊" align="center"></el-table-column>
          <el-table-column prop="returnVisitCount" label="复诊" align="center"></el-table-column>

        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import {visitInstitutionids,treeInstitutions,appointmentExcel} from "@/api";
export default {
  name: 'report_appointment',
  components: {

  },
  data () {
    return {
      time:[],
      filterText:'',
      dataList:[],
      defaultProps: {
        children: 'subLevelList',
        disabled: this.disabledFn,
        label: 'name'
			},
      timeVal:'',
      shopListText:[],
      chargeChartList:[],
      shopFla:false,//新增患者门店选择显示
      appointmentCountSum:'',
      firstVisitCountSum:'',
      returnVisitCountSum:'',
      visitCountSum:'',
      searchForm:{
        startTime:'',
        endTime:'',
        institutionIds:'',
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
          _this.sourceshopFla=false;
          _this.shopFla=false;
      }
    })
    this.searchForm.startTime=this.getDay(-29)
    this.searchForm.endTime=this.getDay(0)
    this.time=[this.getDay(-29),this.getDay(0)]
    this.setData()
    treeInstitutions().then(res=>{
      this.dataList=res.data.data.subLevelList
    })

  },
  methods: {
    setData(){
      let shopList=[['product','预约','就诊']]
      visitInstitutionids({params:this.searchForm}).then(res=>{
        res.data.data.appointmentVisitChart.map(res=>{
          shopList.push([res.institutionName,parseInt(res.appointmentCount),parseInt(res.visitCount)])
        })
        this.appointmentCountSum=res.data.data.appointmentCountSum
        this.firstVisitCountSum=res.data.data.firstVisitCountSum
        this.returnVisitCountSum=res.data.data.returnVisitCountSum
        this.visitCountSum=res.data.data.visitCountSum
        this.chargeChartList=res.data.data.appointmentVisitChart
        this.EchartsData(shopList)

      })
    },
    timeChange(val){
        this.searchForm.startTime=val[0]
        this.searchForm.endTime=val[1]
        this.setData()
    },
    EchartsData(shopList){
      let myChart =echarts.init(document.getElementById('myChart'))
          // 绘制图表
        let  option = {
          title: {
              text: '单位:人次',
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
              data: ['预约','就诊']
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
                type: 'bar',
                label: {normal: {position: 'top',show: true}},
                barWidth: 14,
                itemStyle: {normal: {
                          color: new echarts.graphic.LinearGradient(
                              0, 0, 0, 1,
                              [{offset: 0, color: '#5AD6FD'},
                                  {offset: 0.5, color: '#73C1FE'},
                                  {offset: 1, color: '#5A99FC'}])},
                            }
              },
              {
                type: 'bar',
                label: {normal: {position: 'top',show: true}},
                barWidth: 14,
                itemStyle: {normal: {
                          color: new echarts.graphic.LinearGradient(
                              0, 0, 0, 1,
                              [{offset: 0, color: '#FE8483'},
                                  {offset: 0.5, color: '#FF6E6E'},
                                  {offset: 1, color: '#FF5B5A'}])},
                            }
              },

            ]
          };

          myChart.setOption(option);

        window.addEventListener('resize',function() {myChart.resize()});
    },
    timeCommand(val){
      let time
      if(val==7){
        time = -6
      }else if(val==15){
        time= -14
      }else{
        time= -29
      }
      this.timeVal=val
      this.searchForm.startTime=this.getDay(time)
      this.searchForm.endTime=this.getDay(0)
      this.time=[this.getDay(time),this.getDay(0)]

      this.setData()
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
      let arrayList=[]
      let ids=''
      node.checkedNodes.map((item,index)=>{
        if(item.name){
          arrayList.push({label:item.name,id:item.id})
          ids += ','+item.id
        }
      })
      this.searchForm.institutionIds =ids.substr(1);
      this.setData()
      this.shopListText=arrayList
    },
    disabledFn(data, node) {
      if (!data.alias) {  return true; } else { return false; }
    },
    exportFun(){
      appointmentExcel(this.searchForm).then(res=>{
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
  .report_appointment{
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
              // max-width: 300px;

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
  .report_appointment{
    position: relative;

    .el-dropdown{
      padding-right: 15px;
      border-right: 1px solid #DFE7F0;
      cursor: pointer;
      width: 100px;
    }
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
