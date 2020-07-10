import request from '@/lib/request'

export const apiLogin = (params) => request('login', params)
