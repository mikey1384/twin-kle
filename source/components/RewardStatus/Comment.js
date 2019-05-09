import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ProfilePic from 'components/ProfilePic';
import UsernameText from 'components/Texts/UsernameText';
import { css } from 'emotion';
import { Color } from 'constants/css';
import LongText from 'components/Texts/LongText';
import EditTextArea from 'components/Texts/EditTextArea';
import DropdownButton from 'components/Buttons/DropdownButton';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import request from 'axios';
import { timeSince } from 'helpers/timeStampHelpers';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { auth, handleError } from 'helpers/requestHelpers';
import { connect } from 'react-redux';
import URL from 'constants/URL';

const API_URL = `${URL}/user`;

Comment.propTypes = {
  authLevel: PropTypes.number,
  canEdit: PropTypes.bool,
  handleError: PropTypes.func.isRequired,
  maxRewardableStars: PropTypes.number.isRequired,
  myId: PropTypes.number,
  noMarginForEditButton: PropTypes.bool,
  onEditDone: PropTypes.func,
  star: PropTypes.object.isRequired
};

function Comment({
  authLevel,
  canEdit,
  handleError,
  maxRewardableStars,
  myId,
  noMarginForEditButton,
  onEditDone = () => {},
  star
}) {
  const [onEdit, setOnEdit] = useState(false);
  const userIsUploader = star.rewarderId === myId;
  const userCanEditThis = canEdit && authLevel > star.rewarderAuthLevel;
  const editButtonShown = userIsUploader || userCanEditThis;
  const editMenuItems = [];
  if (userIsUploader || canEdit) {
    editMenuItems.push({
      label: 'Edit',
      onClick: () => setOnEdit(true)
    });
  }

  return (
    <ErrorBoundary>
      <div
        className={css`
          padding: 1rem;
          ${noMarginForEditButton ? `padding-right: 0;` : ''} display: flex;
          align-items: space-between;
        `}
      >
        <div
          className={css`
            width: 6rem;
          `}
        >
          <ProfilePic
            userId={star.rewarderId}
            profilePicId={star.rewarderProfilePicId}
            style={{ width: '5rem', height: '5rem' }}
          />
        </div>
        <div
          className={css`
            width: 100%;
            margin-left: 0.5rem;
            font-size: 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          `}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent:
                stringIsEmpty(star.rewardComment) && !onEdit && 'center'
            }}
          >
            <div
              style={{
                width: '100%'
              }}
            >
              <UsernameText
                user={{
                  id: star.rewarderId,
                  username: star.rewarderUsername
                }}
                userId={myId}
              />{' '}
              <span
                style={{
                  fontWeight: 'bold',
                  color:
                    star.rewardAmount >= maxRewardableStars
                      ? Color.gold()
                      : star.rewardAmount >= 10
                      ? Color.orange()
                      : star.rewardAmount >= 5
                      ? Color.pink()
                      : Color.logoBlue()
                }}
              >
                rewarded {star.rewardAmount === 1 ? 'a' : star.rewardAmount}{' '}
                Twinkle
                {star.rewardAmount > 1 ? 's' : ''}
              </span>{' '}
              <span style={{ fontSize: '1.2rem', color: Color.gray() }}>
                ({timeSince(star.timeStamp)})
              </span>
            </div>
            <div
              style={{
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'pre-wrap',
                overflowWrap: 'break-word',
                wordBreak: 'break-word'
              }}
            >
              {!onEdit && <LongText>{star.rewardComment}</LongText>}
              {onEdit && (
                <EditTextArea
                  allowEmptyText
                  autoFocus
                  rows={3}
                  text={star.rewardComment}
                  onCancel={() => setOnEdit(false)}
                  onEditDone={submitEdit}
                />
              )}
            </div>
          </div>
          {editButtonShown && !onEdit && (
            <DropdownButton
              skeuomorphic
              color="darkerGray"
              direction="left"
              menuProps={editMenuItems}
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );

  async function submitEdit(editedComment) {
    try {
      await request.put(
        `${API_URL}/reward`,
        { editedComment, contentId: star.id },
        auth()
      );
      onEditDone({ id: star.id, text: editedComment });
      setOnEdit(false);
    } catch (error) {
      handleError(error);
    }
  }
}

export default connect(
  state => ({
    canEdit: state.UserReducer.canEdit,
    authLevel: state.UserReducer.authLevel
  }),
  dispatch => ({
    handleError: error => handleError(error, dispatch)
  })
)(Comment);
