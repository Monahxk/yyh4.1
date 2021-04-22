<!--
@Author: ZJZ
@Date:   2019-08-26
@Filename: CalendarView.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-14
-->

<template>
  <div class="calendarr_view ">

    <div class="statusList">
      <ul>
        <li><span class="blue"></span> 预约</li>
        <li><span class="orange"></span> 已挂号</li>
        <li><span class="yellow"></span> 治疗中</li>
        <li><span class="cyan"></span> 治疗完成</li>
        <li><span class="gray"></span> 已离开</li>
      </ul>
    </div>

    <div class="info_content" id='info_content' v-show='infoVisible'>
        <div class="info_top">
          <span>{{infoContent.patientName}}</span>&nbsp;&nbsp; <span>{{infoContent.gender==1?'男':'女'}}</span> &nbsp;&nbsp;<span>{{infoContent.patientAge}}</span>岁 &nbsp;&nbsp;<span>病历号:{{infoContent.emrNo }}</span>
        </div>
        <div class="info_chunk">
          <ul class="header_top">
            <li @click='clickTab(1)' :class="activeNum==1?'active':''">
              <el-badge  class="item" type="primary">
                <span>预约信息</span>
              </el-badge>
            </li>
            <li @click='clickTab(2)' :class="activeNum==2?'active':''">
              <el-badge :value="laterNum" class="item" type="primary">
                <span>之后预约</span>
              </el-badge>
            </li>
            <li @click='clickTab(3)' :class="activeNum==3?'active':''">
              <el-badge :value="beforeNum" class="item" type="primary">
                <span>之前预约</span>
              </el-badge>
            </li>
          </ul>
          <ul class="ul_chunk">
            <li v-if='activeNum==1'>
              <p class="p_chunk"><label>预约时间：</label> <span>{{infoContent.appointStartTime }}</span></p>
              <p class="p_chunk"><label>预约医生：</label> <span>{{infoContent.doctorName }}</span></p>
              <p class="p_chunk"><label>预约项目：</label> <span>{{infoContent.appointItemsText }}</span></p>
              <p class="p_chunk"><label>电话号码：</label> <span>{{infoContent.patientMobile }}</span></p>
              <p class="p_chunk"><label>备注：</label> <span>{{infoContent.remark }}</span></p>
            </li>
            <li v-if='activeNum==2'>
              <ul>
                <li v-for='(item,index) in laterList'>
                  <ul>
                    <li>{{item.appointmentVisitTrack.appointStartTime.substring(0,10)}}</li>
                    <li>{{item.appointmentVisitTrack.appointStartTime.substring(11,16)}}-{{item.appointmentVisitTrack.appointEndTime.substring(11,16)}}</li>
                    <li>{{item.appointItemsText}}</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li v-if='activeNum==3'>
              <ul>
                <li v-for='(item,index) in beforeList'>
                  <ul>
                    <li>{{item.appointmentVisitTrack.appointStartTime.substring(0,10)}}</li>
                    <li>{{item.appointmentVisitTrack.appointStartTime.substring(11,16)}}-{{item.appointmentVisitTrack.appointEndTime.substring(11,16)}}</li>
                    <li>{{item.appointItemsText}}</li>
                  </ul>
                </li>
              </ul>
            </li>

          </ul>

        </div>
        <div class="info_footer">
          <span v-if='infoContent.status==0' @click='moreEvent(0)' class="addRegistration">挂号</span>
          <ul class="right_edit">
            <li v-if='infoContent.status==0' @click='moreEvent(1)'><img src="../../assets/img/edit.png" alt="" ></li>
            <li @click='Del'><img src="../../assets/img/delete.png" alt="" ></li>
            <li @click='infoVisible=false'><img src="../../assets/img/wrong.png" alt="" ></li>
          </ul>
        </div>
    </div>
    <div v-if='dayFla' :class="dayFla?'left_width':''">
      <div class="top_time">
        <p class="num_text">{{numText}}</p>
        <p class="week_text">{{dateText}} {{weekText}}</p>
      </div>
      <el-date-picker
      v-model="dateTime"
      ref='dateTime'
      type="date"
      @blur='dateBlur'
      @change='dateChange'
      class="dateTime_input"
      :clearable='false'
      size='mini'
      popper-class='calendarr_view_dateTime_chunk'
      value-format='yyyy-MM-dd'
      placeholder="选择日期">
    </el-date-picker>
    </div>

    <div class="content_chunk" :class="dayFla?'right_width':''">
      <FullCalendar :events="events"
      ref='calendar'
      @event-drop="eventDrop"
      @event-resize="eventResize"
      @event-created="eventCreated"
      @event-selected="selected"
      @view-render="eventsFun"
      :config="config" ></FullCalendar>

    </div>
    <addBespeakDialog
      :isShow="isShowDialog"
      :info="userinfo"
      :rowId="rowId"
      :isEdit="isEdit"
      :viewInfo="viewInfo"
      :event-refresh="updateConstData">
    </addBespeakDialog>
    <!-- 挂号 -->
    <register :isShow="editReferral" :userinfo="sendUserinfo" :event-refresh="updateConstData"/>

  </div>
