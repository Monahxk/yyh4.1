<!--
@Author: ZJZ
@Date:   2019-08-01
@Filename: workSetting.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-11
-->

<template>
  <div class="wrapper" id="work_page">
    <div class="header_wrap">
      <div class="header_left">
        <el-tooltip class="btn_item" effect="dark" content="上一周" placement="bottom" style="marginRight: 10px;">
          <span class="el-icon-arrow-left" @click="handelTimeBtn(true)"></span>
        </el-tooltip>
        <ul class="header_time">
          <li><span>{{timeValue.startTime}}</span></li>
          <li style="padding:0 20px;">至</li>
          <li><span>{{timeValue.endTime}}</span></li>
        </ul>
        <el-tooltip class="btn_item" effect="dark" content="下一周" placement="bottom" style="marginLeft: 10px;">
          <span class="el-icon-arrow-right"  @click="handelTimeBtn(false)"></span>
        </el-tooltip>
      </div>
      <div class="header_right">
        <el-select v-model="params.departmentId" placeholder="请选择科室" style="width:160px;marginRight:10px;">
          <el-option value="" label="全部科室"></el-option>
          <el-option
            v-for="item in selectList.departmentList"
            :key="item.value"
            :label="item.name"
            :value="item.id"
            size="mini"
          ></el-option>
        </el-select>
        <el-select v-model="params.positionId" placeholder="请选择岗位" style="width:160px;marginRight:10px;">
          <el-option value="" label="全部岗位"></el-option>
          <el-option
            v-for="item in selectList.positionList"
            :key="item.value"
            :label="item.name"
            :value="item.id"
            size="mini"
          ></el-option>
        </el-select>
        <el-button @click="searchData">查询</el-button>
        <el-button @click="resetData">重置排班</el-button>
      </div>
    </div>
    <!-- container -->
    <div class="container">
      <div v-show="dutyList.length">
        <ul class="item">
          <li><span></span></li>
          <li v-for="(item, index) of dutyList" :key="index"><span>{{formatTime(item.dutyDate)}}</span></li>
        </ul>
        <ul class="item" style="borderBottom:1px solid #DEE9FB">
          <li><span></span></li>
          <li v-for="(item, index) of dutyList" :key="index"><span>{{formatGetDay(item.dutyDate)}}</span></li>
        </ul>
        <ul v-for="(item, index) of userList" :key="index" class="item">
          <li><span>{{item.employeeName}}</span></li>
          <li v-for="(val,index) of item.dutyList" :key="index" :style="{backgroundColor: val.dutyConfig.color}">
            <el-dropdown trigger="click" placement="bottom">
              <span :class="{txtColor: val.dutyConfig.color && val.dutyConfig.color != '#FFFFFF' && val.dutyConfig.color != '#f8f8f8'}">{{val.dutyConfig.name}}</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(drop, index) of dropList" :key="index" @click.native="handleDrop(item.membershipId, val.id, val.dutyDate, drop.id)">{{drop.name}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
        </ul>
      </div>
      <div class="vis_box" v-show="!dutyList.length" style="justify-content: center;">
        <span>暂无内容</span>
      </div>
      <div class="pagination_boxs">
        <el-pagination
          prev-text="上一页"
          next-text="下一页"
          background
          :page-sizes="[10, 20, 30, 40]"
          layout=" prev, pager, next, total"
          :total="totalNumber"
          @current-change="handleCurrent"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getSetWorkList, getDutyconfig, putEditDuty, getDutySelect, putReset } from '@/api'
import moment from 'moment'
import "./index.less";
export default {
  components: {},
  props: {},
  data() {
    return {
      params: {
        dutyDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        departmentId:'',
        positionId: '',
        page: 1,
        pageSize: 10
      },
      timeValue: {
        startTime: '',
        endTime: ''
      },
      dutyList: [],
      userList:[{dutyList:{}}],
      dropList: [],
      totalNumber:1,
      selectList:[],
      options: [],
      value: ""
    };
  },
  watch: {},
  computed: {},
  methods: {
    formatTime(t) {
      return moment(t).format('MM-DD')
    },
    formatGetDay(t) {
      const dataTxt = ['日', '一', '二', '三', '四', '五', '六']
      return  '周' + dataTxt[Number(moment(t).day())]
    },
    handleCurrent(page) {
      this.params.page = page
      this._initPage()
    },
    handleDrop( membershipId, id, dutyDate, dutyConfigId ) {
      putEditDuty({membershipId, id, dutyDate, dutyConfigId}).then(res => {this._initPage()})
    },
    resetData() {
      this.$confirm('此操作将重置该页数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // let params = {
          //   date: this.params.dutyDate,
          //   membershipIdList:[]
          // }
          // params.membershipIdList = this.userList.map(val => val.membershipId).join(',')
          let formData = new FormData();
          formData.append('date',this.params.dutyDate);
          formData.append('membershipIdList',this.userList.map(val => val.membershipId).join(','));

          putReset(formData).then(res => {
            this._initPage()
          })
        })
    },
    searchData() {
      this.params.page = 1
      this._initPage()
    },
    handelTimeBtn(bol) {
      let up = moment().week(moment(this.params.dutyDate).week() - 1).startOf('week').day(1).format('YYYY-MM-DD HH:mm:ss')
      let down = moment().week(moment(this.params.dutyDate).week() + 1).startOf('week').day(1).format('YYYY-MM-DD HH:mm:ss')
      let t = bol ? up : down
      this.params.dutyDate = t
      this._initPage()
      this._initTime(t)
    },
    _initPage() {
      getSetWorkList(this.params).then(res => {
        let data = res.data.data
        this.dutyList = data.length ? data[0].dutyList : []
        this.userList = data
        this.totalNumber = res.data.totalNumber
      })
    },
    _initDuty() {
      getDutyconfig().then(res => {this.dropList = res.data.data})
    },
    _initSelect() {
      getDutySelect().then(res => {
        this.selectList = res.data.data
      })
    },
    _initTime(weekOfday = moment()) {
      this.timeValue = {
        startTime : moment().week(moment(weekOfday).week()).startOf('week').day(1).format('YYYY-MM-DD'),
        endTime   : moment().week(moment(weekOfday).week()).endOf('week').day(7).format('YYYY-MM-DD')
      }
    }
  },
  mixins: [],
  mounted() {
    this._initTime()
    this._initPage()
    this._initDuty()
    this._initSelect()
  }
};
</script>
<style lang="less" scoped>
.txtColor {
  color: #fff;
}
</style>
