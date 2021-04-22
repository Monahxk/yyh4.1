<template>
  <div class="wrapper">
    <ul class="header_wrap">
      <li>
        <span>就诊记录</span>
      </li>
    </ul>
    <div class="main" id="main" v-if="sendData.length">
      <div class="list_item" v-for="(item,index) of sendData" :key="index">
        <p class="timer">{{item.leftTime}}</p>
        <ul class="list_content">
          <li>
            <div>
              <p>
                <span v-show="! Number(item.status)">预约时间: {{item.appointEndTime}}</span>
                <span v-show="Number(item.status)">就诊时间: {{item.registerTime}}</span>
                <span style="margin-left:18px;">{{item.returnVisitName}} </span>
                <span style="margin-left:18px;">{{item.doctorName }} </span>
              </p>
            </div>
          </li>
          <li>
            <span v-show="! Number(item.status)">预约状态: </span>
            <span v-show="Number(item.status)">就诊状态: </span>
            <span>{{item.statusName}}</span>
          </li>
          <li>
            <span>科室:</span>
            <span>{{item.departName}}</span>
          </li>
          <li>
            <span>诊治医生:</span>
            <span>{{item.doctorName}}</span>
          </li>
          <li>
            <span>项目:</span>
            <span>【{{item.projectName}}】</span>
          </li>
          <li>
            <span>备注:</span>
            <span>{{item.remark}}</span>
          </li>
          <li class="last_li">
            <span>创建时间: {{item.addTime}}</span>
            <span @click="openRecord(item.id)">流转记录</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="main addMain" id="main" v-if="!sendData.length">
      <div class="img_box">
        <img src="../../../../assets/img/workbench/img_workbench_table_bg.png" alt>
      </div>
    </div>
  </div>
</template>

<script>
import { getPatientVisitrecord } from "@/api";
import monment from "moment";
import { mapState,mapActions } from "vuex";
import { SYSTEM_HTTP_SUCCESS } from "@/constant";

export default {
  components: {},
  props: [],
  data() {
    return {
      list: {},
      sendData: [],
      loading: "",
      dataList: [],
      pid: "",
      isShowDialog: {
        dialogVisible: false,
        id: "",
        pid: ""
      },
      diglogShow: {
        show: false,
        id: ""
      }
    };
  },
  watch: {},
  computed: mapState({
    pId: state => state.signal.patientId
  }),
  created() {
    this.init();
  },
  mounted() {
    // 新增挂号刷新
    this.$root.Bus.$on("VisitRecordRefresh", () => {
      this.init();
    });
  },
  methods: {
    init() {
      getPatientVisitrecord(this.pId).then(res => {
        if (res.data.code == SYSTEM_HTTP_SUCCESS) {
          let data = res.data.data;
          let visitRecord = null;
          this.sendData = data.map(item => {
            item.leftTime = this.getTime(item.registerTime, "l");

            //非预约状态
            if(!visitRecord && item.status != '0') {
              visitRecord = item;
            }
            return item;
          });

          if(this.sendData.length > 0) {
            //把第一条就诊记录信息，传递到新增病历
            if(!visitRecord) visitRecord = {};
            this.SET_VISIT_RECORD_FRIST(visitRecord);
          }
        }
      });
    },
    getTime(t, l) {
      if (l) {
        return monment(t).format("YYYY-MM-DD");
      } else {
        return monment(t).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    openRecord(id) {
      this.$emit("openOrclose", id);
    },
    ...mapActions([
        'SET_VISIT_RECORD_FRIST'
    ]),
  },
  mixins: []
};
</script>
<style lang="less" scoped>
.wrapper {
  .main::-webkit-scrollbar {
    width: 2px;
    height: 2px;
    background: #ccc;
    border-radius: 1px;
  }
  .main::-webkit-scrollbar-thumb {
    display: block;
    width: 1px;
    margin: 0 auto;
    border-radius: 1px;
    background: #3b78fd;
  }
  padding-bottom: 20px;
  .section_title {
    font-weight: bold;
  }
  .foot {
    width: 150px;
    margin: 20px auto;
    button {
      display: inline-block;
      border: 1px solid #3b78fd;
      width: 70px;
      height: 30px;
      background: #fff;
      color: #3b78fd;
    }
  }
}
.add_bt {
  font-size: 14px;
  display: block;
  cursor: pointer;
  width: 80px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: rgb(59, 120, 253);
}
.header_wrap {
  color: #3b78fd;
  padding-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  li:nth-child(1) {
    font-size: 16px;
    padding-left: 10px;
    cursor: pointer;
  }
  li:nth-child(3) {
    height: 32px;
    text-align: center;
    line-height: 32px;
    font-size: 14px;
    padding-left: 10px;
    padding: 0 4px 0 4px;
    border: 1px solid #3b78fd;
    margin-left: 700px;
    cursor: pointer;
  }
  li:nth-child(2) {
    cursor: pointer;
    height: 32px;
    text-align: center;
    line-height: 32px;
    font-size: 14px;
    border: 1px solid #3b78fd;
    padding: 0 4px 0 4px;
  }
}
.img_box {
  width: 400px;
}
.addMain {
  display: flex;
  justify-content: center;
  align-items: center;
}
.main {
  padding-top: 4px;
  padding-right: 20px;
  height: calc(100% - 48px) !important;
  overflow-y: auto;
  .list_item {
    display: flex;
    margin-bottom: 20px;
    .timer {
      width: 100px;
      color: #1b1e25;
      font-size: 14px;
      font-weight: bold;
    }
    .list_content {
      width: 650px;
      padding: 10px;
      color: #1b1e25;
      font-size: 14px;
      box-shadow: 0 0 6px 0 #e4e9ff;
      background-color: #ffffff;
      flex: 1;
      li {
        display: flex;
        line-height: 30px;
      }
      li span:nth-child(1) {
        margin-right: 10px;
      }

      .last_li {
        justify-content: space-between;
        display: flex;
        span:nth-child(2) {
          color: #3b78fd;
          height: 32px;
          text-align: center;
          line-height: 32px;
          font-size: 14px;
          border: 1px solid #3b78fd;
          padding: 0 4px 0 4px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
<style>
.caseHistoryList_collapse .el-collapse-item__arrow {
  display: none;
}
</style>
