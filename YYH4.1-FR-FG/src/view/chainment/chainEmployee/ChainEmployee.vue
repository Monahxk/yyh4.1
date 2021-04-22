<template>
  <div class="wrapper">
    <div class="charge_item" ref="charge_item">
      <el-row class="height100">
        <el-col :span="5"  class="height100">
          <areaTree :treeCfg="treeCfg" @treeNodeClick="getTableList" @getTableList="getTableList" class="tree-box"></areaTree>
        </el-col>
        <el-col :span="19">
          <div class="box_header" ref="box_header">
            <el-form :inline="true" :model="formSearch" class="demo-form-inline">
              <el-row :gutter="24">
                <el-col :span="5">
                  <el-form-item label="">
                    <el-input v-model="formSearch.nameOrId" placeholder="姓名/ID" clearable>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5" >
                  <el-form-item label="">
                    <el-select v-model="formSearch.departmentId" placeholder="科室" clearable filterable>
                      <el-option
                        v-for="item in departmentList"
                        :key="item.department.id"
                        :label="item.department.name"
                        :value="item.department.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="5" >
                  <el-form-item label="">
                    <el-select v-model="formSearch.positionId" placeholder="岗位" clearable filterable>
                      <el-option
                        v-for="item in positionList"
                        :key="item.position.id"
                        :label="item.position.name"
                        :value="item.position.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4" :push="1">
                  <el-form-item>
                    <el-button type="primary" class="search_btn" round @click="getTableList('')">查询</el-button>
                  </el-form-item>
                </el-col>
                <el-col :span="3" :push="2">
                  <el-form-item>
                    <el-button type="primary" @click="openAddDialog('add')">新增员工</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="wrapper_table1">
            <el-table
              highlight-current-row
              ref="singleTable"
              :data="tableList"
              style="font-size: 14px"
              :height="tableHeight + 'px'"
              v-loading="tableLoading"
              :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
            >
              <template slot="empty">
                <div class="table-empty">
                  <img src="../../../assets/img/blank.png" alt>
                </div>
              </template>
              <el-table-column prop="employee.name" label="姓名" align="center"></el-table-column>
              <el-table-column prop="employee.username" label="账号" align="center"></el-table-column>
              <el-table-column prop="membership.departmentName" label="科室" align="center"></el-table-column>
              <el-table-column prop="membership.positionName" label="岗位" align="center"></el-table-column>
              <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope" style="marginLeft:-25px">
                  <el-button type="text" size="small" @click="openAddDialog('edit',scope.row.employee.id)">编辑</el-button>
                  <span class="line">|</span>
                  <el-button type="text" size="small" @click="delData(scope.row.employee.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <pagination :pageConfig="pageConfig" @handleSizeChange="handleSizeChange" @handleChage="handleChage"></pagination>
        </el-col>
      </el-row>
      <addEmployeeDialog :dialogCfg="dialogCfg" @getTableList="getTableList"></addEmployeeDialog>

    </div>
  </div>
    
</template>

