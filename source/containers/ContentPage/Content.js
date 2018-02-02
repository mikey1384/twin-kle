import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ContentPanel from 'components/ContentPanel'
import { connect } from 'react-redux'
import request from 'axios'
import { URL } from 'constants/URL'
import { auth, handleError } from 'redux/actions/constants'

class Comment extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    userId: PropTypes.number
  }

  state = {
    contentObj: {}
  }

  async componentDidMount() {
    const { match, match: { params: { contentId } } } = this.props
    try {
      const { data } = await request.get(
        `${URL}/content/${match.url
          .split('/')[1]
          .slice(0, -1)}?contentId=${contentId}`
      )
      this.setState({ contentObj: data })
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    const { userId } = this.props
    const { contentObj } = this.state
    return (
      <ContentPanel
        selfLoadingDisabled
        contentObj={contentObj}
        methodObj={{
          onCommentSubmit: () => console.log('comment submit'),
          onReplySubmit: () => console.log('reply submit'),
          onTargetCommentSubmit: () => console.log('target comment submit'),
          onLikeContent: this.onLikeContent,
          onLikeComment: this.onLikeComment,
          onLikeTargetComment: () => console.log('like target comment'),
          onLikeQuestion: this.onLikeQuestion,
          onDeleteContent: () => console.log('delete content'),
          onDeleteComment: () => console.log('delete comment'),
          onEditComment: () => console.log('edit comment'),
          onLoadMoreComments: () => console.log('load more comments'),
          onLoadMoreReplies: () => console.log('load more replies'),
          onShowComments: this.onShowComments,
          onVideoStar: () => console.log('video star')
        }}
        userId={userId}
      />
    )
  }

  onLikeComment = async commentId => {
    const { handleError } = this.props
    try {
      const { data: { likes } } = await request.post(
        `${URL}/content/comment/like`,
        {
          commentId
        },
        auth()
      )
      this.setState(state => ({
        contentObj: {
          ...state.contentObj,
          contentLikers:
            state.contentObj.contentId === commentId
              ? likes
              : state.contentObj.contentLikers,
          childComments: state.contentObj.childComments.map(comment => ({
            ...comment,
            likes: comment.id === commentId ? likes : comment.likes
          }))
        }
      }))
    } catch (error) {
      handleError(error)
    }
  }

  onLikeContent = async() => {
    console.log('on like content')
  }

  onLikeQuestion = async() => {
    const { match: { params: { contentId } }, handleError } = this.props
    try {
      const { data: { likes } } = await request.post(
        `${URL}/content/question/like`,
        {
          contentId
        },
        auth()
      )
      this.setState(state => ({
        contentObj: {
          ...state.contentObj,
          contentLikers: likes
        }
      }))
    } catch (error) {
      handleError(error)
    }
  }

  onShowComments = async({ contentId, isReply, rootType, type }) => {
    try {
      console.log(contentId, isReply, rootType)
    } catch (error) {
      console.error(error)
    }
  }
}

export default connect(
  state => ({
    userId: state.UserReducer.userId
  }),
  dispatch => ({
    handleError: error => handleError(error, dispatch)
  })
)(Comment)
