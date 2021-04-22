<template>
  <div class="wrapper">
    <div class="nav_wrap">
      <div class="nav_left_box">
        <div class="nav_item">
          <span class="title">工作关系列表</span>
        </div>
      </div>
      <ul class="handle_wrap">
        <li @click="showDialogFn(5)">
          <span>新增关系</span>
        </li>
      </ul>
    </div>

    <div>
      <div class="wrapper_workbench_table">
        <div class>
          <!-- 列表 -->
          <el-table
            highlight-current-row
            ref="singleTable"
            :data="str"
            style="font-size: 14px"
            :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
          >
            <el-table-column label="员工" align="center" prop="doctorName"></el-table-column>
            <el-table-column label="岗位" align="center">
              <template slot-scope="scope">
                <p>医生</p>
                <p />
              </template>
            </el-table-column>
            <el-table-column label="上级医生" sortable prop="superiorName" align="center"></el-table-column>
            <el-table-column label="辅助护士" prop="aidNurseName" sortable align="center"></el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope" style="marginLeft:-25px">
                <el-button
                  type="text"
                  size="small"
                  @click="IndexEvent(6,scope.row.doctorId)"
                >编辑</el-button>
                <span class="line"></span>
                <el-button type="text" size="small" @click="open(scope.row.doctorId)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="table_bottom">
          <!-- 分页 -->
          <div class="pagination_box">
            <div class="block">
              <el-pagination
                prev-text="上一页"
                next-text="下一页"
                background
                layout="prev,pager,next,sizes,jumper"
                :page-sizes="[4, 10, 15, 20]"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :pager-count="9"
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
    <guan :isShow="isShowDialog" @qued="init"></guan>
    <bian :isShow="isShowDialog" :sed="sed" @quedd="init"></bian>
  </div>
</template>
<script>
import guan from "./components/addworker.vue";
import bian from "./components/editworker.vue";
import {
  listWorkingRelations,
  addWorkingRelation,
  saveWorkingRelation,
  editWorkingRelation,
  deleteWorkingRelation
} from "@/api";
export default {
  components: {
    guan,
    bian
  },
  data() {
    return {
      nowIndex: 0,
      isMaxActive: 0,
      isShowDialog: {
        patient: false,
        add: false,
        detail: false,
        job: false,
        role: false,
        guan: false,
        bian: false
      },
      option: [{ name: "医生" }],
      tabletitle: [
        {
          prop: "name",
          label: "员工"
        },
        {
          prop: "num",
          label: "人数"
        },
        {
          prop: "ming",
          label: "上级医生"
        },
        {
          prop: "hs",
          label: "辅助护士"
        }
      ],
      tableDataList: [],
      str: [],
      sed: 0
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      listWorkingRelations({}).then(res => {
        this.str = res.data.data;
      });
    },
    open(a) {
      this.$confirm("此操作将删除该关系, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
      deleteWorkingRelation({ id: a }).then(res => {
        if(res.data.code==200){
          this.init();
        }
      });
        
      });
    },

    handleNavFn(num) {
      this.isMaxActive = num;
      this.nowIndex = num;
    },
    showDialogFn(num) {
      this.isShowDialog[Object.keys(this.isShowDialog)[num]] = true;
    },
    IndexEvent(num, b) {
      this.isShowDialog[Object.keys(this.isShowDialog)[num]] = true;
      this.sed = b;
    },
    handleCurrentChange(val) {
      this.page = val;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.tableDataList = this.datalist.slice(0, val);
    }
  }
};
</script>
<style lang="less" scoped>
.wrapper_workbench_table {
  box-shadow: 0 0 6px 0 #e4e9ff;
  background: #fff;
}

.line {
  display: inline-block;
  height: 14px;
  border-left: 1px solid #000;
  vertical-align: -2px;
  margin: 0 2px 0 2px;
}
.table_bottom {
  height: 70px;
  width: 100%;
  border-top: 1px solid rgba(59, 120, 253, 0.34);
  position: absolute;
  bottom: 0px;
}
.but_box {
  float: left;
  padding: 20px 0 0 26px;
}
.pagination_box {
  padding: 25px 17px 0 0;
  float: right;
}
.start_but {
  width: 74px;
  height: 32px;
  border: 1px solid #4d9eff;
  border: none;
  line-height: 32px;
  text-align: center;
  font-size: 14px;
  color: #4d9eff;
  box-sizing: border-box;
  background: #fff;
  border: 1px solid #4d9eff;
  margin-right: 4px;
}
.start_but:hover {
  box-shadow: 0 2px 3px 0 rgba(34, 113, 199, 0.25);
}
.but_avtive {
  background-image: linear-gradient(to right, #4d9eff, #3b78fd);
  color: #fff;
}
.wrapper {
  .nav_wrap {
    height: 62px;
    padding-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .nav_left_box {
      display: flex;
      align-items: center;
      .line {
        padding: 0 20px;
        b {
          color: #ccc;
          font-weight: bold;
          margin-left: -12px;
        }
      }
      .nav_item {
        display: flex;
        align-items: center;
        .title {
          cursor: pointer;
          font-size: 16px;
          font-weight: 100;
          color: #493bfd;
        }
        .active_checked {
          border-bottom: 2px solid #7874f2;
        }
      }
      .jinai {
        cursor: pointer;
        font-size: 18px;
      }
      .active span,
      .active li {
        color: #493bfd !important;
      }
      .active .nav_main {
        width: auto;
        transition: all 0.1s easy;
      }
    }
    .handle_wrap {
      display: flex;
      li {
        cursor: pointer;
        width: 154px;
        height: 48px;
        font-size: 18px;
        font-weight: bold;
        color: #4e81f2;
        text-align: center;
        line-height: 48px;
        box-shadow: 0 0 6px 0 #e4e9ff;
        background-color: #ffffff;
        margin-right: 20px;
      }
    }
  }
}
</style>
