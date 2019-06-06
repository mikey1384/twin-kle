import PropTypes from 'prop-types';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Context from './Context';
import DropdownButton from 'components/Buttons/DropdownButton';
import Likers from 'components/Likers';
import UserListModal from 'components/Modals/UserListModal';
import Replies from './Replies';
import ReplyInputArea from './Replies/ReplyInputArea';
import EditTextArea from 'components/Texts/EditTextArea';
import UsernameText from 'components/Texts/UsernameText';
import ProfilePic from 'components/ProfilePic';
import Button from 'components/Button';
import LikeButton from 'components/Buttons/LikeButton';
import ConfirmModal from 'components/Modals/ConfirmModal';
import LongText from 'components/Texts/LongText';
import RewardStatus from 'components/RewardStatus';
import HiddenComment from 'components/HiddenComment';
import XPRewardInterface from 'components/XPRewardInterface';
import SubjectLink from './SubjectLink';
import Icon from 'components/Icon';
import { Link } from 'react-router-dom';
import { checkIfUserResponded, editContent } from 'helpers/requestHelpers';
import { commentContainer } from './Styles';
import { timeSince } from 'helpers/timeStampHelpers';
import { connect } from 'react-redux';
import { determineXpButtonDisabled, scrollElementToCenter } from 'helpers';

