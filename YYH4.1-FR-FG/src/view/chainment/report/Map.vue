<template>
  <div class="report_map wrapper">
    <div class="wrok_bench_title">
      <div class="work_count_wrap">
        <div class="item">
          <div class="left">
            <p>
              <span class="red">{{todayWhole.outPatient}}</span>
              <span class="samlls red">人</span>
            </p>
            <p>今日门诊量</p>
          </div>
          <img src="../../../assets/img/renshu-png.png" alt="">
        </div>
        <div class="item">
          <div class="left">
            <p>
              <span class="samlls blue">￥</span>
              <span class="blue">{{todayWhole.todayIncome}}</span>
            </p>
            <p>今日收入</p>
          </div>
          <img src="../../../assets/img/shouru-png.png" alt="">
        </div>
        <div class="item">
          <div class="left">
            <p>
              <span class="samlls violet">￥</span>
              <span class="violet">{{todayWhole.perCustomer}}</span>
            </p>
            <p>今日客单价</p>
          </div>
          <img src="../../../assets/img/jinbi-png.png" alt="">
        </div>
      </div>
    </div>
    <div class="map_content">
      <div class="top">各门店今日统计（{{time}}）</div>
      <div class="map_chunk">
        <div id="myChart" :style="{width: '900px', height: '660px'}"></div>
        <!-- <div class="shop_details">

        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import china from 'echarts/map/json/china.json'
import {overviewMap} from "@/api";
export default {
  name: 'report_map',
  data () {
    return {
      time:'',
      todayWhole:{},
      dataList:[],
      geoCoordMap:{},
    }
  },
  mounted() {
    let date = new Date();
    this.time=util.timestampToTime(date).substring(0,10)
    echarts.registerMap('china', china)
    this.setData()
  },
  methods: {
    setData(){
      overviewMap().then(res=>{
        this.todayWhole=res.data.data.todayWhole
        let nameList={}
        let dataList=[]
        res.data.data.listAllInstitutionReport.forEach((item,index)=>{
          nameList[item.institution.name]=[item.institution.longitude,item.institution.latitude]

          dataList.push({name: item.institution.name, value: 150,todayAppoint:item.todayAppoint,todayNewPatient:item.todayNewPatient,todayReceivingAmount:item.todayReceivingAmount,todayVisit:item.todayVisit})
        })

        this.EchartsData(nameList,dataList)

      })
    },
    EchartsData(geoCoordMap,dataList){
      let myChart =echarts.init(document.getElementById('myChart'))
          // 绘制图表
          var data = dataList;
          // var geoCoordMap = {
          //     geoCoordMap
          // };
          // var data = [
          //   {name: '大庆', value: 200,num1:3,num2:4,num3:5,num4:15}
          // ];
          // var geoCoordMap = {
          //     '大庆':[125.03,46.58]
          // };
          var convertData = function (data) {
              var res = [];
              for (var i = 0; i < data.length; i++) {

                  var geoCoord = geoCoordMap[data[i].name];
                  if (geoCoord) {
                      res.push({
                          name: data[i].name,
                          value: geoCoord.concat(data[i].value),
                          todayAppoint:data[i].todayAppoint,
                          todayNewPatient:data[i].todayNewPatient,
                          todayReceivingAmount:data[i].todayReceivingAmount,
                          todayVisit:data[i].todayVisit,
                      });
                  }
              }
              return res;
          };
        let  option = {

          tooltip : {
            trigger: 'item',
            formatter: function (params,ticket,callback){
                  return params.data.name
                  +'<br>'+'今日预约'+' : '+params.data.todayAppoint+' 人'
                  +'<br>'+'今日就诊'+' : '+params.data.todayVisit+' 人'
                  +'<br>'+'新增患者'+' : '+params.data.todayNewPatient+' 人'
                  +'<br>'+'今日实收'+' : ￥'+params.data.todayReceivingAmount
            }

          },
          geo: {
            map: 'china',
            roam: true,
            zoom:1,
            label: {
              normal: {
                show: true, // 是否显示对应地名
                textStyle: {
                  color: 'rgba(0,0,0,0.4)'
                }
              }
            },
            itemStyle: {
              normal: {
                borderColor: 'rgba(0, 0, 0, 0.2)',
                areaColor:'rgba(198,217,241,1)'
              },
              emphasis: {
                areaColor: null,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 20,
                borderWidth: 0,
                shadowColor: 'rgba(198,217,241,1)'
              }
            }
          },
            series :  [
              {
                name: 'house',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                    data: convertData(dataList),
                    symbolSize: function (val) {
                        return val[2] / 10;
                    },
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: true
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#FF4871'
                        }
                    }

                },

            ]
          };

          myChart.setOption(option);

        window.addEventListener('resize',function() {myChart.resize()});
    },


  }
}
</script>
<style lang="less" scoped>
  .report_map{
    position: relative;
    overflow: hidden;
    .wrok_bench_title {
      display: flex;
      align-items: flex-end;
      // margin-top: 30px;
      .work_count_wrap {
        color: #1b1e25;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .item {
          // display: flex;
          // flex-flow: column;
          // justify-content: center;
          height: 96px;
          margin-right: 20px;
          padding: 0 10px;
          box-shadow: 0 0 6px 0 #e4e9ff;
          background-color: #ffffff;
          overflow: hidden;
          .left{
            float: left;
            position: relative;
            top: 20px;
          }
          img{
            float: right;
            width: 48px;
            margin-left: 30px;
            position: relative;
            top: 20px;
          }
          p:nth-child(2) {
            font-size: 12px;
          }
          p:nth-child(1) {
            font-size: 32px;
            padding-bottom: 10px;
          }
          .samlls {
            font-size: 11px;
          }

          * {
            -moz-user-select: none; /*火狐*/
            -webkit-user-select: none; /*webkit浏览器*/
            -ms-user-select: none; /*IE10*/
            -khtml-user-select: none; /*早期浏览器*/
            user-select: none;
          }
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
    }
    .map_content{
      box-shadow:0px 0px 6px 0px rgba(228,233,255,1);
      position: relative;
      margin-top: 20px;
      background: white;
      .top{
        font-size: 18px;
        font-weight: bold;
        padding: 20px 20px;
        width: 95%;
        margin: auto;
        border-bottom: 1px solid #E4E9FF;
      }
      .map_chunk{
        background: white;
        height: 30px;
        position: relative;
        height: 700px;
        padding: 20px;
        margin:auto;
        margin-top: 20px;
        width: 900px;
      }
    }
  }
</style>
