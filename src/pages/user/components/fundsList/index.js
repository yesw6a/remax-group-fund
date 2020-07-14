import React, { useState, useEffect, useRef } from 'react'
import { View, Text } from 'remax/wechat'
import BigNumber from 'bignumber.js'
import VanSwiperCell from '@vant/weapp/dist/swipe-cell'
import VanDialog from '@vant/weapp/dist/dialog'
import { Alert, Toast, Divider, TextInput } from '@/components'
import { apiDeleteUserFund, apiUpdateUserRate } from '@/utils/apis'
import { transformRpx } from '@/utils/scalePx'

import styles from './style.scss'

function FundsList({ fundList, onRefresh }) {
  const modalUpdateRateInputRef = useRef()

  const [isVisibleModalUpdateRate, setIsVisibleModalUpdateRate] = useState(false)
  const [chooseFund, setChooseFund] = useState({})

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

  const handleUpdateRate = (code, name, userRate) => {
    setChooseFund({ code, name, userRate })
    setIsVisibleModalUpdateRate(true)
  }

  const onUpdateRate = (code) => {
    const value = modalUpdateRateInputRef.current.getValue()
    if (!value || isNaN(Number(value))) {
      Toast.showInfo('收益率只能为数字')
      return
    }
    const rate = BigNumber(value).times(100).toFixed(2)
    Toast.showLoading()
    apiUpdateUserRate({ code, rate }).then(() => {
      Toast.showSuccess('更新成功')
      onRefresh()
    })
  }

  const renderModalUpdateRate = () => {
    const { code, name, userRate } = chooseFund
    return (
      <VanDialog
        use-slot
        show={isVisibleModalUpdateRate}
        title={name}
        show-cancel-button
        confirm-button-text="修改"
        bind:confirm={() => onUpdateRate(code)}
        bind:close={() => setIsVisibleModalUpdateRate(false)}
      >
        <TextInput
          ref={modalUpdateRateInputRef}
          className={styles.modal_update_rate__input}
          defaultValue={userRate}
          placeholder="请输入该基金当前收益率"
          debounced
          type="number"
        />
      </VanDialog>
    )
  }

  const renderFundList = () => {
    return fundList.map(({ _id, code, name, dayGrowth, rateUser }, index) => {
      const userRate = BigNumber(rateUser).div(100).toString()
      const style = Object.assign({}, index === 0 && { borderTopWidth: 0 })
      return (
        <VanSwiperCell key={_id} right-width={transformRpx(260)}>
          <View className={styles.item__container} style={style}>
            <View className={styles.fund_info}>
              <Text className={styles.fund_name}>{name}</Text>
              <Text className={styles.fund_code}>{code}</Text>
            </View>
            <View className={styles.fund_user_rate}>收益率：{userRate}%</View>
          </View>
          <View slot="right" className={styles.item_right__buttons}>
            <View
              className={styles.item_update_rate__button}
              onClick={() => handleUpdateRate(code, name, userRate)}
            >
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
      <View className={styles.fund_list__wrapper}>{renderFundList()}</View>
      {renderModalUpdateRate()}
    </View>
  )
}

export default FundsList
