// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  let result = {}

  await db
    .collection('table_user')
    .get()
    .then((res) => {
      console.log('res', res)
      const { data } = res
      if (data.length === 0) {
        result = { code: 500, message: '未有用户参与排名' }
      } else {
        const ranking = data.reduce((acc, cur) => {
          const { funds } = cur
          if (funds) {
            funds.sort((a, b) => b.rate - a.rate)
            const info = { }
            return acc.concat([funds[0]])
          }
        }, [])
        result = { code: 200, message: 'success', data: ranking }
      }
    })
    .catch((err) => {
      result = { code: 500, message: err }
    })

  return result
}
