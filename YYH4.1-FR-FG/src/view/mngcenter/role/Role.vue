<!--
 * @Author: OBKoro1
 * @Date: 2019-08-14 08:54:36
 * @LastEditors: jyp
 * @LastEditTime: 2019-08-14 09:11:46
 * @Description: 
 -->
<template>
  <div class="wrapper">
    <div class="nav_wrap">
      <div class="nav_left_box">
        <div class="nav_left_item" :class="{active: isMaxActive === 0}">
          <span class="nav_left_title" @click="handleNavFn()">角色列表</span>
        </div>
      </div>
      <ul class="nav_right_box">
        <li @click="addRoleNew">
          <span>新增角色</span>
        </li>
      </ul>
    </div>

    <div>
      <div class="table_box">
        <div class="table">
          <!-- 列表 -->
          <el-table
            highlight-current-row
            ref="singleTable"
            :data="datalist"
            style="font-size: 14px"
            :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
          >
            <el-table-column label="角色" align="center" width="400" prop="role.name"></el-table-column>
            <el-table-column label="人数" align="left" width="200"  prop="numOfPeople" ></el-table-column>
            <el-table-column label="角色权限" prop="pvgList"  align="left" >
              <template slot-scope="scope">
                <span v-for="(item, index) of scope.row.pvgList" :key="index"> {{ item.funcName }} {{scope.row.pvgList.length-1 !== index ?  ',' : ''}}</span>
              </template>
            </el-table-column>
            <el-table-column label="" align="left" width="180"  prop="" ></el-table-column>
            <el-table-column label="操作" width="140">
              <template slot-scope="scope" >
                <el-button type="text" size="small" @click="editRole(scope.row.role.id)">编辑</el-button>
                <span class="line"></span>
                <el-button type="text" size="small" @click="delRole(scope.row.role.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <addrole :isShow="isShowDialog" @refreshData="sondEvent"></addrole>
  </div>
</template>
<script>
import addrole from "./components/addrole.vue";
import { listRole, deleteRole } from "@/api";
export default {
  components: {
    addrole
  },
  data() {
    return {
      nowIndex: 0,
      isMaxActive: 0,
      isShowDialog: {
        role: false,
        title: "",
        edit: "",
        id: ""
      },
      tableDataList: [],
      datalist: []
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      listRole({}).then(res => {
      

         this.datalist = res.data.data || [];
        // if(data.length>0){
        //   this.datalist=data.map(item=>{
            
        //       console.log(item.pvgList);
        //   })
        // }
      });
    },
    // 编辑事件
    editRole(v) {
      this.showDialogFn(0);
      this.isShowDialog.title = "编辑角色";
      this.isShowDialog.id = v;
      this.isShowDialog.edit = true;
    },
    // 新增事件
    addRoleNew() {
      this.showDialogFn(0);
      this.isShowDialog.title = "新增角色";
      this.isShowDialog.id = 0;
      this.isShowDialog.edit = false;
    },
    // 删除事件
    delRole(v) {
      this.$confirm("是否删除该角色权限?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteRole({ id: v }).then(res => {
            if (res.data.code === 200) {
              this.initData();
              this.name = "";
            } 
          });
        })
    },
    handleNavFn(num) {
      this.isMaxActive = num;
      this.nowIndex = num;
    },
    showDialogFn(num) {
      this.isShowDialog[Object.keys(this.isShowDialog)[num]] = true;
    },
    IndexEvent(num) {
      this.isShowDialog[Object.keys(this.isShowDialog)[num]] = true;
    },
    handleCurrentChange(val) {
      this.page = val;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.tableDataList = this.datalist.slice(0, val);
    },
    // 通知外面刷新列表
    sondEvent() {
      this.initData();
    }
  }
};
</script>
<style lang="less" scoped>
.table_box {
  box-shadow: 0 0 6px 0 #e4e9ff;
  background: #fff;
  // position: absolute;
  // left: 20px;
  // top: 100px;
  // right: 20px;
  // bottom: 0px;
}
// .table {
//   position: absolute;
//   left: 0;
//   top: 0;
//   right: 0;
//   bottom: 71px;
// }
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
  width: 100%;
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
      .nav_left_item {
        display: flex;
        align-items: center;
        .nav_left_title {
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
    .nav_right_box {
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


