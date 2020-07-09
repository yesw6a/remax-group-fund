import React, { useEffect } from 'react'
import { View, Text, Image, Button, getSetting, cloud } from 'remax/wechat'

import styles from './style.scss'

export default () => {
  useEffect(() => {
    getSetting().then((res) => {
      console.log(res)
    })
    cloud
      .callFunction({
        name: 'login',
      })
      .then((res) => console.log(res))
  }, [])

  const handleGetUserInfo = (e) => {
    console.log(e)
  }

  const renderHeader = () => {
    return (
      <View className={styles.header__wrapper}>
        <Button openType="getUserInfo" onClick={handleGetUserInfo}>
          获取用户信息
        </Button>
      </View>
    )
  }

  return <View className={styles.wrapper}>{renderHeader()}</View>
}
