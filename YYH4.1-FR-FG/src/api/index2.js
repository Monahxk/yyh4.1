/**
 * @Author: ZJZ
 * @Date:   2019-08-01
 * @Filename: index2.js
 * @Last modified by:   ZJZ
 * @Last modified time: 2019-11-14
 */

import axios from './axios-set'
import qs from 'qs'


//报表库存列表
export const inventroyreportList = data => axios.get(`statistic/inventroyreport/page/filter`, data)
//报表库存下拉数据
export const inventroyreportfilterdo = data => axios.get(`statistic/inventroyreportfilterdo`, data)
//报表库存table详情
export const batchlineitemId = id => axios.get(`statistic/inventroyreport/batchlineitem/${id}`)
//报表库存明细
export const inventoryreportdetaildoId = data => axios.get(`statistic/inventoryreportdetaildo/drug/${data.drugId}/warehouse/${data.wareHouseId}`)
//报表库存导出
export const fileExport = data => {
    return axios({
        method: 'get',
        url: `statistic/inventroyreport/fileexport?wareHouseId=${data.wareHouseId}&drugTypeId=${data.drugTypeId}&drugInfo=${data.drugInfo}`,
        responseType: 'arraybuffer',
    })
}

//报表入库存列表
export const importinventoryreportList = data => axios.get(`statistic/importinventoryreport/page/filter`, data)
//报表出入库存下拉数据
export const importinventoryreportfilterdo = data => axios.get(`statistic/importinventoryreportfilterdo`, data)
//报表入库导出
export const importinventoryreportExport = (data) => {
    return axios({
        method: 'get',
        url: `statistic/importinventoryreport/fileexport?startDay=${data.startDay}&endDay=${data.endDay}&drugTypeId=${data.drugTypeId}&wareHouseId=${data.wareHouseId}&queryType=${data.queryType}`,
        responseType: 'arraybuffer',
    })
}

//报表出库存列表
export const exportinventoryreportList = data => axios.get(`statistic/exportinventoryreport/page/filter`, data)
//报表出库导出
export const exportinventoryreportExport = (data) => {
    return axios({
        method: 'get',
        url: `statistic/exportinventoryreport/fileexport?startDay=${data.startDay}&endDay=${data.endDay}&drugTypeId=${data.drugTypeId}&wareHouseId=${data.wareHouseId}&queryType=${data.queryType}`,
        responseType: 'arraybuffer',
    })
}
//报表采购列表
export const purchasereporttList = data => axios.get(`statistic/purchasereport/page/filter`, data)
//报表采购导出
export const purchasereportExport = data => {
    return axios({
        method: 'get',
        url: `statistic/purchasereport/fileexport?startDay=${data.startDay}&endDay=${data.endDay}&drugTypeId=${data.drugTypeId}&wareHouseId=${data.wareHouseId}&queryType=${data.queryType}`,
        responseType: 'arraybuffer',
    })
}
//报表领用列表
export const takeoutreportList = data => axios.get(`statistic/takeoutreport/page/filter`, data)
//报表领用导出
export const takeoutreportExport = data => {
    return axios({
        method: 'get',
        url: `statistic/takeoutreport/fileexport?startDay=${data.startDay}&endDay=${data.endDay}&drugTypeId=${data.drugTypeId}&wareHouseId=${data.wareHouseId}&queryType=${data.queryType}`,
        responseType: 'arraybuffer',
    })
}
//报表退库列表
export const returninventoryreportList = data => axios.get(`statistic/returninventoryreport/page/filter`, data)
//报表退库导出
export const returninventoryreportExport = data => {
    return axios({
        method: 'get',
        url: `statistic/returninventoryreport/fileexport?startDay=${data.startDay}&endDay=${data.endDay}&drugTypeId=${data.drugTypeId}&wareHouseId=${data.wareHouseId}&queryType=${data.queryType}`,
        responseType: 'arraybuffer',
        data:data
    })
}
//报表盘点列表
export const checkinventoryreportList = data => axios.get(`statistic/checkinventoryreport/page/filter`, data)
//报表盘点导出
export const checkinventoryreportExport = data => {
    return axios({
        method: 'get',
        url: `statistic/checkinventoryreport/fileexport?startDay=${data.startDay}&endDay=${data.endDay}&drugTypeId=${data.drugTypeId}&wareHouseId=${data.wareHouseId}&queryType=${data.queryType}`,
        responseType: 'arraybuffer',
        data:data
    })
}

//审批管理列表
export const approvalitemDetailsList = data => axios.get(`approvalflow/approvalitem/details/page/fiter`, data)
//审批管理我发起列表
export const approvalitemList = data => axios.get(`approvalflow/approvalitem/page/fiter`, data)
//审批管理填充数据
export const approvalitemfilterdo = data => axios.get(`approvalflow/approvalitemfilterdo`, data)
//审批id查看数据
export const approvalitemId = id => axios.get(`approvalflow/approvalitem/${id}`)
//审批  通过审批
export const putPassApprovalitem = (data,id) => {
    return axios({
        method: 'put',
        url: `approvalflow/approvalitem/${id}/complete`,
        headers: { "Content-Type": 'multipart/from-data' },
        data: data,
    })
}
//审批  驳回审批
// export const putRejectApprovalitem = data => axios.put(`approvalflow/approvalitem/${data.id}/reject`,{opinion:data.opinion})
export const putRejectApprovalitem = (data,id) => {
    return axios({
        method: 'put',
        url: `approvalflow/approvalitem/${id}/reject`,
        headers: { "Content-Type": 'multipart/from-data' },
        data: data,
    })
}
//审批  撤销
export const approvalitemCancel = id => axios.put(`approvalflow/approvalitem/${id}/cancel`)
