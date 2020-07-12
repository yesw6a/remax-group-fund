// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID, APPID, UNIONID } = cloud.getWXContext()
  const db = cloud.database()
  let result = {}

  try {
    await db
      .collection('table_user')
      .where({ _openid: OPENID })
      .get()
      .then((res) => {
        const { data } = res
        if (data.length === 0) {
          db.collection('table_user').add({
            data: {
              ...event,
            },
          })
        } else {
          db.collection('table_user')
            .doc(data[0]._id)
            .update({
              data: {
                ...event,
              },
            })
        }
        result = { code: 200, message: 'success', data: event }
      })
      .catch(() => {})
    return result
  } catch (error) {
    console.log(`login error: ${error}`)
    return result
  }
}
