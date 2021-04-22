import * as types from '../mutation-types'
import { getVisitData } from "@/api";
import monment from "moment";
let today =  monment(new Date()).format("YYYY-MM-DD");
const visit = {
    state: {
        workCount: [],
        params: {
            total: 0,
            page: 1,
            startTime: today,
            pageSize: 10,
            endTime: today,
            type: null,
            firststatus:'need-deal',
            status:null
        },
        tableData: {},
    },
    getters: {

    },
    mutations: {
        [types.GET_VISIT_PARAMS](state, data) {
            Object.assign(state.params, data)
        },
        [types.SET_VISIT_DATA](state, data) {
            state.tableData = data;
        },
    },
    actions: {
        //就诊
        [types.GET_VISIT_DATA]({ commit,state }, data) {
            console.log(state);
            getVisitData(state.params).then(res => {
                if (res.data.code === 200) {
                    console.log(res);
                    commit('SET_VISIT_DATA', res.data)
                }
            })
        }
    }
}

export default visit