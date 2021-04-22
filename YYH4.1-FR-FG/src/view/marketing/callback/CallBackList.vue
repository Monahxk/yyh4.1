<!--
 * @Descripttion: 回访列表
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-10 09:45:23
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-07 17:15:35
 -->
<template>
	<div class="wrapper">
		<header class="header-page" :class="{'show-query': showQuery}">
			<div class="nav_wrap">
				<div class="nav_right_box">
          <div class="nav_item">
						<el-button icon="el-icon-search" @click="showQuery=!showQuery">搜索</el-button>
					</div>
          <div class="nav_item">
						<el-select v-model="formSearch.status" @change="search">
              <el-option label="全部状态" value=""></el-option>
							<el-option
                :label="value"
                :value="key"
                v-for="(value, key) in searchData.callbackStatusMap"
                :key="key"
              ></el-option>
						</el-select>
					</div>
					<div class="nav_item">
						<el-button type="primary" @click="add">+ 新增回访</el-button>

					</div>
				</div>
			</div>
      <div class="query-box">
        <el-form :inline="true"  :model="formSearch" @keyup.enter.native="search">

            <el-form-item label="" >
              <el-select class="type-select" v-model="formSearch.type" style="width:160px !important;">
                <el-option label="回访日期" value="1"></el-option>
                <el-option label="就诊日期" value="2"></el-option>
              </el-select>
              <el-date-picker
								v-model="timeValue"
								value-format="yyyy-MM-dd HH:mm:ss"
								type="daterange"
								range-separator="-"
								start-placeholder="开始日期"
								end-placeholder="结束日期">
							</el-date-picker>
            </el-form-item>
						<el-form-item label="">
                <el-input placeholder="患者姓名" v-model="formSearch.patientName" clearable></el-input>
            </el-form-item>
						<el-form-item label="">
							<el-select v-model="formSearch.doctorId"  placeholder="就诊医生" style="width:150px;">
								<el-option label='全部医生' value=""></el-option>
								<el-option
	                :label="item.name"
	                :value="item.id"
	                v-for="(item, key) in searchData.doctorList"
	                :key="key"
	              ></el-option>
							</el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="search_btn"  @click="search">搜索</el-button>
              <el-button class="search_btn"  @click="search(1)">重置</el-button>
            </el-form-item>
				</el-form>
      </div>
		</header>
		<main class="main-content">
			<section class="table-box" :class="{'re-ren': showQuery}">
				<el-table
          highlight-current-row
          ref="table"
          :data="tableList"
          :style="{'font-size': tableStyleConfig.font}"
          height="100%"
          v-loading="tableLoading"
          :cell-class-name="setCellClassName"
          :header-cell-style="{background:tableStyleConfig.headerCellStyle.background,color:tableStyleConfig.headerCellStyle.color}"
        >
          <template slot="empty">
            <div class="table-empty">
              <img src="../../../assets/img/blank.png" alt>
            </div>
          </template>
          <el-table-column
            align="center"
						sortable
            :prop="item.prop"
            :label="item.label"
            v-for="(item,index) in tableHeader"
            :key="index"
            :formatter="item.formatter"
          >
          </el-table-column>

          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope" style="marginLeft:-25px">
              <el-button type="text" @click="edit(scope.row,true)">详情</el-button>
              <span class="line" v-if='scope.row.callback.status != 1 && scope.row.callback.status != 3'>|</span>
              <el-dropdown v-if='scope.row.callback.status != 1 && scope.row.callback.status != 3'>
								<span class="el-dropdown-link">
									更多
								</span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-show="scope.row.callback.status != 1">
                    <p @click="edit(scope.row)">编辑</p>
                  </el-dropdown-item>
                  <el-dropdown-item v-show="scope.row.callback.status != 1 && scope.row.callback.status != 3 ">
                    <p @click="cancelCallback(scope.row.callback)">取消回访</p>
                  </el-dropdown-item>
                  <el-dropdown-item v-show="scope.row.callback.status != 1">
                    <p @click="getFinishstatus(scope.row.callback)">完成回访</p>
                  </el-dropdown-item>
                  <el-dropdown-item v-show="scope.row.callback.status === 1">
                    <p @click="addCallBack(scope.row)">新增回访</p>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
			</section>
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
		</main>
    <addCallback :isShow="paramObj" :patient="patient" @successData="search"/>
    <editCallback
      @sendEvent="search"
      :isShow="paramObj"
      :selectData="selectData"
      :form="editCallbackData"
      :stateData="stateData"
    />
		<el-dialog
      title="完成回访"
      :visible.sync="dialogFla"
      :modal="true"
      @close="closeDialog"
      @open="openDialog"
			width='400px'
      >
        <el-form :model="form" ref="form" style='text-align:center' :rules="rules">
          <el-form-item prop="result">
            <el-select
              v-model="form.result"
              allow-create
              filterable
              default-first-option
              placeholder="请选择或输入回访结果"
            style='width:100%'>
              <el-option
                :label="item.name"
                :value="item.name"
                v-for="(item, index) of selectDataList.contentSet"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="surepost">确 定</el-button>
      </span>
    </el-dialog>

	</div>
