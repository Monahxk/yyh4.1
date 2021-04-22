<template>
  <div class="wrapper">
    <div class="charge_item" ref="charge_item">
      <el-row class="height100">
        <el-col :span="5"  class="height100">
          <areaTree class="tree-box" :treeCfg="treeCfg" @openDialog="openInstitutionDialog" @treeNodeClick="getTableList" @getTableList="getTableList"></areaTree>
        </el-col>
        <el-col :span="19">
          <div class="box_header" ref="box_header">
            <el-form :inline="true" :model="formSearch" class="demo-form-inline">
              <el-row :gutter="24">
                <el-col :span="6">
                  <el-form-item label="">
                    <el-input v-model="formSearch.nameOrId" placeholder="门店名称/ID号" clearable>
                      <el-button slot="append" icon="el-icon-search" @click="getTableList('')"></el-button>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="3" :push="15">
                  <el-form-item>
                    <el-button type="primary"  @click="openInstitutionDialog('add')">新增门店</el-button>
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
              <el-table-column prop="id" label="ID" align="center"></el-table-column>
              <el-table-column prop="order" label="排序" align="center"></el-table-column>
              <el-table-column prop="name" label="名称" align="center"></el-table-column>
              <el-table-column prop="alias" label="简称" align="center"></el-table-column>
              <el-table-column prop="addr" label="地址" align="center"></el-table-column>
              <el-table-column prop="status" label="状态" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.status == 0">启用</span>
                  <span v-if="scope.row.status == 1">禁用</span>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope" style="marginLeft:-25px">
                  <el-button type="text" size="small" @click="openInstitutionDialog('edit',scope.row.id)">编辑</el-button>
                  <span class="line">|</span>
                  <el-dropdown>
                    <span class="el-dropdown-link">
                      更多
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <p @click="editOrder(scope.row)">排序</p>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <p @click="moveInstitution(scope.row.id)">移动到...</p>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <p @click="delData(scope.row.id)">删除</p>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <p @click="changeStatus(scope.row)">启用/禁用</p>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <pagination :pageConfig="pageConfig" @handleSizeChange="handleSizeChange" @handleChage="handleChage"></pagination>
        </el-col>
      </el-row>
      <addInstitutionDialog :dialogCfg="dialogCfg"  @getTableList="getTableList"></addInstitutionDialog>
      <moveInstitutionDialog :dialogCfg="dialogCfg"  @getTableList="getTableList"></moveInstitutionDialog>
      <orderInstitutionDialog :dialogCfg="dialogCfg"  @getTableList="getTableList"></orderInstitutionDialog>
    </div>
  </div>
</template>

