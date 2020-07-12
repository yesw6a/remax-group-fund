/**
 * 获取基金详情
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')

cloud.init()

// 云函数入口函数
exports.main = async (event) => {
  const { code } = event

  const getDetail = {
    method: 'GET',
    url: 'https://api.doctorxiong.club/v1/fund/detail',
    qs: {
      code: code,
    },
    json: true,
  }

  const res = await rp(getDetail)

  return res
}
