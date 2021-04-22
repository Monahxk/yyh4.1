<!--
@Author: ZJZ
@Date:   2019-08-13
@Filename: DialogAddBespeak.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-12
-->

<template>
  <div class="wrapper" id="bespeak_wrap">
    <el-dialog
      :title="rowId? '修改预约': '新增预约' "
      :visible.sync="isShow.visibility"
      :closeOnClickModal="false"
      width="1000px"
      @open="openPageFn"
      @closed="closePageFn"
    >
      <div class="dialog_main">
        <div class="header" v-if="!isEdit">
          <el-autocomplete
            style="width:280px"
            popper-class="my-autocomplete"
            v-model="state3"
            :trigger-on-focus="false"
            :fetch-suggestions="querySearch"
            placeholder="患者姓名 / 拼音 / 首字母"
            @select="handleSelect"
            size="small"
          >
            <i class="el-icon-search el-input__icon" slot="suffix"></i>
            <template slot-scope="{ item }">
              <div class="name_box">
                <span>{{ item.patientName }}</span>
              </div>
            </template>
          </el-autocomplete>
          <ul class="btns"></ul>
        </div>

        <div class="content_user">
          <ul class="user_msg">
            <li>
              <span>患者姓名：</span>
              <span>{{stateDatas.patientName}}</span>
            </li>
            <li>
              <span>病历号：</span>
              <span>{{stateDatas.emrNo}}</span>
            </li>
            <li>
              <span>手机号：</span>
              <span>{{stateDatas.mobilephone}}</span>
            </li>
          </ul>
          <div></div>
        </div>

        <div class="main_wrap">
          <div class="bespeak_box">
            <h3 class="title">预约基本信息</h3>
            <el-form ref="form" :model="form" label-width="93px">
              <el-form-item label="类别" class="special">
                <el-radio-group v-model="sendData.returnVisit">
                  <el-radio label="0">初诊</el-radio>
                  <el-radio label="1">复诊</el-radio>
                  <el-radio label="2">再诊</el-radio>
                </el-radio-group>
              </el-form-item>
              <!-- <el-form-item label="当前诊所" class="mt10" v-if="isChain != 'true'">
                <span>{{eachData.institution.name}}</span>
              </el-form-item> -->
              <!-- hzj，增加 -->
              <!-- <el-form-item label="预约门店" class="mt10" v-if="isChain = 'true'" required>
                <el-cascader
                v-model='institutionIdArr'
                :options="institutionList"
                expand-trigger="hover"
                :show-all-levels='false'
                size="small"
                @change="institutionChange">
                </el-cascader>
              </el-form-item> -->
              <el-form-item label="科室" required>
                <el-select v-model="sendData.departmentId" size="small" placeholder="请选择">
                  <el-option
                    v-for="(item,index) in eachData.departmentList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="医生" required>
                <!-- doctor -->
                <el-select v-model="sendData.doctorId" placeholder="请选择" size="small">
                  <el-option
                    v-for="(item,index) in eachData.doctorList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="开始时间" class="mt10" required>
                <el-date-picker
                  v-model="sendData.appointStartTime"
                  type="datetime"
                  size="small"
                  value-format="yyyy-MM-dd HH:mm"
                  placeholder="选择日期时间"
                  style="width:200px;"
                  :default-time="startT"
                  @change="changeTimeValue"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="持续时间">
                <el-input-number
                  v-model="sendData.appointEndTime"
                  size="small"
                  style="width:90px;"
                  controls-position="right"
                  :min="1"
                  :max="10"
                  @change="inoutNumberTimeFn"
                ></el-input-number>
                <span>单元(15分钟/单元)</span>
              </el-form-item>

              <el-form-item label="备注">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 2}"
                  placeholder="请输入内容"
                  v-model="sendData.remark"
                  resize="none"
                  style="width:200px;"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>

          <div class="bespeak_box">
            <h3 class="title">预约视图</h3>
            <div class="select_time"></div>
            <div class="scroll_wrap_box">
              <full-calendar
                ref="calendar"
                id="calendar"
                :events="events"
                :config="config"
                :header="false"
                @event-created="eventCreated"
                @event-drop="eventDrop"
                @event-resize="eventResize"
                defaultView="agendaDay"
                defaultDate="2019-02-24"
              ></full-calendar>
            </div>
          </div>

          <div class="bespeak_box">
            <h3 class="title">预约项目</h3>
            <div class="select_time"></div>
            <div class="scroll_wrap_box checkbox_wrap">
              <vuescroll :ops="ops" class="max_width">
                <el-checkbox-group v-model="sendData.treatItemIds">
                  <el-checkbox
                    :label="item.id.toString()"
                    v-for="(item,index) of eachData.appointItemConfigList"
                    :key="index"
                  >{{item.name}}</el-checkbox>
                </el-checkbox-group>
              </vuescroll>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <ul class="btns_wrap">
          <li class="actives item" @click="saveBespeak">
            <span>保存预约</span>
          </li>
          <li class="item" @click="isShow.visibility = false">
            <span>取消</span>
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import vuescroll from "vuescroll";
import { FullCalendar } from "vue-full-calendar";
import moment from "moment";
import { SYSTEM_HTTP_SUCCESS } from "@/constant";
import {
  getPatientlists,
  getBespeakInfo,
  appointmentdoId,
  getTineView,
  getRecordData,
  postPatientAppoint,
  appointmentdo,
  treeInstitutionsSimple,
  putPatientAppoint
} from "@/api";
import $ from "jquery";
export default {
  components: { FullCalendar, vuescroll },
  props: ["isShow", "info", "rowId", "isAdd", "isEdit", "viewInfo"],
  data() {
    return {
      startT: "09:00:00",
      sTime: "",
      eTime: "",
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.pickerMinDate = minDate.getTime();
          if (maxDate) {
            this.pickerMinDate = "";
          }
        },
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      isVisb: "",
      searchShow: true,
      AppointmentItemConfig: [],
      clinic: [],
      department: [],
      doctor: [],
      departmentId: "",
      doctorId: "",
      state3: "",
      sendData: {
        patientName: "", // 患者名称
        patientId: "", // 患者Id
        returnVisit: "0", //  类别
        institutionId: "", // 诊所ID
        appointStartTime: "", // 开始时间s
        appointEndTime: "", // 结束时间
        departmentId: "1", // 预约科室的ID
        doctorId: "", // 医生ID
        remark: "", // 备注
        treatItemIds: [] // 预约项目的id
        // statusVO: 0
      },
      eachData: {
        doctorList: [], // 医生
        appointItemConfigList: [], // 项目
        departmentList: [], // 科室
        institution: {
          name: ""
        }
      },
      stateDatas: {
        patientName: "",
        emrNo: "",
        patientMobile: ""
      },
      config: {
        locale: "zh-cn",
        height: "parent",
        allDaySlot: false, // 是否显示日历的头部
        eventTextColor: "#fff",
        eventBackgroundColor: "#95D8FF",
        eventBorderColor: "none",
        eventLimit: true,
        displayEventEnd: true,
        slotDuration: "00:15:00", // 设置间隔
        slotLabelInterval: "00:15:00", // 设置间隔
        slotLabelFormat: "HH:mm", // 格式化左侧的时间
        minTime: "08:00", // 开始的时间
        maxTime: "17:15", // 结束的时间
        scrollTime: "08:00", // 滚动的时间
        // editable: true,
        selectable: true, // 这个可以控制 是否 可以拖拽
        selectHelper: false,
        slotEventOverlap: false
        // defaultDate: ''，
        // eventLimit: true 限制一天的事件数
        // defaultDate:'2017-10-28', // 设置当前的默认时间  可以改变时间搜索
      },
      events: [],
      form: {},
      checkList: [],
      timeValue: "",
      num8: "",
      soptions: [],
      value: "",
      textarea3: "",
      value1: "",
      len: "",
      ops: {
        mode: "native",
        sizeStrategy: "percent",
        detectResize: true,
        bar: {
          background: "#F0F0F0",
          keepShow: false,
          size: "6px",
          minSize: 0.2
        }
      },
      eventsViewInfo: {
        //预约视图数据
        appointStartTime: "",
        appointEndTime: "",
        departmentId: "1",
        doctorId: ""
      },
      ViewInfoEdit: false,
      institutionIdArr: [],
      institutionList: [],
      isChain: sessionStorage.getItem('isChain'),
      loginInstitutionId: sessionStorage.getItem('institutionId')
    };
  },
  watch: {
    "sendData.doctorId": {
      handler(val) {
        if (val) this.initView();
      },
      deep: true
    },
    "sendData.appointStartTime": {
      handler(val) {
        if (!val) return;
        let _t = moment(val).format("YYYY-MM-DD");
        this.$refs.calendar.fireMethod("gotoDate", _t);
        // this.$refs.calendar.config.scrollTime=val.substring(11,16)
        this.getBespeakView();
      },
      deep: true
    },
    "sendData.appointEndTime": {
      handler() {
        this.getBespeakView();
      },
      deep: true
    },
    "stateDatas.patientName": {
      handler(val) {
        this.changeEventName(val);
      },
      deep: true
    },
    viewInfo: {
      handler(val) {
        let _this = this;
        console.log(val)

        if (val.addBespeak) {
          _this.sendData.doctorId = _this.eachData.doctorList[0].id;
          return;
        }
        setTimeout(function() {
          _this.sendData.appointStartTime = val.appointStartTime;
          // _this.sendData.appointEndTime=val.appointEndTime
          _this.sendData.departmentId = parseInt(val.departmentId) || 1;
          _this.sendData.doctorId = parseInt(val.doctorId) || "";

          _this.eventsViewInfo.appointStartTime = val.appointStartTime;
          _this.eventsViewInfo.appointEndTime = val.appointEndTime;
          _this.eventsViewInfo.departmentId = val.departmentId|| 1;
          _this.eventsViewInfo.doctorId = val.doctorId;
          // _this.getBespeakView()
          _this.sendData.appointEndTime = _this.getDifference(
            val.appointStartTime,
            val.appointEndTime
          );
          // this.initView();
        }, 300);
      },
      deep: true
    }
  },
  created() {
    this.sendData.returnVisit = "0";

  },
  mounted() {

  },
  computed: {},
  methods: {
    closePageFn() {
      Object.keys(this.sendData).map(key => (this.sendData[key] = ""));
      Object.keys(this.stateDatas).map(key => (this.stateDatas[key] = ""));
      this.sendData.treatItemIds = [];
      this.returnVisit = 1;
      // this.statusVO = 0;
      this.state3 = "";
    },
    formatHourTime() {},
    // 点击时间
    inoutNumberTimeFn() {
      let t = this.sendData.appointEndTime * 15;
      let endTime = moment(this.sendData.appointStartTime)
        .add("minutes", t)
        .format("YYYY-MM-DD HH:mm:ss");

      if (
        moment(endTime).hours() > parseInt(this.config.maxTime.split(":")[0])
      ) {
        this.$message.error("【错误】,结束时间不应大于营业时间,请重新选择");
        this.sendData.appointEndTime = this.sendData.appointEndTime - 1;
      }
    },
    changeTimeValue(val) {
      if (moment(val).isBefore(new Date(), "day")) {
        this.$message.error("【错误】,开始日期不应小于当天,请重新选择");
        this.sendData.appointStartTime = "";
        return;
      }

      if (moment(val).hours() < parseInt(this.config.minTime.split(":")[0])) {
        this.$message.error("【错误】,开始时间不应小于营业时间,请重新选择");
        this.sendData.appointStartTime = "";
        return;
      }

      if (moment(val).hours() > parseInt(this.config.maxTime.split(":")[0])) {
        this.$message.error("【错误】,结束时间不应大于营业时间,请重新选择");
        this.sendData.appointStartTime = "";
        return;
      }

    },
    // 计算当前时间 时间转单元
    getDifference(start, end) {
      let start_data = moment(start);
      let end_date = moment(end);
      return end_date.diff(start_data, "minutes") / 15;
    },
    changeEventName(val) {
      let len = this.events.length;
      if (len && this.events[len - 1]._is) this.events[len - 1].title = val;
    },
    // 开始托框 - 视图板块
    eventCreated(...arg) {
      if (!this.stateDatas.patientName) {
        this.$message.error("请先选择预约的患者");
        return;
      }
      let start = this.getTime(arg[0].start);
      let end = this.getTime(arg[0].end);

      let _t = this.getDifference(arg[0].start, arg[0].end);

      this.sendData.appointStartTime = start;
      this.sendData.appointEndTime = _t;

      if (this.len < this.events.length) {
        this.events.pop();
      }

      this.events.push({
        id: new Date().getTime(),
        room: 1,
        title: this.stateDatas.patientName,
        start: start,
        end: end,
        rendering: "#000",
        editable: true,
        textColor: "#fff",
        backgroundColor: "#95D8FF",
        _is: true
      });
    },
    init() {
      getBespeakInfo().then(res => {
        console.log(res);

        this.AppointmentItemConfig = res.data.data.AppointmentItemConfig;
        this.clinic = res.data.data.institution;
        this.department = res.data.data.Department;
        // this.doctor = res.data.data.Doctor;
      });
    },
    querySearch(queryString, cb) {
      // this.init();
      getPatientlists(this.state3).then(res => {
        if (res.data.code === SYSTEM_HTTP_SUCCESS) cb(res.data.data);
      });
    },
    handleSelect(val) {
      // console.log(val);

      this.sendData.patientId = val.id;
      this.sendData.patientName = val.patientName;
      this.state3 = val.patientName;
      this.sendData.returnVisit = val.returnVisit + '';
      this.stateDatas = val;
    },
    // 刷新工作台预约数
    RefreshBespeakNum() {
      this.$root.Bus.$emit("ChangeBespeakRefresh");
    },
    // 保存
    saveBespeak() {
      // if (this.$attrs["event-refresh"]) this.$attrs["event-refresh"]();
      // return
      if (!this.sendData.patientId) {
        this.$message.error("患者姓名不能为空");
        return;
      }

      if (!this.sendData.appointStartTime) {
        this.$message.error("请选择开始时间");
        return;
      }

      if (!this.sendData.departmentId) {
        this.$message.error("请选择科室");
        return;
      }

      if (!this.sendData.doctorId) {
        this.$message.error("请选择医生");
        return;
      }

      if (!this.sendData.treatItemIds.length) {
        this.$message.error("请选择预约项目");
        return;
      }

      let t = this.sendData.appointEndTime * 15;
      this.sendData.appointEndTime = moment(this.sendData.appointStartTime)
        .add("minutes", t)
        .format("YYYY-MM-DD HH:mm:ss");
      this.sendData.appointStartTime = moment(
        this.sendData.appointStartTime
      ).format("YYYY-MM-DD HH:mm:ss");

      if (this.rowId) {
        this.sendData.id = this.rowId;
        this.sendData.patientId = this.info.patientId;
        this.sendData.treatItemIds = this.sendData.treatItemIds.join(",");

        putPatientAppoint(this.sendData).then(res => {
          if (res.data.code === SYSTEM_HTTP_SUCCESS) {
            if (this.$attrs["event-refresh"]) this.$attrs["event-refresh"]();

            this.isShow.visibility = false;
          }
        });
      } else {
        if (this.isAdd) {
          this.sendData.patientId = this.stateDatas.patientId;
        }
        this.sendData.treatItemIds = this.sendData.treatItemIds.join(",");

        postPatientAppoint(this.sendData).then(res => {
          if (res.data.code === SYSTEM_HTTP_SUCCESS) {
            this.isShow.visibility = false;
            if (this.$attrs["event-refresh"]) this.$attrs["event-refresh"]();

            this.RefreshBespeakNum();
          }
        });
      }
    },
    // 拖拽
    eventDrop(T) {
      this.sendData.appointStartTime = this.getTime(T.start);
    },
    // 下拉
    eventResize(T, delta, revertFunc) {
      this.sendData.appointEndTime = this.getDifference(T.start._d, T.end._d);
    },
    getTime(t) {
      return moment(t).format("YYYY-MM-DD HH:mm");
    },
    // 生成预约时间
    getBespeakView() {
      if (this.ViewInfoEdit) return;
      if (!this.sendData.appointStartTime) return;
      if (this.len < this.events.length) this.events.pop();
      this.events.push({
        id: new Date().getTime(),
        room: 1,
        title: this.stateDatas.patientName || "",
        start: this.getTime(this.sendData.appointStartTime),
        end: moment(this.sendData.appointStartTime)
          .add("minutes", parseInt(this.sendData.appointEndTime) * 15)
          .format("YYYY-MM-DD HH:mm:ss"),
        rendering: "#000",
        editable: true,
        textColor: "#fff",
        backgroundColor: "#95D8FF",
        _is: true
      });
    },
    resetTime(t) {
      let str = "";
      if (t.length == 5) {
        str = t + ":00";
      }
      return str;
    },
    // get base data
    getInitData(institutionId,callback) {
      appointmentdo().then(res => {
        let _D = res.data.data;
        // this.sendData.doctorId = _D.Doctor.length ? _D.Doctor[0].id : "";
        Object.assign(this.eachData, _D);
        if(this.sendData.treatItemIds.length<1){
          this.sendData.treatItemIds.push(this.eachData.appointItemConfigList[0].id.toString())
        }

        if(this.eachData.departmentList.length > 0)this.sendData.departmentId = this.eachData.departmentList[0].id;

        if (_D.AppointmentViewForm && _D.AppointmentViewForm.start) {
          this.config.minTime = _D.AppointmentViewForm.start;
        } else {
          this.config.minTime = "09:00";
        }
        if (_D.AppointmentViewForm && _D.AppointmentViewForm.end) {
          this.config.maxTime = _D.AppointmentViewForm.end;
        } else {
          this.config.maxTime = "19:00";
        }
        // this.config.maxTime = _D.AppointmentViewForm.end
        //   ? _D.AppointmentViewForm.end
        //   : "18:00";
        this.startT = this.resetTime("09:00");
        if (callback) callback();
      });
    },
    // init 预约 view
    initView(callback) {
      let id = this.sendData.doctorId;
      // alert(id)
      let date = new Date();
      let data={doctorId:id,dateStr:this.sendData.appointStartTime.substring(0,10)||util.timestampDay(date)}
      getTineView(data).then(res => {
        console.log(res);
        let _d = res.data.data || null;
        this.len = _d.length;
        this.events = [];
        let scroller = document.getElementsByClassName(
          "fc-time-grid-container"
        )[1];
        if (_d.length) {
          _d.map(val => {
            if (val.id == this.rowId) {
              this.ViewInfoEdit = true;
              this.events.push({
                id: val.id,
                room: 1,
                title: val.patientName,
                start: this.getTime(val.appointStartTime),
                end: this.getTime(val.appointEndTime),
                rendering: "#000",
                editable: true,
                textColor: "#fff",
                backgroundColor: "#95D8FF"
              });
              this.sendData.appointEndTime = this.getDifference(
                this.getTime(val.appointStartTime),
                this.getTime(val.appointEndTime)
              );
              let StartTime = parseInt(
                this.sendData.appointStartTime.substring(11, 13) - 8
              );
              scroller.scrollTop = StartTime * 80;
            } else {
              this.events.push({
                id: val.id,
                room: 1,
                title: val.patientName,
                start: this.getTime(val.appointStartTime),
                end: this.getTime(val.appointEndTime),
                rendering: "#000",
                editable: false,
                textColor: "#fff",
                backgroundColor: "#FC9986"
              });
            }
          });

          if (callback) callback();
        }
        if (!this.isEdit) {
          this.events.push({
            id: new Date().getTime(),
            room: 1,
            title: "",
            start: this.eventsViewInfo.appointStartTime,
            end: this.eventsViewInfo.appointEndTime,
            rendering: "#000",
            editable: true,
            textColor: "#fff",
            backgroundColor: "#95D8FF"
          });
          let StartTime = parseInt(
            this.sendData.appointStartTime.substring(11, 13) - 8
          );

          scroller.scrollTop = StartTime * 80;
        }
      });
    },
    // 打开窗口
    openPageFn() {
      this.events = [];
      if(this.info && this.info.patientId) {
        appointmentdoId(this.info.patientId).then(res=>{
          this.stateDatas=res.data.data.appointmentVisitTrack
          this.stateDatas.emrNo=res.data.data.emrNo
          this.stateDatas.mobilephone=res.data.data.patientMobile
          this.sendData.patientId =res.data.data.appointmentVisitTrack.patientId;
          this.sendData.patientName =res.data.data.appointmentVisitTrack.patientName;
          // this.sendData.returnVisit = res.data.data.returnVisit + '';
        })

      }

      if (this.rowId) {
        // Object.assign(this.stateDatas, this.info);
        this.sendData.treatItemIds=[]
        getRecordData(this.rowId).then(res => {
          let _d = res.data.data;
          this.sendData.returnVisit = _d.appointmentVisitTrack.returnVisit.toString();
          this.sendData.appointStartTime = _d.appointmentVisitTrack.appointStartTime;
          this.sendData.appointEndTime = _d.appointmentVisitTrack.appointEndTime;
          this.sendData.departmentId = Number(_d.appointmentVisitTrack.departmentId);
          this.sendData.doctorId = Number(_d.appointmentVisitTrack.doctorId);
          this.sendData.remark = _d.appointmentVisitTrack.remark;
          this.sendData.institutionId = _d.appointmentVisitTrack.institutionId;
          this.sendData.treatItemIds = _d.appointmentVisitTrack.treatItemIds
            ? _d.appointmentVisitTrack.treatItemIds.split(",")
            : [];

            // this.getTreeInstitutionsSimple(_d.institutionId);
            this.getInitData(_d.institutionId);
        });
      } else {
        if (this.isAdd) {
          // Object.assign(this.stateDatas, this.info);
          if (!this.stateDatas.patientId) {
            this.stateDatas.patientId = this.stateDatas.id;
          }
        }
        this.getInitData(this.loginInstitutionId,() => {
          let day = new Date();
          var dayStr = day.getFullYear()+"-" + (day.getMonth()+1) + "-" + day.getDate();
        });
        this.sendData.returnVisit = "0";
        this.getTreeInstitutionsSimple(this.loginInstitutionId);
        this.sendData.institutionId = this.loginInstitutionId;
      }
      console.log(this.stateDatas)

    },
    //判断是否是连锁机构
    getTreeInstitutionsSimple(institutionId) {
      // treeInstitutionsSimple().then(res => {
      //   if (res.data.code == SYSTEM_HTTP_SUCCESS) {
      //     this.institutionList = res.data.data;
      //     this.sendData.institutionId = institutionId;
      //     this.institutionIdArr = this.recursionFn(this.institutionList,institutionId);
      //   }
      // });
    },
    recursionFn(arr,institutionId) {
      let ids = [],isbreak = false;
			var forFn = function(data,a){
					for (var i in data) {
            let result = a ? new Array(a.join(',')) : new Array();
            result.push(data[i].value);
            if (data[i].value == institutionId) {
              ids = result;
              return result;
            }
            if (data[i].children) {
              forFn(data[i].children,result);
            }
        }
			};
      forFn(arr);

			return ids;
		},

    institutionChange(val) {
      this.sendData.institutionId = parseInt(val[val.length-1].substring(5,7))

      this.getInitData(this.sendData.institutionId);
    }
  },
  mixins: []
};
</script>
<style lang="less" scoped>
.df(@just:space-between, @cen:center) {
  display: flex;
  justify-content: @just;
  align-items: @cen;
}
@bColor: rgb(251, 249, 254);
.header {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background: rgb(247, 245, 249);
  .btns {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    line-height: 36px;
    li {
      cursor: pointer;
      width: 100px;
      height: 36px;
      margin-left: 20px;
      color: #3b78fd;
      border: 1px solid #3b78fd;
    }
    li:nth-child(1) {
      color: #fff;
      background: #3b78fd;
    }
  }
}

