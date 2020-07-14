// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const db = cloud.database()
  const cf = cloud.callFunction
  const params = {
    ...event,
    updatedAt: Date.now(),
  }
  let result = {}

  try {
    await cf({
      name: 'getUserInfo',
      data: {
        openid: OPENID,
      },
    })
      .then(async (res) => {
        const { code, message, data = {} } = res.result
        const { _id } = data
        if (code === 50000) {
          Object.assign(params, {
            createdAt: Date.now(),
          })
          await db.collection('table_user').add({
            data: params,
          })
          result = {
            code: 200,
            message: 'success',
            data: params,
          }
        } else {
          await db.collection('table_user').doc(_id).update({
            data: params,
          })
          result = {
            code: 200,
            message: 'success',
            data: params,
          }
        }
      })
      .catch(async (err) => {
        const { code, message } = err
        result = {
          code,
          message,
        }
      })
  } catch (error) {}

  return result
}
