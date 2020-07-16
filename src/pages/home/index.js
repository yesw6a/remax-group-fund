import React, { useEffect } from 'react'
import { View, Text, Image, Button } from 'remax/wechat'
import classNames from 'classnames'
import { apiRankingRate } from '@/utils/apis'
import { useRequest } from '@/hooks'

import styles from './style.scss'

const rankingAttrs = [
  { label: '排名', value: 'rank' },
  { label: '昵称', value: 'nickName' },
  { label: '名称', value: 'fundName' },
  { label: '代码', value: 'code' },
  { label: '收益率', value: 'rate', suffix: '%' },
]
const rankingDefault = { rank: '-', nickName: '-', fundName: '-', code: '-', rate: '-' }

export default () => {
  const [requestRankingRate, rankingRateList] = useRequest(apiRankingRate, { initData: [] })

  const renderRowItem = () => {
    return rankingRateList.map((item, index) => {
      const rowData = Object.assign({}, rankingDefault, item, { rank: index + 1 })
      return (
        <View key={index} className={styles.ranking__container}>
          {rankingAttrs.map(({ value, suffix }, index2) => (
            <View
              key={index2}
              className={classNames(styles.ranking__container__text, styles[`ranking_${value}`])}
            >
              {rowData[value]}
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
          {rankingAttrs.map(({ label, value, suffix }, index) => (
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
