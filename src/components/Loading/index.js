import React from 'react'
import AtActivityIndicator from '@vant/weapp/dist/loading'

function Indicator({ color, type, size }) {
  return <AtActivityIndicator color={color} type={type} size={size}></AtActivityIndicator>
}

Indicator.defaultProps = {
  color: '#c9c9c9',
  type: 'circular',
  size: '25px',
}

export default Indicator
