// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const db = cloud.database()
  let list = []

  try {
    await db
      .collection('table_user')
      .where({ _openid: OPENID })
      .get()
      .then(async (res) => {
        const { data } = res
        if (data.length > 0) {
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
              console.log(res)
              const { list: details } = res
              if (details.length > 0) {
                const { fundsDetail, funds } = details[0]
                fundsDetail.reduce((acc, cur) => {
                  funds.map((o) => o.code === cur.code && (cur['userRate'] = o.rate))
                  return acc.concat([cur])
                }, [])
                list = fundsDetail
              }
            })
            .catch((err) => {})
        }
      })
    return { code: 200, message: 'success', data: list }
  } catch (error) {
    return { code: 500, message: error, data: list }
  }
}
