<!--
 * @Descripttion: 折扣卡活动
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-09-23 15:54:17
 -->
<template>
  <div class="charge_item DiscountCard">
    <div class="header">
      <div class="add_btn" @click="itemDialog('add')">新增折扣卡</div>
    </div>
    <div class="wrapper_table1" id="wrapper_table1">
      <el-table
        highlight-current-row
        :height="tableHeight"
        ref="singleTable"
        :data="list"
        style="font-size: 14px"
        :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
      >
        <el-table-column prop="name" sortable label="折扣卡名称" align="center"></el-table-column>
        <el-table-column sortable prop="rechargeMoneyYuan" label="充值金额" align="right">
          <template slot-scope="scope">￥ {{scope.row.rechargeMoneyYuan}}</template>
        </el-table-column>
        <el-table-column sortable prop="discount" label="折扣" align="center">
          <template slot-scope="scope">{{scope.row.discount}}%</template>
        </el-table-column>
        <el-table-column label="有效期限" sortable align="center">
          <template slot-scope="scope">{{scope.row.type ? '永久有效' : scope.row.term}}</template>
        </el-table-column>
        <el-table-column label="状态" sortable align="center">
          <template slot-scope="scope">{{scope.row.status}}</template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" sortable align="center"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope" style="marginLeft:-25px">
            <el-button type="text" size="small" @click="itemDialog('edit',scope.row.id)">编辑</el-button>
            <span class="line">|</span>
            <el-dropdown>
              <span class="el-dropdown-link">
                <el-button type="text" size="small">更多</el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <p @click="itemDel(scope.row.id)">删除</p>
                </el-dropdown-item>
                <el-dropdown-item  v-if='scope.row.hasMenu'>
                  <p @click="commonfn(scope.row.id)">同步门店</p>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <template slot="empty">
          <img style="width:350px;" src="../../../assets/img/blank.png" alt />
        </template>
      </el-table>
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
            :total="formSearch.totalNumber"
            :current-page="formSearch.page"
          ></el-pagination>
        </div>
      </div>
    </div>

    <!-- 收费项目的弹窗 -->
    <el-dialog
      :title="itemDialogTitle"
      :visible.sync="itemDialogFla"
      :closeOnClickModal="false"
      top="20vh"
      width="440px"
      center
    >
      <div class="content">
        <el-form
          :model="itemRuleForm"
          :rules="rules"
          ref="itemRuleForm"
          label-width="90px"
          class="demo-ruleForm"
        >
          <el-form-item label="活动名称" prop="name">
            <el-input v-model="itemRuleForm.name" maxlength="32" placeholder="请输入内容最多不超过32个字符"></el-input>
          </el-form-item>
          <div class="mix_money">
            <el-form-item label="充值最小金额" prop="rechargeMoneyYuan">
              <el-input v-model="itemRuleForm.rechargeMoneyYuan" maxlength="6" placeholder="请输入"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="折扣" prop="discount">
            <el-col :span="8">
              <el-input v-model="itemRuleForm.discount" maxlength="3" placeholder="请输入"></el-input>
            </el-col>
            <el-col :offset="1" :span="1">
              <span>%</span>
            </el-col>
          </el-form-item>
          <el-form-item label="有效期限" prop="type">
            <el-row>
              <template>
                <el-radio v-model="itemRuleForm.type" @change="change" :label="0">设置时间</el-radio>
                <el-radio v-model="itemRuleForm.type" @change="change" :label="1">永久有效</el-radio>
              </template>
            </el-row>
          </el-form-item>
          <el-row>
            <el-col :span="24">
              <el-form-item v-if="!onOff" prop="sectionTimeArr">
                <el-row>
                  <el-col :span="24">
                    <div class="block">
                      <el-date-picker
                        class="selectTime"
                        @change="change"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        v-model="itemRuleForm.sectionTimeArr"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                      ></el-date-picker>
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="备注" prop="remark">
            <el-input
              maxlength="100"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容最多不超过100个字符"
              v-model="itemRuleForm.remark"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="itemForm('itemRuleForm')">保存</el-button>
        <el-button size="small" @click="itemDialogFla = false">取 消</el-button>
      </div>
    </el-dialog>
    <activity-sync-dialog :dialog="dialog" @submitSync="submitSync"></activity-sync-dialog>
  </div>
