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
    .then(async (res) => {
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
            await db
              .collection('table_funds')
              .where({ code })
              .get()
              .then((fundDetail) => {
                const { data } = fundDetail
                if (data.length > 0) {
                  const { name } = data[0]
                  info.fundName = name
                }
              })
            if (Array.isArray(acc)) {
              acc.push(info)
            } else {
              acc.then((accRes) => (acc = accRes.push(info)))
            }
          }
          return acc
        }, [])
        await ranking.then((rankingRes) => {
          rankingRes.sort((a, b) => b.rate - a.rate)
          result = { code: 200, message: 'success', data: rankingRes }
        })
      }
    })
    .catch((err) => {
      result = { code: 500, message: err }
    })
  console.log('result', result)

  return result
}
