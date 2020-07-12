import request from '@/lib/request'

// 登录
export const apiLogin = (params) => request('login', params)
export const apiGetFundDetail = (params) => request('getFundDetail', params)
export const apiAddFund = (params) => request('addFund', params)
