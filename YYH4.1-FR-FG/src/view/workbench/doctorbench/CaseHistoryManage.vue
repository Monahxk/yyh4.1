<template>
  <div class="wrapper">
    <div class="nav_item">
      <span class="title" @click="$router.go(-1)">＜ 病历管理</span>
    </div>
    <div class="optios">
      <el-form ref="form" :model="form" label-width="80px">
        <el-row type="flex" justify="start" :gutter="50">
          <el-col :span="8">
            <el-form-item label="就诊日期">
              <el-date-picker
                v-model="valTime"
                style="width:100%"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="诊治医生">
              <el-select v-model="form.doctor" placeholder="请选择">
                <el-option label="全部" value></el-option>
                <el-option
                  :label="item.name"
                  :value="item.id"
                  v-for="(item, index) in doctorArr"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="5"></el-col>

          <el-col :span="2" :push="0">
            <el-form-item>
              <div class="btns">
                <span @click="searchFn">查询</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="start" :gutter="50">
          <el-col :span="4">
            <el-form-item label="患者姓名">
              <el-input v-model="form.patientName"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="病历号">
              <el-input v-model="form.emrNo"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="table_box" id="table_box">
      <el-table
        ref="singleTable"
        :data="tableDataList"
        :height="tableHeight"
        style="font-size: 14px"
        :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
      >
        <template slot="empty">
          <div class="table-empty">
            <img src="../../../assets/img/blank.png" alt>
          </div>
        </template>

        <el-table-column
          v-for="(item,index) in tabletitle "
          :key="index"
          height="100%"
          :prop="item.prop"
          :label="item.label"
          sortable
          align="center"
        ></el-table-column>

        <el-table-column prop label="就诊状态" width="120" align="center">
          <template slot-scope="scope">
            <span :class="{}">{{scope.row.statusName}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="140" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="IndexEvent(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination_box">
        <el-pagination
          prev-text="上一页"
          next-text="下一页"
          background
          :page-sizes="[10, 20, 30, 40]"
          layout="sizes, prev, pager, next, total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <IframeDialog :iframeVisible="iframeParam" v-if="detection" @on-click="testFn"/>
  </div>
</template>

<script>
import IframeDialog from "@/components/workbench/sideslipframe/Sideslipframe";
import monment from "moment";
import { getCase, getCaseDoctor } from "@/api";
import {
  SYSTEM_HTTP_SUCCESS,
  STATUS_EMR_TABLEARR,
  STATUS_EMR_FIRSTVISITAGAINARR
} from "@/constant";
export default {
  components: { IframeDialog },
  name: "CaseHistoryManage",
  props: {},
  data() {
    return {
      detection: false,
      doctorArr: [],
      valTime: [],
      form: {
        doctor: "",
        patientName: "",
        clinicNo: "",
        startTime: "",
        endTime: "",
        page: 1,
        pageSize: 10
      },
      iframeParam: {
        iframeShow: false,
        id: "",
        tapActive: ""
      },
      tabData: ["待写", "已写"],
      isActive: 0,
      iframeShow: true,
      page: 1,
      pageSize: 10,
      total: 1,
      listTotal: 0,
      operationMsg: "",
      outDialogVisible: false,
      tabsArr: ["first", "second", "third", "four", "five", "six", "seven"],
      iframeParam: {
        iframeShow: false,
        id: "",
        tapActive: ""
      },
      tableDataList: [],
      tabletitle: [
        {
          prop: "patientName",
          label: "患者姓名"
        },
        {
          prop: "emrNo",
          label: "病历号"
        },
        {
          prop: "departName",
          label: "科室"
        },
        {
          prop: "doctorName",
          label: "诊治医生"
        },
        {
          prop: "returnVisitName",
          label: "就诊分类"
        },
        {
          prop: "registerTime",
          label: "就诊时间"
        }
      ],
      courseInfo: "",
      loading: true,
      courseId: "",
      pagerCount: "",
      treatmentStatue: false,
      activeIndex: "",
      tableHeight: 500
    };
  },
  watch: {},
  computed: {},
  methods: {
    testFn() {
      this.initData();
      this.detection = false;
    },
    searchFn() {
      this.form.startTime = "";
      this.form.endTime = "";
      this.form.pageSize = 10;
      this.form.page = 1;
      if (this.valTime) {
        this.form.startTime = this.valTime[0];
        this.form.endTime = this.valTime[1];
      }
      this.initData();
    },
    handleNavFn(num) {
      this.isActive = num;
    },
    // 设置行选中
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    // 点击行选中
    handleTableChange(val) {
      this.treatmentStatue = true;
      this.currentRow = val;
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    handleSizeChange(val) {
      this.form.pageSize = val;
      this.initData();
    },
    handleCurrentChange(val) {
      this.form.page = val;
      this.initData();
    },
    IndexEvent(row) {
      this.detection = true;
      let patientId = row.appointmentVisitTrack.patientId;
      this.$store.dispatch("GET_PATIENT_MSG", patientId);
      this.iframeParam.id = patientId;
      this.iframeParam.iframeShow = true;
      this.iframeParam.tapActive = "third";
    },
    moreEvent(i) {
      if (i === 0) {
        this.iframeParam.iframeShow = true;
        this.iframeParam.tapActive = "third";
      }
      if (i === 1) {
        this.iframeParam.iframeShow = true;
        this.iframeParam.tapActive = "third";
      }
    },
    // 退出询问
    DialogVisible() {
      this.outDialogVisible = false;
    },
    getTime(t) {
      return monment(t).format("YYYY-MM-DD HH:mm");
    },
    initData() {
      getCase(this.form).then(res => {
        if (res.data.code == SYSTEM_HTTP_SUCCESS) {
          let _D = res.data.data;
          let arr = STATUS_EMR_TABLEARR;
          this.total = res.data.totalNumber;
          this.tableDataList = _D.map(v => {
            v.startTime = this.getTime(v.startTime);
            v.visitTime = this.getTime(v.visitTime);
            return v;
          });
        }
      });
    }
  },
  mixins: [],
  mounted() {
    getCaseDoctor().then(res => {
      if (res.data.code === SYSTEM_HTTP_SUCCESS) {
        this.doctorArr = res.data.data;
      }
    });
    this.initData();
    this.$nextTick(()=> {
      let height = document.getElementById('table_box').offsetHeight;
      this.tableHeight = height;
    })
  }
};
</script>
<style lang="less" scoped>
.wrapper {
  .nav_item {
    padding-bottom: 20px;
    color: #493bfd;
    display: flex;
    align-items: center;
    .title {
      cursor: pointer;
      font-size: 18px;
    }
    .nav_main {
      display: flex;
      font-size: 14px;
      overflow: hidden;
      margin-left: 20px;
      transition: all 1s;
      li {
        line-height: 20px;
        cursor: pointer;
        margin-right: 20px;
      }
    }
    .active_checked {
      border-bottom: 2px solid #7874f2;
    }
  }
  .active span,
  .active li {
    color: #493bfd !important;
  }
  .active .nav_main {
    width: auto;
    transition: all 0.1s easy;
  }
  .optios {
    padding-top: 20px;
    box-shadow: 0 0 6px 0 #e4e9ff;
    background-color: #ffffff;
  }
  .btns {
    span {
      cursor: pointer;
      color: #fff;
      line-height: 40px;
      text-align: center;
      display: block;
      width: 150px;
      height: 40px;
      border-radius: 20px;
      box-shadow: 0 1px 4px 0 #b9cdf9;
      background-image: linear-gradient(to right, #4d9eff, #3b78fd);
    }
  }
  .table_box {
    margin-top: 30px;
    box-shadow: 0 0 6px 0 #e4e9ff;
    background-color: #fff;
  }
  .pagination_box {
    height: 70px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
<style>
.pagination_box .el-pagination span {
  color: #4d9eff;
}
.pagination_box .el-input__inner {
  color: #4d9eff;
  border: 1px solid #4d9eff;
}
.pagination_box .el-select .el-input .el-select__carett {
  color: #4d9eff !important;
}
.pagination_box .number {
  color: #4d9eff !important;
  background: #fff !important;
  border: 1px solid #4d9eff !important ;
}
.pagination_box .el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
  color: #4d9eff !important;
}
.pagination_box
  .el-pagination.is-background
  .el-pager
  li:not(.disabled).active {
  color: #fff !important;
  background: #4d9eff !important;
  border: none;
}
.pagination_box .btn-next,
.pagination_box .btn-prev {
  border: 1px solid #4d9eff;
  padding: 0 10px !important;
  background: #fff !important;
}

.has-gutter .gutter {
  background: rgb(247, 249, 255);
}
.table-empty {
  padding: 50px 0px;
  width: 400px;
  margin: auto;
}
</style>
