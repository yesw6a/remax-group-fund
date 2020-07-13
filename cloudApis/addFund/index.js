// 云函数入口文件
const cloud = require('wx-server-sdk')
const getFundDetail = require('../getFundDetail')
const getUserInfo = require('../getUserInfo')

cloud.init()

const db = cloud.database()

/**
 * 更新基金列表
 * @param {object} detail - 基金详情
 */
const updateFund = async (detail = {}) => {
  const { code } = detail
  const updatedAt = Date.now()
  await db
    .collection('table_funds')
    .where({ code: code })
    .get()
    .then((res) => {
      const { data } = res
      const createdAt = Date.now()
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
const updateUserFundInfo = async (code, rate) => {
  await getUserInfo
    .main()
    .then((res) => {
      const { data } = res
      const { _id, funds } = data
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
    })
    .catch((err) => {})
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

    await getFundDetail
      .main({ code: code })
      .then((res) => {
        const { data } = res || {}
        updateFund(data)
      })
      .catch((err) => {
        console.log('err', err)
      })

    await updateUserFundInfo(code, rate)

    return { code: 200, message: 'success', data: {} }
  } catch (error) {}
}
