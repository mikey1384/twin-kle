import PropTypes from 'prop-types'
import React, { Component } from 'react'
import InputForm from 'components/Texts/InputForm'
import { scrollElementToCenter } from 'helpers/domHelpers'

export default class CommentInputArea extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    inputTypeLabel: PropTypes.string,
    innerRef: PropTypes.func,
    clickListenerState: PropTypes.bool,
    autoFocus: PropTypes.bool,
    style: PropTypes.object
  }

  componentDidMount() {
    const { autoFocus } = this.props
    if (autoFocus) {
      setTimeout(() => scrollElementToCenter(this.InputForm), 200)
    }
  }

  render() {
    const {
      onSubmit,
      inputTypeLabel,
      clickListenerState,
      autoFocus,
      innerRef,
      style
    } = this.props
    return (
      <div
        style={{ ...style, position: 'relative' }}
        ref={ref => {
          this.InputForm = ref
        }}
      >
        <InputForm
          innerRef={innerRef}
          clickListenerState={clickListenerState}
          autoFocus={autoFocus}
          onSubmit={onSubmit}
          rows={4}
          placeholder={`Enter your ${inputTypeLabel} here...`}
        />
      </div>
    )
  }
}
