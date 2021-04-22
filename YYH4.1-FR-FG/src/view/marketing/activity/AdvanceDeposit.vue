<!--
 * @Author: jyp
 * @Date: 2019-07-01 09:11:18
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-01 17:00:00
 * @Description: 预存款活动
 -->
<template>
  <div class="charge_item AdvanceDeposit">
    <div class="header">
      <div class="add_btn" @click="classDialog('add')">新增活动</div>
    </div>
    <div class="wrapper_table1" id="wrapper_table1">
      <el-table
        class="el_table"
        highlight-current-row
        :height="tableHeight"
        ref="singleTable"
        :data="list"
        style="font-size: 14px"
        :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
      >
        <el-table-column prop="activityName" label="活动名称" sortable align="center"></el-table-column>
        <el-table-column prop="rechargeMoneyYuan" label="充值金额" sortable align="right" width='120px'>
          <template slot-scope="scope">￥ {{scope.row.rechargeMoneyYuan}}</template>
        </el-table-column>
        <el-table-column prop="giveMoneyYuan" label="赠送金额" sortable align="right" width='120px'>
          <template slot-scope="scope">￥ {{scope.row.giveMoneyYuan}}</template>
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
            <el-button type="text" size="small" @click="classDialog('edit',scope.row.id)">编辑</el-button>
            <span class="line">|</span>
            <el-dropdown>
								<span class="el-dropdown-link">
									<el-button type="text" size="small">更多</el-button>
								</span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <p @click="classDel(scope.row.id)">删除</p>
                  </el-dropdown-item>
                  <el-dropdown-item v-if='scope.row.hasMenu'>
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

    <!-- 弹窗 -->
    <el-dialog
      :title="classDialogTitle"
      :visible.sync="classDialogFla"
      width="440px"
      top="20vh"
      center
    >
      <div class="content">
        <el-form :model="classRuleForm" :rules="classRules" ref="classForm" class="demo-ruleForm">
          <el-form-item label-width="80px" label="活动名称" prop="activityName">
            <el-row>
              <el-col :span="24">
                <el-input
                  v-model="classRuleForm.activityName"
                  maxlength="32"
                  placeholder="请输入内容最多不超过32个字符"
                ></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-row>
            <el-col :span="14">
              <el-form-item
                label-width="80px"
                label="活动内容"
                prop="rechargeMoneyYuan"
                :inline="true"
              >
                <el-row>
                  <el-col :span="4">充</el-col>
                  <el-col :span="20">
                    <el-input
                      v-model="classRuleForm.rechargeMoneyYuan"
                      maxlength="6"
                      placeholder="请输入"
                    ></el-input>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item
                label-width="20px"
                prop="giveMoneyYuan"
                :inline="true"
              >
                <el-row>
                  <el-col :span="4">送</el-col>
                  <el-col :span="20">
                    <el-input
                      maxlength="6"
                      v-model="classRuleForm.giveMoneyYuan"
                      placeholder="请输入"
                    ></el-input>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="有效期限" label-width="80px" prop="type">
            <el-row>
              <template>
                <el-radio v-model="classRuleForm.type" :label="0">设置时间</el-radio>
                <el-radio v-model="classRuleForm.type" :label="1">永久有效</el-radio>
              </template>
            </el-row>
          </el-form-item>
          <el-row>
            <el-col :span="24">
              <el-form-item label-width="80px" v-if="!onOff" prop="sectionTimeArr">
                <el-row>
                  <el-col :span="24">
                    <div class="block">
                      <el-date-picker
                        @change="change"
                        class="selectTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        v-model="classRuleForm.sectionTimeArr"
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

          <el-form-item label="备注" label-width="80px" prop="remark">
            <el-row>
              <el-col :span="24">
                <el-input
                  maxlength="100"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入内容最多不超过100个字符"
                  v-model="classRuleForm.remark"
                ></el-input>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="classForm('classForm')">保存</el-button>
        <el-button size="small" @click="classDialogFla = false">取 消</el-button>
      </div>
    </el-dialog>
    <activity-sync-dialog :dialog="dialog" @submitSync="submitSync"></activity-sync-dialog>
  </div>
</template>



<script>

/**
 * 多选级联
 * https://github.com/Charming2015/el-cascader-multi
 *
 */
