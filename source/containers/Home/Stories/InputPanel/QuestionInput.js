import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { uploadQuestion } from 'redux/actions/FeedActions'
import Button from 'components/Button'
import Input from 'components/Texts/Input'
import Textarea from 'react-textarea-autosize'
import {
  addEmoji,
  stringIsEmpty,
  finalizeEmoji,
  turnStringIntoQuestion
} from 'helpers/stringHelpers'
import { Color } from 'constants/css'
import { PanelStyle } from './Styles'

const wordLimit = 150

class QuestionInput extends Component {
  static propTypes = {
    uploadQuestion: PropTypes.func.isRequired
  }

  state = {
    question: '',
    description: '',
    descriptionInputShown: false
  }

  render() {
    const { description, descriptionInputShown, question } = this.state
    return (
      <div className={PanelStyle}>
        <p>
          Ask <span style={{ color: Color.green }}>questions</span> to friends
          and teachers in Twinkle
        </p>
        <Input
          className="form-control"
          placeholder="Ask a question (and feel free to answer your own questions)"
          value={question}
          onChange={this.onInputChange}
          style={{
            marginBottom: '0.3rem',
            color: question.length > wordLimit && 'red'
          }}
        />
        <small style={{ color: question.length > wordLimit ? 'red' : null }}>
          {question.length}/{wordLimit} Characters
        </small>
        {descriptionInputShown && (
          <Fragment>
            <Textarea
              className="form-control"
              type="text"
              style={{
                marginTop: '1rem',
                color: question.length > wordLimit && 'red'
              }}
              value={description}
              minRows={4}
              placeholder="Enter Description (Optional, you don't need to write this)"
              onChange={event =>
                this.setState({ description: addEmoji(event.target.value) })
              }
              onKeyUp={event => {
                if (event.key === ' ') {
                  this.setState({
                    form: {
                      ...this.state.form,
                      description: addEmoji(event.target.value)
                    }
                  })
                }
              }}
            />
            <div className="mobile-button">
              <Button
                className="btn btn-primary"
                type="submit"
                style={{ marginTop: '1rem' }}
                onClick={this.onSubmit}
              >
                Ask!
              </Button>
            </div>
          </Fragment>
        )}
      </div>
    )
  }

  onInputChange = text => {
    this.setState({
      question: text,
      descriptionInputShown: text.length > 0
    })
  }

  onSubmit = async event => {
    const { uploadQuestion } = this.props
    const { question, description } = this.state
    event.preventDefault()
    if (stringIsEmpty(question) || question.length > wordLimit) return
    await uploadQuestion({
      question: turnStringIntoQuestion(question),
      description: finalizeEmoji(description)
    })
    this.setState({
      question: '',
      description: '',
      descriptionInputShown: false
    })
  }
}

export default connect(null, { uploadQuestion })(QuestionInput)
