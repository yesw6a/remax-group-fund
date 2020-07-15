import React, { useEffect } from 'react'
import { View, Text, Image, Button } from 'remax/wechat'
import classNames from 'classnames'
import { apiRankingRate } from '@/utils/apis'
import { useRequest } from '@/hooks'

import styles from './style.scss'

const rankingAttrs = [
  { label: '排名', value: 'rank' },
  { label: '昵称', value: 'nickname' },
  { label: '名称', value: 'fundName' },
  { label: '代码', value: 'code' },
  { label: '收益率', value: 'rate', suffix: '%' },
]
const rankingDefault = { rank: '-', nickname: '-', fundName: '-', code: '-', rate: '-' }

export default () => {
  const [requestRankingRate, rankingRateList] = useRequest(apiRankingRate)

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
        {Array(10)
          .fill(rankingDefault)
          .map((item, index) => (
            <View key={index} className={styles.ranking__container}>
              {rankingAttrs.map(({ value, suffix }, index2) => (
                <View
                  key={index2}
                  className={classNames(
                    styles.ranking__container__text,
                    styles[`ranking_${value}`]
                  )}
                >
                  {item[value]}
                  {suffix}
                </View>
              ))}
            </View>
          ))}
      </View>
    )
  }

  useEffect(() => {
    requestRankingRate()
  }, [])

  return <View className={styles.wrapper}>{renderRanking()}</View>
}
