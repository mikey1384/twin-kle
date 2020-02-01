import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import CreateNewChannelModal from './Modals/CreateNewChannel';
import UserListModal from 'components/Modals/UserListModal';
import LeftMenu from './LeftMenu';
import RightMenu from './RightMenu';
import Body from './Body';
import Loading from 'components/Loading';
import PleaseLogIn from './PleaseLogIn';
import LocalContext from './Context';
import { phoneMaxWidth } from 'constants/css';
import { socket } from 'constants/io';
import { css } from 'emotion';
import { objectify } from 'helpers';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useViewContext, useChatContext } from 'contexts';

Chat.propTypes = {
  onFileUpload: PropTypes.func
};

export default function Chat({ onFileUpload }) {
  const {
    requestHelpers: {
      createNewChat,
      loadChatChannel,
      loadDMChannel,
      loadMoreChannels,
      updateChatLastRead
    }
  } = useAppContext();
  const { userId, username } = useMyState();
  const {
    state: { loaded, selectedChannelId, channelsObj, channelLoadMoreButton },
    actions: {
      onClearNumUnreads,
      onCreateNewChannel,
      onEnterChannelWithId,
      onEnterEmptyChat,
      onLoadMoreChannels,
      onNotifyThatMemberLeftChannel,
      onOpenDirectMessageChannel,
      onReceiveMessage,
      onReceiveMessageOnDifferentChannel,
      onSetChessModalShown,
      onUpdateChessMoveViewTimeStamp,
      onUpdateSelectedChannelId
    }
  } = useChatContext();
  const {
    state: { pageVisible }
  } = useViewContext();
  const [
    currentChannelOnlineMembers,
    setCurrentChannelOnlineMembers
  ] = useState([]);
  const [createNewChannelModalShown, setCreateNewChannelModalShown] = useState(
    false
  );
  const [userListModalShown, setUserListModalShown] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [partner, setPartner] = useState(null);
  const memberObj = useRef({});
  const mounted = useRef(true);

  const currentChannel = useMemo(() => channelsObj[selectedChannelId] || {}, [
    channelsObj,
    selectedChannelId
  ]);

  useEffect(() => {
    mounted.current = true;
    if (userId && (loaded || !userId || !socket.connected)) {
      if (userId && selectedChannelId) {
        updateChatLastRead(selectedChannelId);
      }
      onClearNumUnreads(selectedChannelId);
    }
    return function cleanUp() {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, pageVisible, userId, selectedChannelId]);

  useEffect(() => {
    if (mounted.current) {
      memberObj.current = objectify(currentChannelOnlineMembers);
    }
  }, [currentChannelOnlineMembers]);

  useEffect(() => {
    const otherMember = currentChannel.twoPeople
      ? currentChannel?.members?.filter(
          member => Number(member.id) !== userId
        )?.[0]
      : null;
    setPartner(otherMember);
    setChannelName(
      otherMember?.username || channelsObj[currentChannel?.id]?.channelName
    );
  }, [channelsObj, currentChannel, userId]);

  useEffect(() => {
    socket.on('chess_move_made', onNotifiedMoveMade);
    socket.on('chess_move_viewed', onNotifyMoveViewed);
    socket.on('subject_changed', onSubjectChange);
    socket.on('members_online_changed', onChangeMembersOnline);

    function onChangeMembersOnline(data) {
      let forCurrentChannel = data.channelId === selectedChannelId;
      if (forCurrentChannel) {
        if (data.leftChannel) {
          const { userId, username, profilePicId } = data.leftChannel;
          onNotifyThatMemberLeftChannel({
            channelId: data.channelId,
            userId,
            username,
            profilePicId
          });
        }
        setCurrentChannelOnlineMembers(data.membersOnline);
      }
    }

    function onNotifiedMoveMade({ channelId }) {
      if (channelId === selectedChannelId) {
        onSetChessModalShown(false);
      }
    }

    function onNotifyMoveViewed(channelId) {
      if (channelId === selectedChannelId) {
        onUpdateChessMoveViewTimeStamp();
      }
    }

    return function cleanUp() {
      socket.removeListener('chess_move_made', onNotifiedMoveMade);
      socket.removeListener('chess_move_viewed', onNotifyMoveViewed);
      socket.removeListener('subject_changed', onSubjectChange);
      socket.removeListener('members_online_changed', onChangeMembersOnline);
    };
  });

  useEffect(() => {
    socket.emit('check_online_members', selectedChannelId, (err, data) => {
      if (err) console.error(err);
      if (mounted.current) {
        setCurrentChannelOnlineMembers(data.membersOnline);
      }
    });
  }, [currentChannel, selectedChannelId]);

  return (
    <LocalContext.Provider
      value={{
        onFileUpload
      }}
    >
      {userId ? (
        loaded ? (
          <div
            className={css`
              width: 100%;
              height: 100%;
              display: flex;
              font-size: 1.5rem;
              position: relative;
              @media (max-width: ${phoneMaxWidth}) {
                width: 152vw;
                height: 100%;
              }
            `}
          >
            {createNewChannelModalShown && (
              <CreateNewChannelModal
                userId={userId}
                onHide={() => setCreateNewChannelModalShown(false)}
                onDone={handleCreateNewChannel}
              />
            )}
            {userListModalShown && (
              <UserListModal
                onHide={() => setUserListModalShown(false)}
                users={returnUsers(currentChannel, currentChannelOnlineMembers)}
                descriptionShown={userListDescriptionShown}
                description="(online)"
                title="Online Status"
              />
            )}
            <LeftMenu
              channelLoadMoreButtonShown={channelLoadMoreButton}
              currentChannel={currentChannel}
              currentChannelOnlineMembers={currentChannelOnlineMembers}
              loadMoreChannels={handleLoadMoreChannels}
              onChannelEnter={handleChannelEnter}
              onNewButtonClick={() => setCreateNewChannelModalShown(true)}
              showUserListModal={() => setUserListModalShown(true)}
            />
            <Body
              channelName={channelName}
              chessOpponent={partner}
              currentChannel={currentChannel}
            />
            <RightMenu
              channelName={channelName}
              currentChannel={currentChannel}
              currentChannelOnlineMembers={currentChannelOnlineMembers}
            />
          </div>
        ) : (
          <Loading text="Loading Twinkle Chat" />
        )
      ) : (
        <PleaseLogIn />
      )}
    </LocalContext.Provider>
  );

  async function handleLoadMoreChannels(params) {
    const data = await loadMoreChannels(params);
    onLoadMoreChannels(data);
  }

  function userListDescriptionShown(user) {
    for (let i = 0; i < currentChannelOnlineMembers.length; i++) {
      if (user.id === currentChannelOnlineMembers[i].id) return true;
    }
    return false;
  }

  function returnUsers({ members: allMembers }, currentChannelOnlineMembers) {
    return allMembers.length > 0 ? allMembers : currentChannelOnlineMembers;
  }

  async function handleChannelEnter(id) {
    if (id === 0) {
      setCurrentChannelOnlineMembers([]);
      return onEnterEmptyChat();
    }
    onUpdateSelectedChannelId(id);
    const data = await loadChatChannel({ channelId: id });
    onEnterChannelWithId({ data });
  }

  async function handleCreateNewChannel(params) {
    if (params.selectedUsers.length === 1) {
      const recepient = params.selectedUsers[0];
      const data = await loadDMChannel({ recepient });
      onOpenDirectMessageChannel({
        user: { id: userId, username },
        recepient,
        channelData: data
      });
      return setCreateNewChannelModalShown(false);
    }

    const data = await createNewChat(params);
    onCreateNewChannel(data);

    const users = params.selectedUsers.map(user => user.id);
    socket.emit('join_chat_channel', data.message.channelId);
    socket.emit('send_group_chat_invitation', users, data);
    setCreateNewChannelModalShown(false);
  }

  function onSubjectChange({ message }) {
    let messageIsForCurrentChannel = message.channelId === selectedChannelId;
    let senderIsNotTheUser = message.userId !== userId;
    if (messageIsForCurrentChannel && senderIsNotTheUser) {
      onReceiveMessage({ message, pageVisible });
    }
    if (!messageIsForCurrentChannel) {
      onReceiveMessageOnDifferentChannel({
        senderIsNotTheUser,
        pageVisible,
        channel: {
          id: 2,
          lastUpdate: message.timeStamp,
          isHidden: false,
          channelName: 'General',
          lastMessage: {
            content: message.content,
            sender: {
              id: message.userId,
              username: message.username
            }
          },
          numUnreads: 1
        }
      });
    }
  }
}
