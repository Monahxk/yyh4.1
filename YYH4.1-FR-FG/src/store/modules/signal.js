import * as types from '../mutation-types'
import {getPatientMsg} from "@/api"
import moment from 'moment'
const eventIframe = {
  state: {
    patientsDidlog: null,
    patientsMsg: {
      patientName:null,
      gender:null,
      clinicNo: null,
      mobilphone: null
    },
    patientId: null,
    allCountOne: {
      one: null,
      two: null,
      three: null,
      four: null
    },
    rowId:''
  },
  getters: {
    
  },
  mutations: {
    [types.SAVE_PATIENT](state,data) {
      state.patientsDidlog = data
    },
    [types.SET_PATIENT_MSG](state,data) {
      state.patientsMsg = data
    },
    [types.SET_PATIENT_ID](state,data) {
      state.patientId = data
    },
    [types.SET_ALL_COUNT_ONE](state, data) {
      
    },
    [types.SET_ROW_ID](state,data){
      state.rowId = data
    }
  },
  actions: {
    [types.SAVE_PATIENT]({commit},data) {
      commit('SAVE_PATIENT',data)
    },
    [types.GET_PATIENT_MSG]({commit},id){
      commit('SET_PATIENT_ID',id)
      getPatientMsg(id).then(res => {
        let _D = res.data.data.Patient || null;
        if(_D){
          if ( Object.is( _D.gender, null ) ) {
            _D.gender = '数据异常'
          } else if( _D.gender == 0 ){
            _D.gender = '未知性别'
          } else {
            _D.gender == 1 ? _D.gender = '男' : _D.gender = '女'
          }
          let duration  = moment.duration(moment().diff(_D.birthDate));
          _D.birthDate ? _D.ages = duration.years()  : _D.ages  = '';
          
          commit('SET_PATIENT_MSG', _D)
        }

      })
    }
  }
}

export default eventIframe