// 云函数入口文件
const cloud = require('wx-server-sdk')
const dayjs = require('dayjs')
const getFundDetail = require('../getFundDetail')

cloud.init()

const wxContext = cloud.getWXContext()
const { OPENID } = wxContext
const db = cloud.database()
const _ = db.command

/**
 * 更新基金列表
 * @param {object} detail - 基金详情
 */
const updateFund = (detail = {}) => {
  const { code } = detail
  const updatedAt = dayjs().valueOf()
  db.collection('table_funds')
    .where({ code: code })
    .get()
    .then((res) => {
      const { data } = res
      const createdAt = dayjs().valueOf()
      if (data.length === 0) {
        db.collection('table_funds').add({ data: { ...detail, createdAt, updatedAt } })
      } else {
        db.collection('table_funds')
          .doc(data[0]._id)
          .update({ data: { ...detail, updatedAt } })
      }
    })
    .catch(() => {})
}

/**
 * 更新用户基金信息
 * @param {string} code - 基金代码
 * @param {number} rate  - 基金收益率
 */
const updateUserFundInfo = (code, rate) => {
  return db
    .collection('table_user')
    .where({ _openid: OPENID })
    .get()
    .then((res) => {
      const { data } = res
      if (data.length === 0) {
        return {
          code: 500,
          message: '用户不存在',
        }
      } else {
        const { _id, funds } = data[0]
        let temp = funds
        if (!temp) {
          temp = [{ code, rate }]
        } else {
          const i = funds.findIndex((o) => o.code === code)
          if (i === -1) {
            temp.push({ code, rate })
          } else {
            temp.splice(i, 1, { code, rate })
          }
        }
        db.collection('table_user')
          .doc(_id)
          .update({ data: { funds: temp } })
      }
    })
}

// 云函数入口函数
exports.main = async (event) => {
  const { code, rate } = event
  const numberReg = /^[0-9]*$/

  try {
    if (!code || !numberReg.test(code)) {
      return {
        code: 400,
        message: '基金代码需为数字',
      }
    }

    getFundDetail
      .main({ code: code })
      .then((res) => {
        const { data } = res || {}
        updateFund(data)
      })
      .catch((err) => {
        console.log('err', err)
      })

    updateUserFundInfo(code, rate)

    return { code: 200, message: 'success', data: {} }
  } catch (error) {}
}