.content_user {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  .user_msg {
    display: flex;
    li {
      margin-right: 30px;
    }
  }
}

.main_wrap {
  .df(space-between, normal);
  padding: 0 20px 10px 20px;
  .title {
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    background: #f7f9ff;
  }
  .special {
    height: 30px;
    overflow: hidden;
    margin-bottom: 10px;
  }
  // .mt10 {
  //   margin-top: -10px;
  // }
  .bespeak_box {
    width: 310px;
    border: 1px solid #eee;
  }
  .scroll_wrap {
    height: 336px;
  }
}
.scroll_wrap_box {
  padding-top: 13px;
  height: 380px;
  ::-webkit-scrollbar-track-piece {
    //滚动条凹槽的颜色，还可以设置边框属性
    background-color: #f8f8f8;
  }
  ::-webkit-scrollbar {
    //滚动条的宽度
    width: 4px;
    height: 8px;
  }
  ::-webkit-scrollbar-thumb {
    //滚动条的设置
    background-color: #dddddd;
    background-clip: padding-box;
    min-height: 28px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: #bbb;
  }
  .time_list {
    .df();
    background: @bColor;
    .time_hour {
      width: 70px;
      height: 100px;
      line-height: 80px;
      text-align: center;
      border-right: 1px solid #eee;
    }
    .time_min {
      height: 100px;
      flex: 2;
      display: flex;
      flex-flow: column nowrap;
      span {
        display: block;
        width: 100%;
        height: 100%;
      }
      .time_show_btn {
        height: 25%;
        line-height: 20px;
        border-bottom: 1px solid #eee;
      }
    }
  }
}