import {
  savePrechargeactivity,
  updataPrechargeactivity,
  getPrechargeactivityPage,
  getEditPrechargeactivity,
  deletePrechargeactivity,
  savePrechargeActivitys,
  getPerchargeActivityById
} from "@/api";
import {SYSTEM_HTTP_SUCCESS} from "@/constant"
import monment from "moment";
import ActivitySyncDialog from './components/ActivitySyncDialog'
export default {
  name: "AdvanceDeposit",
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
        callback(new Error("必须大于0"));
      }
      callback();
    };
    var checkGiveMoney = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("赠送金额不能为空"));
      }
      if (!reg.test(value)) {
        callback(new Error("请输入数字值最多两位小数"));
      }
      // if (!(Number(value) > 0)) {
      //   callback(new Error("必须大于0"));
      // }
      callback();
    };

    return {
      dialog: {
        isshow: false,//同步门店dialog
        id: '',
        institutionIdList: []
      },
      tableHeight: 500,
      classDialogFla: false,
      classDialogTitle: "新增预存款活动",
      typeList: [
        { label: "诊所服务项", value: 0 },
        { label: "商品销售项", value: 1 }
      ],

      formSearch: {
        //大类搜索
        name: "",
        totalNumber: 0,
        page: 1,
        pageSize: 10
      },
      onOff: true,
      classRuleForm: {
        //表单
        id: "",
        activityName: "",
        endTime: "",
        giveMoneyYuan: "",
        rechargeMoneyYuan: "",
        remark: "",
        startTime: "",
        type: 1,
        sectionTimeArr: [],
        term: ""
      },
      classRules: {
        activityName: [
          { required: true, message: "请输入名称", trigger: "blur" }
        ],
        rechargeMoneyYuan: [
          { required: true, validator: checkRechargeMoney, trigger: "blur" }
        ],
        giveMoneyYuan: [{ validator: checkGiveMoney, trigger: "blur" }],
        sectionTimeArr: [
          { required: true, message: "请选择有效期限", trigger: "change" }
        ],
        type: [{ required: true, message: "请输入有效期限", trigger: "blur" }]
      },
      list: []
    };
  },
  watch: {
    "classRuleForm.type"(val) {
      if (val) {
        this.onOff = true;
        this.classRuleForm.sectionTimeArr = [];
        this.classRuleForm.startTime = "";
        this.classRuleForm.endTime = "";
      } else {
        this.onOff = false;
      }
    }
  },
  computed: {},
  mounted() {
    this.setData();
    this.$nextTick(() => {
      let height = document.getElementById("wrapper_table1").offsetHeight;
      this.tableHeight = height - 60;
    });
  },
  methods: {
    setData() {
      getPrechargeactivityPage(this.formSearch).then(res => {
        if (res.data.code == 200) {
          this.list = res.data.data.map(item => {
            item.term =
              this.getTime(item.startTime) + "~" + this.getTime(item.endTime);
            return item;
          });
          this.formSearch.totalNumber = res.data.totalNumber;
        }
      });
    },
    classForm(formName) {
      //项目表单
      this.$refs[formName].validate(valid => {
        this.classRuleForm.startTime =
          this.classRuleForm.sectionTimeArr[0] || "";
        this.classRuleForm.endTime =
          this.handEndTime(this.classRuleForm.sectionTimeArr[1]) || "";
        if (this.classRuleForm.giveMoney)
          this.$delete(this.classRuleForm, "giveMoney");
        if (this.classRuleForm.rechargeMoney)
          this.$delete(this.classRuleForm, "rechargeMoney");
        if (valid) {
          if (this.classRuleForm.id) {
            updataPrechargeactivity(this.classRuleForm).then(res => {
              if (res.data.code == 200) {
                this.$delete(this.classRuleForm, "sectionTimeArr");
                this.classDialogFla = false;
                this.setData();
              }
            });
          } else {
            savePrechargeactivity(this.classRuleForm).then(res => {
              if (res.data.code == 200) {
                this.$delete(this.classRuleForm, "sectionTimeArr");
                this.classDialogFla = false;
                this.setData();
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    classDialog(type, id) {
      let _this = this;

      if (type == "add") {
        _this.classDialogTitle = "新增预存款活动";
        _this.classDialogFla = true;
        setTimeout(function() {
          _this.$refs["classForm"].resetFields();
          _this.classRuleForm.activityName=''
          _this.classRuleForm.rechargeMoneyYuan=''
          _this.classRuleForm.giveMoneyYuan=''
          _this.classRuleForm.type=1
          _this.classRuleForm.sectionTimeArr=''
          _this.classRuleForm.remark=''
        }, 100);
        this.$delete(this.classRuleForm, "id");
      } else {
        getEditPrechargeactivity(id).then(res => {
          if (res.data.code == 200) {
            _this.classDialogFla = true;
            _this.classDialogTitle = "编辑预存款活动";
            Object.assign(this.classRuleForm, res.data.data);
            this.classRuleForm.id = res.data.data.id;
            let timeArr = [];
            timeArr[0] = res.data.data.startTime;
            timeArr[1] = res.data.data.endTime;
            this.$set(this.classRuleForm, "sectionTimeArr", timeArr);
          }
        });
      }
    },
    classDel(id) {
      this.$confirm("确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deletePrechargeactivity(id).then(res => {
            if (res.data.code == 200) {
              this.setData();
            }
          });
        })
        .catch(() => {});
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
    change() {
      this.$forceUpdate();
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
      getPerchargeActivityById(id).then(res => {
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
      formData.append('prechargeActivityId', this.dialog.id);
      savePrechargeActivitys(formData).then(res => {
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.dialog.isshow = false;
        }
      })
    }
  }
};
</script>
<style lang="less" scoped>
.AdvanceDeposit {
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
.wrapper1 {
  box-shadow: 0px 0px 6px 0px rgba(228, 233, 255, 1);
}
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
</style>
<style lang="less">
.AdvanceDeposit {
  .el-dialog__body {
    padding-bottom: 0px;
  }
  .el-table__empty-text {
    margin-top: -70px;
  }
  .el-pagination__jump {
    margin-left: 0px;
  }
}
</style>
