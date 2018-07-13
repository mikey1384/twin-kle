import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ContentPanel from 'components/ContentPanel'
import { connect } from 'react-redux'
import request from 'axios'
import Loading from 'components/Loading'
import NotFound from 'components/NotFound'
import { URL } from 'constants/URL'
import { auth, handleError } from 'helpers/requestHelpers'

class Comment extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    userId: PropTypes.number,
    history: PropTypes.object.isRequired
  }

  state = {
    contentObj: {}
  }

  async componentDidMount() {
    const {
      match,
      match: {
        params: { contentId }
      }
    } = this.props
    try {
      const { data } = await request.get(
        `${URL}/content/${match.url
          .split('/')[1]
          .slice(0, -1)}?contentId=${contentId}`
      )
      this.setState({ contentObj: { ...data, loaded: true }, loaded: true })
    } catch (error) {
      console.error(error)
    }
  }

  async componentDidUpdate(prevProps) {
    const {
      match,
      match: {
        params: { contentId }
      }
    } = this.props
    if (prevProps.match.params.contentId !== contentId) {
      try {
        const { data } = await request.get(
          `${URL}/content/${match.url
            .split('/')[1]
            .slice(0, -1)}?contentId=${contentId}`
        )
        this.setState({ contentObj: { ...data, loaded: true } })
      } catch (error) {
        console.error(error)
      }
    }
  }

  render() {
    const { userId } = this.props
    const { contentObj, loaded } = this.state
    return loaded ? (
      contentObj.id ? (
        <ContentPanel
          key={contentObj.contentId}
          selfLoadingDisabled
          autoShowComments
          inputAtBottom={contentObj.type === 'comment'}
          commentsLoadLimit={5}
          contentObj={contentObj}
          userId={userId}
          onAttachStar={this.onAttachStar}
          onCommentSubmit={this.onCommentSubmit}
          onDeleteComment={this.onDeleteComment}
          onDeleteContent={this.onDeleteContent}
          onEditComment={this.onEditComment}
          onEditContent={this.onEditContent}
          onEditRewardComment={this.onEditRewardComment}
          onLikeContent={this.onLikeContent}
          onLoadMoreComments={this.onLoadMoreComments}
          onLoadMoreReplies={this.onLoadMoreReplies}
          onReplySubmit={this.onReplySubmit}
          onShowComments={this.onShowComments}
          onTargetCommentSubmit={this.onTargetCommentSubmit}
        />
      ) : (
        <NotFound />
      )
    ) : (
      <Loading />
    )
  }

  onAttachStar = data => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        stars:
          data.contentId === state.contentObj.contentId &&
          data.contentType === state.contentObj.type
            ? state.contentObj.stars
              ? state.contentObj.stars.concat(data)
              : [data]
            : state.contentObj.stars || [],
        childComments: (state.contentObj.childComments || []).map(comment => {
          return {
            ...comment,
            stars:
              comment.id === data.contentId
                ? (comment.stars || []).concat(data)
                : comment.stars || [],
            replies: comment.replies.map(reply => ({
              ...reply,
              stars:
                reply.id === data.contentId
                  ? (reply.stars || []).concat(data)
                  : reply.stars || []
            }))
          }
        }),
        targetCommentStars:
          (state.contentObj.type === 'comment' &&
            data.contentId === state.contentObj.replyId) ||
          data.contentId === state.contentObj.commentId
            ? (state.contentObj.targetCommentStars || []).concat(data)
            : state.contentObj.targetCommentStars
      }
    }))
  }

  onCommentSubmit = data => {
    const {
      contentObj: { type }
    } = this.state
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        childComments:
          type === 'comment'
            ? (state.contentObj.childComments || []).concat([data])
            : [data].concat(state.contentObj.childComments)
      }
    }))
  }

  onReplySubmit = data => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        childComments: state.contentObj.childComments.map(comment => {
          let match = false
          let commentId = data.replyId || data.commentId
          if (comment.id === commentId) {
            match = true
          } else {
            for (let reply of comment.replies || []) {
              if (reply.id === commentId) {
                match = true
                break
              }
            }
          }
          return {
            ...comment,
            replies: match ? comment.replies.concat([data]) : comment.replies
          }
        })
      }
    }))
  }

  onDeleteComment = commentId => {
    this.setState(state => {
      const comments = (state.contentObj.childComments || []).filter(
        comment => comment.id !== commentId
      )
      return {
        contentObj: {
          ...state.contentObj,
          childComments: comments.map(comment => ({
            ...comment,
            replies: (comment.replies || []).filter(
              reply => reply.id !== commentId
            )
          }))
        }
      }
    })
  }

  onEditComment = ({ editedComment, commentId }) => {
    this.setState(state => {
      const comments = state.contentObj.childComments.map(comment => ({
        ...comment,
        content: comment.id === commentId ? editedComment : comment.content
      }))
      return {
        contentObj: {
          ...state.contentObj,
          childComments: comments.map(comment => ({
            ...comment,
            replies: comment.replies
              ? comment.replies.map(reply => ({
                  ...reply,
                  content:
                    reply.id === commentId ? editedComment : reply.content
                }))
              : []
          }))
        }
      }
    })
  }

  onEditRewardComment = ({ id, text }) => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        stars: state.contentObj.stars
          ? state.contentObj.stars.map(star => ({
              ...star,
              rewardComment: star.id === id ? text : star.rewardComment
            }))
          : [],
        childComments: state.contentObj.childComments
          ? state.contentObj.childComments.map(comment => ({
              ...comment,
              stars: comment.stars
                ? comment.stars.map(star => ({
                    ...star,
                    rewardComment: star.id === id ? text : star.rewardComment
                  }))
                : [],
              replies: comment.replies.map(reply => ({
                ...reply,
                stars: reply.stars
                  ? reply.stars.map(star => ({
                      ...star,
                      rewardComment: star.id === id ? text : star.rewardComment
                    }))
                  : []
              }))
            }))
          : [],
        targetCommentStars: state.contentObj.targetCommentStars
          ? state.contentObj.targetCommentStars.map(star => ({
              ...star,
              rewardComment: star.id === id ? text : star.rewardComment
            }))
          : []
      }
    }))
  }

  onDeleteContent = () => {
    const { history } = this.props
    history.push('/')
  }

  onEditContent = async data => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        ...data,
        contentTitle: data.title,
        contentDescription: data.description
      }
    }))
  }

  onLikeContent = ({ likes, type, contentId }) => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        likes:
          state.contentObj.id === contentId && state.contentObj.type === type
            ? likes
            : state.contentObj.likes,
        childComments:
          type === 'comment'
            ? state.contentObj.childComments.map(comment => ({
                ...comment,
                likes: comment.id === contentId ? likes : comment.likes,
                replies: comment.replies.map(reply => ({
                  ...reply,
                  likes: reply.id === contentId ? likes : reply.likes
                }))
              }))
            : state.contentObj.childComments,
        rootObj: {
          ...state.contentObj.rootObj,
          likes:
            state.contentObj.rootId === contentId &&
            state.contentObj.rootType === type
              ? likes
              : state.contentObj.rootObj.likes
        },
        targetObj: {
          ...state.contentObj.targetObj,
          [type]: state.contentObj.targetObj[type]
            ? {
                ...state.contentObj.targetObj[type],
                likes:
                  state.contentObj.targetObj[type].id === contentId
                    ? likes
                    : state.contentObj.targetObj[type].likes
              }
            : undefined
        }
      }
    }))
  }

  onLoadMoreComments = async({ comments, loadMoreButton }) => {
    const { type } = this.props
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        childComments:
          type === 'comment'
            ? state.contentObj.childComments.concat(comments)
            : comments.concat(state.contentObj.childComments),
        commentsLoadMoreButton: loadMoreButton
      }
    }))
  }

  onLoadMoreReplies = ({ commentId, replies, loadMoreButton }) => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        childComments: state.contentObj.childComments.map(comment => ({
          ...comment,
          replies:
            comment.id === commentId
              ? replies.concat(comment.replies)
              : comment.replies,
          loadMoreButton:
            comment.id === commentId ? loadMoreButton : comment.loadMoreButton
        }))
      }
    }))
  }

  onShowComments = ({ comments, loadMoreButton }) => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        childComments: comments,
        commentsLoadMoreButton: loadMoreButton
      }
    }))
    return Promise.resolve()
  }

  onTargetCommentSubmit = async params => {
    const { handleError } = this.props
    try {
      const { data } = await request.post(
        `${URL}/content/targetContentComment`,
        params,
        auth()
      )
      this.setState(state => ({
        contentObj: {
          ...state.contentObj,
          targetObj: {
            ...state.contentObj.targetObj,
            comment: {
              ...state.contentObj.targetObj.comment,
              comments: [data].concat(
                state.contentObj.targetObj.comment.comments || []
              )
            }
          }
        }
      }))
    } catch (error) {
      handleError(error)
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
