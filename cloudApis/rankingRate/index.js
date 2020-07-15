// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const cf = cloud.callFunction
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
        const ranking = data.reduce(async (acc, cur) => {
          const { nickName, funds } = cur
          if (funds) {
            funds.sort((a, b) => b.rate - a.rate)
            const { code, rate } = funds[0]
            const info = { nickName: nickName, code, rate }
            await cf({ name: 'getFundDetail', data: { code } }).then((fundDetail) => {
              const { name } = fundDetail.result.data
              info.fundName = name
            })
            acc.push(info)
          }
          return acc
        }, [])
        result = { code: 200, message: 'success', data: ranking }
      }
    })
    .catch((err) => {
      result = { code: 500, message: err }
    })

  return result
}
