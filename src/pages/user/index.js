import React, { useState, useEffect, useContext } from 'react'
import { View, Text, Image, Button } from 'remax/wechat'
import { AppContext } from '@/app'
import { isLogin } from '@/utils/helper'

import styles from './style.scss'

export default () => {
  const appState = useContext(AppContext)
  const loginState = isLogin()

  const renderUnLogin = () => {
    return (
      <View className={styles.header__wrapper}>
        <Button openType="getUserInfo" onGetUserInfo={() => {}}>
          登录
        </Button>
      </View>
    )
  }

  const renderUserInfo = () => {
    return <View>{JSON.stringify(appState.userInfo)}</View>
  }

  return <View className={styles.wrapper}>{loginState ? renderUserInfo() : renderUnLogin()}</View>
}
