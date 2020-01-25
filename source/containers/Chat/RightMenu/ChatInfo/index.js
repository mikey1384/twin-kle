import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Members from './Members';
import ChannelDetails from './ChannelDetails';
import { css } from 'emotion';
import { Color, mobileMaxWidth } from 'constants/css';
import { useMyState } from 'helpers/hooks';

ChatInfo.propTypes = {
  channelName: PropTypes.string,
  currentChannel: PropTypes.object.isRequired,
  currentChannelOnlineMembers: PropTypes.array.isRequired
};

export default function ChatInfo({
  currentChannel,
  currentChannelOnlineMembers,
  channelName
}) {
  const { userId: myId, username, profilePicId } = useMyState();
  const displayedChannelMembers = useMemo(() => {
    const totalChannelMembers = currentChannel?.members || [];
    const me = { id: myId, username, profilePicId };
    const currentChannelOnlineMembersOtherThanMe = currentChannelOnlineMembers.filter(
      member => !!member.id && member.id !== myId
    );
    const totalValidChannelMembers = totalChannelMembers.filter(
      member => !!member.id
    );
    const currentlyOnlineIds = currentChannelOnlineMembers.map(
      member => member.id
    );
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

  const currentlyOnlineValidMembers = useMemo(
    () => currentChannelOnlineMembers.filter(member => !!member.id),
    [currentChannelOnlineMembers]
  );

  return (
    <>
      <div
        className={css`
          width: 100%;
          display: flex;
          margin-top: 1rem;
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
        >
          <ChannelDetails
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
              {currentlyOnlineValidMembers.length}
              {currentChannel.id !== 2 &&
                '/' + displayedChannelMembers.length}{' '}
              online
            </div>
          )}
        </div>
      </div>
      <Members
        channelId={currentChannel.id}
        creatorId={currentChannel.creatorId}
        members={displayedChannelMembers}
        onlineMembers={currentChannelOnlineMembers}
      />
    </>
  );
}
