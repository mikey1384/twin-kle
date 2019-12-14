import 'regenerator-runtime/runtime'; // for async await
import React, { memo, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Chat from 'containers/Chat';
import ContentPage from 'containers/ContentPage';
import Explore from 'containers/Explore';
import Header from './Header';
import Home from 'containers/Home';
import Button from 'components/Button';
import LinkPage from 'containers/LinkPage';
import PlaylistPage from 'containers/PlaylistPage';
import Privacy from 'containers/Privacy';
import Redirect from 'containers/Redirect';
import SigninModal from 'containers/Signin';
import Management from 'containers/Management';
import MobileMenu from './MobileMenu';
import Profile from 'containers/Profile';
import Verify from 'containers/Verify';
import VideoPage from 'containers/VideoPage';
import { Switch, Route } from 'react-router-dom';
import { addEvent, removeEvent } from 'helpers/listenerHelpers';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import { hot } from 'react-hot-loader';
import { socket } from 'constants/io';
import { useMyState } from 'helpers/hooks';
import {
  useAppContext,
  useContentContext,
  useViewContext,
  useNotiContext,
  useChatContext
} from 'contexts';

App.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object
};

function App({ location, history }) {
  const {
    user: {
      actions: { onCloseSigninModal, onInitUser, onLogout, onSetSessionLoaded }
    },
    requestHelpers: { auth, initSession, uploadFileOnChat }
  } = useAppContext();
  const { signinModalShown, username } = useMyState();
  const {
    actions: {
      onPostFileUploadStatus,
      onPostUploadComplete,
      onResetChat,
      onSendFirstDirectMessage,
      onUpdateClientToApiServerProgress
    }
  } = useChatContext();
  const {
    actions: { onInitContent }
  } = useContentContext();
  const {
    state: { updateDetail, updateNoticeShown }
  } = useNotiContext();
  const {
    state: { pageVisible },
    actions: { onChangePageVisibility }
  } = useViewContext();
  const [mobileMenuShown, setMobileMenuShown] = useState(false);
  const visibilityChangeRef = useRef(null);
  const hiddenRef = useRef(null);
  const authRef = useRef(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return function cleanUp() {
      mounted.current = false;
    };
  });

  useEffect(() => {
    if (!auth()?.headers?.authorization && !signinModalShown) {
      onLogout();
      onResetChat();
      onSetSessionLoaded();
    } else {
      if (
        authRef.current?.headers?.authorization !==
        auth()?.headers?.authorization
      ) {
        init();
      } else {
        onSetSessionLoaded();
      }
    }
    authRef.current = auth();
    async function init() {
      const data = await initSession(location.pathname);
      if (mounted.current) {
        onInitContent({ contentType: 'user', contentId: data.userId, ...data });
        if (data?.userId) onInitUser(data);
      }
      onSetSessionLoaded();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, location.pathname, pageVisible, signinModalShown]);

  useEffect(() => {
    window.ga('send', 'pageview', location.pathname);
    history.listen(location => {
      window.ga('send', 'pageview', location.pathname);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (typeof document.hidden !== 'undefined') {
      hiddenRef.current = 'hidden';
      visibilityChangeRef.current = 'visibilitychange';
    } else if (typeof document.msHidden !== 'undefined') {
      hiddenRef.current = 'msHidden';
      visibilityChangeRef.current = 'msvisibilitychange';
    } else if (typeof document.webkitHidden !== 'undefined') {
      hiddenRef.current = 'webkitHidden';
      visibilityChangeRef.current = 'webkitvisibilitychange';
    }
    addEvent(document, visibilityChangeRef.current, handleVisibilityChange);
    function handleVisibilityChange() {
      onChangePageVisibility(!document[hiddenRef.current]);
    }
    return function cleanUp() {
      removeEvent(
        document,
        visibilityChangeRef.current,
        handleVisibilityChange
      );
    };
  });

  return (
    <div
      className={css`
        height: CALC(100% - 4.5rem);
        width: 100%;
        @media (max-width: ${mobileMaxWidth}) {
          height: 100%;
        }
      `}
    >
      {mobileMenuShown && (
        <MobileMenu
          location={location}
          history={history}
          username={username}
          onClose={() => setMobileMenuShown(false)}
        />
      )}
      {updateNoticeShown && (
        <div
          className={css`
            position: fixed;
            width: 80%;
            left: 10%;
            top: 2rem;
            z-index: 100000;
            background: ${Color.blue()};
            color: #fff;
            padding: 1rem;
            text-align: center;
            font-size: 2rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            @media (max-width: ${mobileMaxWidth}) {
              width: 100%;
              left: 0;
            }
          `}
        >
          <p>
            The website has been updated. Click the button below to apply the
            update.
          </p>
          <p style={{ fontSize: '1.3em' }}>
            {
              "Warning: Update is mandatory. Some features will not work properly if you don't update!"
            }
          </p>
          {updateDetail && (
            <p style={{ color: Color.gold() }}>{updateDetail}</p>
          )}
          <Button
            color="gold"
            filled
            style={{ marginTop: '3rem', width: '20%', alignSelf: 'center' }}
            onClick={() => window.location.reload()}
          >
            Update!
          </Button>
        </div>
      )}
      <Header
        history={history}
        onMobileMenuOpen={() => setMobileMenuShown(true)}
      />
      <div
        id="App"
        className={css`
          margin-top: 4.5rem;
          height: 100%;
          @media (max-width: ${mobileMaxWidth}) {
            margin-top: 0;
            padding-top: 0;
            padding-bottom: 5rem;
          }
        `}
      >
        <Switch>
          <Route
            path="/users/:username"
            render={({ history, location, match }) => (
              <Profile history={history} location={location} match={match} />
            )}
          />
          <Route path="/comments/:contentId" component={ContentPage} />
          <Route path="/videos/:videoId" component={VideoPage} />
          <Route path="/videos" component={Explore} />
          <Route path="/links/:linkId" component={LinkPage} />
          <Route path="/links" component={Explore} />
          <Route path="/subjects/:contentId" component={ContentPage} />
          <Route path="/subjects" component={Explore} />
          <Route path="/playlists" component={PlaylistPage} />
          <Route
            path="/chat"
            render={() => <Chat onFileUpload={handleFileUpload} />}
          />
          <Route path="/management" component={Management} />
          <Route path="/verify" component={Verify} />
          <Route path="/privacy" component={Privacy} />
          <Route
            exact
            path="/"
            render={({ history, location }) => (
              <Home history={history} location={location} />
            )}
          />
          <Route
            exact
            path="/users/"
            render={({ history, location }) => (
              <Home history={history} location={location} />
            )}
          />
          <Route path="/:username" component={Redirect} />
        </Switch>
      </div>
      {signinModalShown && <SigninModal show onHide={onCloseSigninModal} />}
    </div>
  );

  async function handleFileUpload({
    channelId,
    content,
    fileName,
    filePath,
    fileToUpload,
    recepientId,
    targetMessageId,
    subjectId
  }) {
    onPostFileUploadStatus({
      channelId,
      content,
      fileName,
      filePath,
      fileToUpload,
      recepientId
    });
    const { messageId, members, message } = await uploadFileOnChat({
      channelId,
      content,
      selectedFile: fileToUpload,
      onUploadProgress: handleUploadProgress,
      recepientId,
      path: filePath,
      targetMessageId,
      subjectId
    });
    if (members) {
      onSendFirstDirectMessage({ members, message });
      socket.emit('join_chat_channel', message.channelId);
      socket.emit('send_bi_chat_invitation', recepientId, message);
    }
    onPostUploadComplete({
      path: filePath,
      channelId,
      messageId,
      result: !!messageId
    });
    function handleUploadProgress({ loaded, total }) {
      onUpdateClientToApiServerProgress({
        channelId,
        path: filePath,
        progress: loaded / total
      });
    }
  }
}

export default process.env.NODE_ENV === 'development'
  ? hot(module)(memo(App))
  : memo(App);
