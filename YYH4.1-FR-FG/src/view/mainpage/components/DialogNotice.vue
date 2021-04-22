<!--
 * @Author: jyp
 * @LastEditors: jyp
 * @Description: 实时消息窗口
 * @Date: 2019-04-02 16:02:51
 * @LastEditTime: 2019-07-17 13:27:58
 -->
<template>
  <div class="msg_wrapper">
    <el-dialog title="提示" :visible.sync="isShow.msgdialogVisible" width="960px">
      <div class="content">
        <div class="header-wrap">
          <ul class="header">
            <li @click="tabEvent(0)" :class="{active:  !tabShow }">
              <span>业务通知({{countBusiness}})</span>
            </li>
            <li>
              <span>|</span>
            </li>
            <li @click="tabEvent(1)" :class="{active:  tabShow }">
              <span>系统通知({{countSystem}})</span>
            </li>
          </ul>
          <div class="icon-close-box">
            <span class="el-icon-close" @click="isShow.msgdialogVisible=false;"></span>
          </div>
        </div>
        <div v-if="!tabShow" class="main_wrap">
          <div class="msg_item" v-for=" (item,index) in dataList" :key="index">
            <div class="title">
              <el-badge is-dot class="item">{{item.title}}</el-badge>
              <span class="time">{{item.noticeTime}}</span>
            </div>
            <div @click="setRead(item.id)" class="text">
              <span>{{item.description}}</span>
            </div>
          </div>
          <div class="msg_item readcolor" v-for=" (item,index) in readList" :key="index">
            <div class="title">
              <el-badge class="item">{{item.title}}</el-badge>
              <span class="time">{{item.noticeTime}}</span>
            </div>
            <div class="text">
              <span>{{item.description}}</span>
            </div>
          </div>
        </div>
        <div v-if="tabShow" class="main_wrap">
          <div class="msg_item" v-for=" (item,index) in sysList" :key="index">
            <div class="title">
              <el-badge is-dot class="item">{{item.title}}</el-badge>
              <span class="time">{{item.noticeTime}}</span>
            </div>
            <div @click="setRead(item.id)" class="text">
              <span>{{item.description}}</span>
            </div>
          </div>
          <div class="msg_item readcolor" v-for=" (item,index) in sysReadList" :key="index">
            <div class="title">
              <el-badge class="item">{{item.title}}</el-badge>
              <span class="time">{{item.noticeTime}}</span>
            </div>
            <div class="text">
              <span>{{item.description}}</span>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div>
          <div class="footer_checked" v-if="!tabShow">
            <el-checkbox v-model="checked">显示已读通知</el-checkbox>
          </div>
          <div class="footer_checked" v-if="tabShow">
            <el-checkbox v-model="sysChecked">显示已读通知</el-checkbox>
          </div>
          <div @click="chageReadAll" class="btns">
            <span>全部已读</span>
          </div>
        </div>
        <div>
          <div v-show="!tabShow">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              layout="prev, pager, next, jumper"     
              :total="total"
              :current-page="param.page"
            ></el-pagination>
          </div>
          <div v-show="tabShow">
            <el-pagination
              @size-change="handleSizeChangeSys"
              @current-change="handleCurrentChangeSys"
              layout="prev, pager, next, jumper"          
              :total="sysTotal"
              :current-page="param1.page"
            ></el-pagination>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getBusinessMsg,
  getSystemMsg,
  getMsgRead,
  changeSuatus,
  changeAllSuatus
} from "@/api";
import { SYSTEM_HTTP_SUCCESS } from "@/constant";
export default {
  components: {},
  props: ["isShow"],
  data() {
    return {
      dialogVisible: true,
      checked: false,
      sysChecked: false,
      tabShow: false,
      dataList: [],
      readList: [],
      sysList: [],
      sysReadList: [],
      countBusiness: 0,
      countSystem: 0,
      total: 10,
      sysTotal: 10,
      param: {
        page: 1,
        pageSize: 10,
        status: 0
      },
      param1: {
        page: 1,
        pageSize: 10,
        status: 0
      }
    };
  },
  created() {},
  computed: {},
  methods: {
    setRead(id) {
      changeSuatus(id).then(res => {
        this.getBusinessMsgFn();
        this.getSystemMsgFn();
      });
    },
    getBusinessMsgFn() {
      getBusinessMsg(this.param).then(res => {
        if (res.data.code == 200) {
          this.total = res.data.totalNumber;
          this.checked
            ? (this.readList = res.data.data)
            : (this.dataList = res.data.data);
          this.countBusiness = res.data.totalNumber;
          this.emitStatus();
        }
      });
    },
    getSystemMsgFn() {
      getSystemMsg(this.param1).then(res => {
        if (res.data.code == 200) {
          this.sysTotal = res.data.totalNumber;
          this.sysChecked
            ? (this.sysReadList = res.data.data)
            : (this.sysList = res.data.data);
          this.countSystem = res.data.totalNumber;
          this.emitStatus();
        }
      });
    },
    tabEvent(i) {
      if (i == 0) {
        this.tabShow = false;
      }
      if (i == 1) {
        this.tabShow = true;
      }
    },
    emitStatus() {
      if (!this.sysList.length && !this.dataList.length && !this.param.status && !this.param1.status) {
        this.$emit("msgStatus", false);
      }
    },
    chageReadAll() {
      let str = "";
      let arr = [];
      if (this.tabShow) {
        arr = this.sysList;
      } else {
        arr = this.dataList;
      }
      for (let i = 0; i < arr.length; i++) {
        str += arr[i].id + ",";
      }
      let a = str.substring(0, str.length - 1);
      let formData = new FormData();
      formData.append("noticeMessageId", a);
      changeAllSuatus(formData).then(res => {
        if (res.data.code == 200) {
          this.getBusinessMsgFn();
          this.getSystemMsgFn();
        }
      });
    },
    handleSizeChangeSys(pageSize) {
      this.param1.pageSize = pageSize;
      this.getSystemMsgFn();
    },
    handleCurrentChangeSys(val) {
      this.param1.page = val;
      this.getSystemMsgFn();
    },
    handleSizeChange(pageSize) {
      this.param.pageSize = pageSize;
      this.getBusinessMsgFn();
    },
    handleCurrentChange(val) {
      this.param.page = val;
      this.getBusinessMsgFn();
    }
  },
  mixins: [],
  mounted() {},
  watch: {
    isShow: {
      handler: function(obj) {
        this.getBusinessMsgFn();
        this.getSystemMsgFn();
      },
      deep: true
    },
    checked(val) {
      if (val) {
        this.param.page=1;
        this.param.status = 1;
        this.dataList = [];
      } else {
        this.param.page=1;
        this.param.status = 0;
        this.readList = [];
      }
      this.getBusinessMsgFn();
    },
    sysChecked(val) {
      if (val) {
        this.param.page=1;
        this.param1.status = 1;
        this.sysList = [];
      } else {
        this.param.page=1;
        this.param1.status = 0;
        this.sysReadList = [];
      }
      this.getSystemMsgFn();
    }
  }
};
// 数据过滤
let filterData = arr => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].noticeTime) {
      arr[i].noticeTime = util.timestampToTime(arr[i].noticeTime);
    } else {
      arr[i].noticeTime = "--:--";
    }
  }
  return arr;
};
</script>
<style lang="less" scoped>
.header {
  height: 66px;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  font-size: 16px;
  justify-content: flex-start;
  align-items: center;
  background: #fff;
  li {
    cursor: pointer;
  }
  li:nth-child(2) span {
    color: #ddd;
    padding: 0 20px;
  }
  .active {
    color: #3b78fd;
  }
}
.content {
  .header-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid #dfe7f0;
  }
  .icon-close-box {
    cursor: pointer;
    padding: 10px;
  }
}
.main_wrap {
  height: 500px;
  overflow-y: scroll;
  padding: 10px 0px;
  border-bottom: 1px solid #ccc;
  .msg_item {
    padding: 10px 20px;
    border-bottom: 1px solid #eee;
    .title {
      display: flex;
      justify-content: space-between;
    }
    .text {
      padding-top: 10px;
      line-height: 20px;
    }
  }
  .msg_item:hover {
    background: #eee;
  }
}
.dialog-footer {
  padding: 10px !important;
  display: flex;
  justify-content: space-between;
  // align-items: center;
}
.footer_checked {
  float: left;
  margin-right: 34px;
  padding-top: 6px;
}
.btns {
  cursor: pointer;
  float: left;
  text-align: center;
  line-height: 32px;
  color: #fff;
  width: 88px;
  height: 32px;
  background-image: linear-gradient(110deg, #4d9eff, #3c79fd 99%, #3b78fd);
}
.readcolor {
  color: #ccc;
}
</style>
<style>
.msg_wrapper .el-dialog__header {
  display: none;
}
.msg_wrapper .el-dialog__body {
  padding: 0;
}
.msg_wrapper .el-dialog__footer {
  padding: 10px;
}
</style>
