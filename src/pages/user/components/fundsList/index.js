import React, { useState, useEffect } from 'react'
import { View, Text } from 'remax/wechat'
import VanSwiperCell from '@vant/weapp/dist/swipe-cell'
import BigNumber from 'bignumber.js'
import { Toast, Divider } from '@/components'
import { apiListUserFunds, apiDeleteUserFund } from '@/utils/apis'
import { useRequest } from '@/hooks'

import styles from './style.scss'

function FundsList() {
  const [requestFundList, fundList] = useRequest(apiListUserFunds, { initData: [] })

  const handleUnfollow = (code) => {
    apiDeleteUserFund({ code })
  }

  const renderFundList = () => {
    return fundList.map(({ _id, code, name, dayGrowth, rateUser }, index) => {
      const userRate = BigNumber(rateUser).div(100).toString()
      return (
        <VanSwiperCell key={_id} right-width={65}>
          <View className={styles.item__container}>
            <View className={styles.fund_info}>
              <Text className={styles.fund_name}>{name}</Text>
              <Text className={styles.fund_code}>{code}</Text>
            </View>
            <View className={styles.fund_user_rate}>收益率：{userRate}%</View>
          </View>
          <View
            slot="right"
            className={styles.item_unfollow__button}
            onClick={() => handleUnfollow(code)}
          >
            取消关注
          </View>
        </VanSwiperCell>
      )
    })
  }

  const renderFundsEmpty = () => {}

  useEffect(() => {
    requestFundList()
  }, [])

  return (
    <View className={styles.funds__wrapper}>
      <Text className={styles.funds__label}>已关注基金</Text>
      <Divider height={12} />
      {renderFundList()}
    </View>
  )
}

export default FundsList
