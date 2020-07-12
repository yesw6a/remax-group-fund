import React, { useState, useEffect } from 'react'
import { View, Text } from 'remax/wechat'
import VanSwiperCell from '@vant/weapp/dist/swipe-cell'
import VanCellGroup from '@vant/weapp/dist/cell-group'
import BigNumber from 'bignumber.js'
import { Toast, Divider } from '@/components'
import { apiListUserFunds } from '@/utils/apis'
import { useRequest } from '@/hooks'

import styles from './style.scss'

function FundsList() {
  const [requestFundList, fundList] = useRequest(apiListUserFunds, { initData: [] })

  const renderFundList = () => {
    return fundList.map(({ code, name, dayGrowth, _id }, index) => (
      <VanSwiperCell key={_id} right-width={65}>
        <VanCellGroup className={styles.item__container}>
          {code}-{name}
        </VanCellGroup>
        <View slot="right" className={styles.item_unfollow__button}>
          取消关注
        </View>
      </VanSwiperCell>
    ))
  }

  const renderFundsEmpty = () => {}

  useEffect(() => {
    requestFundList()
  }, [])

  return (
    <View className={styles.funds__wrapper}>
      <Text className={styles.funds__label}>已关注基金</Text>
      {renderFundList()}
    </View>
  )
}

export default FundsList
