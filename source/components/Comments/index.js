import React, { memo, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Context from './Context';
import CommentInputArea from './CommentInputArea';
import Comment from './Comment';
import Button from 'components/Button';
import { scrollElementToCenter } from 'helpers';
import { css } from 'emotion';
import { Color, mobileMaxWidth } from 'constants/css';
import { useAppContext } from 'contexts';

Comments.propTypes = {
  autoExpand: PropTypes.bool,
  autoFocus: PropTypes.bool,
  commentsHidden: PropTypes.bool,
  numPreviews: PropTypes.number,
  className: PropTypes.string,
  commentsShown: PropTypes.bool,
  comments: PropTypes.array.isRequired,
  commentsLoadLimit: PropTypes.number,
  inputAreaInnerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  inputAtBottom: PropTypes.bool,
  inputTypeLabel: PropTypes.string,
  loadMoreButton: PropTypes.bool.isRequired,
  numInputRows: PropTypes.number,
  noInput: PropTypes.bool,
  onAttachStar: PropTypes.func.isRequired,
  onCommentSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEditDone: PropTypes.func.isRequired,
  onLikeClick: PropTypes.func.isRequired,
  onLoadMoreComments: PropTypes.func.isRequired,
  onLoadMoreReplies: PropTypes.func.isRequired,
  onPreviewClick: PropTypes.func,
  onLoadRepliesOfReply: PropTypes.func,
  onReplySubmit: PropTypes.func.isRequired,
  onRewardCommentEdit: PropTypes.func.isRequired,
  parent: PropTypes.shape({
    commentId: PropTypes.number,
    id: PropTypes.number.isRequired,
    contentType: PropTypes.string.isRequired
  }).isRequired,
  style: PropTypes.object,
  userId: PropTypes.number
};

function Comments({
  autoFocus,
  autoExpand,
  comments = [],
  commentsHidden,
  commentsLoadLimit,
  commentsShown,
  className,
  inputAreaInnerRef,
  inputAtBottom,
  inputTypeLabel,
  loadMoreButton,
  noInput,
  numInputRows,
  numPreviews,
  onAttachStar,
  onCommentSubmit,
  onDelete,
  onEditDone,
  onLikeClick,
  onLoadRepliesOfReply,
  onLoadMoreComments,
  onLoadMoreReplies,
  onPreviewClick = () => {},
  onReplySubmit,
  onRewardCommentEdit,
  parent,
  style,
  userId
}) {
  const {
    requestHelpers: { deleteContent, loadComments, uploadComment }
  } = useAppContext();
  const [deleting, setDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const [prevComments, setPrevComments] = useState(comments);
  const ContainerRef = useRef(null);
  const CommentInputAreaRef = useRef(null);
  const CommentRefs = {};

  useEffect(() => {
    if (comments.length < prevComments.length && deleting) {
      setDeleting(false);
      if (comments.length === 0) {
        return scrollElementToCenter(ContainerRef.current);
      }
      if (
        comments[comments.length - 1].id !==
        prevComments[prevComments.length - 1].id
      ) {
        scrollElementToCenter(CommentRefs[comments[comments.length - 1].id]);
      }
    }
    if (
      inputAtBottom &&
      commentSubmitted &&
      comments.length > prevComments.length &&
      (prevComments.length === 0 ||
        comments[comments.length - 1].id >
          prevComments[prevComments.length - 1].id)
    ) {
      setCommentSubmitted(false);
      scrollElementToCenter(CommentRefs[comments[comments.length - 1].id]);
    }
    if (
      !inputAtBottom &&
      commentSubmitted &&
      comments.length > prevComments.length &&
      (prevComments.length === 0 || comments[0].id > prevComments[0].id)
    ) {
      setCommentSubmitted(false);
      scrollElementToCenter(CommentRefs[comments[0].id]);
    }
    setPrevComments(comments);
  }, [comments]);

  useEffect(() => {
    if (!autoExpand && !commentSubmitted && autoFocus && commentsShown) {
      scrollElementToCenter(CommentInputAreaRef.current);
    }
  }, [commentsShown]);
  const previewComments =
    numPreviews > 0 && !commentsShown
      ? comments.filter((comment, index) => index < numPreviews)
      : [];
  return (
    <Context.Provider
      value={{
        onAttachStar,
        onDelete: deleteComment,
        onEditDone,
        onLikeClick,
        onLoadMoreReplies,
        onRewardCommentEdit,
        onReplySubmit: submitReply,
        onLoadRepliesOfReply
      }}
    >
      <div
        className={`${
          previewComments.length > 0
            ? css`
                &:hover {
                  background: ${Color.highlightGray()};
                }
                @media (max-width: ${mobileMaxWidth}) {
                  &:hover {
                    background: #fff;
                  }
                }
              `
            : ''
        } ${className}`}
        style={style}
        ref={ContainerRef}
        onClick={previewComments.length > 0 ? onPreviewClick : () => {}}
      >
        {!inputAtBottom &&
          !noInput &&
          (commentsShown || autoExpand) &&
          renderInputArea()}
        {(commentsShown || autoExpand || numPreviews > 0) && !commentsHidden && (
          <div
            style={{
              width: '100%'
            }}
          >
            {inputAtBottom && loadMoreButton && renderLoadMoreButton()}
            {(previewComments.length > 0 ? previewComments : comments).map(
              (comment, index) => (
                <Comment
                  isPreview={previewComments.length > 0}
                  index={index}
                  innerRef={ref => {
                    CommentRefs[comment.id] = ref;
                  }}
                  parent={parent}
                  comment={comment}
                  key={comment.id}
                  userId={userId}
                />
              )
            )}
            {!inputAtBottom && loadMoreButton && renderLoadMoreButton()}
          </div>
        )}
        {inputAtBottom &&
          !noInput &&
          (commentsShown || autoExpand) &&
          renderInputArea({
            marginTop: comments.length > 0 ? '1rem' : 0
          })}
      </div>
    </Context.Provider>
  );

  async function submitComment({ content, rootCommentId, targetCommentId }) {
    setCommentSubmitted(true);
    const data = await uploadComment({
      content,
      parent,
      rootCommentId,
      targetCommentId
    });
    onCommentSubmit({
      ...data,
      contentId: parent.id,
      contentType: parent.contentType
    });
  }

  async function submitReply({ content, rootCommentId, targetCommentId }) {
    setCommentSubmitted(true);
    const data = await uploadComment({
      content,
      parent,
      rootCommentId,
      targetCommentId
    });
    onReplySubmit({
      ...data,
      contentId: parent.id,
      contentType: parent.contentType
    });
  }

  async function handleLoadMoreComments() {
    if (!isLoading) {
      setIsLoading(true);
      const lastCommentLocation = inputAtBottom ? 0 : comments.length - 1;
      const lastCommentId = comments[lastCommentLocation]
        ? comments[lastCommentLocation].id
        : 'undefined';
      try {
        const data = await loadComments({
          contentId: parent.id,
          contentType: parent.contentType,
          lastCommentId,
          limit: commentsLoadLimit
        });
        onLoadMoreComments({
          ...data,
          contentId: parent.id,
          contentType: parent.contentType
        });
        setIsLoading(false);
      } catch (error) {
        console.error(error.response || error);
      }
    }
  }

  async function deleteComment(commentId) {
    setDeleting(true);
    await deleteContent({ id: commentId, contentType: 'comment' });
    onDelete(commentId);
  }

  function renderInputArea(style) {
    return (
      <CommentInputArea
        autoFocus={autoFocus}
        InputFormRef={CommentInputAreaRef}
        innerRef={inputAreaInnerRef}
        inputTypeLabel={inputTypeLabel}
        numInputRows={numInputRows}
        onSubmit={submitComment}
        parent={parent}
        rootCommentId={
          parent.contentType === 'comment' ? parent.commentId : null
        }
        style={style}
        targetCommentId={parent.contentType === 'comment' ? parent.id : null}
      />
    );
  }

  function renderLoadMoreButton() {
    return autoExpand || commentsShown ? (
      <Button
        filled
        color="lightBlue"
        disabled={isLoading}
        onClick={handleLoadMoreComments}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginTop: inputAtBottom ? 0 : '1rem'
        }}
      >
        Load More
      </Button>
    ) : null;
  }
}

export default memo(Comments);
