import React from 'react'
import PropTypes from 'prop-types'
import { View, Text } from 'remax/wechat'

function Component({ height, color, autoTrans }) {
  const finalHeight = autoTrans ? height : `${height}px`
  return (
    <View style={{ height: finalHeight, backgroundColor: color }}>
      <Text style={{ opacity: 0 }}>分割</Text>
    </View>
  )
}
Component.propTypes = {
  height: PropTypes.number,
  color: PropTypes.string,
  autoTrans: PropTypes.bool,
}

Component.defaultProps = {
  color: 'transparent',
  autoTrans: true,
}

export default Component
