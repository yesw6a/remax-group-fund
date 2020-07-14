import React, { useState, useEffect } from 'react'
import { View, Text } from 'remax/wechat'
import VanSwiperCell from '@vant/weapp/dist/swipe-cell'
import BigNumber from 'bignumber.js'
import { Alert, Toast, Divider } from '@/components'
import { apiDeleteUserFund } from '@/utils/apis'
import px from '@/utils/scalePx'

import styles from './style.scss'

function FundsList({ fundList, onRefresh }) {
  const handleUnfollow = (code, name) => {
    Alert.alert('', `确认取消关注 ${name}(${code})`).then((res) => {
      const { confirm } = res
      if (confirm) {
        onUnfollow(code)
      }
    })
  }

  const onUnfollow = (code) => {
    Toast.showLoading()
    apiDeleteUserFund({ code }).then(() => {
      Toast.showSuccess('已取消关注')
      onRefresh()
    })
  }

  const renderFundList = () => {
    return fundList.map(({ _id, code, name, dayGrowth, rateUser }, index) => {
      const userRate = BigNumber(rateUser).div(100).toString()
      return (
        <VanSwiperCell key={_id} right-width={135}>
          <View className={styles.item__container}>
            <View className={styles.fund_info}>
              <Text className={styles.fund_name}>{name}</Text>
              <Text className={styles.fund_code}>{code}</Text>
            </View>
            <View className={styles.fund_user_rate}>收益率：{userRate}%</View>
          </View>
          <View slot="right" className={styles.item_right__buttons}>
            <View className={styles.item_update_rate__button} onClick={() => {}}>
              修改收益率
            </View>
            <View
              className={styles.item_unfollow__button}
              onClick={() => handleUnfollow(code, name)}
            >
              取消关注
            </View>
          </View>
        </VanSwiperCell>
      )
    })
  }

  const renderFundsEmpty = () => {}

  return (
    <View className={styles.funds__wrapper}>
      <Text className={styles.funds__label}>已关注基金</Text>
      <Divider height={12} />
      {renderFundList()}
    </View>
  )
}

export default FundsList
