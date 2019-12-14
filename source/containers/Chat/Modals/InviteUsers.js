import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import TagForm from 'components/Forms/TagForm';
import { useAppContext, useChatContext } from 'contexts';

InviteUsersModal.propTypes = {
  currentChannel: PropTypes.object.isRequired,
  onDone: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  selectedChannelId: PropTypes.number.isRequired
};

export default function InviteUsersModal({
  selectedChannelId,
  onDone,
  onHide,
  currentChannel
}) {
  const {
    requestHelpers: { inviteUsersToChannel, searchUserToInvite }
  } = useAppContext();
  const {
    state: { userSearchResults },
    actions: {
      onClearUserSearchResults,
      onInviteUsersToChannel,
      onSearchUserToInvite
    }
  } = useChatContext();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const currentMembersUID = currentChannel.members.map(member => member.id);

  return (
    <Modal onHide={onHide}>
      <header>Invite people to this channel</header>
      <main>
        <TagForm
          title="Invite People"
          itemLabel="username"
          searchResults={userSearchResults}
          filter={result => !currentMembersUID.includes(result.id)}
          onSearch={handleSearchUserToInvite}
          onClear={onClearUserSearchResults}
          onAddItem={onAddUser}
          onRemoveItem={onRemoveUser}
          onSubmit={selectedUsers.length > 0 && handleDone}
          renderDropdownLabel={item => (
            <span>
              {item.username}{' '}
              {item.realName && <small>{`(${item.realName})`}</small>}
            </span>
          )}
          searchPlaceholder="Search for people you want to chat with"
          selectedItems={selectedUsers}
          style={{ width: '80%' }}
        />
      </main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          Cancel
        </Button>
        <Button
          color="blue"
          onClick={handleDone}
          disabled={selectedUsers.length === 0}
        >
          Invite
        </Button>
      </footer>
    </Modal>
  );

  function onAddUser(user) {
    setSelectedUsers(selectedUsers.concat([user]));
  }

  function onRemoveUser(userId) {
    setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
  }

  async function handleDone() {
    const data = await inviteUsersToChannel({
      selectedUsers,
      channelId: selectedChannelId
    });
    onInviteUsersToChannel(data);
    onDone(
      selectedUsers.map(user => user.id),
      data.message
    );
  }

  async function handleSearchUserToInvite(text) {
    const data = await searchUserToInvite(text);
    onSearchUserToInvite(data);
  }
}