Comment.propTypes = {
  authLevel: PropTypes.number,
  canDelete: PropTypes.bool,
  canEdit: PropTypes.bool,
  canStar: PropTypes.bool,
  comment: PropTypes.shape({
    content: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    likes: PropTypes.array.isRequired,
    profilePicId: PropTypes.number,
    replies: PropTypes.array,
    replyId: PropTypes.number,
    stars: PropTypes.array,
    targetObj: PropTypes.object,
    targetUserName: PropTypes.string,
    targetUserId: PropTypes.number,
    timeStamp: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    uploader: PropTypes.object.isRequired
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  innerRef: PropTypes.func,
  isPreview: PropTypes.bool,
  pageVisible: PropTypes.bool,
  parent: PropTypes.object,
  userId: PropTypes.number
};

function Comment({
  authLevel,
  canDelete,
  canEdit,
  canStar,
  comment,
  dispatch,
  innerRef,
  isPreview,
  userId,
  pageVisible,
  parent,
  comment: { replies = [], targetObj = {}, likes = [], stars = [], uploader }
}) {
  const {
    onAttachStar,
    onDelete,
    onEditDone,
    onLikeClick,
    onLoadMoreReplies,
    onReplySubmit,
    onRewardCommentEdit
  } = useContext(Context);
  const [onEdit, setOnEdit] = useState(false);
  const [userListModalShown, setUserListModalShown] = useState(false);
  const [confirmModalShown, setConfirmModalShown] = useState(false);
  const [xpRewardInterfaceShown, setXpRewardInterfaceShown] = useState(false);
  const [prevReplies, setPrevReplies] = useState(replies);
  const [replying, setReplying] = useState(false);
  const [secretShown, setSecretShown] = useState(false);

  const ReplyInputAreaRef = useRef(null);
  const ReplyRefs = {};
  const mounted = useRef(true);

  useEffect(() => {
    if (replying && replies.length > prevReplies.length) {
      setReplying(false);
      scrollElementToCenter(ReplyRefs[replies[replies.length - 1].id]);
    }
    setPrevReplies(replies);
  }, [replies]);

  const userIsUploader = uploader.id === userId;
  const userCanEditThis =
    (canEdit || canDelete) && authLevel > uploader.authLevel;
  const editButtonShown = userIsUploader || userCanEditThis;
  const editMenuItems = [];
  if (userIsUploader || canEdit) {
    editMenuItems.push({
      label: 'Edit',
      onClick: () => setOnEdit(true)
    });
  }
  if (userIsUploader || canDelete) {
    editMenuItems.push({
      label: 'Remove',
      onClick: () => setConfirmModalShown(true)
    });
  }
  let userLikedThis = false;
  for (let i = 0; i < likes.length; i++) {
    if (likes[i].id === userId) userLikedThis = true;
  }

  const isCommentForContentSubject =
    parent.type !== 'subject' &&
    !parent.subjectId &&
    targetObj &&
    targetObj.subject;
  const hasSecretAnswer = targetObj?.subject?.secretAnswer;
  const isHidden =
    hasSecretAnswer && !secretShown && targetObj.subject.uploader.id !== userId;

  useEffect(() => {
    mounted.current = true;
    if (mounted.current) {
      if (userId) {
        checkSecretShown();
      } else {
        setSecretShown(false);
      }
    }

    async function checkSecretShown() {
      if (hasSecretAnswer) {
        const { responded } = await checkIfUserResponded(targetObj.subject.id);
        if (mounted.current) {
          setSecretShown(responded);
        }
      }
    }
  }, [pageVisible, userId]);

  return (
    <>
      <div
        style={isPreview ? { cursor: 'pointer' } : {}}
        className={commentContainer}
        ref={innerRef}
      >
        <div className="content-wrapper">
          <aside>
            <ProfilePic
              style={{ height: '5rem', width: '5rem' }}
              userId={uploader.id}
              profilePicId={uploader.profilePicId}
            />
          </aside>
          {editButtonShown && !onEdit && (
            <div className="dropdown-wrapper">
              <DropdownButton
                skeuomorphic
                color="darkerGray"
                direction="left"
                opacity={0.8}
                menuProps={editMenuItems}
              />
            </div>
          )}
          <section>
            <div>
              <UsernameText className="username" user={uploader} />{' '}
              <small className="timestamp">
                <Link to={`/comments/${comment.id}`}>
                  {parent.type === 'user' ? 'messag' : 'comment'}
                  ed {timeSince(comment.timeStamp)}
                </Link>
              </small>
            </div>
            <div>
              {comment.targetUserId &&
                !!comment.replyId &&
                comment.replyId !== parent.id && (
                  <span className="to">
                    to:{' '}
                    <UsernameText
                      user={{
                        username: comment.targetUserName,
                        id: comment.targetUserId
                      }}
                    />
                  </span>
                )}
              {onEdit ? (
                <EditTextArea
                  autoFocus
                  text={comment.content}
                  onCancel={() => setOnEdit(false)}
                  onEditDone={editDone}
                />
              ) : (
                <div>
                  {isCommentForContentSubject && (
                    <SubjectLink subject={targetObj.subject} />
                  )}
                  {isHidden ? (
                    <HiddenComment
                      onClick={() =>
                        window.open(`/subjects/${targetObj.subject.id}`)
                      }
                    />
                  ) : (
                    <LongText className="comment__content">
                      {comment.content}
                    </LongText>
                  )}
                  {!isPreview && !isHidden && (
                    <>
                      <div className="comment__buttons">
                        <LikeButton
                          contentType="comment"
                          contentId={comment.id}
                          onClick={likeClick}
                          liked={userLikedThis}
                        />
                        <Button
                          transparent
                          style={{ marginLeft: '1rem' }}
                          onClick={onReplyButtonClick}
                        >
                          <Icon icon="comment-alt" />
                          <span style={{ marginLeft: '1rem' }}>Reply</span>
                        </Button>
                        {canStar && userCanEditThis && !userIsUploader && (
                          <Button
                            color="pink"
                            style={{ marginLeft: '0.7rem' }}
                            onClick={() => setXpRewardInterfaceShown(true)}
                            disabled={determineXpButtonDisabled({
                              difficulty: determineDifficulty({
                                parent,
                                targetObj
                              }),
                              myId: userId,
                              xpRewardInterfaceShown,
                              stars
                            })}
                          >
                            <Icon icon="certificate" />
                            <span style={{ marginLeft: '0.7rem' }}>
                              {determineXpButtonDisabled({
                                difficulty: determineDifficulty({
                                  parent,
                                  targetObj
                                }),
                                myId: userId,
                                xpRewardInterfaceShown,
                                stars
                              }) || 'Reward'}
                            </span>
                          </Button>
                        )}
                      </div>
                      <Likers
                        className="comment__likes"
                        userId={userId}
                        likes={comment.likes}
                        onLinkClick={() => setUserListModalShown(true)}
                      />
                    </>
                  )}
                </div>
              )}
            </div>
            {xpRewardInterfaceShown && (
              <XPRewardInterface
                difficulty={determineDifficulty({ parent, targetObj })}
                stars={stars}
                contentType="comment"
                contentId={comment.id}
                uploaderId={uploader.id}
                onRewardSubmit={data => {
                  setXpRewardInterfaceShown(false);
                  onAttachStar(data);
                }}
              />
            )}
            {!isPreview && (
              <RewardStatus
                difficulty={determineDifficulty({ parent, targetObj })}
                noMarginForEditButton
                onCommentEdit={onRewardCommentEdit}
                style={{
                  fontSize: '1.5rem',
                  marginTop: comment.likes.length > 0 ? '0.5rem' : '1rem'
                }}
                stars={stars}
                uploaderName={uploader.username}
              />
            )}
            {!isPreview && !(hasSecretAnswer && !secretShown) && (
              <>
                <ReplyInputArea
                  innerRef={ReplyInputAreaRef}
                  style={{
                    marginTop:
                      stars.length > 0 || comment.likes.length > 0
                        ? '0.5rem'
                        : '1rem'
                  }}
                  onSubmit={submitReply}
                  numReplies={replies.length}
                  rootCommentId={comment.commentId}
                  targetCommentId={comment.id}
                />
                <Replies
                  subject={targetObj.subject || {}}
                  userId={userId}
                  replies={replies}
                  comment={comment}
                  parent={parent}
                  onLoadMoreReplies={onLoadMoreReplies}
                  onReplySubmit={onReplySubmit}
                  ReplyRefs={ReplyRefs}
                />
              </>
            )}
          </section>
        </div>
        {userListModalShown && (
          <UserListModal
            onHide={() => setUserListModalShown(false)}
            title="People who liked this comment"
            users={comment.likes}
            description="(You)"
          />
        )}
      </div>
      {confirmModalShown && (
        <ConfirmModal
          onHide={() => setConfirmModalShown(false)}
          title="Remove Comment"
          onConfirm={() => onDelete(comment.id)}
        />
      )}
    </>
  );

  function determineDifficulty({ parent, targetObj }) {
    if (parent.type === 'subject' && parent.difficulty > 0) {
      return parent.difficulty;
    }
    if (parent.rootType === 'subject' && parent.rootObj?.difficulty > 0) {
      return parent.rootObj.difficulty;
    }
    if (parent.type === 'video' || parent.type === 'url') {
      if (targetObj.subject?.difficulty) {
        return targetObj.subject?.difficulty;
      }
      if (parent.difficulty > 0) {
        return 1;
      }
    }
    if (parent.rootType === 'video' || parent.rootType === 'url') {
      if (targetObj.subject?.difficulty) {
        return targetObj.subject?.difficulty;
      }
      if (parent.rootObj?.difficulty > 0) {
        return 1;
      }
    }
    return 0;
  }

  async function editDone(editedComment) {
    await editContent({
      params: { editedComment, contentId: comment.id, type: 'comment' },
      dispatch
    });
    onEditDone({ editedComment, commentId: comment.id });
    setOnEdit(false);
  }

  function likeClick(likes) {
    onLikeClick({ commentId: comment.id, likes });
  }

  function onReplyButtonClick() {
    ReplyInputAreaRef.current.focus();
  }

  async function submitReply(reply) {
    setReplying(true);
    await onReplySubmit(reply);
  }
}

export default connect(
  state => ({
    authLevel: state.UserReducer.authLevel,
    canDelete: state.UserReducer.canDelete,
    canEdit: state.UserReducer.canEdit,
    canStar: state.UserReducer.canStar,
    pageVisible: state.ViewReducer.pageVisible
  }),
  dispatch => ({ dispatch })
)(Comment);
