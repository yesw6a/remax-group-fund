import React from 'react'
import { View, Text } from 'remax/wechat'
import Loading from '@/components/Loading'
import styles from './style.module.scss'

function ListFooter({ isEnd, isLoadMore }) {
  const renderListFooter = () => {
    if (isEnd) {
      return <Text className={styles.text}>没有更多数据了</Text>
    } else if (isLoadMore) {
      return <Loading />
    } else {
      return null
    }
  }

  return <View className={styles.container}>{renderListFooter()}</View>
}

export default ListFooter
