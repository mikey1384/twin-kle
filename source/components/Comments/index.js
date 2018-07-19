import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Context from './Context'
import CommentInputArea from './CommentInputArea'
import Comment from './Comment'
import Button from 'components/Button'
import { scrollElementToCenter } from 'helpers/domHelpers'
import {
  deleteContent,
  loadComments,
  uploadComment
} from 'helpers/requestHelpers'
import { connect } from 'react-redux'

class Comments extends Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    autoShowComments: PropTypes.bool,
    commentsShown: PropTypes.bool,
    comments: PropTypes.array.isRequired,
    commentsLoadLimit: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    inputAreaInnerRef: PropTypes.func,
    inputAtBottom: PropTypes.bool,
    inputTypeLabel: PropTypes.string,
    loadMoreButton: PropTypes.bool.isRequired,
    loadMoreComments: PropTypes.func.isRequired,
    onAttachStar: PropTypes.func.isRequired,
    onCommentSubmit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEditDone: PropTypes.func.isRequired,
    onLikeClick: PropTypes.func.isRequired,
    onLoadMoreReplies: PropTypes.func.isRequired,
    onReplySubmit: PropTypes.func.isRequired,
    onRewardCommentEdit: PropTypes.func.isRequired,
    parent: PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired
    }).isRequired,
    style: PropTypes.object,
    userId: PropTypes.number
  }

  state = {
    isLoading: false,
    commentSubmitted: false
  }

  Comments = {}

  componentDidUpdate(prevProps) {
    const { commentSubmitted } = this.state
    const {
      autoFocus,
      autoShowComments,
      comments,
      commentsShown,
      inputAtBottom
    } = this.props
    if (prevProps.comments.length > comments.length) {
      if (comments.length === 0) {
        return scrollElementToCenter(this.Container)
      }
      if (
        comments[comments.length - 1].id !==
        prevProps.comments[prevProps.comments.length - 1].id
      ) {
        scrollElementToCenter(this.Comments[comments[comments.length - 1].id])
      }
    }
    if (
      inputAtBottom &&
      commentSubmitted &&
      comments.length > prevProps.comments.length &&
      (prevProps.comments.length === 0 ||
        comments[comments.length - 1].id >
          prevProps.comments[prevProps.comments.length - 1].id)
    ) {
      this.setState({ commentSubmitted: false })
      scrollElementToCenter(this.Comments[comments[comments.length - 1].id])
    }
    if (
      !inputAtBottom &&
      commentSubmitted &&
      comments.length > prevProps.comments.length &&
      (prevProps.comments.length === 0 ||
        comments[0].id > prevProps.comments[0].id)
    ) {
      this.setState({ commentSubmitted: false })
      scrollElementToCenter(this.Comments[comments[0].id])
    }

    if (
      !autoShowComments &&
      !prevProps.commentsShown &&
      !commentSubmitted &&
      autoFocus &&
      commentsShown
    ) {
      scrollElementToCenter(this.CommentInputArea)
    }
  }
  render() {
    const {
      autoShowComments,
      loadMoreButton,
      comments = [],
      commentsShown,
      style,
      inputAtBottom,
      onAttachStar,
      onEditDone,
      onLikeClick,
      onLoadMoreReplies,
      onRewardCommentEdit,
      parent,
      userId
    } = this.props
    return (
      <Context.Provider
        value={{
          onAttachStar,
          onDelete: this.onDelete,
          onEditDone,
          onLikeClick,
          onLoadMoreReplies,
          onRewardCommentEdit,
          onReplySubmit: this.onReplySubmit
        }}
      >
        <div
          style={{
            width: '100%',
            ...style
          }}
          ref={ref => {
            this.Container = ref
          }}
        >
          {!inputAtBottom &&
            (commentsShown || autoShowComments) &&
            this.renderInputArea()}
          {(autoShowComments || commentsShown) && (
            <div style={{ width: '100%' }}>
              {inputAtBottom && loadMoreButton && this.renderLoadMoreButton()}
              {comments.map((comment, index) => (
                <Comment
                  index={index}
                  innerRef={ref => {
                    this.Comments[comment.id] = ref
                  }}
                  parent={parent}
                  comment={comment}
                  key={comment.id}
                  userId={userId}
                />
              ))}
              {!inputAtBottom && loadMoreButton && this.renderLoadMoreButton()}
            </div>
          )}
          {inputAtBottom &&
            (commentsShown || autoShowComments) &&
            this.renderInputArea({
              marginTop: comments.length > 0 ? '1rem' : 0
            })}
        </div>
      </Context.Provider>
    )
  }

  onCommentSubmit = async({ content, rootCommentId, targetCommentId }) => {
    const { dispatch, onCommentSubmit, parent } = this.props
    this.setState({ commentSubmitted: true })
    const data = await uploadComment({
      content,
      parent,
      rootCommentId,
      targetCommentId,
      dispatch
    })
    onCommentSubmit(data)
  }

  onReplySubmit = async({ content, rootCommentId, targetCommentId }) => {
    const { dispatch, onReplySubmit, parent } = this.props
    this.setState({ commentSubmitted: true })
    const data = await uploadComment({
      content,
      parent,
      rootCommentId,
      targetCommentId,
      dispatch
    })
    onReplySubmit(data)
  }

  loadMoreComments = async() => {
    const { isLoading } = this.state
    const { commentsLoadLimit, inputAtBottom } = this.props
    if (!isLoading) {
      const { comments, parent, loadMoreComments } = this.props
      this.setState({ isLoading: true })
      const lastCommentLocation = inputAtBottom ? 0 : comments.length - 1
      const lastCommentId = comments[lastCommentLocation]
        ? comments[lastCommentLocation].id
        : 'undefined'
      try {
        const data = await loadComments({
          id: parent.id,
          type: parent.type,
          lastCommentId,
          limit: commentsLoadLimit
        })
        loadMoreComments(data)
        this.setState({ isLoading: false })
      } catch (error) {
        console.error(error.response || error)
      }
    }
  }

  onDelete = async commentId => {
    const { dispatch, onDelete } = this.props
    await deleteContent({ id: commentId, type: 'comment', dispatch })
    onDelete(commentId)
  }

  renderInputArea = style => {
    const { autoFocus, inputAreaInnerRef, inputTypeLabel, parent } = this.props
    return (
      <CommentInputArea
        autoFocus={autoFocus}
        InputFormRef={ref => (this.CommentInputArea = ref)}
        innerRef={inputAreaInnerRef}
        style={style}
        inputTypeLabel={inputTypeLabel}
        onSubmit={this.onCommentSubmit}
        rootCommentId={parent.type === 'comment' ? parent.commentId : null}
        targetCommentId={parent.type === 'comment' ? parent.id : null}
      />
    )
  }

  renderLoadMoreButton = () => {
    const { isLoading } = this.state
    const { inputAtBottom } = this.props
    return (
      <Button
        filled
        info
        disabled={isLoading}
        onClick={this.loadMoreComments}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginTop: inputAtBottom ? 0 : '1rem'
        }}
      >
        Load More
      </Button>
    )
  }
}

export default connect(
  null,
  dispatch => ({ dispatch })
)(Comments)
