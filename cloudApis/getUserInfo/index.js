// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const { openid } = event
  let result = {}

  await db
    .collection('table_user')
    .where({ _openid: openid })
    .get()
    .then((res) => {
      console.log('res', res)
      const { data } = res
      if (data.length === 0) {
        result = { code: 50000, message: '未找到用户' }
      } else {
        console.log(data[0])
        result = { code: 200, message: 'success', data: data[0] }
      }
    })
    .catch((err) => {
      result = { code: 500, message: err }
    })

  console.log('result', result)
  return result
}
