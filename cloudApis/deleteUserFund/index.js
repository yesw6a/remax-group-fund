// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const { OPENID } = cloud.getWXContext()
const db = cloud.database()
const cf = cloud.callFunction

// 云函数入口函数
exports.main = async (event, context) => {
  const { code } = event
  const numberReg = /^[0-9]*$/
  let result = {}

  if (!code || !numberReg.test(code)) {
    result = {
      code: 400,
      message: '基金代码需为数字',
    }
    return result
  }

  await cf({ name: 'getUserInfo', data: { openid: OPENID } }).then(async (res) => {
    const { data } = res.result
    const { _id, funds } = data
    const i = funds.findIndex((o) => o.code === code)
    if (i === -1) {
      result = { code: 500, message: '用户未关注该基金' }
    } else {
      // 更新数组
      const cloneDeepFunds = JSON.parse(JSON.stringify(funds))
      cloneDeepFunds.splice(i, 1)
      await db
        .collection('table_user')
        .doc(_id)
        .update({ data: { funds: cloneDeepFunds } })
      result = { code: 200, message: 'success' }
    }
  })

  return result
}
