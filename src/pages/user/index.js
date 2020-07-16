import React, { useState, useEffect, useContext, useRef } from 'react'
import { View, Text, Button } from 'remax/wechat'
import BigNumber from 'bignumber.js'
import { Image, TextInput, Toast, Divider } from '@/components'
import VanDialog from '@vant/weapp/dist/dialog'
import { AppContext } from '@/app'
import { apiLogin, apiGetFundDetail, apiAddFund, apiListUserFunds } from '@/utils/apis'
import { isLogin } from '@/utils/helper'
import { useRequest } from '@/hooks'

import styles from './style.scss'
import FundsList from './components/fundsList'

function Index() {
  const { userInfo, setUserInfo } = useContext(AppContext)
  const loginState = isLogin()
  const fundCodeInputRef = useRef()
  const modalFundCurrentRateInputRef = useRef()

  const [requestFundDetail, fundDetail] = useRequest(apiGetFundDetail, { initData: {} })
  const [requestFundList, fundList] = useRequest(apiListUserFunds, { initData: [] })

  const { avatarUrl, nickName } = userInfo || {}

  const [isVisibleModalFundDetail, setIsVisibleModalFundDetail] = useState(false)

  const handleLogin = (e) => {
    apiLogin(e.detail.userInfo).then((res) => {
      setUserInfo(res)
    })
  }

  const handleSearchFund = () => {
    const value = fundCodeInputRef.current.getValue() || '260108'
    if (!value || !value.trim()) {
      // return Toast.showInfo('基金代码不能为空')
    }
    Toast.showLoading('信息加载中')
    requestFundDetail({ code: value }).then((res) => {
      setIsVisibleModalFundDetail(true)
      Toast.hide()
    })
  }

  const handleAddFund = (code) => {
    const value = modalFundCurrentRateInputRef.current.getValue() || '0'
    if (!value || isNaN(Number(value))) {
      return Toast.showInfo('收益率需为数字')
    }
    const rate = BigNumber(value).times(100).dp(2).toNumber()
    Toast.showLoading('正在操作')
    apiAddFund({ code, rate }).then((res) => {
      requestFundList()
    })
  }

  const renderModalFundDetail = () => {
    const { code, name, manager } = fundDetail || {}
    return (
      <VanDialog
        use-slot
        show={isVisibleModalFundDetail}
        title="基金详情"
        show-cancel-button
        confirm-button-text="添加"
        bind:confirm={() => handleAddFund(code)}
        bind:close={() => setIsVisibleModalFundDetail(false)}
      >
        <View className={styles.modal_fund_detail__container}>
          <Text className={styles.modal_fund_detail__text}>基金代码：{code || '-'}</Text>
          <Text className={styles.modal_fund_detail__text}>基金名称：{name || '-'}</Text>
          <Text className={styles.modal_fund_detail__text}>基金经理：{manager || '-'}</Text>
          <View className={styles.modal_fund_detail_input__row}>
            <Text className={styles.modal_fund_detail__text}>当前收益率(%)：</Text>
            <TextInput
              ref={modalFundCurrentRateInputRef}
              className={styles.modal_fund_detail_current_rate__input}
              placeholder="请输入该基金当前收益率"
              debounced
              type="number"
            />
          </View>
        </View>
      </VanDialog>
    )
  }

  const renderUnLogin = () => {
    return (
      <View className={styles.header__wrapper}>
        <Button openType="getUserInfo" onGetUserInfo={handleLogin}>
          登录
        </Button>
      </View>
    )
  }

  const renderAddFund = () => {
    return (
      <View className={styles.fund_add__wrapper}>
        <Text className={styles.fund_add__label}>添加基金</Text>
        <Divider height={12} />
        <View className={styles.fund_add__container}>
          <TextInput
            ref={fundCodeInputRef}
            className={styles.fund_add__input}
            placeholder="请输入基金代码"
            clearable
            debounced
            leftIcon="search"
            confirmType="search"
          />
          <Button className={styles.fund_add__button} onClick={handleSearchFund}>
            搜索
          </Button>
        </View>
      </View>
    )
  }

  const renderUserInfo = () => {
    return (
      <View className={styles.user_info__wrapper}>
        <Image src={avatarUrl} className={styles.user_avatar__img} />
        <Text className={styles.user_name__text}>{nickName}</Text>
        {renderAddFund()}
        {Array.isArray(fundList) && fundList.length > 0 && (
          <FundsList fundList={fundList} onRefresh={requestFundList} />
        )}
        {renderModalFundDetail()}
      </View>
    )
  }

  useEffect(() => {
    requestFundList()
  }, [])

  return <View className={styles.wrapper}>{loginState ? renderUserInfo() : renderUnLogin()}</View>
}

export default Index
