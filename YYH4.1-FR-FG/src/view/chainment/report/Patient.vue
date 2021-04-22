<template>
  <div class="report_patient wrapper">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
    <el-tab-pane label="新增患者" name="first">
      <div class="add_patient">
        <div class="top">
          <el-dropdown trigger="click" @command='timeCommand'>
             <span class="el-dropdown-link">
               <span v-if='addTimeVal==7'>最近7天</span>
               <span v-else-if='addTimeVal==15'>最近15天</span>
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
             v-model="addTime"
             type="daterange"
             value-format='yyyy-MM-dd'
             range-separator="至"
             size="small"
             start-placeholder="开始日期"
             end-placeholder="结束日期"
             @change='addTimeChange'>
           </el-date-picker>
          </div>
          <div class="shop_chunk">
            <span class="shop_list">
              <span class="show_shop" @click='addShopFla=true'>选择门店：</span>
              <ul >
                <li v-for='(item,index) in addShopListText' v-if='index<3'>
                  <span>{{item.label}}</span> <i class="el-icon-close" @click="addDelShop(item.id)"></i>
                  <span v-if='index==2'>...</span>
                </li>
              </ul>
              <i class="show_shop el-icon-caret-bottom" @click='addShopFla=true'></i>
              <div class="shop_content" v-show='addShopFla'>
                <el-input
                  placeholder="输入关键字进行过滤"
                  v-model="addFilterText" class="filter_text">
                </el-input>
                <div class="tree">
                  <el-tree
                      :data="dataList"
                      :props="defaultProps"
                      node-key="id"
                      show-checkbox
                      :default-expand-all='true'
                      :filter-node-method="filterNode"
                      ref="addTree"
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
            总计： <span>{{total}}人</span>
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
              :data="detailsList"
              max-height="500"
              :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
            >
              <el-table-column width='120px' prop="dateTime" label="时间\门店" align="center"></el-table-column>
              <el-table-column prop="total" label="合计"></el-table-column></el-table-column>
              <el-table-column width='200px' :prop="'count'+index" :label="item" align="center" v-for='(item,index) in shopList' :key='index'></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-tab-pane>



    <el-tab-pane label="患者来源" name="second">
      <div class="source_patient">
        <div class="top">
          <el-dropdown trigger="click" @command='timeCommand'>
             <span class="el-dropdown-link">
               <span v-if='sourceTimeVal==7'>最近7天</span>
               <span v-else-if='sourceTimeVal==15'>最近15天</span>
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
             v-model="sourceTime"
             type="daterange"
             value-format='yyyy-MM-dd'
             @change='addTimeChange'
             range-separator="至"
             size="small"
             start-placeholder="开始日期"
             end-placeholder="结束日期">
           </el-date-picker>
          </div>
          <div class="shop_chunk">
            <span class="shop_list">
              <span class="show_shop" @click='sourceShopFla=true'>选择门店：</span>
              <ul >
                <li v-for='(item,index) in shopListText' v-if='index<3'>
                  <span>{{item.label}}</span> <i class="el-icon-close" @click="delShop(item.id)"></i>
                  <span v-if='index==2'>...</span>
                </li>
              </ul>
              <i class="show_shop el-icon-caret-bottom" @click='sourceShopFla=true'></i>
              <div class="shop_content" v-show='sourceShopFla'>
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
            <i></i> <span>数据图</span>
          </div>
          <div id="myChart2" :style="{width: '60%', height: '500px',margin:'auto'}"></div>
          <p class="bg_gray"></p>
          <div class="title_text">
            <i></i> <span>详细数据</span>
            <a @click='exportFun'>导出Excel</a>
          </div>
          <div class="table_list">
            <el-table
              highlight-current-row
              ref="singleTable"
              :data="detailsList"
              max-height="500"
              :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
            >
              <el-table-column width='120px' prop="patientSourceName" label="时间\门店" align="center"></el-table-column>
              <el-table-column prop="total" label="合计"></el-table-column></el-table-column>
              <el-table-column width='200px' :prop="'count'+index" :label="item" align="center" v-for='(item,index) in shopList' :key='index'></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import {incrementalpatient,patientsourceData,patientsourceWhole,treeInstitutions,incrementalpatientExcel,patientsourceExcel} from "@/api";
