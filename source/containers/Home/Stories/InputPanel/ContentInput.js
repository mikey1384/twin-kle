import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Textarea from 'components/Texts/Textarea'
import Button from 'components/Button'
import { uploadContentAsync } from 'redux/actions/FeedActions'
import { loadVideoPageFromClientSideAsync } from 'redux/actions/VideoActions'
import Input from 'components/Texts/Input'
import { scrollElementToCenter } from 'helpers/domHelpers'
import {
  isValidUrl,
  isValidYoutubeUrl,
  stringIsEmpty,
  addEmoji,
  finalizeEmoji
} from 'helpers/stringHelpers'
import Banner from 'components/Banner'
import { PanelStyle } from './Styles'

class ContentInput extends Component {
  static propTypes = {
    uploadContent: PropTypes.func.isRequired
  }

  state = {
    descriptionFieldsShown: false,
    form: {
      url: '',
      checkedVideo: false,
      title: '',
      description: ''
    },
    urlError: null
  }

  render() {
    const { form, urlError, descriptionFieldsShown } = this.state
    const { url, title } = form
    return (
      <div className={PanelStyle}>
        <p>Share interesting videos or web links</p>
        {urlError && (
          <Banner love style={{ marginBottom: '1rem' }}>
            {urlError}
          </Banner>
        )}
        <Input
          inputRef={ref => {
            this.UrlField = ref
          }}
          style={{ borderColor: !!urlError && 'red' }}
          value={form.url}
          onChange={this.onUrlFieldChange}
          placeholder="Copy the URL address of a website or a YouTube video and paste it here"
          type="text"
        />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <small>YouTube Video:&nbsp;&nbsp;</small>
          <div>
            <input
              style={{ height: '2rem' }}
              onClick={() => {
                this.setState({
                  form: {
                    ...form,
                    checkedVideo: !form.checkedVideo
                  },
                  urlError: null
                })
              }}
              checked={form.checkedVideo}
              type="checkbox"
            />
          </div>
        </div>
        {descriptionFieldsShown && (
          <div style={{ marginTop: '0.5rem' }}>
            <div style={{ position: 'relative' }}>
              <Input
                value={form.title}
                onChange={text =>
                  this.setState({ form: { ...form, title: text } })
                }
                placeholder="Enter Title"
                onKeyUp={event => {
                  if (event.key === ' ') {
                    this.setState({
                      form: {
                        ...this.state.form,
                        title: addEmoji(event.target.value)
                      }
                    })
                  }
                }}
                type="text"
              />
              <Textarea
                style={{ marginTop: '1rem' }}
                value={form.description}
                minRows={4}
                placeholder="Enter Description (Optional, you don't need to write this)"
                onChange={event =>
                  this.setState({
                    form: { ...form, description: event.target.value }
                  })
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
            </div>
            <div className="button-container">
              <Button
                type="submit"
                filled
                success
                style={{ marginTop: '1rem' }}
                disabled={stringIsEmpty(url) || stringIsEmpty(title)}
                onClick={this.onSubmit}
              >
                Share!
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  onSubmit = event => {
    const { uploadContent } = this.props
    const { form } = this.state
    const { url, checkedVideo } = form
    let urlError
    event.preventDefault()

    if (!isValidUrl(url)) urlError = 'That is not a valid url'
    if (checkedVideo && !isValidYoutubeUrl(url)) {
      urlError = 'That is not a valid YouTube url'
    }

    if (urlError) {
      this.setState({ urlError })
      this.UrlField.focus()
      return scrollElementToCenter(this.UrlField)
    }

    this.setState({
      descriptionFieldsShown: false,
      form: {
        url: '',
        checkedVideo: false,
        title: '',
        description: ''
      },
      urlError: null
    })
    uploadContent({
      ...form,
      title: finalizeEmoji(form.title),
      description: finalizeEmoji(form.description)
    })
    document.getElementById('react-view').scrollTop = 0
  }

  onUrlFieldChange = url => {
    const { form } = this.state
    this.setState({
      form: {
        ...form,
        url,
        checkedVideo: isValidYoutubeUrl(url) || form.checkedVideo
      },
      urlError: null,
      descriptionFieldsShown: true
    })
  }
}

export default connect(
  state => ({
    username: state.UserReducer.username
  }),
  {
    loadVideoPage: loadVideoPageFromClientSideAsync,
    uploadContent: uploadContentAsync
  }
)(ContentInput)