<script>
import {delInstitution,listInstitution,changeInstitutionStatus} from '@/api'
import addInstitutionDialog from './components/AddInstitutionDialog'
import moveInstitutionDialog from './components/MoveInstitutionDialog'
import orderInstitutionDialog from './components/OrderInstitutionDialog'
import pagination from '@/components/inventory/pagination'
import areaTree from '@/components/chainment/areaTree'
export default {
  name:'chainInstitution',
  components: {
    areaTree,
    addInstitutionDialog,
    moveInstitutionDialog,
    orderInstitutionDialog,
    pagination
  },
  data() {
    return {
      tableLoading: false,
      treeCfg: {
        isshowAddBtn: true,
        hasInstitution: false,
        isGettable: true
      },
      dialogCfg: {
        addInstitutionDialog: {
          isshow: false,
          dialogTitle: '新增门店',
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
        moveInstitutionDialog: {
          isshow: false,
          data: {
            id: '',
          }
        },
        order: {
          isshow: false,
          data: {
            id: '',
            order: ''
          }
        }
      },
      formSearch: { //项目搜索
        nameOrId: '',
        chainLevel1Id: '',
        chainLevel2Id: '',
        chainLevel3Id: '',
        chainLevel4Id: '',
        headquartersId: '',
        level: '0', //连锁层级 等级
        id: '0', //连锁层级id
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
    openInstitutionDialog(type,id){
      let _this=this
      _this.dialogCfg.addInstitutionDialog.isshow = true;
      _this.dialogCfg.addInstitutionDialog.type = type;
      if(type == 'add'){
        _this.dialogCfg.addInstitutionDialog.dialogTitle = '新增门店';
        _this.dialogCfg.addInstitutionDialog.data.id = '';
        this.dialogCfg.addInstitutionDialog.data.chainLevel1Id = id && id.chainLevel ? id.chainLevel.chainLevel1Id : _this.formSearch.chainLevel1Id;
        this.dialogCfg.addInstitutionDialog.data.chainLevel2Id = id && id.chainLevel ? id.chainLevel.chainLevel2Id : _this.formSearch.chainLevel2Id;
        this.dialogCfg.addInstitutionDialog.data.chainLevel3Id = id && id.chainLevel ? id.chainLevel.chainLevel3Id : _this.formSearch.chainLevel3Id;
        this.dialogCfg.addInstitutionDialog.data.chainLevel4Id = id && id.chainLevel ? id.chainLevel.chainLevel4Id : _this.formSearch.chainLevel4Id;
        this.dialogCfg.addInstitutionDialog.data.headquartersId = id && id.chainLevel ? id.chainLevel.headquartersId : _this.formSearch.headquartersId;
        let level = id && id.chainLevel ? id.chainLevel.level : _this.formSearch.level;
        this.dialogCfg.addInstitutionDialog.data[`chainLevel${level}Id`] = id && id.chainLevel.id ? id.chainLevel.id : _this.formSearch.id;

      } if(type == 'edit'){
        _this.dialogCfg.addInstitutionDialog.dialogTitle = '编辑门店';
        _this.dialogCfg.addInstitutionDialog.data.id = id;
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
    },
    //删除门店
    delData(id){
      this.$confirm("此操作将删除该门店, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delInstitution(id).then(res => {
          this.getTableList();
        })
      }).catch(() => {});
    },
    //改变门店状态
    changeStatus(rowData) {
      let text = '您确定要启用该门店吗？';
      if(rowData.status == 0) {
        text = '您确定要禁用该门店吗？';
      }
      this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        changeInstitutionStatus({id: rowData.id,status: rowData.status == 1 ? 0:1}).then(res => {
          this.getTableList();
        })
      }).catch(() => {});
    },
    //移动门店
    moveInstitution(id) {
      this.dialogCfg.moveInstitutionDialog.isshow = true;
      this.dialogCfg.moveInstitutionDialog.data.id = id;
    },
    //修改排序
    editOrder(rowData) {
      this.dialogCfg.order.isshow = true;
      this.dialogCfg.order.data.id = rowData.id;
      this.dialogCfg.order.data.order = rowData.order;
    },
    //获取门店列表
    getTableList(data) {
      let _this = this;
      _this.tableLoading = true;
      if(data != 'changePage')_this.pageConfig.currentPage = 1;
      if(data && data != 'changePage') {
        this.formSearch.chainLevel1Id = data.chainLevel.chainLevel1Id || 0;
        this.formSearch.chainLevel2Id = data.chainLevel.chainLevel2Id || 0;
        this.formSearch.chainLevel3Id = data.chainLevel.chainLevel3Id || 0;
        this.formSearch.chainLevel4Id = data.chainLevel.chainLevel4Id || 0;
        this.formSearch.headquartersId = data.chainLevel.headquartersId || 1;
        this.formSearch.level = data.chainLevel.level || 0;
        this.formSearch.id = data.chainLevel.id || 0;
        if(data.chainLevel.level)this.formSearch[`chainLevel${data.chainLevel.level}Id`] = data.chainLevel.id;
      }
      this.formSearch.page = _this.pageConfig.currentPage;
      this.formSearch.pageSize = _this.pageConfig.pageSize;

      listInstitution(this.formSearch).then(res => {
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

      /deep/.el-input-group__append {
        background: #3B78FD;
        color: #fff;
        border: 1px solid #3B78FD;
      }
    }
    .height100 {
      height: 100%;
    }
    .wrapper_table1 {
      box-shadow: none;
      padding: 0 15px;
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
