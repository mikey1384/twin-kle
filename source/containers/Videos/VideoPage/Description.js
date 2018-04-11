import PropTypes from 'prop-types'
import React, { Component } from 'react'
import DropdownButton from 'components/DropdownButton'
import UsernameText from 'components/Texts/UsernameText'
import Textarea from 'components/Texts/Textarea'
import Button from 'components/Button'
import LongText from 'components/Texts/LongText'
import { timeSince } from 'helpers/timeStampHelpers'
import UserListModal from 'components/Modals/UserListModal'
import FullTextReveal from 'components/FullTextReveal'
import { textIsOverflown } from 'helpers/domHelpers'
import Input from 'components/Texts/Input'
import {
  cleanString,
  stringIsEmpty,
  addEmoji,
  finalizeEmoji,
  isValidYoutubeUrl
} from 'helpers/stringHelpers'
import { edit } from 'constants/placeholders'
import Likers from 'components/Likers'
import LikeButton from 'components/LikeButton'
import StarButton from 'components/StarButton'
import { starVideo } from 'redux/actions/VideoActions'
import { connect } from 'react-redux'
import { Color, mobileMaxWidth } from 'constants/css'
import { css } from 'emotion'

class Description extends Component {
  static propTypes = {
    authLevel: PropTypes.number,
    canDelete: PropTypes.bool,
    canEdit: PropTypes.bool,
    canStar: PropTypes.bool,
    content: PropTypes.string.isRequired,
    description: PropTypes.string,
    isStarred: PropTypes.bool,
    likes: PropTypes.array.isRequired,
    likeVideo: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEditCancel: PropTypes.func.isRequired,
    onEditFinish: PropTypes.func.isRequired,
    onEditStart: PropTypes.func.isRequired,
    starVideo: PropTypes.func.isRequired,
    timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    title: PropTypes.string.isRequired,
    uploaderAuthLevel: PropTypes.number.isRequired,
    uploaderId: PropTypes.number.isRequired,
    uploaderName: PropTypes.string.isRequired,
    userId: PropTypes.number,
    videoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    videoViews: PropTypes.string.isRequired
  }

  state = {
    onEdit: false,
    onTitleHover: false,
    editDoneButtonDisabled: true,
    userListModalShown: false
  }

  static getDerivedStateFromProps(nextProps) {
    return {
      editedTitle: cleanString(nextProps.title),
      editedUrl: `https://www.youtube.com/watch?v=${nextProps.content}`,
      editedDescription: nextProps.description
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.title !== this.props.title ||
      prevProps.description !== this.props.description ||
      prevProps.content !== this.props.content
    ) {
      return this.setState({
        onEdit: false
      })
    }
  }

