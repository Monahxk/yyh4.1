<!--
 * @Descripttion: 
 * @version: 
 * @Author: hzj
 * @Date: 2019-08-01 14:52:36
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-18 13:56:46
 -->
<template>
  <div class="wrapper">
    <div class="nav_item">
      <span class="title" @click="$router.go(-1)">＜ 收费管理</span>
    </div>
    <div class="optios">
      <el-form ref="form" :model="form" label-width="80px">
        <el-row type="flex" justify="start" :gutter="50">
          <el-col :span="10">
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
            <el-form-item label="状态">
              <el-select v-model="form.status" placeholder="请选择">
                <el-option label="全部" value></el-option>
                <el-option
                  :label="item.statusName"
                  :value="item.status"
                  v-for="(item, index) in statesArr"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2" :push="0">
            <el-form-item>
              <div class="btns">
                <span @click="searchFn">查询</span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="4" :push="3"></el-col>
        </el-row>
        <el-row type="flex" justify="start" :gutter="50">
          <el-col :span="5">
            <el-form-item label="患者姓名">
              <el-input v-model="form.patientName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="单据号">
              <el-input v-model="form.number"></el-input>
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
        </el-row>
      </el-form>
    </div>

    <div class="table_box">
      <!-- 列表 -->
      <el-table
        ref="singleTable"
        height="600px"
        :data="tableDataList"
        style="font-size: 14px"
        :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
      >
        <template slot="empty">
          <p>
            <span>暂无内容</span>
          </p>
        </template>
        <el-table-column
          v-for="(item,index) in tabletitle "
          :key="index"
          :prop="item.prop"
          :label="item.label"
          sortable
          align="center"
        ></el-table-column>
        <el-table-column label="操作" width="140" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="IndexEvent(scope.row)">详情</el-button>
            <span class="line"></span>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination_box">
        <el-pagination
          prev-text="上一页"
          next-text="下一页"
          background
          layout="prev,pager,next,sizes,jumper"
          :page-sizes="[10, 20, 30, 40]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pager-count="9"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <IframeDialog :iframeVisible="iframeParam" v-if="detection" @on-click="testFn"/>
  </div>
</template>
<script>
import IframeDialog from "@/components/workbench/sideslipframe/Sideslipframe";
import { getChargebilling, getCaseDoctor, getAllpatient ,getChargebillStatus} from "@/api";
import {SYSTEM_HTTP_SUCCESS,STATUS_BILL_SEACHARR,STATUS_BILL_TABLEARR} from "@/constant";
import monment from "moment";
export default {
  components: { IframeDialog },
  name: "receptionist",
  props: {},
  data() {
    return {
      detection: false,
      valTime: [],
      patientArr: [],
      form: {
        doctor: "",
        status: "",
        patientName: "",
        number: "",
        startTime: "",
        endTime: "",
        page: 1,
        pageSize: 10,
      },
      doctorArr: "",
      isActive: 0,
      total: 1, 
      tabsArr: ["first", "second", "third", "four", "five", "six", "seven"],
      iframeParam: {
        iframeShow: false,
        id: "",
        tapActive: "",
        doctor: {
          id: ''
        },
        nurse: {
          id: ''
        }
      },
      statesArr:[],
      tableDataList: [],
      tabletitle: [
        {
          prop: "number",
          label: "单据号"
        },
        {
          prop: "patient.patientName",
          label: "患者姓名"
        },
        {
          prop: "patient.emrNo",
          label: "病历号"
        },
        {
          prop: "visitTime",
          label: "就诊时间"
        },
        {
          prop: "doctor.name",
          label: "诊治医生"
        },
        {
          prop: "discountAmountYuan",
          label: "应收"
        },
        {
          prop: "toller.name",
          label: "收费员"
        },
        {
          prop: "statusName",
          label: "状态"
        },
        {
          prop: "chargeTime",
          label: "创建时间"
        }
      ],
      courseInfo: "",
      oldTableDataList: "",
      tableData: [],
      loading: true,
      courseId: "",
      pagerCount: "",
      treatmentStatue: false,
      butArr: ["开始治疗", "结束治疗", "已离开", "回退", "转诊"],
      activeIndex: ""
    };
  },
  watch: {},
  computed: {},
  methods: {
    testFn() {
      this.detection = false;
      this.getDataData();
    },
    // 设置行选中
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
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
      this.getDataData();
    },
    handleCurrentChange(val) {
      this.form.page = val;
      this.getDataData();
    },
    IndexEvent(row) {
      this.detection = true;
      let patientId = row.patient.id;
      this.$store.dispatch("GET_PATIENT_MSG", patientId);
      this.iframeParam.id = patientId;
      this.iframeParam.iframeShow = true;
      this.iframeParam.tapActive = "four";
      this.iframeParam.doctor.id = row.doctor.id;
      this.iframeParam.nurse.id = row.nurse.id;
    },
    moreEvent(i, row) {
      if (i === 1) {
        this.iframeParam.iframeShow = true;
        this.iframeParam.tapActive = "four";
      }
      if (i === 2) {
        this.$confirm("此操作将作废该收费信息, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          putchargebillinginfo(row.id).then(res => {
            if (res.data.code === SYSTEM_HTTP_SUCCESS) {
              this.getDataData();
              this.$message({
                type: "success",
                message: "作废该收费信息成功!"
              });
            }
          });
        });
      }
    },
    // 退出询问
    DialogVisible() {
      this.outDialogVisible = false;
    },
    getTime(t) {
      return monment(t).format("YYYY-MM-DD HH:ss");
    },
    getDataData() {
      console.log(this.form);
      
      getChargebilling(this.form).then(res => {
        console.log(res);
        
        if (res.data.code === SYSTEM_HTTP_SUCCESS) {
          let _D = res.data.data;
          this.total = res.data.totalNumber;
          this.tableDataList = _D
        }
      });
    },
    searchFn() {
      this.total=0;
      this.form.startTime = "";
      this.form.endTime = "";
      this.form.pageSize = 10;
      this.form.page = 1;
      // this.form.status > 1
      //   ? (this.form.status = this.form.status = this.form.status + 1)
      //   : (this.form.status = this.form.status);
      if (this.valTime) {
        this.form.startTime = this.valTime[0];
        this.form.endTime = this.valTime[1];
      }
      this.getDataData();
    },
    handleNavFn(num) {
      this.isActive = num;
    }
  },
  mixins: [],
  mounted() {
    this.getDataData();
    getCaseDoctor().then(res => {
      if (res.data.code === SYSTEM_HTTP_SUCCESS) {
        this.doctorArr = res.data.data;
      }
    });
    getChargebillStatus().then(res => {
      if(res.data.code == SYSTEM_HTTP_SUCCESS) {
        this.statesArr = res.data.data;
      }
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
</style>
