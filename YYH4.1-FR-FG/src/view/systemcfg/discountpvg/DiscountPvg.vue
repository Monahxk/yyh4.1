<!--
@Author: ZJZ
@Date:   2019-08-07
@Filename: DiscountPvg.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-11
-->

<template>
  <div class="wrapper DiscountPvg" id="DiscountPvg">
    <div class="header">
      <div class="header_left">
        <div class="title">医生折扣权限</div>
        <div class="header_left_edit">
          <span style="width:80px">默认权限：</span>
          <span v-show="this.defaultShow">{{discounted}}</span>
          <el-input
            style="width:70px"
            ref='discountedInput'
            size="small"
            v-if="inputShow"
            v-model="discounted"
            autofocus
            @blur="editShow()"
          ></el-input>
          <span style="width:10px;display:inline-block">%</span>
          <el-button icon="el-icon-edit" @click="editShow" size="small" class="edit_btn">{{defaultShow ? "" : "保存"}}</el-button>
        </div>
      </div>
      <div class="header_right" @click="showDialoginit">
        <span>新增折扣权限</span>
      </div>
    </div>

    <div class="from_box">
      <el-table
        :data="datas"
        :height="tableHeight"
        highlight-current-row
        style="font-size: 14px"
        :header-cell-style="{background:'rgba(228, 233, 255, 0.29)'}"
      >
        <el-table-column prop="departmentName" label="科室" sortable align="center"></el-table-column>
        <el-table-column prop="doctorName" label="医生" sortable align="center"></el-table-column>
        <el-table-column prop="privilege.discount" label="折扣" sortable align="center">
          <template slot-scope="scope">
            <span>{{scope.row.privilege.discount}}%</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope" style="marginLeft:-25px">
            <el-button type="text" @click="editDiscount(scope.row)">修改</el-button>
            <span class="line">|</span>
            <el-button type="text" @click="delDiscount(scope.row.privilege.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination_box">
      <el-pagination
        prev-text="上一页"
        next-text="下一页"
        background
        :page-sizes="[10, 20, 30, 40]"
        layout="sizes, prev, pager, next, total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleChage"
      ></el-pagination>
    </div>
    <dialogAddDiscount @que="init" :isShow="showDialog" />
    <el-dialog
      title="修改折扣权限"
      :visible.sync="dialogFla"
      :modal="true"
      width='400px'
      top='30vh'
      >
        <el-form :model="form" ref="form" style='text-align:center' :rules="rules">
          <el-form-item prop="discount">
            <el-input maxlength='3' v-model="form.discount">
              <i slot="suffix">%</i>
            </el-input>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="upDataDiscount('form')">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import dialogAddDiscount from "./components/DialogAddDiscount.vue";
import {
  getDiscountList,
  deleteDiscountPvg,
  updateDiscountPvg,
  getDefaulteDiscountPvg
} from "@/api";
import { SYSTEM_HTTP_SUCCESS } from "@/constant";

export default {
  components: { dialogAddDiscount },
  props: {},
  data() {
    return {
      tableHeight:500,
      page: 1,
      pageSize: 10,
      total: 1,
      showDialog: {
        register: false,
        tui: false
      },
      datas: [],
      isShow: false,
      defaultShow: true,
      inputShow: false,
      discounted: "",
      moId: "",
      dialogFla:false,
			form: {
        discount :'',
        doctorId :'',
        institutionId :'',
        id :'',
        type :'',
      },
      rules: {
        discount: [
          { required: true, message: '折扣不能为空', trigger: 'blur' },
          {
            pattern:/^([0-9]|[1-9][0-9]|100)$/,
            message: "折扣在0-100之间",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {},
  computed: {},
  mounted() {
    this.init();
    this.$nextTick(() => {
      let height = document.getElementById("DiscountPvg").offsetHeight;
      this.tableHeight = height - 107;
    });
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.page = 1;
      this.init();
    },
    handleChage(val) {
      this.page = val;
      this.init();
    },
    // 修改权限
    upDataDiscount(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.dialogFla = false;
          updateDiscountPvg(this.form).then(res => {
            this.init();
          });
        } else {
          return false;
        }
      });

    },
    // 修改默认权限
    editDefaultDiscount() {
      let formData = {};
      formData.id= this.moId;
      formData.discount= this.discounted;
      updateDiscountPvg(formData).then(res => {
        if (res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.init();
        }
      });
    },
    init() {
      getDefaulteDiscountPvg({}).then(res => {
        this.discounted = res.data.data.discount;
        this.moId = res.data.data.id;
      });
      getDiscountList({
        page: this.page,
        pageSize: this.pageSize
      }).then(res => {
        console.log(this.page,res);
        let data=res.data.data || []
        this.datas = res.data.data.map(val => {
          val.isShow = false;
          return val;
        });
        this.total = res.data.totalNumber;
      });
    },
    showDialoginit() {
      this.showDialog.register = !this.showDialog.register;
    },
    editShow() {
      if(!this.defaultShow){
        this.editDefaultDiscount()
      }
      this.defaultShow = !this.defaultShow;
      this.inputShow = !this.inputShow;
    },
    editDiscount(val) {
      this.form=val.privilege
      this.dialogFla = true;
    },
    delDiscount(id) {
      this.$confirm("此操作将删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteDiscountPvg({ id: id }).then(res => {
          this.init();
        });
      });
    },
    tuihuo() {
      this.showDialog.tui = !this.showDialog.tui;
    }
  },
  mixins: []
};
</script>
<style lang="less" scoped>
.DiscountPvg{
  height: 100%;
}
.header {
  height: 48px;
  font-size: 16px;
  display: flex;
  margin-bottom: 20px;
  justify-content: space-between;
  .header_left {
    display: flex;
    align-items: center;
    .title {
      margin-right: 80px;
      font-size: 16px;
      color: #493bfd;
    }
    .header_left_edit {
      display: flex;
      align-items: center;
      span:nth-child(2) {
      }
      // span:nth-child(3) {
      //   width: 26px;
      //   height: 26px;
      //   cursor: pointer;
      //   background: url("../../../assets/img/edit.png") no-repeat center center;
      //   background-size: 100% 100%;
      // }
      .edit_btn {
        margin-left: 14px;
      }
    }
  }
  .header_right {
    font-size: 16px;
    height: 48px;
    padding: 0 20px;
    cursor: pointer;
    color: #4e81f2;
    line-height: 48px;
    text-align: center;
    box-shadow: 0 1px 4px 0 #b9cdf9;
    font-weight:bold;
  }
}
</style>
<style lang="less">
.DiscountPvg  .el-dialog__body {
    padding: 10px 20px;
  }
/* .DiscountPvg .el-input--small .el-input__inner {
  width: 50px;
} */
/* .pagination_box .el-pagination span {
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
  padding: 0 10px 20px 0 !important;
  background: #fff !important;
} */
</style>
