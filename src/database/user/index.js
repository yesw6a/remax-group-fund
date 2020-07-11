import { db } from '@/lib/crud'

export const updateUserInfo = (userInfo) => {
  return new Promise((resolve, reject) => {
    db.collection('table_user')
      .where({
        _openid: global.openid,
      })
      .get()
      .then((res) => {
        console.log(res)
        const { data } = res
        if (data.length === 0) {
          db.collection('table_user').add({
            data: {
              ...userInfo,
            },
          })
        } else {
          db.collection('table_user')
            .doc(data[0]._id)
            .update({
              data: {
                ...userInfo,
              },
            })
        }
        resolve(res.data[0])
      })
      .catch((e) => reject(e))
  })
}