.checkbox_wrap {
  display: flex;
  flex-flow: row wrap;
  align-items: none;
  .max_width {
    width: 100%;
  }
  .el-checkbox-group {
    width: 100%;
    .el-checkbox {
      padding-left: 20px;
      padding-bottom: 10px;
      margin: 0;
      width: 45%;
    }
  }
}

.select_time {
  width: 100%;
  // padding: 10px;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  .btns_wrap {
    display: flex;
    justify-content: flex-end;
    text-align: center;
    line-height: 32px;
    .item {
      cursor: pointer;
      color: #3b78fd;
      width: 88px;
      height: 32px;
      border: 1px solid #3b78fd;
      margin-right: 20px;
    }
    .actives {
      color: #fff;
      background-image: linear-gradient(110deg, #4d9eff, #3c79fd 99%, #3b78fd);
    }
  }
}
.shop_content {
  position: absolute;
  top: 40px;
  left: 0;
  box-shadow: 0 0 6px 0 #e4e9ff;
  z-index: 9;
  min-width: 300px;
  background: white;
  overflow-y: auto;
  height: 300px;
}
.institution {
  /deep/.el-input__inner {
    cursor: pointer;
  }
}
#bespeak_wrap /deep/.el-form-item {
  margin-bottom: 15px !important;
}
</style>

<style lang="less">

#bespeak_wrap {
  .el-input__inner{
    width: 100%;
  }
  .el-dialog__wrapper .el-dialog__body {
    padding: 0;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
  .el-icon-arrow-down {
    padding-left: 8px;
  }
  .el-checkbox__label {
    width: 100%;
    vertical-align: -5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.fc-license-message {
  display: none;
}
.el-radio-group {
  .el-radio {
    margin-right: 15px;
  }
}
</style>
