<!--
 * @Descripttion: 
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-09-09 16:23:32
 -->
<template>
  <div class="main_box" ref="main_box">
    <el-table
      :data="tableData"
      style="width: 100%;font-size: 14px"
      :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
      :height="tableHeight"
      class="tables"
    >
      <template slot="empty">
          <div class="table-empty">
            <img src="../../../../assets/img/blank.png" alt>
          </div>
        </template>
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
            <span
              :class="addColour(scope.row)"
              v-if="item.prop === 'statusTxt'"
            >{{scope.row[item.prop]}}</span>
            <span v-if="item.prop !== 'statusTxt'">{{scope.row[item.prop]}}</span>
            <div v-if="item.isTemp">
              <el-button type="text" @click="openDetails(scope.row)">详情</el-button>
              <el-dropdown v-if="scope.row.status < 3">
                <span class="el-dropdown-link">
                  <span class="more_but" >更多</span>
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-show="scope.row.status != 1">
                    <p @click="editEvent(scope.row)">编辑</p>
                  </el-dropdown-item>
                  <el-dropdown-item v-show="scope.row.status != 1 && scope.row.status != 3 ">
                    <p @click="cancelCallback(scope.row)">取消回访</p>
                  </el-dropdown-item>
                  <el-dropdown-item v-show="scope.row.status != 1">
                    <p @click="getFinishstatus(scope.row)">完成回访</p>
                  </el-dropdown-item>
                  <el-dropdown-item v-show="scope.row.status === 1">
                    <p @click="addCallBack(scope.row)">新增回访</p>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getCallbacklist, deleteCallData, getFinishstatus,delateAcallback  } from "@/api";
// import configDialog from "@/components/callback/configDialog";
import {SYSTEM_HTTP_SUCCESS} from "@/constant"
export default {
  // components: { configDialog },
  props: ["tableData", "total"],
  data() {
    return {
      visible: false,
      tableHeight: 300,
      form: {
        name: "",
        remark: "",
        id: ""
      },
      tableHeader: [
        { prop: "statusTxt", label: "回访状态",className: "" },
        { prop: "patientName", label: "姓名" },
        { prop: "doctorName", label: "诊治医生" },
        { prop: "callTime", label: "回访时间" },
        { prop: "visitTime", label: "就诊时间" },
        { prop: "content", label: "回访内容" },
        { prop: "result", label: "回访结果" },
        { prop: "remark", label: "备注" },
        { prop: "i", label: "操作", isTemp: true }
      ]
    };
  },
  watch: {
  },
  mounted() {
    this.$nextTick(() => {
      let wheight = this.$refs['main_box'].offsetHeight;
      this.tableHeight = wheight;
    })
  },
  computed: {
    addColour(val) {
      return val => {
        switch (Number(val.status)) {
          case 0:
            return { red: true };
            break;
          case 1:
            return { green: true };
            break;
          case 2:
            return { orgin: true };
            break;
          default:
            return { other: true };
        }
      };
    }
  },
  methods: {
    openDetails(row) {
      row.isOff = true;
      this.$emit("editEvent", row);
    },
    editEvent(row) {
      row.isOff = false;
      this.$emit("editEvent", row);
    },
    addCallBack(val) {
      this.$emit("addManyCallBack", val);
    },
    cancelCallback(row) {
      this.confirm("是否取消回访").then(() => {
        delateAcallback(row.id,'cancelstatus').then(res => {
          if (res.data.code ==SYSTEM_HTTP_SUCCESS) {
            this.$emit("updateInit");
          }
        });
      });
    },
    getFinishstatus(row) {
      this.confirm("是否完成回访").then(() => {
        getFinishstatus(row.id).then(res => {
          if (res.data.code ==SYSTEM_HTTP_SUCCESS) {
            this.$emit("updateInit");
          }
        });
      });
    },
    confirm(text) {
      return this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
    },
    saveEmitDataFn() {
      postCallbackContent(this.form).then(res => {
        if (res.data.code ===SYSTEM_HTTP_SUCCESS) {
          this.$emit("deleteSucces");
          this.visible = false;
        }
      });
    },
    successFn(txt) {
      this.$message({
        message: txt,
        type: "success"
      });
    },
    openDelateFn(val) {
      deleteContentId(val.id).then(res => {
        if (res.data.code ===SYSTEM_HTTP_SUCCESS) {
          this.$emit("deleteSucces");
        }
      });
    }
  },
  mixins: [],
  created() {
    console.log(this.tableData);
  }
};
</script>
<style lang="less" scoped>
.tables {
  box-shadow: 0 0 6px 0 #e4e9ff;
  .table-empty {
    padding: 50px 0px;
    width: 400px;
    margin: auto;
  }
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
.main_box {
  background: rgb(252, 253, 255);
  height: 100%;
}
.red {
  color: #ff485f;
}
.orgin {
  color: #f77e1b;
}
.green {
  color: #7ed321;
}
.other {
  color: #797979;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  li {
    cursor: pointer;
    text-align: center;
    line-height: 32px;
    color: #fff;
    width: 88px;
    height: 32px;
    background-image: linear-gradient(110deg, #4d9eff, #3c79fd 99%, #3b78fd);
  }
  li:nth-child(2) {
    color: #3b78fd;
    margin-left: 20px;
    background: #fff;
    border: 1px solid #3b78fd;
  }
}
.pagination_box {
  height: 70px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.more_but{
  color:#409EFF;
  cursor: pointer;
}
</style>

