import * as types from '../mutation-types'
import { getAppointment, getWorkCount, getAppointmentData } from "@/api";
import monment from "moment";
const appointment = {
    state: {
        workCount: [],
        params: {
            total: 0,
            page: 0,
            startTime: null,
            pageSize: null,
            endTime: null,
            type: null
        },
        tableData: {},
    },
    getters: {

    },
    mutations: {
        [types.GET_APPOINTMENT_PARAMS](state, data) {
            Object.assign(state.params, data)
        },
        [types.SET_APPOINTMENT_DATA](state, data) {
            state.tableData = data;
        },
    },
    actions: {
        //预约
        [types.GET_APPOINTMENT_DATA]({ commit,state}, data) {
            commit('GET_APPOINTMENT_PARAMS', data)
            getAppointmentData(data).then(res => {
                if (res.data.code === 200) {
                    commit('SET_APPOINTMENT_DATA', res.data)
                }
            })
        }
    }
}

export default appointment