<template>
  <div class="wrapper register" id="register">
    <el-dialog title="选择患者" append-to-body :visible.sync="isShow.register" width="960px" @open="initGetDatas">
      <div class="content">
        <div class="search_box_wrap">
          <el-input
            v-model="params.patientName"
            size="medium"
            placeholder="姓名/手机号/病历号"
            style="width:260px;"
          ></el-input>
          <el-button size="medium" class="searchBtns" @click="searchFn">查询</el-button>
        </div>

        <div class="table_main">
          <el-table
            :header-cell-style="{background:'#F7F9FF'}"
            :data="tableData"
            style="width: 100%;height:580px;"
            max-height="580"
            class="tables"
          >
            <el-table-column
              fixed
              align="center"
              :prop="item.prop"
              :label="item.label"
              v-for="(item,index) in tableHeader"
              :key="index"
            >
              <template slot-scope="scope">
                <div>
                  <span>{{scope.row[item.prop]}}</span>
                  <div v-if="item.isTemp">
                    <el-button type="primary" size="mini" round @click="selectRow(scope.row)">确定</el-button>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-pagination
          @current-change="handleCurrentChange"
          layout="total, prev, pager, next"
          :pager-count="9"
          :page-sizes="[ 10, 20, 30]"
          :total="total"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPatientlists, getPatientcenter } from "@/api";
export default {
  components: {},
  props: ["isShow"],
  data() {
    return {
      tableHeader: [
        { prop: "patientName", label: "患者姓名" },
        { prop: "mobilephone", label: "手机号" },
        { prop: "gender", label: "性别" },
        { prop: "i", label: "操作", isTemp: true }
      ],
      tableData: [],
      form: {
        region: ""
      },
      total: 1,
      params: {
        patientName: "",
        page: 1,
        pageSize: 20
      }
    };
  },
  watch: {
    "params.patientName"() {
      if (!this.params.patientName) this.initGetDatas();
    }
  },
  computed: {},
  mounted() {},
  methods: {
    selectRow(val) {
      this.isShow.register = false;
      this.$emit("sendData", val);
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.initGetDatas();
    },
    searchFn() {
      this.initGetDatas(this.params);
    },
    initGetDatas() {
      getPatientcenter(this.params).then(res => {
        let _D = res.data.data;
        let arr = ["", "男", "女"];
        this.total = res.data.totalNumber;
        this.tableData = _D.map(v => {
          v.patientName = v.patient.patientName;
          v.mobilephone = v.patient.mobilephone;
          v.gender = arr[parseInt(v.patient.gender)];
          return v;
        });
      });
      return;
    }
  },
  mixins: []
};
</script>
<style lang="less" scoped>
.wrapper {
  .blue {
    cursor: pointer;
    color: #3b78fd;
  }
  .form_box {
    padding-top: 20px;
  }
  .searchBtns {
    background: rgb(63, 128, 253);
    color: #fff;
    margin-left: 20px;
  }
  .search_box_wrap {
    height: 60px;
    padding: 0 30px;
    display: flex;
    align-items: center;
    background: rgb(247, 249, 255);
  }
  .table_main {
    padding: 20px;
  }
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
  .add_reg {
    height: 400px;
    padding: 0 20px;
    border-top: 1px solid #eee;
    .header {
      height: 60px;
      background: rgb(247, 245, 249);
    }
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
        background-image: linear-gradient(
          110deg,
          #4d9eff,
          #3c79fd 99%,
          #3b78fd
        );
      }
    }
  }
}
</style>
<style>
.register .el-dialog__wrapper .el-dialog__body {
  padding: 0;
}
</style>
