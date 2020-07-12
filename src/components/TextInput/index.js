import React, { useRef, forwardRef, useImperativeHandle } from 'react'
import { View } from 'remax/wechat'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import VanInput from '@vant/weapp/dist/field'

import styles from './style.module.scss'

function TextInputComponent(
  {
    className,
    style,
    labelClassName,
    labelStyle,
    title,
    border, // 是否显示下划线边框
    placeholder,
    type,
    disabled,
    maxLength,
    clearable,
    leftIcon,
    isLink,
    defaultValue,
    confirmType,
    onConfirm,
    onChangeValue,
  },
  ref
) {
  const valueRef = useRef(defaultValue)

  useImperativeHandle(ref, () => ({
    getValue: () => valueRef.current,
  }))

  const onChange = (e) => {
    const val = e.detail.trim()
    valueRef.current = val
    onChangeValue(val)
  }

  return (
    <View style={style} className={classNames(styles.inputWrapper, className)}>
      {title && (
        <View style={labelStyle} className={classNames(styles.label, labelClassName)}>
          {title}
        </View>
      )}
      <VanInput
        value={valueRef.current}
        className={styles.input}
        type={type}
        left-icon={leftIcon}
        border={border}
        placeholder={placeholder}
        disabled={disabled}
        maxlength={maxLength}
        confirm-type={confirmType}
        clearable={clearable}
        is-link={isLink}
        bindchange={onChange}
        bindconfirm={onConfirm}
      />
    </View>
  )
}

const TextInput = forwardRef(TextInputComponent)

TextInput.options = {
  addGlobalClass: true,
}

TextInput.propTypes = {
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  border: PropTypes.bool,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  maxLength: PropTypes.number,
  clearable: PropTypes.bool,
  leftIcon: PropTypes.string,
  isLink: PropTypes.bool,
  confirmType: PropTypes.string,
  onConfirm: PropTypes.func,
  onChangeValue: PropTypes.func,
}

TextInput.defaultProps = {
  defaultValue: '',
  title: '',
  border: false,
  placeholder: '',
  type: 'text',
  disabled: false,
  maxLength: 140,
  clearable: false,
  leftIcon: '',
  isLink: false,
  confirmType: 'done',
  onConfirm: () => {},
  onChangeValue: () => {},
}

export default TextInput
