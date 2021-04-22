<template>
  <div class="wrapper">
    <div class="nav">
      <div class="nav_left">
        <div class="nav_left_item" :class="{active: isMaxActive === index}" :key="index">
          <span class="title" @click="handleNavFn()">员工列表</span>
          <div v-show="index === 0">
            <span>|</span>
          </div>
        </div>
      </div>
      <ul class="nav_right">
        <li @click="showDialogFn(5)">
          <span>新增员工</span>
        </li>
      </ul>
    </div>

    <searchBox @emitSeachPage="initSearch"></searchBox>

    <div class="content">
      <div class="content_shadow">
        <div class="table_box">
          <!-- 列表 -->
          <el-table
            highlight-current-row
            ref="singleTable"
            height="570px"
            :data="dataList"
            style="font-size: 14px"
            :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
          >
            <el-table-column prop="employee.name" label="姓名" sortable align="center"></el-table-column>
            <el-table-column prop="employee.workno" label="工号" sortable align="center"></el-table-column>
            <el-table-column prop="employee.teleno" label="手机号" sortable align="center"></el-table-column>
            <el-table-column label="科室" prop="membership.departmentName" sortable align="center"></el-table-column>
            <el-table-column prop="membership.positionName" label="岗位" sortable align="center"></el-table-column>
            <el-table-column prop="membership.canNotLoginText" label="允许登录" sortable align="center"></el-table-column>
            <el-table-column label="在职状态" sortable prop="membership.isDimissionText" align="center"></el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="showDialogFn(3,scope.row.employee.id)"
                >编辑</el-button>
                <span v-if="scope.row.type !==1 " class="line"></span>
                <el-button
                  v-if="scope.row.type !==1 "
                  type="text"
                  size="small"
                  @click="delClinicUser(scope.row.employee.id)"
                >删除</el-button>
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
                :total="total"
                layout="total,prev,pager,next,sizes,jumper"
                :page-sizes="[4, 10, 15, 20]"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
    <addEmployee :isShow="isShowDialog" @initData="init"></addEmployee>
    <editEmployee :isShow="isShowDialog" :userId="userId" @initData="init"></editEmployee>
  </div>
</template>
<script>
import searchBox from "./components/TemplateSearchBox.vue";
import addEmployee from "./components/DialogAddEmployee.vue";
import editEmployee from "./components/DialogEditEmployee.vue";
import {
  getClinicUserPage,
  deleteClinicUser,
  updateClinicUser,
  editClinicUser
} from "@/api";
import {
  TYPE_CLINICUSER_JOB,
  SYSTEM_HTTP_SUCCESS,
  TYPE_PHYSICAL_NOTLOGIN
} from "@/constant";
export default {
  components: {
    addEmployee,
    searchBox,
    editEmployee
  },
  data() {
    return {
      pageSize: 10,
      total: 1,
      page: 1,
      index: 1,
      dataList: [],
      isPage: "",
      userId: "",
      nowIndex: 0,
      isMaxActive: 0,
      isShowDialog: {
        patient: false,
        add: false,
        detail: false,
        job: false,
        role: false,
        user: false
      },
      isDimission: 0
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    delClinicUser(id) {
      this.$confirm("此操作将删除该员工, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteClinicUser({ id: id }).then(res => {
            if (res.data.code === SYSTEM_HTTP_SUCCESS) {
              this.init();
            }
          });
        })
        .catch(() => {});
    },
    initSearch(val) {
      if (val) {
        this.isPage = true;
        let _D = val.data.data;
        if (_D.length) {
          this.dataList = _D.map(v => {
            v.isDimission == TYPE_CLINICUSER_JOB
              ? (v.isDimission = "在职")
              : (v.isDimission = "离职");
            return v;
          });
          this.total = val.data.totalNumber;
        } else {  
          this.dataList = [];
        }
      } else {
        this.total=0;
        this.page=1;
        this.pageSize=10;
        this.isPage = false;
        
        this.init();
      }
    },

    init() {
      getClinicUserPage({ page: this.page, pageSize: this.pageSize }).then(
        res => {
          this.dataList = res.data.data;
          this.total = res.data.totalNumber;
        }
      );
    },
    handleNavFn(num) {
      this.isMaxActive = num;
      this.nowIndex = num;
    },
    showDialogFn(num, id) {
      this.isShowDialog[Object.keys(this.isShowDialog)[num]] = true;
      this.userId = id;
    },
    IndexEvent(num) {
      this.isShowDialog[Object.keys(this.isShowDialog)[num]] = true;
    },
    handleCurrentChange(val) {
      this.page = val;
      if (this.isPage) {
        this.$root.Bus.$emit("pageSearchData", this.page, this.pageSize);
      } else {
        this.init();
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      if (this.isPage) {
        this.$root.Bus.$emit("pageSearchData", this.page, this.pageSize);
      } else {
        this.init();
      }
    }
  }
};
</script>
<style lang="less" scoped>
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
  // padding: 25px 17px 0 0;
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
  height: 100%;
  width: 100%;
  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 62px;
    padding-bottom: 20px;

    .nav_left {
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
      .nav_left_item {
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
    .nav_right {
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
  .content {
    height: 500px;
    .content_shadow {
      box-shadow: 0 0 6px 0 #e4e9ff;
      background: #fff;
      position: absolute;
      left: 20px;
      top: 240px;
      right: 20px;
      bottom: 0px;
    }
    .table_box {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 71px;
    }
  }
}
</style>
