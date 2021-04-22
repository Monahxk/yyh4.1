<!--
@Author: ZJZ
@Date:   2019-08-01
@Filename: PhysicalExam.vue
@Last modified by:   ZJZ
@Last modified time: 2019-09-05
-->

<template>
  <div class="wrapper" id="physical">
    <div class="header_wrap">
      <div class="header_left">
        <div>体检管理</div>
      </div>
      <div class="header_right" @click="showDialogFn">
        <span>新增体检</span>
      </div>
    </div>

    <div class="content">
      <el-form class="demo-form-inline">
        <el-row>
          <el-col :span="7">
            <el-form-item>
              <el-input  v-model="formInline.user" placeholder="姓名/手机号验证" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="检查医生">
              <el-select
                v-model="formInline.regioned"
                placeholder="请选择"
              >
                <el-option label="全部" value></el-option>
                <el-option v-for="(item,index) in doctorList" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7" :push="1">
            <el-form-item>
              <el-button  type="primary" class="search-btn" @click="init" round>查询</el-button>
              <el-button  type="primary" class="search-btn" @click="resetData" round>重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div>
      <div class="wrapper_table_box" style="marginTop:25px">
        <el-table
          highlight-current-row
          ref="singleTable"
          :data="tableList"
          height="600px"
          max-height="600"
          style="font-size: 14px;maxHeight:300px"
          :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
        >
          <el-table-column prop="patientName" label="姓名" align="center"></el-table-column>
          <el-table-column prop="sex" label="性别" align="center"></el-table-column>
          <el-table-column prop="age" label="年龄" align="center"></el-table-column>
          <el-table-column prop="physicalExaminationDate" label="体检日期" align="center"></el-table-column>
          <el-table-column prop="doctorName" label="体检医生" align="center"></el-table-column>

          <el-table-column label="操作" width="150">
            <template slot-scope="scope" style="marginL4ft:-25px">
              <el-button type="text" size="small" @click="handleEdit(scope.row.id)">详情</el-button>
              <el-button type="text" size="small" @click="delClinic(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table_bottom">
        <div class="pagination_box">
          <div class="block">
            <el-pagination
              prev-text="上一页"
              next-text="下一页"
              background
              layout="total,prev,pager,next,sizes,jumper"
              :page-sizes="[4, 10, 15, 20]"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :pager-count="9"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <addphysical
      @init="init"
      @printing="printing"
      :isShow="isShowDialog"
      :datas="editData"
      :visb="show"
    />
    <physicalReport :isShow="isShowDialog" :datas="editData" :visb="show"/>
  </div>
</template>

<script>
import addphysical from "./components/addphysical.vue";
import physicalReport from "./components/physicalReport.vue";
import {TYPE_PHYSICAL_MAN,SYSTEM_HTTP_SUCCESS} from '@/constant'
import {
  physicalexaminationlist,
  doctorlist,
  editphysicalexamination,
  deletephysicalexamination
} from "@/api";
export default {
  props: {},
  components: { addphysical, physicalReport },
  data() {
    return {
      show: false,
      editData: {
        id: "",
        data: [],
        edit: false
      },
      page: "1",
      pageSize: "10",
      total: 1,
      formInline: {
        user: "",
        regioned: ""
      },
      isShowDialog: {
        register: false,
        detail: false,
        physicalReport: false
      },
      isShows: {
        dayin: false
      },
      tableList: [],
      name: "",
      doctorList: [],
    };
  },
  watch: {},
  computed: {},
  mounted() {
    this.init();
  },
  methods: {
    // 编辑
    handleEdit(id) {
      editphysicalexamination(id).then(res => {
        if (res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.editData.data = res.data.data;
          this.editData.id = id;
          this.isShowDialog.register = true;
          this.editData.edit = true;
          this.show = false;
        }
      });
    },
    init() {
      doctorlist().then(res => {
        this.doctorList = res.data.data;
      });
      physicalexaminationlist({params:{
        doctorId: this.formInline.regioned,
        page: this.page,
        pageSize: this.pageSize,
        telOrName: this.formInline.user
      }}).then(res => {
        let _D = res.data.data;
        this.total = res.data.totalNumber;
        this.tableList = _D.map(v => {
          v.sex == TYPE_PHYSICAL_MAN ? (v.sex = "男") : (v.sex = "女");
          return v;
        });
      });
    },
    resetData() {
      Object.keys(this.formInline).map(key => (this.formInline[key] = ""));
      this.init();
    },
    printing(id) {
      this.isShowDialog.register = false;
      editphysicalexamination(id).then(res => {
        if (res.data.code == 200) {
          this.editData.data = res.data.data;
          this.editData.id = id;
          this.isShowDialog.physicalReport = true;
          this.editData.edit = true;
          this.show = false;
        }
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.init();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.init();
    },
    showDialogFn() {
      this.show = true;
      this.isShowDialog.register = true;
      this.editData.data = "";
      this.editData.edit = false;
      this.editData.id = "";
    },
    delClinic(id) {
      this.$confirm("此操作将删除该员工, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deletephysicalexamination({ id: id }).then(res => {
            if (res.data.code === 200) {
              this.init();
            }
          });
        })
        .catch(() => {});
    },
    detail(a) {
      this.isShowDialog.detail = !this.isShowDialog.detail;
    }
  },
  mixins: []
};
</script>
<style lang="less" scoped>
.header_wrap {
  padding-bottom: 25px;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  .header_left {
    display: flex;
    align-items: center;
    div {
      margin-right: 80px;
      font-size: 16px;
      color: #493bfd;
    }
  }
  .header_right {
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
  }
}
.header_left {
  width: 100%;
  // height: 50px;
  h3 {
    color: blue;
    font-size: 18px;
  }
}

.content {
  padding-top: 20px;
  padding-left: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 0 6px 0 #e4e9ff;
  background-color: #fff;
  display: flex;
  height: 80px;
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
  padding: 0px 45px 0 0;
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
.demo-form-inline {
  width: 100%;
  .el-input,.el-select {
    width: 270px;
  }
  .search-btn {
    padding: 12px 50px;
  }
}
</style>
<style>
</style>
