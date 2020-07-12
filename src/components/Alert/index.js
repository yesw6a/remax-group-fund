import React, { Component } from 'react';
import { showModal } from 'remax/wechat'

class Alert extends Component {
  static alert = (title, content, options = {}) => {
    return showModal({
      title,
      content,
      ...options,
    })
  };
}

export default Alert;
