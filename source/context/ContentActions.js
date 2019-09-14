export default function ContentActions(dispatch) {
  return {
    onAddTags({ tags, contentType, contentId }) {
      return dispatch({
        type: 'ADD_TAGS',
        tags,
        contentType,
        contentId: Number(contentId)
      });
    },
    onAddTagToContents({ contentIds, contentType, tagId, tagTitle }) {
      return dispatch({
        type: 'ADD_TAG_TO_CONTENTS',
        contentIds,
        contentType,
        tagId,
        tagTitle
      });
    },
    onAttachStar(data) {
      return dispatch({
        type: 'ATTACH_STAR',
        data,
        contentId: data.contentId,
        contentType: data.contentType
      });
    },
    onChangeSpoilerStatus({ shown, subjectId }) {
      return dispatch({
        type: 'CHANGE_SPOILER_STATUS',
        shown,
        contentId: subjectId,
        contentType: 'subject'
      });
    },
    onDeleteComment(commentId) {
      return dispatch({
        type: 'DELETE_COMMENT',
        commentId
      });
    },
    onDeleteSubject(subjectId) {
      return dispatch({
        type: 'DELETE_SUBJECT',
        subjectId
      });
    },
    onEditComment({ commentId, editedComment }) {
      return dispatch({
        type: 'EDIT_COMMENT',
        commentId,
        editedComment
      });
    },
    onEditContent({ data }) {
      return dispatch({
        type: 'EDIT_CONTENT',
        data
      });
    },
    onEditRewardComment({ id, text }) {
      return dispatch({
        type: 'EDIT_REWARD_COMMENT',
        id,
        text
      });
    },
    onEditSubject({ editedSubject, subjectId }) {
      return dispatch({
        type: 'EDIT_SUBJECT',
        editedSubject,
        subjectId
      });
    },
    onInitContent({ contentId, contentType, ...data }) {
      return dispatch({
        type: 'INIT_CONTENT',
        contentId: Number(contentId),
        contentType,
        data
      });
    },
    onLikeComment({ commentId, likes }) {
      return dispatch({
        type: 'LIKE_COMMENT',
        commentId,
        likes
      });
    },
    onLikeContent({ likes, contentType, contentId }) {
      return dispatch({
        type: 'LIKE_CONTENT',
        likes,
        contentType,
        contentId: Number(contentId)
      });
    },
    onLoadComments({ comments, loadMoreButton, contentId, contentType }) {
      return dispatch({
        type: 'LOAD_COMMENTS',
        comments,
        loadMoreButton,
        contentId,
        contentType
      });
    },
    onLoadMoreComments({ comments, loadMoreButton, contentId, contentType }) {
      return dispatch({
        type: 'LOAD_MORE_COMMENTS',
        comments,
        loadMoreButton,
        contentId,
        contentType
      });
    },
    onLoadMoreReplies({
      commentId,
      replies,
      loadMoreButton,
      contentType,
      contentId
    }) {
      return dispatch({
        type: 'LOAD_MORE_REPLIES',
        commentId,
        replies,
        loadMoreButton,
        contentType,
        contentId
      });
    },
    onLoadMoreSubjectComments({
      comments,
      loadMoreButton,
      contentId,
      contentType,
      subjectId
    }) {
      return dispatch({
        type: 'LOAD_MORE_SUBJECT_COMMENTS',
        comments,
        loadMoreButton,
        subjectId,
        contentId,
        contentType
      });
    },
    onLoadMoreSubjectReplies({
      commentId,
      loadMoreButton,
      replies,
      contentId,
      contentType
    }) {
      return dispatch({
        type: 'LOAD_MORE_SUBJECT_REPLIES',
        commentId,
        loadMoreButton,
        replies,
        contentId,
        contentType
      });
    },
    onLoadMoreSubjects({ results, loadMoreButton, contentId, contentType }) {
      return dispatch({
        type: 'LOAD_MORE_SUBJECTS',
        results,
        loadMoreButton,
        contentId,
        contentType
      });
    },
    onLoadRepliesOfReply({
      replies,
      commentId,
      replyId,
      contentType,
      contentId
    }) {
      return dispatch({
        type: 'LOAD_REPLIES_OF_REPLY',
        replies,
        commentId,
        replyId,
        contentType,
        contentId
      });
    },
    onLoadSubjectComments({
      comments,
      loadMoreButton,
      subjectId,
      contentType,
      contentId
    }) {
      return dispatch({
        type: 'LOAD_SUBJECT_COMMENTS',
        comments,
        loadMoreButton,
        subjectId,
        contentType,
        contentId
      });
    },
    onLoadTags({ contentType, contentId, tags }) {
      return dispatch({
        type: 'LOAD_TAGS',
        contentId,
        contentType,
        tags
      });
    },
    onSetByUserStatus({ byUser, contentId, contentType }) {
      return dispatch({
        type: 'SET_BY_USER_STATUS',
        byUser,
        contentId,
        contentType
      });
    },
    onSetCommentsShown({ contentId, contentType }) {
      return dispatch({
        type: 'SET_COMMENTS_SHOWN',
        contentId,
        contentType
      });
    },
    onSetRewardLevel({ rewardLevel, contentType, contentId }) {
      return dispatch({
        type: 'SET_REWARD_LEVEL',
        rewardLevel,
        contentType,
        contentId
      });
    },
    onSetSubjectRewardLevel({ contentId, contentType, rewardLevel }) {
      return dispatch({
        type: 'SET_SUBJECT_REWARD_LEVEL',
        rewardLevel,
        contentId: Number(contentId),
        contentType
      });
    },
    onSetVideoQuestions({ questions, contentType, contentId }) {
      return dispatch({
        type: 'SET_VIDEO_QUESTIONS',
        questions,
        contentType,
        contentId
      });
    },
    onShowTCReplyInput({ contentId, contentType }) {
      return dispatch({
        type: 'SHOW_TC_REPLY_INPUT',
        contentId,
        contentType
      });
    },
    onUploadComment({ contentId, contentType, ...data }) {
      return dispatch({
        type: 'UPLOAD_COMMENT',
        data,
        contentId,
        contentType
      });
    },
    onUploadReply({ contentId, contentType, ...data }) {
      return dispatch({
        type: 'UPLOAD_REPLY',
        data,
        contentId,
        contentType
      });
    },
    onUploadSubject({ contentType, contentId, ...subject }) {
      return dispatch({
        type: 'UPLOAD_SUBJECT',
        subject,
        contentId,
        contentType
      });
    },
    onUploadTargetComment({ contentType, contentId, ...data }) {
      return dispatch({
        type: 'UPLOAD_TARGET_COMMENT',
        data,
        contentType,
        contentId
      });
    }
  };
}
