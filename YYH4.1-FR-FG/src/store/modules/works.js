import * as types from '../mutation-types'
import { docDiagnosis } from '@/config/middleware'
import { getWorkCount, getDentalPatientInfo, getChargebillingInfo } from '@/config'
import monment from "moment";
const userInfo = {
  state: {
    workCount: [],
    docDiagnosis: {
      tableDataList: [],
      total: 1
    },
    docPrice: {
      tableDataList: [],
      total: 1
    },
    docCase: [],
    docVist: [],
    allDocDiagnosis: [],
    allDocPrice: [],
    allDocCase: [],
    allDocVist: [],
    recBespeak: [],
    recDiagnosis: [],
    recPrice: [],
    recVist: [],
    allRecBespeak: [],
    allRecDiagnosis: [],
    allRecPrice: [],
    allRecVist: [],
    visitRecordFrist: {}
  },
  getters: {
    getVisitRecordFrist(state) {
      return state.visitRecordFrist;
    }
  },
  mutations: {
    [types.GET_WORK_COUNT](state, data) {
      getWorkCount().then(res => {
        state.workCount = res.data.data
        console.log(state.workCount)
      })
    },
    [types.UPDATE_DOC_DIAGNOSIS](state, data) {
      state.docDiagnosis = data
    },
    [types.UPDATE_DOC_PRICE](state, data) {
      state.docPrice = data
    },
    [types.SET_VISIT_RECORD_FRIST](state, data) {
      state.visitRecordFrist = data
    }
  },
  actions: {
    [types.GET_WORK_COUNT]({ commit }) {
      let titData = {}
      getWorkCount().then(res => {
        Object.assign(titData, res.data.data)
      })
      commit('GET_WORK_COUNT', titData)
    },
    // 医生 - 代办 - 就诊
    async [types.UPDATE_DOC_DIAGNOSIS]({ commit }, data) {
      console.log( data )
      await getDentalPatientInfo(data).then(res => {
        console.log( data )
        if (res.data.code === 200) {
          let _D = res.data.data;
          let data = {
            tableDataList: [],
            total: 1
          }
          // 1 是初诊  0 复诊
          let arr = ["预约", "待治疗", "治疗中", "治疗完成", "转诊", "拍片", "代收费", "已收费", "", "结束就诊"];
          data.total = res.data.totalNumber;
          data.tableDataList = _D.map(item => {
            item.num = parseInt(item.visitStatus);
            item.visitStatusTxt = arr[parseInt(item.visitStatus)];
            item.firstVisitIndicator == 0
              ? (item.firstVisitIndicator = "初诊")
              : (item.firstVisitIndicator = "复诊");
            item.visitTime = monment(item.visitTime).format("YYYY-MM-DD HH:mm");
            if (Object.is(item.sex, null)) {
              item.sex == '未添加数据'
            } else if (item.sex == 0) {
              item.sex == '未知性别'
            } else {
              item.sex == 1 ? item.sex = '男' : item.sex = '女'
            }
            return item;
          });
          commit('UPDATE_DOC_DIAGNOSIS', data)
        }
      })
      await commit('GET_WORK_COUNT')
    },
    // 医生 - 代办 - 收费
    async [types.UPDATE_DOC_PRICE]({commit}, data) {
      await getChargebillingInfo(
        {
          page:this.page,
          pageSize:this.pageSize,
          doctor: 'doctor',
          startTime: this.startTime,
          endTime: this.endTime,   
        }
      ).then(res => {
        if (res.data.code === 200) {
          let _D = res.data.data;
          let data = {
            tableDataList: [],
            total: 1
          }
          data.total = _D.totalNumber
          let sexArr = ["男", "女"];
          let arr = ['待收费','已收费','退费','欠费','作废','审批待处理','审批通过','审批驳回']
         
          data.tableDataList = _D.map((v, i) => {
            v.patientName = v.dentalPatientInfo.patientName; //姓名
            v.sex = sexArr[parseInt(v.dentalPatientInfo.sex) - 1]; // 性别
            v.clinicNo = v.dentalPatientInfo.clinicNo; // 病历号
            v.doctorUserName = v.doctorUser.name; // 医生
            v.visitTime = monment(v.visitTime).format("YYYY-MM-DD hh:mm:ss")
            v.createTime = this.getTime(v.createTime);
            v.telephone = v.dentalPatientInfo.mobilphone
            v.tollerUserName = v.tollerUser.username
            v.billingStatusTxt = arr[parseInt(v.billingStatus)]
            return v;
          })
        }
      })
    },
    [types.SET_VISIT_RECORD_FRIST]({ commit },data) {
      commit(types.SET_VISIT_RECORD_FRIST, data)
    },
  }
}

export default userInfo