</template>

<script>
import {
  saveDiscountactivity,
  updataDiscountactivity,
  getDiscountactivityPage,
  getEditDiscountactivity,
  deleteDiscountactivity,
  saveDiscountActivitys,
  getDiscountActivityById
} from "@/api";
import monment from "moment";
import {SYSTEM_HTTP_SUCCESS} from "@/constant"
import ActivitySyncDialog from './components/ActivitySyncDialog'
export default {
  name: "DiscountCard",
  components: {
    ActivitySyncDialog
  },
  data() {
    var reg = /^\d+(\.\d{0,2})?$/;
    var checkRechargeMoney = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("充值金额不能为空"));
      }
      if (!reg.test(value)) {
        callback(new Error("请输入数字值最多两位小数"));
      }
      if (!(Number(value) > 0)) {
        callback(new Error("最小不小于1"));
      }
      callback();
    };
    var checkDiscounty = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("折扣不能为空"));
      }
      if (!reg.test(value)) {
        callback(new Error("请输入数字值最多两位小数"));
      }
      if (!(Number(value) > 0)) {
        callback(new Error("必须大于0"));
      }
      if (!(Number(value) <= 10)) {
        callback(new Error("最大不超过10"));
      }
      callback();
    };
    return {
      dialog: {
        isshow: false,//同步门店dialog
        id: '',
        institutionIdList: []
      },
      tableHeight: 500,
      itemDialogFla: false,
      itemDialogTitle: "新增折扣卡活动",
      formSearch: {
        //项目搜索
        commExpClassId: "",
        itemCode: "",
        expName: "",
        totalNumber: 0,
        page: 1,
        pageSize: 10
      },
      commExpClass: [], //子类
      list: [],
      onOff: true,
      itemRuleForm: {
        //表单
        id: "",
        discount: "",
        endTime: "",
        name: "",
        rechargeMoneyYuan: "",
        remark: "",
        startTime: "",
        status: "",
        type: 1,
        term: "",
        sectionTimeArr: []
      },
      rules: {
        discount: [
          { required: true,message: '折扣不能为空', trigger: "blur" },
          {
            pattern: /^([0-9]|[1-9][0-9]|100)$/,
            message: "折扣在0-100之间",
            trigger: "blur"
          }
        ],
        name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        rechargeMoneyYuan: [
          { required: true, validator: checkRechargeMoney, trigger: "blur" }
        ],
        type: [{ required: true, message: "请选择期限", trigger: "change" }],
        sectionTimeArr: [
          { required: true, message: "请选择有效期限", trigger: "change" }
        ]
      }
    };
  },
  watch: {
    "itemRuleForm.type"(val) {
      if (val === 1) {
        // alert(1+"--"+val)
        this.onOff = true;
        this.itemRuleForm.sectionTimeArr = [];
      } else {
        // alert(2+"--"+val)
        // this.onOff = false;

        this.onOff = false;
        // this.itemRuleForm.sectionTimeArr = [];
        // this.itemRuleForm.startTime = "";
        // this.itemRuleForm.endTime = "";
        // this.change();
      }
    }
  },
  mounted() {
    this.setData();
    this.$nextTick(() => {
      let height = document.getElementById("wrapper_table1").offsetHeight;
      this.tableHeight = height - 60;
    });
  },
  methods: {
    setData() {
      getDiscountactivityPage(this.formSearch).then(res => {
        this.list = res.data.data.map(item => {
          item.term =
            this.getTime(item.startTime) + "~" + this.getTime(item.endTime);
          return item;
        });
        this.formSearch.totalNumber = res.data.totalNumber;
      });
    },
    itemForm(formName) {
      //项目表单
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.itemRuleForm.startTime = this.itemRuleForm.sectionTimeArr[0];
          this.itemRuleForm.endTime = this.handEndTime(
            this.itemRuleForm.sectionTimeArr[1]
          );
          if (this.itemRuleForm.id) {
            updataDiscountactivity(this.itemRuleForm).then(res => {
              if (res.data.code == 200) {
                this.itemDialogFla = false;
                this.setData();
              }
            });
          } else {
            saveDiscountactivity(this.itemRuleForm).then(res => {
              if (res.data.code == 200) {
                this.itemDialogFla = false;
                this.setData();
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    itemDialog(type, id) {
      let _this = this;
      if (type == "add") {
        _this.itemDialogFla = true;
        _this.itemDialogTitle = "新增折扣卡活动";
        setTimeout(function() {
          _this.$refs["itemRuleForm"].resetFields();
          _this.itemRuleForm.name=''
          _this.itemRuleForm.rechargeMoneyYuan=''
          _this.itemRuleForm.discount=''
          _this.itemRuleForm.sectionTimeArr=''
          _this.itemRuleForm.remark=''
          _this.itemRuleForm.type=1
        }, 100);
        this.$delete(this.itemRuleForm, "id");
      } else {
        _this.itemDialogTitle = "编辑折扣卡活动";
        getEditDiscountactivity(id).then(res => {
          if (res.data.code == 200) {
            _this.itemDialogFla = true;
            this.itemRuleForm = res.data.data;
            let timeArr = [];
            timeArr[0] = res.data.data.startTime || "";
            timeArr[1] = res.data.data.endTime || "";
            this.$set(this.itemRuleForm, "sectionTimeArr", timeArr);
          }
        });
      }
    },
    itemDel(id) {
      this.$confirm("确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteDiscountactivity(id).then(res => {
            if (res.data.code == 200) {
              this.setData();
            }
          });
        })
        .catch(() => {});
    },
    change() {
      this.$forceUpdate();
    },
    handleSizeChange(pageSize) {
      this.formSearch.pageSize = pageSize;
      this.setData();
    },
    handleCurrentChange(val) {
      this.formSearch.page = val;
      this.setData();
    },
    inquire() {
      this.formSearch.page = 1;
      this.setData();
    },

    getTime(t) {
      return monment(t).format("YYYY-MM-DD");
    },
    handEndTime(t) {
      if (t) {
        return t.replace(t.substring(t.length - 8), "23:59:59");
      } else {
        return "";
      }
    },
    commonfn(id) {
      /**
       * 打开同步到分店dialog
       */
      this.dialog.isshow = true;
      this.dialog.id = id;
      getDiscountActivityById(id).then(res => {
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.dialog.institutionIdList = res.data.data.institutionIdList;
        }
      })
    },
    submitSync(data) {
      /**
       * 提交同步到分店
       */
      let formData = new FormData();
      formData.append('institutionIdList',data);
      formData.append('discountActivityId', this.dialog.id);
      saveDiscountActivitys(formData).then(res => {
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.dialog.isshow = false;
        }
      })
    }
  },
  mixins: []
};
</script>
<style lang="less" scoped>
.DiscountCard {
  width: 100%;
  height: 100%;
  position: relative;
}
.wrapper_table1 {
  position: absolute;
  left: 0;
  right: 0;
  top: 0px;
  bottom: 50px;
}
.charge_item {
  position: relative;

  .el-dialog {
    .el-select {
      width: 100%;
    }
  }
}
.header {
  .add_btn {
    cursor: pointer;
    position: absolute;
    right: 0;
    top: -60px;
    width: 154px;
    height: 48px;
    font-size: 18px;
    font-weight: bold;
    color: #4e81f2;
    text-align: center;
    line-height: 48px;
    -webkit-box-shadow: 0 0 6px 0 #e4e9ff;
    box-shadow: 0 0 6px 0 #e4e9ff;
    background-color: #ffffff;
    margin-right: 20px;
  }
}
.selectTime {
  width: 100% !important;
}
.mix_money {
  // line-height: normal;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
</style>
<style lang="less">
.DiscountCard {
  .el-dialog__body {
    padding-bottom: 0px;
    padding-right: 34px;
  }
  .mix_money .el-form-item__label {
    line-height: normal;
  }
  .el-table__empty-text {
    margin-top: -70px;
  }
  .el-pagination__jump {
    margin-left: 0px;
  }
}
</style>