</template>
<script>
import Pagination from './../../../components/commons/Pagination'
import Buttons from '@/components/commons/buttons/Buttons'
import addCallback from "./components/DialogAddCallback";
import editCallback from "./components/DialogEditCallback";
import {MESSAGE_TABLE_STYLE,PAGE_SIZE,SYSTEM_HTTP_SUCCESS} from '@/constant'
import {getCallbackfilter, deleteCallData, getFinishstatus,delateAcallback,getCallbackfiltervo,getEditCallbackvo,getCallbackresultlist} from '@/api'
export default {
	name: 'CallBackList',
	components: {Pagination,Buttons,addCallback,editCallback},
  data() {
		return {
      showQuery: false,
			tableel: false,
      searchData: {
        callbackStatusMap: [],
        callerList: [],
        doctorList: []
      },
      timeValue: '',
      formSearch: {
        begDate: "",
        endDate: "",
        status: '',
        patientName: '',
        callerId: '',
        doctorId: '',
        type: '1',
				page:1,
				pageSize:10,
				totalNumber:0,
      },
      tableHeader: [
        { prop: "callback.statusName", label: "回访状态"},
        { prop: "callback.patientName", label: "姓名" },
        { prop: "doctorName", label: "诊治医生" },
        { prop: "callback.callTime", label: "回访时间" },
        { prop: "callback.visitTime", label: "就诊时间" },
        { prop: "callback.content", label: "回访内容" },
        { prop: "callback.result", label: "回访结果" },
        { prop: "callback.remark", label: "备注" },
      ],
			tableLoading: false,
			tableList: [],
			pageConfig: {
				currentPage: 1,
        total: 0,
        pageSize: PAGE_SIZE

      },
      selectData: {
        resultSet:"",
        callerList:"",
        periodList:"",
        doctorList:"",
        contentSet:""
      },
      patient: {},
      editCallbackData: {
        callerId: "", // 回访人员
        callTime: "", // 回访时间
        doctorId: "", // 诊治医生
        status: 0,
        result: "", // 回访结果
        content: "",
        remark: "",
        mode: 0,
        visitTime: ""
      },
      stateData: {},
      sendData: [],
      paramObj: {
        iframeShow: false,
        id: "",
        tapActive: "",
        register: false,
        edit: false,
        shows: false,
        more: false
      },
			dialogFla:false,
			rowId:"",
			form: {
        result :'',
      },
      selectDataList: {
        contentSet: []
      },
      rules: {
        result: [
          { required: true, message: '请选择或输入回访结果', trigger: 'change' },
        ]
      }
		}
	},
	computed: {
		tableStyleConfig() {
			return MESSAGE_TABLE_STYLE;
		}
  },
  mounted() {
    this.getTableList();
    getCallbackfiltervo().then(res => {
      if (res.data.code === SYSTEM_HTTP_SUCCESS) {
        Object.assign(this.searchData,res.data.data)
      }
    });
  },
	watch: {
  },
	methods: {
		surepost(id) {
      this.$refs['form'].validate((valid) => {
          if (valid) {
						getFinishstatus(this.rowId).then(res => {
		          if (res.data.code ==SYSTEM_HTTP_SUCCESS) {
		            this.search();
								this.dialogFla=false
		          }
		        })
          }
        }
      )
    },
		closeDialog() {
      this.$refs['form'].resetFields();
    },
    openDialog() {
      getCallbackresultlist().then(res => {
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.selectDataList.contentSet = res.data.data;
        }
      })
    },
		getTableList() {
      this.tableLoading = true;
			getCallbackfilter(this.formSearch).then(res => {
        this.tableLoading = false;
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.tableList = res.data.data;
          this.formSearch.totalNumber= res.data.totalNumber
        } else {
          this.tableList = [];
        }
      }).catch(err => {
        this.tableLoading = false;
      });
    },
    search(num) {
			if(num==1){
				this.formSearch.page = 1;
				this.formSearch.begDate=''
				this.formSearch.endDate=''
				this.formSearch.patientName=''
				this.formSearch.doctorId=''
			}else{
				this.formSearch.page = 1;
	      this.formSearch.begDate = this.timeValue ? this.timeValue[0] : '';
	      this.formSearch.endDate = this.timeValue ? this.timeValue[1] : '';
			}

      this.getTableList();
    },
    setCellClassName(obj) {
      //设置状态单元格颜色
      if(obj.column.property == 'callback.statusName') {
        switch (Number(obj.row.callback.status)) {
        case 0:
          return 'red';
          break;
        case 1:
          return 'green';
          break;
        case 2:
          return 'orgin';
          break;
        default:
          return 'other';
        }
      }
    },
		add() {
      //新增
			this.paramObj.register = true;
      this.paramObj.more = false;
    },
    addCallBack(val) {
      //行内新增
      this.paramObj.register = !this.paramObj.register;
      this.patient.patientId = val.callback.patientId;
      this.patient.patientName = val.callback.patientName;
      this.patient.emrNo = val.emrNo;
      this.patient.mobilephone = val.teleno;
      this.paramObj.more = true;
    },
		edit(row,fla) {
			// 获取回访单挑数据
      getEditCallbackvo(row.callback.id).then(res => {
        if (res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.selectData = res.data.data;
          this.selectData.emrNo = row.emrNo;
          this.selectData.mobilphone = row.teleno;
          this.stateData.name = row.callback.patientName;
          this.stateData.emrNo = row.emrNo;
          this.stateData.mobilphone = row.teleno;
          this.stateData.visitTime = row.visitTime;
          this.editCallbackData = res.data.data.callback;
          this.editCallbackData.callerId = res.data.data.callback.callerId;
          this.editCallbackData.doctorId = res.data.data.callback.doctorId;
          this.editCallbackData["patientId"] = res.data.data.callback.patientId;
          this.stateData.isOff = fla;
        }
      });
      this.paramObj.shows = !this.paramObj.shows;
		},
		cancelCallback(row) {
      this.$confirm("是否取消回访").then(() => {
        delateAcallback(row.id,'cancelstatus').then(res => {
          if (res.data.code ==SYSTEM_HTTP_SUCCESS) {
            this.search();
          }
        });
      }).catch(err => {});
    },
    getFinishstatus(row) {
			this.dialogFla=true
			this.rowId=row.id
    },
		submitfn() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if(!this.form.id) {
            saveWareHouse(this.form).then(res => {
              if(res.data.code == SYSTEM_HTTP_SUCCESS) {
                this.dialog.isshow = false;
                this.getTableList();
              }
            })
          } else {
            updateWareHouse(this.form).then(res => {
              if(res.data.code == SYSTEM_HTTP_SUCCESS) {
                this.dialog.isshow = false;
                this.getTableList();
              }
            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    closeDialog() {
      this.$refs['form'].clearValidate();
			this.$refs['form'].resetFields();
    },
    handleSizeChange(pageSize) {
      this.formSearch.page = 1;
      this.formSearch.pageSize = pageSize;
      this.getTableList();
    },
		handleCurrentChange(val) {
      this.formSearch.page = val;
      this.getTableList();
    },
	}
}
</script>
<style lang="less" scoped>
/deep/.el-table {
  .red .cell{
    color: #ff485f;
  }
  .orgin .cell{
    color: #f77e1b;
  }
  .green .cell{
    color: #7ed321;
  }
  .other .cell{
    color: #797979;
  }
}
.wrapper{

	.query-box{
		text-align: center;
		.el-input,.el-select{
			width: 150px !important;

		}
	}
}

.type-select {
  width: 120px;
  /deep/.el-input {
    width: 120px !important;
  }
}
.wrapper .header-page .query-box .el-form /deep/.el-input{
	width: 150px !important; 
}
</style>
