import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { timeSince } from 'helpers/timeStampHelpers';
import UsernameText from 'components/Texts/UsernameText';
import UserListModal from 'components/Modals/UserListModal';
import { Link } from 'react-router-dom';
import { editTitle, deleteLink } from 'redux/actions/LinkActions';
import { connect } from 'react-redux';
import DropdownButton from 'components/Buttons/DropdownButton';
import EditTitleForm from 'components/Texts/EditTitleForm';
import { cleanString } from 'helpers/stringHelpers';
import ConfirmModal from 'components/Modals/ConfirmModal';
import { Color } from 'constants/css';
import { css } from 'emotion';
import request from 'axios';
import { URL } from 'constants/URL';
const API_URL = `${URL}/content`;

class LinkItem extends Component {
  static propTypes = {
    authLevel: PropTypes.number,
    canDelete: PropTypes.bool,
    canEdit: PropTypes.bool,
    deleteLink: PropTypes.func.isRequired,
    editTitle: PropTypes.func.isRequired,
    link: PropTypes.shape({
      content: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      timeStamp: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      uploaderName: PropTypes.string.isRequired,
      uploader: PropTypes.number.isRequired,
      likes: PropTypes.array.isRequired,
      numComments: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired
    }).isRequired,
    userId: PropTypes.number
  };

  apiUrl = 'https://api.embed.rocks/api';
  fallbackImage = '/img/link.png';
  mounted = false;

  constructor({ link: { thumbUrl } }) {
    super();
    this.state = {
      confirmModalShown: false,
      imageUrl: thumbUrl
        ? thumbUrl.replace('http://', 'https://')
        : '/img/link.png',
      userListModalShown: false,
      onEdit: false
    };
  }

  async componentDidMount() {
    this.mounted = true;
    const {
      link: { id, content, siteUrl }
    } = this.props;
    if (content && !siteUrl) {
      try {
        const {
          data: { image }
        } = await request.put(`${API_URL}/embed`, {
          url: content,
          linkId: id
        });
        if (this.mounted) {
          this.setState({
            imageUrl: image.url.replace('http://', 'https://')
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  async componentDidUpdate(prevProps) {
    const {
      link: { content, id }
    } = this.props;
    if (prevProps.link.content !== content) {
      try {
        const {
          data: { image }
        } = await request.put(`${API_URL}/embed`, {
          url: content,
          linkId: id
        });
        if (this.mounted) {
          this.setState({
            imageUrl: image.url.replace('http://', 'https://')
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const {
      link: {
        id,
        title,
        timeStamp,
        uploaderName,
        uploader,
        likes,
        numComments,
        uploaderAuthLevel
      },
      authLevel,
      canEdit,
      canDelete,
      userId
    } = this.props;
    const {
      confirmModalShown,
      imageUrl,
      userListModalShown,
      onEdit
    } = this.state;
    const userIsUploader = userId === uploader;
    const userCanEditThis =
      (canEdit || canDelete) && authLevel > uploaderAuthLevel;
    const editButtonShown = userIsUploader || userCanEditThis;
    const editMenuItems = [];
    if (userIsUploader || canEdit) {
      editMenuItems.push({
        label: 'Edit',
        onClick: () => this.setState({ onEdit: true })
      });
    }
    if (userIsUploader || canDelete) {
      editMenuItems.push({
        label: 'Remove',
        onClick: () => this.setState({ confirmModalShown: true })
      });
    }

    return (
      <nav
        className={css`
          display: flex;
          width: 100%;
          section {
            width: 100%;
            margin-left: 2rem;
            display: flex;
            justify-content: space-between;
          }
        `}
      >
        <div
          className={css`
            position: relative;
            width: 20%;
            &:after {
              content: '';
              display: block;
              padding-bottom: 100%;
            }
          `}
        >
          <Link to={`/links/${id}`}>
            <img
              className={css`
                position: absolute;
                width: 100%;
                height: 100%;
                object-fit: cover;
              `}
              src={imageUrl}
              onError={this.onImageLoadError}
              alt=""
            />
          </Link>
        </div>
        <section>
          <div
            className={css`
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              width: 100%;
            `}
          >
            <div style={{ width: '100%' }}>
              <div
                className={css`
                  width: 100%;
                  a {
                    font-size: 2rem;
                    line-height: 1.2;
                    font-weight: bold;
                  }
                `}
              >
                {!onEdit && (
                  <Link to={`/links/${id}`}>{cleanString(title)}</Link>
                )}
                {onEdit && (
                  <EditTitleForm
                    autoFocus
                    style={{ width: '80%' }}
                    maxLength={200}
                    title={title}
                    onEditSubmit={this.onEditedTitleSubmit}
                    onClickOutSide={() => this.setState({ onEdit: false })}
                  />
                )}
              </div>
              <div
                className={css`
                  font-size: 1.2rem;
                  line-height: 2rem;
                `}
              >
                Uploaded {`${timeSince(timeStamp)} `}
                by{' '}
                <UsernameText user={{ username: uploaderName, id: uploader }} />
              </div>
            </div>
            <div
              className={css`
                font-size: 1.3rem;
                font-weight: bold;
                color: ${Color.darkerGray()};
                margin-bottom: 0.5rem;
              `}
            >
              {likes.length > 0 && (
                <>
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.setState({ userListModalShown: true })}
                  >
                    {`${likes.length}`} like
                    {likes.length > 1 ? 's' : ''}
                  </span>
                  &nbsp;&nbsp;
                </>
              )}
              {numComments > 0 && (
                <span>
                  {numComments} comment
                  {numComments > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
          <div>
            {!onEdit &&
              editButtonShown && (
                <DropdownButton
                  snow
                  direction="left"
                  menuProps={editMenuItems}
                />
              )}
          </div>
        </section>
        {confirmModalShown && (
          <ConfirmModal
            title="Remove Link"
            onConfirm={this.onDelete}
            onHide={() => this.setState({ confirmModalShown: false })}
          />
        )}
        {userListModalShown && (
          <UserListModal
            users={likes}
            description="(You)"
            onHide={() => this.setState({ userListModalShown: false })}
            title="People who liked this link"
          />
        )}
      </nav>
    );
  }

  onDelete = () => {
    const { link, deleteLink } = this.props;
    deleteLink(link.id);
  };

  onEditedTitleSubmit = text => {
    const {
      editTitle,
      link: { id }
    } = this.props;
    return editTitle({ title: text, id }).then(() =>
      this.setState({ onEdit: false })
    );
  };

  onImageLoadError = () => {
    const {
      link: { thumbUrl }
    } = this.props;
    this.setState(state => ({
      imageUrl:
        !thumbUrl || state.imageUrl === thumbUrl ? this.fallbackImage : thumbUrl
    }));
  };
}

export default connect(
  state => ({
    authLevel: state.UserReducer.authLevel,
    canDelete: state.UserReducer.canDelete,
    canEdit: state.UserReducer.canEdit,
    userId: state.UserReducer.userId
  }),
  { deleteLink, editTitle }
)(LinkItem);