</template>

<script>
import { FullCalendar } from "vue-full-calendar";
import addBespeakDialog from "@/components/workbench/dialogs/DialogAddBespeak";
import register from "@/components/workbench/dialogs/DialogsAddRegister";
import {deleteTreatmentAppointment,calendarviewDaily,calendarviewWeekly,calendarviewMonthly,appointmentView,patientInfoView,appointTimeEdit} from "@/api";
import $ from 'jquery'
export default {
  components: {FullCalendar,addBespeakDialog,register},
  props: {},
  data () {
    return {
      dateTime:'',
      weekText:'',
      dateText:'',
      numText:'',
      dayFla:false,//是否是天
      config: {
        // header:false,
        locale: "zh-cn",
        // firstDay: "0",
        height: "auto",
        defaultView:'agendaDay',
        allDaySlot: false, // 是否显示日历的头部
        eventTextColor: "#fff",
        eventBorderColor: "none",
        slotDuration: "00:15:00", // 设置间隔
        slotLabelInterval: "01:00:00", // 设置间隔
        slotLabelFormat: "HH:mm", // 格式化左侧的时间
        minTime: "08:00", // 开始的时间
        maxTime: "18:00", // 结束的时间
        editable: true,
        selectable: true, // 这个可以控制 是否 可以拖拽
        selectHelper: true,
        slotEventOverlap: false,
        eventBackgroundColor: "#77CDFF",
        eventLimit: 5,
        // defaultDate:'2019-8-10',
        buttonText:{
          month:'月',
          week:'周',
          day:'日',
          today:'今日',
        },

      },
      events: [],
      eventSources: [1],
      isShowDialog: {//预约传值
        visibility: false
      },
      userinfo: {//预约传值
        rowId: ""
      },
      editReferral: {//挂号传值
        register: false,
        isEdit: false,
        registerId: ""
      },
      sendUserinfo: {//挂号传值
        patientId: "",
        patientName: "",
        clinicNo: "",
        telephone: "",
        add: true
      },
      viewInfo:{  //视图传值新增预约
        appointStartTime:'',
        appointEndTime:'',
        doctorId:'',
        departmentId:'',
      },
      rowId: "",
      isEdit:false,
      infoVisible:false,
      activeNum: 1,
      timeStr:'',//日期时间
      timeType:'day',//什么类型日期
      // formSearch: { //筛选
      //   queryFlag: 2,
      //   startTime: '',
      //   endTime: '',
      //   id: '',
      //   doctorId:''
      // },
      infoContent:{},
      beforeNum:'', //之前
      beforeList:[],
      laterNum:'',//之后
      laterList:[]
    }
  },
  watch:{
    'isShowDialog.visibility':{
      handler(val) {
        console.log(val)
        if(!val){
          this.dateBlur()
        }
      },
    }
  },
  mounted () {
    // this.$refs['dateTime'].focus();
    let dateText = new Date();
    let dateArray = util.timestampDay(dateText).split("-");
    dateArray[2]=dateArray[2].substring(0,2)
    let  date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
    let weekText="星期" + "日一二三四五六".charAt(date.getDay())
    this.weekText= weekText
    this.dateText=dateArray[0]+'年'+dateArray[1]+'月'+dateArray[2]+'日'
    this.numText=dateArray[2]
    this.timeStr=util.timestampDay(dateText)
    // this.setData()
  },
  methods: {
    setData(){
      if(this.timeType=='day'){
        calendarviewDaily(this.timeStr).then(res=>{
          this.dataItem(res)
        })
      }else if(this.timeType=='week'){
        calendarviewWeekly(this.timeStr).then(res=>{
          this.dataItem(res)
        })
      }else if(this.timeType=='month'){
        calendarviewMonthly(this.timeStr).then(res=>{
          this.dataItem(res)
        })
      }

    },
    dataItem(res){
      this.events=[]
      if(this.timeType !='month'){
        this.config.minTime=res.data.data.timeList[0].hour+':00'
        this.config.maxTime=res.data.data.timeList[res.data.data.timeList.length-1].hour+':00'
      }


      res.data.data.avTrackList.map(res=>{
        let bg=''
        if(res.appointmentVisitTrack.status ==0){
          bg='#77CDFF'
        }else if(res.appointmentVisitTrack.status ==1||res.appointmentVisitTrack.status ==4){
          bg='#FC9986'
        }else if(res.appointmentVisitTrack.status ==2){
          bg='#FFC740'
        }else if(res.appointmentVisitTrack.status ==3){
          bg='#1CD5C1'
        }else if(res.appointmentVisitTrack.status ==9||res.appointmentVisitTrack.status ==10){
          bg='#D8D8D8'
        }
          this.events.push({
            id:res.appointmentVisitTrack.id,
            room:res.appointmentVisitTrack.doctorId,
            departmentId:res.appointmentVisitTrack.departmentId,
            patientId:res.appointmentVisitTrack.patientId,
            title:res.appointmentVisitTrack.patientName+'-'+res.appointItemsText,
            start:res.appointmentVisitTrack.appointStartTime,
            end:res.appointmentVisitTrack.appointEndTime,
            status:res.appointmentVisitTrack.status,
            backgroundColor:bg,
          })
      })
    },
    dateBlur(val){
      this.$refs['dateTime'].focus();
    },
    dateChange(val){
      this.timeStr=val
      let dateArray = val.split("-");
      dateArray[2]=dateArray[2].substring(0,2)
      let  date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
      let weekText="星期" + "日一二三四五六".charAt(date.getDay())
      this.weekText= weekText
      this.dateText=dateArray[0]+'年'+dateArray[1]+'月'+dateArray[2]+'日'
      this.numText=dateArray[2]

      this.$refs.calendar.config.defaultDate=val
      $(this.$refs.calendar.$el).fullCalendar('destroy')
      this.$refs.calendar.calendar = $(this.$refs.calendar.$el).fullCalendar(this.$refs.calendar.config)

    },
    eventsFun(event){ //切换视图
      let _this=this
      if(event.name=='agendaDay'){
        this.dayFla=true
        this.dateTime=util.timestampToTimehms(event.start._i).substring(0,10)
        this.timeType='day'
        setTimeout(function(){
          _this.$refs['dateTime'].focus();
        },300)
        this.timeStr=util.timestampToTimehms(event.start._i).substring(0,10)
      }else if(event.name=='month'){
        this.dayFla=false
        this.timeStr=util.timestampToTimehms(event.start._i).substring(0,7)
        this.timeType='month'
      }else if(event.name=='agendaWeek'){
        this.timeStr=util.timestampToTimehms(event.start._i).substring(0,10)
        this.dayFla=false
        this.timeType='week'
      }
      this.setData()


    },
    eventDrop(event, delta, revertFunc, jsEvent, ui, view) {// 拖拽
      if(event.status !='0'){
        this.$message.error('只有预约才能修改时间')
        revertFunc()
        return
      }
      let start
      let end
      if(typeof event.start._i=='string'){
        start=event.start._i.substring(0,18)
        end=event.end._i.substring(0,18)
      }else{
        start=this.arrayTime(event.start._i)+':00'
        end=this.arrayTime(event.end._i)+':00'
      }
      let form={
        startTime:start,
        endTime:end,
        doctorId:event.room,
        id:event.id,
      }
      appointTimeEdit(form).then(res=>{
        if(res.data.code!=200){
          revertFunc()
        }

      })
    },
    selected(event,jsEvent,view){ //点击数据
      // console.log(event)

      this.infoVisible=true
      this.activeNum=1
      patientInfoView(event.id).then(res=>{
        this.infoContent=res.data.data.curAppoint.appointmentVisitTrack
        this.infoContent.doctorName=res.data.data.curAppoint.doctorName
        this.infoContent.emrNo=res.data.data.curAppoint.emrNo
        this.infoContent.patientMobile=res.data.data.curAppoint.patientMobile
        this.infoContent.appointItemsText=res.data.data.curAppoint.appointItemsText
        //之前
        this.beforeList=[]
        this.beforeNum=0
        if(res.data.data.beforeAppointList.length>=10){
          res.data.data.beforeAppointList.map((res,index)=>{
            if(index>9){
              return
            }
            this.beforeList.push(res)
          })
          this.beforeNum=10
        }else{
          this.beforeList=res.data.data.beforeAppointList
          this.beforeNum=res.data.data.beforeAppointList.length
        }
        //之后
        this.laterList=[]
        this.laterNum=0
        if(res.data.data.afterAppointList.length>=10){
          res.data.data.afterAppointList.map((res,index)=>{
            if(index>9){
              return
            }
            this.laterList.push(res)
          })
          this.laterNum=10
        }else{
          this.laterList=res.data.data.afterAppointList
          this.laterNum=res.data.data.afterAppointList.length
        }
      })

      setTimeout(function(){
        let info_content=document.getElementById('info_content')

        info_content.style.left = jsEvent.clientX+0+'px';
        info_content.style.top = jsEvent.clientY+0+'px';

        var objW=info_content.offsetWidth;
        var objH=info_content.offsetHeight;
        var selfX=objW+jsEvent.clientX;
        var selfY=objH+jsEvent.clientY;
        var bodyW=document.body.offsetWidth;
        var bodyH=document.documentElement.clientHeight;

        if(selfX>bodyW){
          info_content.style.left = jsEvent.clientX-objW+'px';
        }
        if(selfY>bodyH){
          info_content.style.top = jsEvent.clientY-objH+'px';
        }
      },100)


    },
    eventResize(event, delta, revertFunc){// 下拉时间被改变
      if(event.status !='0'){
        this.$message.error('只有预约才能修改时间')
        revertFunc()
        return
      }
      let start=this.arrayTime(event.start._i)+':00'
      let end=this.arrayTime(event.end._i)+':00'
      let form={
        startTime:start,
        endTime:end,
        doctorId:event.room,
        id:event.id,
      }
      appointTimeEdit(form).then(res=>{
        if(res.data.code!=200){
          revertFunc()
        }

      })
    },
    moreEvent(i){
      if(i==5){
        this.isShowDialog.visibility = true;
        this.userinfo={}
        this.rowId=''
        this.isEdit=false
      }
      if (i === 0) {
        Object.assign(this.sendUserinfo, this.infoContent);
        this.sendUserinfo.rowId = this.infoContent.id;
        this.editReferral.register = true;
        this.sendUserinfo.appointmentVisitTrack=this.infoContent
      }
      if (i === 1) {
        this.isShowDialog.visibility = true;
        this.userinfo = this.infoContent;
        this.userinfo.patientMobile = this.infoContent.patientMobile;
        this.userinfo.patientId = this.infoContent.patientId;
        this.rowId = this.infoContent.id;
        this.viewInfo.doctorId=this.infoContent.doctorId
        this.viewInfo.addBespeak=false
        this.viewInfo.appointStartTime=this.infoContent.appointStartTime
        this.isEdit=true
      }


    },
    clickTab(num){
      this.activeNum=num
    },
    updateConstData() {
      // this.timeStr=''
      this.infoVisible=false
      this.setData()
    },
    eventCreated(event, jsEvent, view){ //点击空白日程
      console.log(event)
      if(event.view.type=="month"){
        return
      }
      let startText=this.arrayTime(event.start._i)
      let endText=this.arrayTime(event.end._i)
      console.log(this.infoContent)
      this.viewInfo.appointStartTime=startText+':00'
      this.viewInfo.appointEndTime=endText+':00'
      this.viewInfo.doctorId=''
      this.viewInfo.departmentId=''
      this.moreEvent(5)
    },
    Del(){//删除
      this.$confirm("此操作将删除该条信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteTreatmentAppointment(this.infoContent.id).then(res=>{
          if(res.data.code==200){
            // this.timeStr=''
            this.setData()
            this.infoVisible=false
          }
        })
      }).catch(() => {});;
    },
    arrayTime(time){
      let val=''
      time.map((item,index)=>{
        if(index<1){
          val +=item
        }else if(index==1){
          item=parseInt(item+1)
          if(item<10){
            item = '0'+item
          }
          val += '-'+item
        }else{
          if(item<10){
            item = '0'+item
          }
          if(index<3){
            val += '-'+item
          }else if(index ==3){
            val += ' '+item
          }else if(index<5){
            val += ':'+item
          }
        }
      })
      return val;
    },
    // 计算当前时间 时间转单元
    getDifference(start, end) {
      let start_data = moment(start);
      let end_date = moment(end);
      return end_date.diff(start_data, "minutes") / 15;
    },
  },
}
</script>
<style lang="less" scoped>
  .calendarr_view{
    position: relative;
    .top{
      position: relative;
      margin-bottom: 30px;
      .add_btn{
        cursor: pointer;
        position: absolute;
        right: 0;
        top: 0;
        width: 154px;
        height: 48px;
        font-size: 18px;
        font-weight: bold;
        color: #4e81f2;
        text-align: center;
        line-height: 48px;
        -webkit-box-shadow: 0 0 6px 0 #e4e9ff;
        box-shadow: 0 0 6px 0 #e4e9ff;
        background-color: #ffffff;
        margin-right: 20px;
      }
    }
    .statusList{
      position: fixed;
      bottom:30px;
      right: 4.5%;
      z-index: 2;
      background-color: #fff;
      padding:20px;
      li{
        float:left;
        list-style: none;
        span{
          margin:0 5px 0 20px;
          display: inline-block;
          width:16px;
          height:16px;
          position: relative;
          top: 3px;
        }
        .blue{
          background:#77CDFF;
        }
        .orange{
          background:#FC9986;
        }
        .yellow{
          background:#FFC740;
        }
        .cyan{
          background:#1CD5C1;
        }
        .gray{
          background:#D8D8D8;
        }
      }
    }
    .info_content{
      position: fixed;
      z-index: 9;
      box-shadow:0px 0px 15px 0px rgba(59,120,253,0.27);
      height: 300px;
      width: 350px;
      background: white;
      .info_top{
        width:350px;
        height:40px;
        background:rgba(119,205,255,0.3);
        line-height: 40px;
        padding:0 10px;
      }
      .info_chunk{
        width:350px;
        padding:10px;
        background: white;
        height: 220px;
        .header_top{

          height: 40px;
          li{
            float: left;
            height: 30px;
            line-height: 30px;
            width: 33.3%;
            text-align: center;
            cursor: pointer;
            border: 1px solid #F0F0F1;
            border-right:0;

          }

          li:last-child{
            border-right:1px solid #F0F0F1;
          }
          li.active{
            border:1px solid #3B78FD;
            color: #3B78FD;
          }

        }
        .ul_chunk{
          >li{
            height: 150px;
            overflow-y: auto;
            li{
              padding:5px 0;
              ul{
                overflow: hidden;
                li{
                  float: left;
                  width: 33.3%;
                  text-align: center;
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;
                  font-size: 12px;
                }
              }

            }
          }

          .p_chunk{
            padding:7px 0;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            label{
              display: inline-block;
              width: 70px;
              text-align: right;
            }
            span{
              color: #3B78FD;
            }
          }
        }

      }
      .info_footer{
        padding:10px;
        border-top: 1px solid #F0F0F1;
        background: white;
        position: relative;
        .addRegistration{
          border:1px solid #3B78FD;
          font-size: 12px;
          padding:3px 5px;
          color: #3B78FD;
          cursor: pointer;
        }
        .right_edit{
          // position: absolute;
          float:right;
          position: relative;
          top: -5px;
          li{
            float:left;
            width: 24px;
            margin-right: 10px;
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
<style lang="less">
.calendarr_view_dateTime_chunk{
  display: block !important;
  position: absolute !important;
  top: 270px !important;
  left: 212px !important;
  z-index: 2000!important;
  box-shadow:none !important;
  border:0 !important;
  border-radius: 0 !important;
  border-top: 1px solid #E4E7ED !important;
  &.calendarr_view_dateTime_chunk[x-placement^=bottom] .popper__arrow{
    display: none !important;
  }
}
  .calendarr_view{

    background: white;
    display: flex;
    align-items: stretch;
    .left_width{
      position: relative;
      width: 335px;
      background: white;
      border-right: 1px solid #E4E7ED;
      .top_time{
        position: relative;
        top: 5px;
        padding:22px;
        .num_text{
          font-size: 52px;
          color: #1B1E25;
          font-family:PingFangSC-Regular;
          margin-bottom: 5px;
        }
        .week_text{

        }
      }
      .dateTime_input{
        opacity: 0;
        width: 1px;
        height:1px;
        padding:0;
        position: relative;
        top: 20px;
        left: 20px;
        .el-date-table th{
          text-align: center;
        }
        .el-input__inner{
          padding:0;
        }
      }
    }
    .right_width{
      width:76%;
      margin-left: 1%;
    }
    .content_chunk{

      .fc-day,.fc-day-top{
        font-weight: bold;
      }
      .fc-agendaDay-view{
        .fc-widget-content{
          background: #ffffff;
        }
      }
      .fc-time-grid{
        .fc-highlight{
          background: #ffffff;
        }
        .fc-slats td{
          height: 3em;
          font-weight: bold;
        }
        .fc-event{
          border-radius:22px 0px 22px 0px;
          border:0;
          margin-left: 1px;
        }
      }
      .fc-day-header{
        height: 3em;
        line-height: 3em;
        font-weight: bold;
      }
      .fc-time-grid-event{
        .fc-content{
          padding:10px;
        }
      }

    }
    .el-tabs__item{
      padding:0 10px;
    }
    .el-badge__content.is-fixed{
      right: 0;
    }
  }
</style>
