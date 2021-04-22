<!--
@Author: ZJZ
@Date:   2019-08-01
@Filename: workAdmin.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-14
-->

<template>
  <div class="wrapper" id="workadmin">
    <div class="header_wrap">
      <div class="header_left">
        <span>当前营业时间：</span>
        <el-time-picker
          is-range
          :editable="false"
          :clearable="false"
          :readonly="readonly"
          v-model="timeValue"
          @change="setHours"
          format='HH:mm'
          style="width:260px"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围">
        </el-time-picker>
        <el-button @click="setHours">{{readonly? '编辑' : '确定' }}</el-button>
      </div>
      <div class="header_right">
        <el-button type="primary" @click="addWorkFn">新增班次</el-button>
      </div>
    </div>

    <div class="container">
      <el-table
        :header-cell-style="{background:'#F7F9FF'}"
        :data="tableData"
        style="width: 100%; height:650px;"
        max-height="650"
        align="center"
        header-align="center"
      >
        <el-table-column align="center" prop="name" label="班次">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="startTime" label="上班时间">
          <template slot-scope="scope">
            <span>{{setTimeHours(scope.row.startTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="endTime" label="上班时间">
          <template slot-scope="scope">
            <span v-show="scope.row.readonly">{{setTimeHours(scope.row.endTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="color" label="颜色">
          <template slot-scope="scope">
            <div class="color_wrap">
              <span class="color_box" :style="{'backgroundColor':scope.row.color}"></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="canVisit" label="是否可约诊">
          <template slot-scope="scope">
            <span>{{scope.row.canVisit == 0 ?  '不可预约' : '可预约'  }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :title="isAddOrEdit?'新增班次' : '编辑班次'"
      :visible.sync="dialogVisible"
      @close="closeDialog"
      width="600px">
      <el-form ref="forms" :model="form" label-width="110px" :rules="rules">
        <el-form-item label="班次名称" prop="name">
          <el-input v-model="form.name" style="width:360px"></el-input>
        </el-form-item>
        <el-form-item label="上班时间" prop="startTime">
          <el-time-picker v-model="form.startTime"   style="width:360px"></el-time-picker>
        </el-form-item>
        <el-form-item label="下班时间" prop="endTime">
          <el-time-picker v-model="form.endTime"  style="width:360px"></el-time-picker>
        </el-form-item>
        <el-form-item label="颜色" props="color">
          <el-color-picker
            v-model="form.color"
            :predefine="predefineColors">
          </el-color-picker>
        </el-form-item>
        <el-form-item label="是否可预约" props="canVisit">
          <el-select v-model="form.canVisit" placeholder="请选择" style="width:360px">
            <el-option label="不可预约" value=0></el-option>
            <el-option label="可预约"   value=1></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrEdit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getBusinessTime , getDutyconfig, postSaveDutys, putEditDutys, deleteDuty, PutBusinessHours } from '@/api'
import moment from 'moment'
import seeion from 'sessionstorage'
export default {
  components: {},
  props: {},
  data () {
    return {
      timeValue: [],
      readonly: true,
      tableData:[],
      tableHeader:[
        { prop: "name", label: "班次" },
        { prop: "startTime", label: "上班时间" },
        { prop: "endTime", label: "下班时间" },
        { prop: "color", label: "颜色" },
        { prop: "canVisit", label: "是否可约诊" }
      ],
      form: {
        name: '',
        startTime: '',
        endTime: '',
        color: '#77CDFF',
        canVisit: 0,
      },
      isAddOrEdit: true,
      dialogVisible: false,
      color: '#77CDFF',
      predefineColors: [
        'rgb(119, 205, 255)',
        'rgb(28, 213, 193)',
        'rgb(126, 211, 33)',
        'rgb(241, 134, 5)',
        'rgb(181, 190, 209)',
        'rgb(161, 124, 235)',
        'rgb(248, 84, 84)',
        'rgb(247, 144, 124)'
      ],
      rules:{
        name: [{required: true, message: '请输入班次名称', trigger: 'blur'}],
        startTime: [{required: true, message: '请选择上班时间', type: 'date',trigger:'change'}],
        endTime: [{required: true, message: '请选择下班时间', type: 'date'}]
      }
    }
  },
  watch: {},
  computed: {},
  methods: {
    fromtTime(t) {
      return moment(t, 'HH:mm:ss').valueOf()
    },
    setTimeHours(t) {
      return moment(t).format('HH:mm:ss')
    },
    setHours() {
      this.readonly = !this.readonly
      if (!this.readonly) return
      let [openTime, closeTime] = this.timeValue.map(val => this.setTimeHours(val))
      let time = {
        openTime, closeTime,
        institutionId : seeion.getItem('institutionId')
      }
      PutBusinessHours(time).then(res => {

      })
    },
    addWorkFn() {
      this.dialogVisible = true
      this.isAddOrEdit = true
      this.form = {
        name: '',
        startTime: this.fromtTime('09:00:00'),
        endTime: this.fromtTime('18:00:00'),
        color: '#77CDFF',
        canVisit: '0'
      }
    },
    closeDialog() {
      this.$refs['forms'].resetFields();
    },
    handleDelete({id}) {
      this.$confirm("此操作将删除该班次, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteDuty(id).then(res => {
          this._initData()
        })
      }).catch(() => {});;

    },
    deepCopy(obj) {
      var result = Array.isArray(obj) ? [] : {};
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'object') {
            result[key] = deepCopy(obj[key]);   //递归复制
          } else {
            result[key] = obj[key];
          }
        }
      }
      return result;
    },
    // 保存数据
    saveOrEdit() {
      this.$refs['forms'].validate(valid => {
        if ( valid ) {
          // let data = this.deepCopy(this.form)
          this.form.startTime = moment(this.form.startTime).format('HH:mm:ss')
          this.form.endTime = moment(this.form.endTime).format('HH:mm:ss')

          if (this.isAddOrEdit) {
            postSaveDutys(this.form).then(res => {

              this._initData()
            })
          } else {
            putEditDutys(this.form).then(res => {

              this._initData()
            })
          }
          this.dialogVisible = false
        }
      })
    },
    handleEdit(row) {
      this.form = this.deepCopy(row)
      this.isAddOrEdit = false
      this.dialogVisible = true
    },
    _initTime() {
      getBusinessTime().then(res => {
        let time = res.data.data
        this.timeValue = [this.fromtTime(time.openTime), this.fromtTime(time.closeTime)]
      })
    },
    _initData() {
      getDutyconfig().then(res => {
        this.tableData = res.data.data.map(val => {
          val.startTime = this.fromtTime(val.startTime)
          val.endTime = this.fromtTime(val.endTime)
          val.canVisit = val.canVisit.toString()
          val.readonly = true
          return val
        })
      })
    }
  },
  mixins: [],
  mounted () {
    this._initData()
    this._initTime()
  }
}
</script>
<style lang="less" scoped>
.header_wrap {
  height: 80px;
  padding: 0 20px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.container{
  height: 680px;
  margin-top: 20px;
  background: #fff;
}
.color_wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  .color_box {
    width: 36px;
    height: 36px;
    border: 1px solid #eee;
  }
}
</style>
<style>
.el-time-panel__footer {
  border-top: 0 !important;
}
.el-color-dropdown__main-wrapper {
  display: none;
}
.el-color-dropdown__btns .el-input__inner {
  display: none;
}
</style>
