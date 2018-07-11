import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Context from './Context'
import ErrorBoundary from 'components/Wrappers/ErrorBoundary'
import withContext from 'components/Wrappers/withContext'
import Heading from './Heading'
import Body from './Body'
import Loading from 'components/Loading'
import { container } from './Styles'

class ContentPanel extends Component {
  static propTypes = {
    autoShowComments: PropTypes.bool,
    contentObj: PropTypes.object.isRequired,
    inputAtBottom: PropTypes.bool,
    selfLoadingDisabled: PropTypes.bool,
    userId: PropTypes.number,
    onAttachStar: PropTypes.func.isRequired,
    onCommentSubmit: PropTypes.func.isRequired,
    onDeleteComment: PropTypes.func.isRequired,
    onDeleteContent: PropTypes.func.isRequired,
    onEditComment: PropTypes.func.isRequired,
    onEditContent: PropTypes.func.isRequired,
    onEditRewardComment: PropTypes.func.isRequired,
    onLikeComment: PropTypes.func.isRequired,
    onLikeTargetComment: PropTypes.func.isRequired,
    onLikeContent: PropTypes.func.isRequired,
    onLikeQuestion: PropTypes.func.isRequired,
    onLoadContent: PropTypes.func,
    onLoadMoreComments: PropTypes.func.isRequired,
    onLoadMoreReplies: PropTypes.func.isRequired,
    onShowComments: PropTypes.func.isRequired,
    onStarVideo: PropTypes.func,
    onTargetCommentSubmit: PropTypes.func.isRequired
  }

  state = {
    attachedVideoShown: false,
    feedLoaded: false
  }

  componentDidMount() {
    const { contentObj, onLoadContent, selfLoadingDisabled } = this.props
    const { feedLoaded } = this.state
    if (!feedLoaded && !selfLoadingDisabled && !contentObj.newPost) {
      this.setState({ feedLoaded: true })
      onLoadContent()
    }
  }

  render() {
    const {
      autoShowComments,
      contentObj,
      inputAtBottom,
      onAttachStar,
      onCommentSubmit,
      onDeleteComment,
      onDeleteContent,
      onEditComment,
      onEditContent,
      onEditRewardComment,
      onLikeComment,
      onLikeTargetComment,
      onLikeContent,
      onLikeQuestion,
      onLoadMoreComments,
      onLoadMoreReplies,
      onShowComments,
      onStarVideo,
      onTargetCommentSubmit,
      userId
    } = this.props
    const { attachedVideoShown } = this.state
    return (
      <Context.Provider
        value={{
          onAttachStar,
          onCommentSubmit,
          onDeleteComment,
          onDeleteContent,
          onEditComment,
          onEditContent,
          onEditRewardComment,
          onLikeComment,
          onLikeTargetComment,
          onLikeContent,
          onLikeQuestion,
          onLoadMoreComments,
          onLoadMoreReplies,
          onShowComments,
          onStarVideo,
          onTargetCommentSubmit
        }}
      >
        <div
          className={container}
          style={{ height: !contentObj.loaded && '15rem' }}
        >
          {!contentObj.loaded && <Loading absolute />}
          {contentObj.loaded && (
            <Heading
              contentObj={contentObj}
              myId={userId}
              action={
                contentObj.commentId
                  ? contentObj.targetObj.comment.notFound
                    ? 'replied on'
                    : 'replied to'
                  : contentObj.rootType === 'question'
                    ? 'answered'
                    : 'commented on'
              }
              onPlayVideoClick={() =>
                this.setState({ attachedVideoShown: true })
              }
              attachedVideoShown={attachedVideoShown}
            />
          )}
          <ErrorBoundary>
            <div className="body">
              {contentObj.loaded && (
                <Body
                  autoShowComments={autoShowComments}
                  contentObj={contentObj}
                  inputAtBottom={inputAtBottom}
                  attachedVideoShown={attachedVideoShown}
                  myId={userId}
                />
              )}
            </div>
          </ErrorBoundary>
        </div>
      </Context.Provider>
    )
  }
}

export default withContext({ Component: ContentPanel, Context })
