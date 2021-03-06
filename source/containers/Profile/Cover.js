import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ProfilePic from 'components/ProfilePic';
import ColorSelector from 'components/ColorSelector';
import Button from 'components/Button';
import AlertModal from 'components/Modals/AlertModal';
import ImageEditModal from 'components/Modals/ImageEditModal';
import ErrorBoundary from 'components/ErrorBoundary';
import { css } from 'emotion';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';
import { MAX_PROFILE_PIC_SIZE } from 'constants/defaultValues';
import { useAppContext, useContentContext } from 'contexts';
import { useMyState } from 'helpers/hooks';

Cover.propTypes = {
  onSelectTheme: PropTypes.func.isRequired,
  onSetTheme: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  selectedTheme: PropTypes.string
};

export default function Cover({
  onSelectTheme,
  onSetTheme,
  profile,
  selectedTheme
}) {
  const {
    requestHelpers: { checkIfUserOnline }
  } = useAppContext();
  const { userId } = useMyState();
  const {
    id,
    profilePicId,
    online,
    profileTheme,
    realName,
    twinkleXP,
    username,
    userType
  } = profile;
  const {
    actions: { onSetOnline }
  } = useContentContext();
  const [alertModalShown, setAlertModalShown] = useState(false);
  const [colorSelectorShown, setColorSelectorShown] = useState(false);
  const [imageEditModalShown, setImageEditModalShown] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const FileInputRef = useRef(null);

  useEffect(() => {
    onSelectTheme(profileTheme || 'logoBlue');
    if (id !== userId) {
      handleCheckIfUserOnline();
    }
    async function handleCheckIfUserOnline() {
      const online = await checkIfUserOnline(id);
      onSetOnline({ contentId: id, contentType: 'user', online });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ErrorBoundary>
      <div
        style={{
          color: '#fff',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
          backgroundColor: Color[selectedTheme || profileTheme || 'logoBlue']()
        }}
        className={css`
          height: 26rem;
          margin-top: -1rem;
          display: flex;
          justify-content: space-between;
          width: 100%;
          position: relative;
          @media (max-width: ${mobileMaxWidth}) {
            height: 12rem;
          }
        `}
      >
        <div
          className={css`
            margin-left: 29rem;
            font-size: 5rem;
            padding-top: 15rem;
            font-weight: bold;
            > p {
              font-size: 2rem;
              line-height: 1rem;
            }
            @media (max-width: ${mobileMaxWidth}) {
              margin-left: 15rem;
              padding-top: 5.5rem;
              font-size: 3rem;
              > p {
                font-size: 1.3rem;
              }
            }
          `}
        >
          {username}
          {userType ? (
            <>
              {' '}
              <span
                className={css`
                  font-size: 2.5rem;
                  @media (max-width: ${mobileMaxWidth}) {
                    font-size: 1.5rem;
                  }
                `}
              >
                {`[${userType.includes('teacher') ? 'teacher' : userType}]`}
              </span>
            </>
          ) : (
            ''
          )}
          <p>({realName})</p>
        </div>
        {profile.id === userId && (
          <div
            style={{
              background: colorSelectorShown && '#fff',
              borderRadius,
              position: 'absolute',
              padding: '1rem',
              bottom: '1rem',
              right: '1rem'
            }}
          >
            {!colorSelectorShown && (
              <Button
                style={{ marginBottom: '-1rem', marginRight: '-1rem' }}
                default
                filled
                onClick={() => setColorSelectorShown(true)}
              >
                Change Theme
              </Button>
            )}
            {colorSelectorShown && (
              <>
                <ColorSelector
                  colors={[
                    'logoBlue',
                    'green',
                    'orange',
                    'red',
                    'rose',
                    'pink',
                    'purple',
                    'darkBlue',
                    'black',
                    'vantaBlack'
                  ]}
                  twinkleXP={twinkleXP || 0}
                  setColor={onSelectTheme}
                  selectedColor={selectedTheme || profileTheme || 'logoBlue'}
                  style={{
                    width: '100%',
                    height: 'auto',
                    justifyContent: 'center'
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    marginTop: '1rem',
                    justifyContent: 'flex-end'
                  }}
                >
                  <Button
                    style={{ fontSize: '1.2rem', marginRight: '1rem' }}
                    skeuomorphic
                    color="darkerGray"
                    onClick={onColorSelectCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    style={{ fontSize: '1.2rem' }}
                    color="blue"
                    filled
                    onClick={handleSetTheme}
                  >
                    Change
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
        <input
          ref={FileInputRef}
          style={{ display: 'none' }}
          type="file"
          onChange={handlePicture}
          accept="image/*"
        />
      </div>
      <ProfilePic
        isProfilePage
        className={css`
          width: 22rem;
          height: 22rem;
          left: 3rem;
          top: 7rem;
          font-size: 2rem;
          z-index: 10;
          @media (max-width: ${mobileMaxWidth}) {
            width: 12rem;
            height: 12rem;
            left: 1rem;
            top: 4rem;
          }
        `}
        style={{ position: 'absolute' }}
        userId={profile.id}
        onClick={
          userId === profile.id ? () => FileInputRef.current.click() : undefined
        }
        profilePicId={profilePicId}
        online={!!online}
        statusShown
        large
      />
      {imageEditModalShown && (
        <ImageEditModal
          imageUri={imageUri}
          onHide={() => {
            setImageUri(null);
            setImageEditModalShown(false);
          }}
        />
      )}
      {alertModalShown && (
        <AlertModal
          title="Image is too large (limit: 10mb)"
          content="Please select a smaller image"
          onHide={() => setAlertModalShown(false)}
        />
      )}
    </ErrorBoundary>
  );

  function onColorSelectCancel() {
    onSelectTheme(profileTheme || 'logoBlue');
    setColorSelectorShown(false);
  }

  async function handleSetTheme() {
    setColorSelectorShown(false);
    onSetTheme();
  }

  function handlePicture(event) {
    const reader = new FileReader();
    const file = event.target.files[0];
    if (file.size / 1000 > MAX_PROFILE_PIC_SIZE) {
      return setAlertModalShown(true);
    }
    reader.onload = upload => {
      setImageEditModalShown(true);
      setImageUri(upload.target.result);
    };

    reader.readAsDataURL(file);
    event.target.value = null;
  }
}