export default {
  name: 'report_patient',
  components: {

  },
  data () {
    return {
      activeName: 'first',
      addFilterText:'',
      filterText:'',
      dataList:[],
      defaultProps: {
        children: 'subLevelList',
        disabled: this.disabledFn,
        label: 'name'
			},
      addTime:'',
      addTimeVal:'',//新增时间筛选文字
      sourceTime:'',
      sourceTimeVal:'',//来源时间筛选文字
      addShopListText:[],  //新增的门店名
      shopListText:[],
      list:[],
      addShopFla:false,//新增患者门店选择显示
      sourceShopFla:false,//来源门店选择显示
      shopList:[],//门店名列表数据
      shopCountList:[],//门店数据
      detailsList:[],//详情列表
      total:'',
      searchForm:{
        startTime:'',
        endTime:'',
        institutionIds:'',
      }

    }
  },
  watch: {
    addFilterText(val) {
      this.$refs.addTree.filter(val);
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
    let _this=this
    document.addEventListener('click',function(e){
      if(e.target.className!='show_shop'&& e.target.className!='el-input__inner'&& e.target.className!='el-icon-close'){
          _this.sourceShopFla=false;
          _this.addShopFla=false;
      }
    })
    this.searchForm.startTime=this.getDay(-29)
    this.searchForm.endTime=this.getDay(0)
    this.addTime=[this.getDay(-29), this.getDay(0)]
    this.addData()
    treeInstitutions().then(res=>{
      this.dataList=res.data.data.subLevelList
    })

  },
  methods: {
    addTimeChange(val){
      if(this.activeName=='first'){
        this.searchForm.startTime=val[0]
        this.searchForm.endTime=val[1]
        this.addData()
      }else{
        this.searchForm.startTime=val[0]
        this.searchForm.endTime=val[1]
        this.sourceData()
      }

    },
    addData(){
      this.detailsList=[]
      this.shopList=[]
      this.shopCountList=[]
      incrementalpatient({params:this.searchForm}).then(res=>{
        res.data.data.incrementalPatientChart.map(res=>{
          this.shopList.push(res.institutionName)
          this.shopCountList.push(res.count)
        })
        this.total=res.data.data.total
        this.detailsList=res.data.data.incrementalPatientDataPage
        this.addEcharts(this.shopList,this.shopCountList)

      })
    },
    sourceData(){
      this.detailsList=[]
      this.shopList=[]
      this.shopCountList=[]
      let seriesData=[]
      let shopList=[]
      patientsourceData({params:this.searchForm}).then(res=>{
        res.data.data.patientSourceChart.map(res=>{
          seriesData.push({value:parseInt(res.count), name:res.patientSourceName})
          shopList.push(res.patientSourceName)
        })
        res.data.data.listInstitution.map(res=>{
          this.shopList.push(res.name)
        })
        // this.shopList=res.data.data.listInstitution
        this.detailsList=res.data.data.patientSourceData
        this.sourceEcharts(shopList,seriesData)

      })
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
      if(this.activeName=='first'){
        this.addTimeVal=val
        this.searchForm.startTime=this.getDay(time)
        this.searchForm.endTime=this.getDay(0)
        this.addTime=[this.getDay(time),this.getDay(0)]
        this.addData()
      }else{
        this.sourceTimeVal=val
        this.searchForm.startTime=this.getDay(time)
        this.searchForm.endTime=this.getDay(0)
        this.sourceTime=[this.getDay(time),this.getDay(0)]
        this.sourceData()
      }
    },
    addDelShop(id){  //新增取消门店
      this.addShopListText.map((item,index)=>{
        if(id==item.id){
          this.addShopListText.splice(index, 1)
        }
      })
      let ids=''
      this.addShopListText.map(res=>{
        ids += ','+res.id
      })
      this.searchForm.institutionIds =ids.substr(1);
      this.addData()
      this.$refs.addTree.setCheckedNodes(this.addShopListText);

    },
    delShop(id){  //取消门店
      this.shopListText.map((item,index)=>{
        if(id==item.id){
          this.shopListText.splice(index, 1)
        }
      })
      let ids=''
      this.addShopListText.map(res=>{
        ids += ','+res.id
      })
      this.searchForm.institutionIds =ids.substr(1);
      this.sourceData()
      this.$refs.tree.setCheckedNodes(this.shopListText);

    },
    handleClick(tab, event) {
      if(tab.name=='first'){
        this.searchForm.startTime=this.getDay(-29)
        this.searchForm.endTime=this.getDay(0)
        this.searchForm.institutionIds=''
        this.addTime=[this.getDay(-29),this.getDay(0)]
        this.addData()
      }else{
        this.searchForm.startTime=this.getDay(-29)
        this.searchForm.endTime=this.getDay(0)
        this.searchForm.institutionIds=''
        this.sourceTime=[this.getDay(-29),this.getDay(0)]
        this.sourceData()
      }
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
      if(this.activeName=='first'){
        this.searchForm.institutionIds =ids.substr(1);
        this.addShopListText=arrayList
        this.addData()
      }else{
        this.searchForm.institutionIds =ids.substr(1);
        this.shopListText=arrayList
        this.sourceData()
      }
    },
    exportFun(){
      if(this.activeName=='first'){
        incrementalpatientExcel(this.searchForm).then(res=>{
          let filename = decodeURI(res.headers['content-disposition'].split(';')[1].split('=')[1]) || '分拣表.xlsx'
            this.fileDownload(res.data, filename)
        })
      }else{
        patientsourceExcel(this.searchForm).then(res=>{
          let filename = decodeURI(res.headers['content-disposition'].split(';')[1].split('=')[1]) || '分拣表.xlsx'
            this.fileDownload(res.data, filename)
        })
      }

    },
    sourceEcharts(xAxisData,seriesData){
      let myChart =echarts.init(document.getElementById('myChart2'))
          // 绘制图表
        let  option = {
          color:['#3BA0FF','#36CBCB','#4DCB73','#FAD337','#F2637B','#975FE4'],
          title: {
              text: '单位:人',
              right:'15%',
              top:'5%',
          },
          tooltip : {
              trigger: 'item',
              formatter: "{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            right: '30px',
            top:'20%',
            icon: 'circle',
            itemHeight  :9,
            padding:[10,0,10,10],
            formatter: function(name) {
                 var data = option.series[0].data;
                 var total = 0;
                 var tarValue;
                 for (var i = 0, l = data.length; i < l; i++) {
                     total += data[i].value;
                     if (data[i].name == name) {
                         tarValue = data[i].value;
                     }
                 }
                 var p = (tarValue / total * 100).toFixed(0);
                 return name + ' ' + '| ' + p + '%               '+tarValue;
             },
             textStyle:{
               fontSize:14,
             },
            // data:['内部推荐','会员','年度活动','店庆','其他']
            data:xAxisData
          },
            series : [
                {
                  type: 'pie',
                  radius : '55%',
                  center: ['20%', '50%'],
                    // data:[ {value: 33, name: "内部推荐"}, {value: 4, name: "会员"},{value: 5, name: "年度活动"},{value: 6, name: "店庆"},{value: 11, name: "其他"}]
                    data:seriesData
                }
            ]
        };

          myChart.setOption(option);

        window.addEventListener('resize',function() {myChart.resize()});
    },
    addEcharts(xAxisData,seriesData){
      let myChart =echarts.init(document.getElementById('myChart'))
      myChart.clear();
          // 绘制图表
        let  option = {
          title: {
              text: '单位:人',
              right:'15%',
              top:'5%',
          },
            tooltip : {
                trigger: 'axis',
                axisPointer : {type : 'line'}
            },
            xAxis : [
                {
                    data : xAxisData
                }
            ],
            yAxis : [{type : 'value'}],
            series : [
                {
                  type: 'bar',
                  label: {
                      normal: {
                          position: 'top',
                          show: true
                      }
                  },
                  itemStyle: {
                      normal: {
                          color: new echarts.graphic.LinearGradient(
                              0, 0, 0, 1,
                              [
                                  {offset: 0, color: '#C6F6AB'},
                                  {offset: 0.5, color: '#AFF0C2'},
                                  {offset: 1, color: '#77E4C3'}
                              ]
                          )
                      },
                  },
                  barWidth: 14,
                  data:seriesData
                }
            ]
        };

          myChart.setOption(option,true);
        // window.addEventListener('resize',function() {myChart.resize()});
    },
    disabledFn(data, node) {
      if (!data.alias) {  return true; } else { return false; }
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
  .report_patient{
    position: relative;
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
  .report_patient{
    position: relative;
    .el-tabs__nav-scroll{
      background:rgba(59,120,253,0.1);
    }
    .el-tabs--border-card{
      box-shadow:0px 0px 6px 0px rgba(228,233,255,1);
    }
    .el-tabs__item.is-top .is-active{
      // border-top: 4px solid #3B78FD;
      color: #3c79fd !important;
    }
    .el-tabs--border-card>.el-tabs__header .el-tabs__item,.el-tabs__item{
      color: #1B1E25;
    }
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
