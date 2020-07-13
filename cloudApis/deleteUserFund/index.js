// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const db = cloud.database()
  const { code } = event

  const numberReg = /^[0-9]*$/

  if (!code || !numberReg.test(code)) {
    return {
      code: 400,
      message: '基金代码需为数字',
    }
  }

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
        const i = funds.findIndex((o) => o.code === code)
        if (i === -1) {
          return { code: 500, message: '用户未关注该基金' }
        } else {
          // 更新数组
          const cloneDeepFunds = JSON.parse(JSON.stringify(funds))
          cloneDeepFunds.splice(i, 1)
          db.collection('table_user')
            .doc(_id)
            .update({ data: { funds: cloneDeepFunds } })
          return { code: 200, message: 'success' }
        }
      }
    })
}
