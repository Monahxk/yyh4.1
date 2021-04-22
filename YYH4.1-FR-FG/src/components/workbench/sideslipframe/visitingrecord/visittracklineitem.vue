<template>
  <div class="wrapper">
    <ul class="header_wrap">
      <li>
        <span @click="back">就诊记录</span>
        <span>＞流转记录</span>
      </li>
    </ul>
    <div class="main" id="main" v-if="tableDataList.length">
      <el-table
        class="record_table"
        ref="singleTable"
        :data="tableDataList"
        :height="tableHeight"
        :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
      >
      
        <el-table-column
          v-for="(item,index) in tabletitle "
          :key="index"
          :prop="item.prop"
          :label="item.label"
          align="center"
          sortable
        ></el-table-column>
      </el-table>
    </div>

    <div class="main addMain" id="main" v-show="!tableDataList.length">
      <div class="img_box">
        <img src="../../../../assets/img/workbench/img_workbench_table_bg.png" alt>
      </div>
    </div>
  </div>
</template>

<script>
import { getPatientVisitrecord, getPatientVisittracklineitemd } from "@/api";
import monment from "moment";
import { mapState } from "vuex";
import { SYSTEM_HTTP_SUCCESS } from "@/constant";

export default {
  components: {},
  props: ["id"],
  data() {
    return {
      loading: "",
      tableDataList: [],
      tabletitle: [
        {
          prop: "oprateContent",
          label: "操作"
        },
        {
          prop: "departName",
          label: "科室"
        },
        {
          prop: "doctorName",
          label: "医生"
        },
        {
          prop: "startTime",
          label: "时间"
        },
        {
          prop: "oprateName",
          label: "操作人"
        }
      ],
      pid: "",
      isShowDialog: {
        dialogVisible: false,
        id: "",
        pid: ""
      },
      diglogShow: {
        show: false,
        id: ""
      },
      tableHeight: 300,
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
      getPatientVisittracklineitemd(this.id).then(res => {
        console.log(res);
        if (res.data.code == SYSTEM_HTTP_SUCCESS) {
          let data = res.data.data;
          this.tableDataList = data || null;
        }
        this.setTableHeight();
      });
    },
    getTime(t, l) {
      if (l) {
        return monment(t).format("YYYY-MM-DD");
      } else {
        return monment(t).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    back() {
      this.$emit("openOrclose");
    },
    setTableHeight() {

        let height = document.getElementById('iframe_wrapper').offsetHeight - 200;
        this.tableHeight = height;
    },
  },
  mixins: []
};
</script>
<style lang="less" scoped>
.wrapper {
  .header_wrap {
    li {
      font-size: 14px;
      height: 40px;
      line-height: 30px;
      cursor: pointer;
      span:nth-child(2) {
        color: #3b78fd;
      }
    }
  }
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
}
.img_box {
  width: 400px;
}
.addMain {
  display: flex;
  justify-content: center;
  align-items: center;
}
.record_table {
  font-size: 14px;
}
</style>
<style>
</style>
