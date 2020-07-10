import React, { useEffect } from 'react'
import { View, Text, Image, Button } from 'remax/wechat'
import { db } from '@/lib/crud'
import { apiLogin } from '@/utils/apis'

import styles from './style.scss'

export default () => {
  const getOpenid = () => {
    apiLogin().then((res) => {
      const { openid } = res
      global.openid = openid
    })
  }

  const handleGetUserInfo = (e) => {
    console.log(e)
    const { detail } = e
    const { userInfo } = detail
    if (!userInfo) {
      // 用户拒绝
      return
    }
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
              userInfo: userInfo,
            },
          })
        } else {
          db.collection('table_user')
            .doc(data[0].id)
            .update({
              data: {
                userInfo: userInfo,
              },
            })
        }
      })
  }

  const renderHeader = () => {
    return (
      <View className={styles.header__wrapper}>
        <Button openType="getUserInfo" onGetUserInfo={handleGetUserInfo}>
          登录
        </Button>
      </View>
    )
  }

  useEffect(() => {
    getOpenid()
  }, [])

  return <View className={styles.wrapper}>{renderHeader()}</View>
}
