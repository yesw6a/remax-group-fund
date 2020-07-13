// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const db = cloud.database()

  return db
    .collection('table_user')
    .where({ _openid: OPENID })
    .get()
    .then((res) => {
      console.log('res', res)
      const { data } = res
      if (data.length === 0) {
        return { code: 50000, message: '未找到用户' }
      } else {
        return { code: 200, message: 'success', data: data[0] }
      }
    })
    .catch((err) => ({ code: 500, message: err }))
}