  render() {
    const {
      authLevel,
      canDelete,
      canEdit,
      canStar,
      isStarred,
      uploaderId,
      userId,
      uploaderName,
      title,
      description,
      likes,
      onDelete,
      starVideo,
      timeStamp,
      uploaderAuthLevel,
      videoId,
      videoViews
    } = this.props
    let {
      onEdit,
      editedTitle,
      editedUrl,
      editedDescription,
      editDoneButtonDisabled,
      userListModalShown,
      onTitleHover
    } = this.state
    const userIsUploader = uploaderId === userId
    const userCanEditThis =
      (canEdit || canDelete) && authLevel > uploaderAuthLevel
    const editButtonShown = userIsUploader || userCanEditThis
    const editMenuItems = []
    if (userIsUploader || canEdit) {
      editMenuItems.push({
        label: 'Edit',
        onClick: this.onEditStart
      })
    }
    if (userIsUploader || canDelete) {
      editMenuItems.push({
        label: 'Delete',
        onClick: onDelete
      })
    }

    const starButtonGrid = canStar ? 'starButton' : 'likeButton'
    return (
      <div
        className={css`
          display: grid;
          height: auto;
          width: 100%;
          background: #fff;
          padding: 1rem;
          margin-top: 1rem;
          align-items: center;
          align-content: space-around;
          font-size: 1.5rem;
          grid-template-columns: 30% 1fr 1fr 2% 15%;
          grid-template-rows: 20% 2% auto;
          grid-column-gap: 1rem;
          grid-row-gap: 1.3rem;
          grid-template-areas: 
            "title title title ${starButtonGrid} likeButton"
            "description description description description description"
            "description description description description description";
          @media (max-width: ${mobileMaxWidth}) {
            grid-template-columns: 30% 30% 1fr 13% 13%;
            grid-template-areas: 
              "title title ${starButtonGrid} likeButton likeButton"
              "description description description description description"
              "description description description description description";
          }
        `}
      >
        <div
          style={{
            gridArea: 'title',
            alignSelf: 'start',
            marginRight: '1rem'
          }}
        >
          {onEdit ? (
            <div>
              <Input
                type="text"
                placeholder={edit.video}
                value={editedUrl}
                onChange={text => {
                  this.setState({ editedUrl: text }, () => {
                    this.determineEditButtonDoneStatus()
                  })
                }}
              />
              <Input
                style={{ marginTop: '1rem' }}
                type="text"
                placeholder={edit.title}
                value={editedTitle}
                onChange={text => {
                  this.setState({ editedTitle: text }, () => {
                    this.determineEditButtonDoneStatus()
                  })
                }}
                onKeyUp={event => {
                  if (event.key === ' ') {
                    this.setState({
                      editedTitle: addEmoji(event.target.value)
                    })
                  }
                }}
              />
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <div
                ref={ref => {
                  this.thumbLabel = ref
                }}
                style={{
                  width: '100%',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  lineHeight: 'normal'
                }}
              >
                <span
                  style={{
                    wordBreak: 'break-word',
                    fontSize: '3rem',
                    fontWeight: 'bold'
                  }}
                  onMouseOver={this.onMouseOver}
                  onMouseLeave={() => this.setState({ onTitleHover: false })}
                >
                  {cleanString(title)}
                </span>
              </div>
              <FullTextReveal
                width="100%"
                show={onTitleHover}
                text={cleanString(title)}
              />
            </div>
          )}
          {!onEdit && (
            <div style={{ marginTop: '0.5rem' }}>
              Added by{' '}
              <UsernameText user={{ name: uploaderName, id: uploaderId }} />{' '}
              <span>{`${timeStamp ? timeSince(timeStamp) : ''}`}</span>
            </div>
          )}
          {!onEdit &&
            videoViews > 10 && (
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  marginTop: '1rem',
                  color: Color.darkGray()
                }}
              >
                {videoViews} view{`${videoViews > 1 ? 's' : ''}`}
              </div>
            )}
        </div>
        <div
          className={css`
            grid-area: description;
            align-self: start;
            display: grid;
            grid-template-areas:
              'content content content content'
              ${!onEdit ? '"editButton . . ."' : ''};
            grid-row-gap: 2rem;
            grid-template-columns: auto 1fr 1fr 1fr;
          `}
        >
          {onEdit ? (
            <div style={{ gridArea: 'content' }}>
              <Textarea
                minRows={5}
                placeholder={edit.description}
                value={editedDescription}
                onChange={event => {
                  this.determineEditButtonDoneStatus()
                  this.setState(
                    { editedDescription: event.target.value },
                    () => {
                      this.determineEditButtonDoneStatus()
                    }
                  )
                }}
                onKeyUp={event => {
                  if (event.key === ' ') {
                    this.setState({
                      editedDescription: addEmoji(event.target.value)
                    })
                  }
                }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '1rem'
                }}
              >
                <Button
                  transparent
                  style={{ fontSize: '1.7rem', marginRight: '1rem' }}
                  onClick={this.onEditCancel}
                >
                  Cancel
                </Button>
                <Button
                  primary
                  disabled={editDoneButtonDisabled}
                  onClick={this.onEditFinish}
                  style={{ fontSize: '1.7rem' }}
                >
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <div style={{ padding: '0 1rem', gridArea: 'content' }}>
              <LongText
                style={{
                  wordBreak: 'break-word',
                  lineHeight: '2.3rem'
                }}
              >
                {stringIsEmpty(description) ? 'No Description' : description}
              </LongText>
            </div>
          )}
          {editButtonShown &&
            !onEdit && (
              <DropdownButton
                snow
                direction="left"
                style={{
                  gridArea: 'editButton'
                }}
                stretch
                icon="pencil"
                text="Edit or Delete This Video"
                menuProps={editMenuItems}
              />
            )}
        </div>
        {canStar && (
          <StarButton
            style={{
              gridArea: 'starButton',
              alignSelf: 'start',
              justifySelf: 'end'
            }}
            isStarred={isStarred}
            onClick={() => starVideo(videoId)}
          />
        )}
        <div
          style={{
            gridArea: 'likeButton',
            alignSelf: 'start',
            justifySelf: 'end',
            width: '100%'
          }}
        >
          <LikeButton
            filled
            style={{
              fontSize: '2.5rem',
              width: '100%'
            }}
            onClick={this.onVideoLikeClick}
            liked={(likes => {
              let liked = false
              if (likes) {
                for (let i = 0; i < likes.length; i++) {
                  if (likes[i].userId === userId) liked = true
                }
              }
              return liked
            })(likes)}
          />
          <Likers
            style={{
              textAlign: 'center',
              lineHeight: '1.7rem',
              marginTop: '0.5rem'
            }}
            userId={userId}
            likes={likes}
            onLinkClick={() => this.setState({ userListModalShown: true })}
            target="video"
            defaultText="Be the first to like this video"
          />
        </div>
        {userListModalShown && (
          <UserListModal
            onHide={() => this.setState({ userListModalShown: false })}
            title="People who liked this video"
            users={likes.map(like => {
              return {
                username: like.username,
                userId: like.userId
              }
            })}
            description="(You)"
          />
        )}
      </div>
    )
  }

  determineEditButtonDoneStatus = () => {
    const urlIsInvalid = !isValidYoutubeUrl(this.state.editedUrl)
    const titleIsEmpty = stringIsEmpty(this.state.editedTitle)
    const titleChanged = this.state.editedTitle !== this.props.title
    const urlChanged =
      this.state.editedUrl !==
      `https://www.youtube.com/watch?v=${this.props.content}`
    const descriptionChanged =
      this.state.editedDescription !== this.props.description
    const editDoneButtonDisabled =
      urlIsInvalid ||
      titleIsEmpty ||
      (!titleChanged && !descriptionChanged && !urlChanged)
    this.setState({ editDoneButtonDisabled })
  }

  onEditCancel = () => {
    const { description } = this.props
    const editedDescription =
      description === 'No description' ? '' : description
    this.props.onEditCancel()
    this.setState({
      editedUrl: `https://www.youtube.com/watch?v=${this.props.content}`,
      editedTitle: cleanString(this.props.title),
      editedDescription,
      onEdit: false,
      editDoneButtonDisabled: true
    })
  }

  onEditFinish = () => {
    const params = {
      url: this.state.editedUrl,
      videoId: this.props.videoId,
      title: finalizeEmoji(this.state.editedTitle),
      description: finalizeEmoji(this.state.editedDescription)
    }
    this.props.onEditFinish(params).then(() =>
      this.setState({
        onEdit: false,
        editDoneButtonDisabled: true
      })
    )
  }

  onEditStart = () => {
    this.props.onEditStart()
    this.setState({ onEdit: true })
  }

  onMouseOver = () => {
    if (textIsOverflown(this.thumbLabel)) {
      this.setState({ onTitleHover: true })
    }
  }

  onVideoLikeClick = () => {
    const { videoId } = this.props
    this.props.likeVideo(videoId)
  }
}

export default connect(
  state => ({
    authLevel: state.UserReducer.authLevel,
    canDelete: state.UserReducer.canDelete,
    canEdit: state.UserReducer.canEdit,
    canStar: state.UserReducer.canStar
  }),
  {
    starVideo
  }
)(Description)