<script>
import {deleteClinicUser,listChainemployee,listPosition,listDepartment} from '@/api'
import addEmployeeDialog from './components/AddEmployeeDialog'
import pagination from '@/components/inventory/pagination'
import areaTree from '@/components/chainment/areaTree'
//2500，7600
export default {
  name:'chainEmployee',
  components: {
    areaTree,
    addEmployeeDialog,
    pagination
  },
  data() {
    return {
      tableLoading: false,
      treeCfg: {
        isshowAddBtn: false,
        hasInstitution: true,
        isGettable: true
      },
      dialogCfg: {
        addChainemployeeDialog: {
          isshow: false,
          dialogTitle: '新增员工',
          type: 'add',
          data: {
            id: '',
            chainLevel1Id: '',
            chainLevel2Id: '',
            chainLevel3Id: '',
            chainLevel4Id: '',
            headquartersId: '',
            treeId: ''
          }
        },
      },
      positionList: [],//岗位
      departmentList: [],
      formSearch: { //项目搜索
        nameOrId: '',
        chainLevel1Id: '',
        chainLevel2Id: '',
        chainLevel3Id: '',
        chainLevel4Id: '',
        headquartersId: '',
        institutionId: '',
        level: '0', //连锁层级 等级
        id: '0', //连锁层级id
        departmentId: '',
        positionId: ''
      },
      tableHeight: 300,
      pageConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      checkedIndex: 0, // 这个值会自动更新
      tableList: [],

    };
  },
  computed: {},
  mounted() {
    this.init();
  },
  methods: {
    //打开新增/修改模态框
    openAddDialog(type,id){
      let _this=this
      _this.dialogCfg.addChainemployeeDialog.isshow = true;
      _this.dialogCfg.addChainemployeeDialog.type = type;
      if(type == 'add'){
        _this.dialogCfg.addChainemployeeDialog.dialogTitle = '新增员工';
        _this.dialogCfg.addChainemployeeDialog.data.id = '';

        this.dialogCfg.addChainemployeeDialog.data.chainLevel1Id = id && id.chainLevel1Id ? id.chainLevel1Id : 0;
        this.dialogCfg.addChainemployeeDialog.data.chainLevel2Id = id && id.chainLevel2Id ? id.chainLevel2Id : 0;
        this.dialogCfg.addChainemployeeDialog.data.chainLevel3Id = id && id.chainLevel3Id ? id.chainLevel3Id : 0;
        this.dialogCfg.addChainemployeeDialog.data.chainLevel4Id = id && id.chainLevel4Id ? id.chainLevel4Id : 0;
        this.dialogCfg.addChainemployeeDialog.data.headquartersId = id && id.headquartersId ? id.headquartersId : 0;
        this.dialogCfg.addChainemployeeDialog.data.treeId = id && id.id ? id.id : '';
      } if(type == 'edit'){
        _this.dialogCfg.addChainemployeeDialog.dialogTitle = '编辑员工';
        _this.dialogCfg.addChainemployeeDialog.data.id = id;
        _this.dialogCfg.addChainemployeeDialog.data.headquartersId = _this.formSearch.headquartersId;
      }

    },
    //每页显示条数改变
    handleSizeChange(pageSize) {
      let _this = this;
      this.$nextTick(() => {
        _this.pageConfig.currentPage = 1;
        _this.pageConfig.pageSize = pageSize;
        this.getTableList();
      })
    },
    handleChage(page) {
      this.pageConfig.currentPage = page;
      this.getTableList('changePage');
    },
    init() {  //初始化
      this.$nextTick(() => {
        let wheight = this.$refs['charge_item'].offsetHeight - this.$refs['box_header'].offsetHeight - 60;//50为分页高度
        this.tableHeight = wheight;
      })
      listPosition().then(res => {
        this.positionList = res.data.data;
      });
      listDepartment().then(res => {
        this.departmentList = res.data.data;
      })
    },
    //删除员工
    delData(id){
      this.$confirm("此操作将删除该员工, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteClinicUser({id: id}).then(res => {
          this.getTableList();
        })
      }).catch(() => {});
    },
    //获取员工列表
    getTableList(data) {
      let _this = this;
      _this.tableLoading = true;
      if(data != 'changePage')_this.pageConfig.currentPage = 1;
      if(data && data != 'changePage') {
        if(!data.chainLevel) {
          this.formSearch.institutionId = data.id || data.institutionId;
        } else {
          this.formSearch.chainLevel1Id = data.chainLevel.chainLevel1Id || 0;
          this.formSearch.chainLevel2Id = data.chainLevel.chainLevel2Id || 0;
          this.formSearch.chainLevel3Id = data.chainLevel.chainLevel3Id || 0;
          this.formSearch.chainLevel4Id = data.chainLevel.chainLevel4Id || 0;
          this.formSearch.headquartersId = data.chainLevel.headquartersId || 1;
          this.formSearch.institutionId = '0';
          this.formSearch.level = data.chainLevel.level || 0;
          this.formSearch.id = data.chainLevel.id || 0;
          if(data.chainLevel.level)this.formSearch[`chainLevel${data.chainLevel.level}Id`] = data.chainLevel.id;
        }
      }
      this.formSearch.page = _this.pageConfig.currentPage;
      this.formSearch.pageSize = _this.pageConfig.pageSize;
      listChainemployee(this.formSearch).then(res => {
        _this.tableList = Array.isArray(res.data.data) && res.data.data ? res.data.data : [];
        _this.pageConfig.total = res.data.totalNumber || 0;
        _this.tableLoading = false;
      }).catch(res => {
        _this.tableLoading = false;
        
      });
    }
  },
  mixins: []
};
</script>
<style lang="less" scoped>
.wrapper {
  height: 100%;
  box-shadow: 0 0 6px 0 #e4e9ff;
  .charge_item {
    position: relative;
    height: 100%;

    .box_header {
      box-shadow: none;
      margin-bottom: 0;
      .el-input,.el-form-item,.el-select {
        /deep/.el-form-item__content {
          width: 100%;
          max-width: 270px;
        }
        width: 100%;
        max-width: 270px;
      }
      /deep/.el-select>.el-input {
        width: 100% !important;
        max-width: 270px;
      }
         
    }
    .height100 {
      height: 100%;
    }
    .wrapper_table1 {
       padding: 0 15px;
       box-shadow: none;
      .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
      }
    }

    .wrapper-tree {
      overflow: auto;
      font-size: 16px;
      font-weight: 400;
      line-height: 22px;
      /deep/.el-tree {
        padding-left: 5px;
      }
    }
    
  }
}
</style>
