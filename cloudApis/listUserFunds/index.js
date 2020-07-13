// 云函数入口文件
const cloud = require('wx-server-sdk')
const getUserInfo = require('../getUserInfo')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  let result = {}

  try {
    await getUserInfo.main().then(async (res) => {
      await db
        .collection('table_user')
        .aggregate()
        .lookup({
          from: 'table_funds',
          localField: 'funds.code',
          foreignField: 'code',
          as: 'fundsDetail',
        })
        // .count('_id')
        .end()
        .then((res) => {
          const { list: details } = res
          if (details.length > 0) {
            const { fundsDetail, funds } = details[0]
            fundsDetail.reduce((acc, cur) => {
              funds.map((o) => o.code === cur.code && (cur['rateUser'] = o.rate))
              return acc.concat([cur])
            }, [])
            list = fundsDetail
          }
        })
        .catch((err) => {
          result = err
        })
    })
    result = { code: 200, message: 'success', data: list }
  } catch (error) {}
  return result
}
