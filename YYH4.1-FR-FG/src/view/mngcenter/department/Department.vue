<template>
  <div class="wrapper" id="wrapper">
    <div class="nav_wrap">
      <div class="nav_left_box">
        <div
          class="nav_item"
          :class="{active: isMaxActive === index}"
          v-for="(item, index) of navListData"
          :key="index"
        >
          <span class="nav_item_title" @click="handleNavFn(index)" style="color:#000">{{item.title}}</span>
          <div v-show="index === 0" class="nav_item_line">
            <span>|</span>
          </div>
        </div>
      </div>
      <ul class="handle_wrap">
        <li v-show="butShow" @click="showDialogFn(0)">
          <span>新增科室</span>
        </li>
        <li v-show="!butShow" @click="showDialogFn(2)">
          <span>新增岗位</span>
        </li>
      </ul>
    </div>
    <div v-show="nowIndex == 0">
      <div>
        <div id="department_table" class="wrapper_workbench_table">
          <!-- 列表 department-->
          <el-table
            :height="tableHeight"
            ref="singleTable"
            :data="datalist"
            style="font-size: 14px"
            :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
          >
            <el-table-column prop="department.name" label="科室" sortable align="center"></el-table-column>
            <el-table-column prop="numOfDoctor" label="医生人数" sortable align="center"></el-table-column>
            <el-table-column prop="numOfNurse" label="护士人数" sortable align="center"></el-table-column>
            <el-table-column label="科室主任" prop="director.name" sortable align="center"></el-table-column>

            <el-table-column label="操作" width="150">
              <template slot-scope="scope" style="marginLeft:-25px">
                <el-button
                  type="text"
                  size="small"
                  @click="editDepartment(0,scope.row.department.id)"
                >编辑</el-button>
                <span class="line"></span>
                <el-button
                  type="text"
                  size="small"
                  @click="delDepartment(scope.row.department.id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div v-show="nowIndex === 1">
      <div>
        <div id="position_table" class="wrapper_workbench_table">
          <!-- 列表Position -->
          <el-table
            :height="tableHeight"
            ref="singleTable"
            :data="dataposition"
            style="font-size: 14px"
            :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
          >
            <el-table-column prop="position.name" label="岗位" sortable align="center"></el-table-column>
            <el-table-column prop="numOfPeople" label="岗位人数" sortable align="center"></el-table-column>
            <el-table-column prop="numOfPeople" label="岗位权限" sortable align="center">
              <template slot-scope="scope" style="marginLeft:-25px">
                <div v-if="scope.row.permission.billEditable ==1 ">
                  <p>{{scope.row.permission.billEditableText}}</p>
                </div>
                <div v-if="scope.row.permission.chargeEditable ==1 ">
                  <p>{{scope.row.permission.chargeEditableText}}</p>
                </div>
                <div v-if="scope.row.permission.chargeItemConfigEditable ==1 ">
                  <p>{{scope.row.permission.chargeItemConfigEditableText}}</p>
                </div>
                <div v-if="scope.row.permission.emrEditable ==1 ">
                  <p>{{scope.row.permission.emrEditableText}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="类型" sortable align="center">
              <template slot-scope="scope" style="marginLeft:-25px">
                <div v-if="scope.row.position.type ==1 ">
                  <el-button type="text" size="small">系统保留</el-button>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="操作" align="center">
              <template slot-scope="scope" style="marginLeft:-25px">
                <div v-if="scope.row.position.type !==1 ">
                  <el-button
                    type="text"
                    size="small"
                    @click="editPosition(scope.row.position.id)"
                  >编辑</el-button>
                  <span class="line"></span>
                  <el-button type="text" size="small" @click="delPosition(scope.row.position.id)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 新增科室 -->
    <addOrEditDialogDepartment
      :isShow="isShowDialog"
      :dpatmtId="departmentId"
      @initDepartment="initDepartment"
    ></addOrEditDialogDepartment>
    <!-- 新增岗位 -->
    <addOrEditDialogPosition
      :isShow="isShowDialog"
      :positionId="positionId"
      @initPosition="initPosition"
    ></addOrEditDialogPosition>
  </div>
</template>
<script>
import addOrEditDialogDepartment from "./components/DialogDepartment.vue";
import addOrEditDialogPosition from "./components/DialogPosition.vue";
import { SYSTEM_HTTP_SUCCESS } from "@/constant";
import {
  listDepartment,
  editDepartment,
  deleteDepartment,
  listPosition,
  editPosition,
  delPosition
} from "@/api";
export default {
  components: {
    addOrEditDialogDepartment,
    addOrEditDialogPosition
  },
  data() {
    return {
      tableHeight: 500,
      butShow: true,
      nowIndex: 0,
      datalist: [],
      dataposition: [],
      navListData: [{ title: "科室管理" }, { title: "岗位管理" }],
      btnData: ["新增科室", "新增岗位"],
      isMaxActive: 0,
      departmentId: "",
      isShowDialog: {
        departmentShow: false,
        detail: false,
        job: false,
        editjob: false,
        edit: false
      },
      positionId: "",
      list: ["详情", "编辑", "删除"],
      tableDataList: []
    };
  },
  mounted() {
    this.initDepartment();
    this.initPosition();
    this.$nextTick(() => {
      let height = document.getElementById("wrapper").offsetHeight;
      this.tableHeight = height - 60;
    });
  },
  methods: {
    //数据初始化
    initDepartment() {
      //科室管理
      listDepartment({}).then(res => {
        console.log(res);
        this.datalist = res.data.data;
      });
    },
    initPosition() {
      //岗位管理
      listPosition({}).then(res => {
        console.log(res);
        this.dataposition = res.data.data;
      });
    },
    //修改岗位
    editPosition(a) {
      this.positionId = a;
      this.isShowDialog.edit = true;
      this.isShowDialog.job = true;
    },
    //删除科室
    delDepartment(id) {
      this.$confirm("此操作将删除科室, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteDepartment({ id: id }).then(res => {
          if (res.data.code == SYSTEM_HTTP_SUCCESS) {
            this.initDepartment();
          } 
        });
      });
    },
    //删除岗位
    delPosition(id) {
      this.$confirm("此操作将删除岗位, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delPosition({ id: id }).then(res => {
          if (res.data.code == SYSTEM_HTTP_SUCCESS) {
            this.initPosition();
          }
        });
      });
    },
    handleNavFn(num) {
      num ? (this.butShow = false) : (this.butShow = true);
      this.isMaxActive = num;
      this.nowIndex = num;
    },
    showDialogFn(num) {
      this.isShowDialog[Object.keys(this.isShowDialog)[num]] = true;
      this.isShowDialog.edit = false;
    },
    editDepartment(num, id) {
      this.isShowDialog.departmentShow = true;
      this.isShowDialog.edit = true;
      this.departmentId = id;
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
  overflow-y: scroll;
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
  height: 100%;
  .nav_wrap {
    padding-bottom: 20px;
    height: 62px;
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
        .nav_item_title {
          cursor: pointer;
          font-size: 16px;
          font-weight: 100;
          color: #493bfd;
        }
        .nav_item_line {
          margin: 0 25px;
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
