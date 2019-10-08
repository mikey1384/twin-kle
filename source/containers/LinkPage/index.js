import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Embedly from 'components/Embedly';
import Comments from 'components/Comments';
import Subjects from 'components/Subjects';
import LikeButton from 'components/Buttons/LikeButton';
import Likers from 'components/Likers';
import ConfirmModal from 'components/Modals/ConfirmModal';
import UserListModal from 'components/Modals/UserListModal';
import RewardStatus from 'components/RewardStatus';
import XPRewardInterface from 'components/XPRewardInterface';
import Icon from 'components/Icon';
import NotFound from 'components/NotFound';
import Loading from 'components/Loading';
import Description from './Description';
import { css } from 'emotion';
import { Color, mobileMaxWidth } from 'constants/css';
import { determineXpButtonDisabled } from 'helpers';
import { useScrollPosition } from 'helpers/hooks';
import { processedURL } from 'helpers/stringHelpers';
import {
  useAppContext,
  useContentContext,
  useHomeContext,
  useViewContext,
  useExploreContext
} from 'contexts';

LinkPage.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default function LinkPage({
  history,
  location,
  match: {
    params: { linkId: initialLinkId }
  }
}) {
  const linkId = Number(initialLinkId);
  const {
    profile: {
      actions: { onDeleteFeed: onDeleteProfileFeed }
    },
    user: {
      state: { authLevel, canDelete, canEdit, canStar, userId }
    },
    requestHelpers: {
      deleteContent,
      editContent,
      loadComments,
      loadContent,
      loadSubjects
    }
  } = useAppContext();
  const {
    actions: {
      onDeleteLink,
      onEditLinkPage,
      onLikeLink,
      onUpdateNumLinkComments
    }
  } = useExploreContext();
  const {
    actions: { onDeleteFeed: onDeleteHomeFeed }
  } = useHomeContext();
  const {
    state,
    actions: {
      onAttachStar,
      onDeleteComment,
      onDeleteSubject,
      onEditComment,
      onEditContent,
      onEditRewardComment,
      onEditSubject,
      onInitContent,
      onLikeComment,
      onLikeContent,
      onLoadComments,
      onLoadMoreComments,
      onLoadMoreReplies,
      onLoadMoreSubjectComments,
      onLoadMoreSubjectReplies,
      onLoadMoreSubjects,
      onLoadSubjects,
      onLoadSubjectComments,
      onSetRewardLevel,
      onUploadComment,
      onUploadReply,
      onUploadSubject
    }
  } = useContentContext();
  const {
    actions: { onRecordScrollPosition, onSetExploreSubNav },
    state: { scrollPositions }
  } = useViewContext();
  useScrollPosition({
    onRecordScrollPosition,
    pathname: location.pathname,
    scrollPositions
  });
  const [notFound, setNotFound] = useState(false);
  const [confirmModalShown, setConfirmModalShown] = useState(false);
  const [likesModalShown, setLikesModalShown] = useState(false);
  const [xpRewardInterfaceShown, setXpRewardInterfaceShown] = useState(false);
  const mounted = useRef(true);
  const contentState = state['url' + linkId] || {};
  const {
    childComments,
    commentsLoaded,
    commentsLoadMoreButton,
    content,
    description,
    likes = [],
    loaded,
    subjects,
    subjectsLoaded,
    subjectsLoadMoreButton,
    stars,
    timeStamp,
    title,
    uploader,
    ...embedlyProps
  } = contentState;

  useEffect(() => {
    if (!loaded) {
      handleLoadLinkPage();
    }
    if (!commentsLoaded) {
      handleLoadComments();
    }
    if (!subjectsLoaded) {
      handleLoadSubjects();
    }
    async function handleLoadLinkPage() {
      const data = await loadContent({
        contentId: linkId,
        contentType: 'url'
      });
      if (mounted.current) {
        if (data.notFound) return setNotFound(true);
        onInitContent({
          ...data,
          contentId: linkId,
          contentType: 'url'
        });
      }
    }
    async function handleLoadComments() {
      const { comments: loadedComments, loadMoreButton } = await loadComments({
        contentType: 'url',
        contentId: linkId
      });
      onLoadComments({
        comments: loadedComments,
        contentId: linkId,
        contentType: 'url',
        loadMoreButton
      });
    }
    async function handleLoadSubjects() {
      const { results, loadMoreButton } = await loadSubjects({
        contentType: 'url',
        contentId: linkId
      });
      onLoadSubjects({
        contentId: linkId,
        contentType: 'url',
        subjects: results,
        loadMoreButton
      });
    }
    return function cleanUp() {
      mounted.current = false;
    };
  }, [location.pathname]);

  let userLikedThis = false;
  for (let i = 0; i < likes.length; i++) {
    if (likes[i].id === userId) userLikedThis = true;
  }
  const userCanEditThis =
    (canEdit || canDelete) && authLevel > uploader?.authLevel;
  const userIsUploader = uploader?.id === userId;

  return loaded ? (
    <div
      className={css`
        margin-top: 1rem;
        @media (max-width: ${mobileMaxWidth}) {
          margin-top: 0;
        }
      `}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        fontSize: '1.7rem',
        paddingBottom: '10rem'
      }}
    >
      <div
        className={css`
          width: 60%;
          background-color: #fff;
          border: 1px solid ${Color.borderGray()};
          padding-bottom: 1rem;
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
          }
        `}
      >
        <Description
          key={'description' + linkId}
          content={content}
          uploader={uploader}
          timeStamp={timeStamp}
          myId={userId}
          title={title}
          url={content}
          userCanEditThis={userCanEditThis}
          description={description}
          linkId={linkId}
          onDelete={() => setConfirmModalShown(true)}
          onEditDone={handleEditLinkPage}
          userIsUploader={userIsUploader}
        />
        <Embedly
          key={'link' + linkId}
          title={title}
          style={{ marginTop: '2rem' }}
          contentId={linkId}
          url={content}
          loadingHeight="30rem"
          {...embedlyProps}
        />
        <RewardStatus
          contentType="url"
          onCommentEdit={onEditRewardComment}
          style={{
            marginLeft: -1,
            marginRight: -1,
            fontSize: '1.4rem'
          }}
          stars={stars}
        />
        <div
          style={{
            paddingTop: '1.5rem',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex' }}>
            <LikeButton
              key={'like' + linkId}
              filled
              style={{ fontSize: '2rem' }}
              contentType="url"
              contentId={linkId}
              onClick={handleLikeLink}
              liked={userLikedThis}
            />
            {canStar && userCanEditThis && !userIsUploader && (
              <Button
                color="pink"
                filled
                disabled={determineXpButtonDisabled({
                  myId: userId,
                  xpRewardInterfaceShown,
                  stars
                })}
                style={{
                  fontSize: '2rem',
                  marginLeft: '1rem'
                }}
                onClick={() => setXpRewardInterfaceShown(true)}
              >
                <Icon icon="certificate" />
                <span style={{ marginLeft: '0.7rem' }}>
                  {determineXpButtonDisabled({
                    myId: userId,
                    xpRewardInterfaceShown,
                    stars
                  }) || 'Reward'}
                </span>
              </Button>
            )}
          </div>
          <Likers
            key={'likes' + linkId}
            style={{ marginTop: '0.5rem', fontSize: '1.3rem' }}
            likes={likes}
            userId={userId}
            onLinkClick={() => setLikesModalShown(true)}
          />
        </div>
        {xpRewardInterfaceShown && (
          <div style={{ padding: '0 1rem' }}>
            <XPRewardInterface
              stars={stars}
              contentType="url"
              contentId={linkId}
              noPadding
              uploaderId={uploader.id}
              onRewardSubmit={data => {
                setXpRewardInterfaceShown(false);
                onAttachStar({ data, contentId: linkId, contentType: 'url' });
              }}
            />
          </div>
        )}
      </div>
      <Subjects
        className={css`
          width: 60%;
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
          }
        `}
        contentId={linkId}
        loadMoreButton={subjectsLoadMoreButton}
        subjects={subjects}
        onLoadMoreSubjects={onLoadMoreSubjects}
        onLoadSubjectComments={onLoadSubjectComments}
        onSubjectEditDone={onEditSubject}
        onSubjectDelete={onDeleteSubject}
        onSetRewardLevel={onSetRewardLevel}
        uploadSubject={onUploadSubject}
        contentType="url"
        commentActions={{
          attachStar: onAttachStar,
          editRewardComment: onEditRewardComment,
          onDelete: handleDeleteComment,
          onEditDone: onEditComment,
          onLikeClick: onLikeComment,
          onLoadMoreComments: onLoadMoreSubjectComments,
          onLoadMoreReplies: onLoadMoreSubjectReplies,
          onUploadComment: handleUploadComment,
          onUploadReply: handleUploadReply
        }}
      />
      <Comments
        autoExpand
        comments={childComments}
        inputTypeLabel="comment"
        key={'comments' + linkId}
        loadMoreButton={commentsLoadMoreButton}
        onAttachStar={onAttachStar}
        onCommentSubmit={handleUploadComment}
        onDelete={handleDeleteComment}
        onEditDone={onEditComment}
        onLikeClick={onLikeComment}
        onLoadMoreComments={onLoadMoreComments}
        onLoadMoreReplies={onLoadMoreReplies}
        onReplySubmit={handleUploadReply}
        onRewardCommentEdit={onEditRewardComment}
        parent={{ contentType: 'url', id: linkId }}
        className={css`
          border: 1px solid ${Color.borderGray()};
          padding: 1rem;
          width: 60%;
          background: #fff;
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
          }
        `}
        userId={userId}
      />
      {confirmModalShown && (
        <ConfirmModal
          key={'confirm' + linkId}
          title="Remove Link"
          onConfirm={handleDeleteLink}
          onHide={() => setConfirmModalShown(false)}
        />
      )}
      {likesModalShown && (
        <UserListModal
          key={'userlist' + linkId}
          users={likes}
          userId={userId}
          title="People who liked this"
          description="(You)"
          onHide={() => setLikesModalShown(false)}
        />
      )}
    </div>
  ) : notFound ? (
    <NotFound />
  ) : (
    <Loading text="Loading Page..." />
  );

  async function handleDeleteLink() {
    await deleteContent({ id: linkId, contentType: 'url' });
    onDeleteLink(linkId);
    onDeleteHomeFeed({ contentType: 'url', contentId: linkId });
    onDeleteProfileFeed({ contentType: 'url', contentId: linkId });
    onSetExploreSubNav('');
    history.push('/links');
  }

  function handleDeleteComment(data) {
    onDeleteComment(data);
    onUpdateNumLinkComments({
      id: linkId,
      updateType: 'decrease'
    });
  }

  async function handleEditLinkPage(params) {
    await editContent(params);
    const {
      contentId,
      editedTitle: title,
      editedDescription: description,
      editedUrl: content
    } = params;
    onEditContent({
      data: {
        content: processedURL(content),
        title,
        description
      },
      contentType: 'url',
      contentId
    });
    onEditLinkPage({
      id: linkId,
      title,
      content: processedURL(content)
    });
  }

  function handleLikeLink(likes) {
    onLikeContent({ likes, contentType: 'url', contentId: linkId });
    onLikeLink({ likes, id: linkId });
  }

  function handleUploadComment(params) {
    onUploadComment(params);
    onUpdateNumLinkComments({
      id: linkId,
      updateType: 'increase'
    });
  }

  function handleUploadReply(data) {
    onUploadReply(data);
    onUpdateNumLinkComments({
      id: linkId,
      updateType: 'increase'
    });
  }
}
