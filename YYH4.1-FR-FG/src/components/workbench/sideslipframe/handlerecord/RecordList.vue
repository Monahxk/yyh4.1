<template>
  <div class="wrapper">
    <ul class="header_wrap">
      <li>
        <span>处置记录</span>
      </li>
      <li>
        <span @click="addMachining">新增记录</span>
      </li>
    </ul>
    <div class="main" id="main" v-if="sendData.length">
      <div class="list_item" v-for="(item,index) of sendData" :key="index">
        <p class="timer">{{item.leftTime}}</p>
        <ul class="list_content">
          <li>
            <div>
              <p>
                <span>处置时间 ：{{item.commitTime}}</span>
              </p>
            </div>
          </li>
          <li>
            <span style="paddingTop:10px;">选择牙齿:</span>
            <div class="box">
              <div class="lt">{{item.leftUpValue}}</div>
              <div class="rt">{{item.rightUpValue}}</div>
              <div class="lb">{{item.leftDownValue}}</div>
              <div class="rb">{{item.rightDownValue }}</div>
            </div>
          </li>
          <li class="last">
            <div>
              <span>处置内容：</span>
              <span>{{item.remark}}</span>
            </div>
            <div >
              <el-button type="primary" size="mini" plain @click="edit(item.id)">编辑</el-button>
              <el-button type="primary" size="mini" plain @click="del(item.id)">删除</el-button>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="main addMain" id="main" v-if="!sendData.length">
      <div class="img_box">
        <img src="../../../../assets/img/workbench/img_workbench_table_bg.png" alt />
      </div>
    </div>
  </div>
</template>

<script>
import { getRecordList, deleteRecord } from "@/api";
import monment from "moment";
import { mapState } from "vuex";
import { SYSTEM_HTTP_SUCCESS } from "@/constant";

export default {
  components: {},
  props: [],
  data() {
    return {
      list: {},
      sendData: [],
      loading: "",
      pid: ""
    };
  },
  watch: {},
  computed: mapState({
    pId: state => state.signal.patientId
  }),
  created() {
    this.init();
  },
  methods: {
    init() {
      getRecordList(this.pId).then(res => {
        if (SYSTEM_HTTP_SUCCESS == 200) {
          let data = res.data.data;
          this.sendData = data.map(item => {
            item.leftTime = this.getTime(item.commitTime, "l") || "";
            return item;
          });
        }
      });
    },
    edit(id) {
      this.$emit("openOrclose", id);
    },
    addMachining() {
      this.$emit("openOrclose", "");
    },
    del(id) {
      deleteRecord(id).then(res => {
        if (SYSTEM_HTTP_SUCCESS == 200) {
          this.init();
        }
      });
    },
    getTime(t, l) {
      if (l) {
        return monment(t).format("YYYY-MM-DD");
      } else {
        return monment(t).format("YYYY-MM-DD HH:mm:ss");
      }
    }
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
  padding-bottom: 30px;
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
  .last{
    display: flex;
    justify-content: space-between;
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
    width: 88px;
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
  height: 700px !important;
  overflow-y: scroll;
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
      li {
        display: flex;
        line-height: 30px;
      }
      li span:nth-child(1) {
        margin-right: 10px;
      }
      .other {
        justify-content: space-between;
        div {
          display: flex;
          p {
            cursor: pointer;
            width: 88px;
            height: 32px;
            border: 1px solid #3b78fd;
            color: #3b78fd;
            text-align: center;
            line-height: 32px;
          }
          p:nth-child(1) {
            margin-right: 20px;
          }
        }
      }
    }
  }
}

@b_height: 70px;
.box {
  width: 180px;
  height: @b_height;
  // background: #ccc;
  div {
    width: 50%;
    height: 50%;
    box-sizing: border-box;
    float: left;
    font-size: 14px;
    letter-spacing: 1px;
    line-height: @b_height / 2;
    cursor: pointer;
  }
  .lt {
    border-right: 1px solid #3b78fd;
    text-align: right;
  }
  .lb {
    border-right: 1px solid #3b78fd;
    border-top: 1px solid #3b78fd;
    text-align: right;
  }
  .rb {
    border-top: 1px solid #3b78fd;
  }
}
</style>
<style>
.caseHistoryList_collapse .el-collapse-item__arrow {
  display: none;
}
</style>
