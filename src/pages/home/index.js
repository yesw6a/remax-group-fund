import React, { useEffect } from 'react'
import { View, Text, Image, Button } from 'remax/wechat'
import classNames from 'classnames'
import { apiRankingRate } from '@/utils/apis'
import { useRequest } from '@/hooks'

import styles from './style.scss'
import BigNumber from 'bignumber.js'

const rankingDefault = { rank: '-', nickName: '-', fundName: '-', code: '-', rate: '-' }

export default () => {
  const rankingAttrs = [
    { label: '排名', value: 'rank' },
    { label: '昵称', value: 'nickName' },
    { label: '名称', value: 'fundName' },
    { label: '代码', value: 'code' },
    { label: '收益率', value: 'rate', suffix: '%', formatter: (value) => formatRate(value) },
  ]

  const [requestRankingRate, rankingRateList] = useRequest(apiRankingRate, { initData: [] })

  const formatRate = (value) => {
    return BigNumber(value).div(100).toFixed(2)
  }

  const renderRowItem = () => {
    return rankingRateList.map((item, index) => {
      const rowData = Object.assign({}, rankingDefault, item, { rank: index + 1 })
      return (
        <View
          key={index}
          className={classNames(styles.ranking__container, styles[`ranking__container__${index}`])}
        >
          {rankingAttrs.map(({ value, suffix, formatter }, index2) => (
            <View
              key={index2}
              className={classNames(styles.ranking__container__text, styles[`ranking_${value}`])}
            >
              {formatter ? formatter(rowData[value]) : rowData[value]}
              {suffix}
            </View>
          ))}
        </View>
      )
    })
  }

  const renderRanking = () => {
    return (
      <View className={styles.ranking__wrapper}>
        <View className={styles.ranking_title__wrapper}>
          {rankingAttrs.map(({ label, value }, index) => (
            <View
              key={index}
              className={classNames(styles.ranking_title__text, styles[`ranking_${value}`])}
            >
              {label}
            </View>
          ))}
        </View>
        {renderRowItem()}
      </View>
    )
  }

  useEffect(() => {
    requestRankingRate()
  }, [])

  return <View className={styles.wrapper}>{renderRanking()}</View>
}
