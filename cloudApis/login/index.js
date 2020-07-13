// 云函数入口文件
const cloud = require('wx-server-sdk')
const getUserInfo = require('../getUserInfo')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const params = { ...event, updatedAt: Date.now() }
  let result = {}

  try {
    await getUserInfo
      .main()
      .then(async (res) => {
        const { code, message, data = {} } = res
        const { _id } = data
        await db.collection('table_user').doc(_id).update({ data: params })
        result = { code: 200, message: 'success', data: params }
      })
      .catch(async (err) => {
        const { code, message } = err
        if (code === 50000) {
          Object.assign(params, { createdAt: Date.now() })
          await db.collection('table_user').add({ data: params })
          result = { code: 200, message: 'success', data: params }
        } else {
          result = { code, message }
        }
      })
  } catch (error) {}

  return result
}
