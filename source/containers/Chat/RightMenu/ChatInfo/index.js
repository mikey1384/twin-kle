import React, { memo, useMemo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Members from './Members';
import ChannelDetails from './ChannelDetails';
import Icon from 'components/Icon';
import Video from './Video';
import { css } from 'emotion';
import { Color, desktopMinWidth, mobileMaxWidth } from 'constants/css';
import { useMyState } from 'helpers/hooks';
import { useChatContext } from 'contexts';
import { socket } from 'constants/io';

ChatInfo.propTypes = {
  channelName: PropTypes.string,
  channelOnCall: PropTypes.object,
  currentChannel: PropTypes.object.isRequired,
  currentChannelOnlineMembers: PropTypes.object.isRequired,
  selectedChannelId: PropTypes.number
};

function ChatInfo({
  selectedChannelId,
  channelOnCall,
  currentChannel,
  currentChannelOnlineMembers,
  channelName
}) {
  const { userId: myId, username, profilePicId, authLevel } = useMyState();
  const {
    state: { myStream },
    actions: { onSetCall, onHangUp }
  } = useChatContext();
  const myVideoRef = useRef(null);
  const myStreaming = useRef(false);

  const callOngoing = useMemo(
    () => selectedChannelId === channelOnCall.id && channelOnCall.members[myId],
    [channelOnCall.id, channelOnCall.members, myId, selectedChannelId]
  );

  const calling = useMemo(() => {
    return !channelOnCall.callReceived && channelOnCall.imCalling;
  }, [channelOnCall.callReceived, channelOnCall.imCalling]);

  useEffect(() => {
    const videoRef = myVideoRef.current;
    if (videoRef && myStream && !myStreaming.current && !videoRef?.srcObject) {
      const clonedStream = myStream.clone();
      videoRef.srcObject = clonedStream;
      videoRef.volume = 0;
      myStreaming.current = true;
    }
    return function cleanUp() {
      myStreaming.current = false;
    };
  }, [myStream]);

  const videoChatButtonShown = useMemo(() => {
    if (currentChannel.twoPeople) {
      if (currentChannel.members?.length !== 2) return false;
      return callOngoing || authLevel > 0;
    }
    return (
      currentChannel.isClass &&
      (callOngoing || currentChannel.creatorId === myId)
    );
  }, [
    authLevel,
    callOngoing,
    currentChannel.creatorId,
    currentChannel.isClass,
    currentChannel.members,
    currentChannel.twoPeople,
    myId
  ]);

  const displayedChannelMembers = useMemo(() => {
    const totalChannelMembers = currentChannel?.members || [];
    const me = { id: myId, username, profilePicId };
    const currentChannelOnlineMembersOtherThanMe = Object.entries(
      currentChannelOnlineMembers
    )
      .map(([, member]) => member)
      .filter(member => !!member.id && member.id !== myId);
    const totalValidChannelMembers = totalChannelMembers.filter(
      member => !!member.id
    );
    const currentlyOnlineIds = Object.keys(
      currentChannelOnlineMembers
    ).map(memberId => Number(memberId));
    if (totalValidChannelMembers.length > 0) {
      const offlineChannelMembers = totalValidChannelMembers.filter(
        member => !currentlyOnlineIds.includes(member.id) && member.id !== myId
      );
      return [
        me,
        ...currentChannelOnlineMembersOtherThanMe,
        ...offlineChannelMembers
      ];
    }
    return [me, ...currentChannelOnlineMembersOtherThanMe];
  }, [
    currentChannel,
    myId,
    username,
    profilePicId,
    currentChannelOnlineMembers
  ]);

  return (
    <>
      <div
        className={css`
          width: 100%;
          display: flex;
          padding-bottom: 1rem;
          justify-content: center;
          color: ${Color.darkerGray()};
        `}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            width: '100%'
          }}
          className="unselectable"
        >
          {videoChatButtonShown && (
            <div
              className={css`
                padding: 1rem;
                background: ${callOngoing
                  ? Color.rose(0.8)
                  : Color.darkBlue(0.8)};
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: background 0.2s;
                @media (max-width: ${mobileMaxWidth}) {
                  background: ${callOngoing
                    ? Color.rose(1)
                    : Color.darkBlue(1)};
                }
                @media (min-width: ${desktopMinWidth}) {
                  &:hover {
                    background: ${callOngoing
                      ? Color.rose(1)
                      : Color.darkBlue(1)};
                  }
                }
              `}
              onClick={handleCall}
            >
              {!callOngoing && <Icon icon="phone-volume" />}
              <span style={{ marginLeft: '1rem' }}>
                {!callOngoing ? 'Call' : 'Hang Up'}
              </span>
            </div>
          )}
          {myStream && !currentChannel.isClass && (
            <Video myVideoRef={myVideoRef} />
          )}
          <ChannelDetails
            style={{ marginTop: '1rem' }}
            channelId={currentChannel.id}
            channelName={channelName}
          />
          {displayedChannelMembers.length > 2 && (
            <div
              className={css`
                color: ${Color.green()};
                font-size: 1.7rem;
                font-weight: bold;
                @media (max-width: ${mobileMaxWidth}) {
                  font-size: 1.3rem;
                }
              `}
            >
              {Object.keys(currentChannelOnlineMembers).length}
              {currentChannel.id !== 2 &&
                '/' + displayedChannelMembers.length}{' '}
              online
            </div>
          )}
        </div>
      </div>
      <Members
        isClass={!!currentChannel.isClass}
        channelId={selectedChannelId}
        creatorId={currentChannel.creatorId}
        members={displayedChannelMembers}
        onlineMembers={currentChannelOnlineMembers}
      />
    </>
  );

  function handleCall() {
    if (!channelOnCall.id) {
      onSetCall({
        imCalling: true,
        channelId: selectedChannelId,
        isClass: currentChannel.isClass
      });
    } else {
      if (calling) {
        return onSetCall({});
      }
      onHangUp({ memberId: myId, iHungUp: true });
      socket.emit('hang_up_call', channelOnCall.id, () => {
        if (selectedChannelId !== channelOnCall.id) {
          onSetCall({
            imCalling: true,
            channelId: selectedChannelId,
            isClass: currentChannel.isClass
          });
        }
      });
    }
  }
}

export default memo(ChatInfo);
