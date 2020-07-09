import * as React from 'react'
import { View, Text, Image, Button } from 'remax/wechat'

import styles from './style.scss'

export default () => {
  const renderHeader = () => {
    return (
      <View className={styles.header__wrapper}>
        <Button openType="getUserInfo">获取用户信息</Button>
      </View>
    )
  }

  return <View className={styles.wrapper}>{renderHeader()}</View>
}
