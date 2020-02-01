import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Textarea from 'components/Texts/Textarea';
import Input from 'components/Texts/Input';
import Button from 'components/Button';
import { useInputContext } from 'contexts';
import { edit } from 'constants/placeholders';
import { css } from 'emotion';
import {
  addEmoji,
  exceedsCharLimit,
  finalizeEmoji,
  stringIsEmpty,
  isValidUrl,
  isValidYoutubeUrl
} from 'helpers/stringHelpers';

ContentEditor.propTypes = {
  comment: PropTypes.string,
  content: PropTypes.string,
  contentId: PropTypes.number.isRequired,
  contentType: PropTypes.string.isRequired,
  description: PropTypes.string,
  onDismiss: PropTypes.func.isRequired,
  onEditContent: PropTypes.func.isRequired,
  secretAnswer: PropTypes.string,
  style: PropTypes.object,
  title: PropTypes.string
};

export default function ContentEditor({
  comment,
  content,
  contentId,
  contentType,
  description,
  onDismiss,
  onEditContent,
  secretAnswer = '',
  style,
  title
}) {
  const {
    state,
    actions: { onSetEditForm }
  } = useInputContext();
  const inputState = useMemo(() => state['edit' + contentType + contentId], [
    contentId,
    contentType,
    state
  ]);
  useEffect(() => {
    if (!inputState) {
      onSetEditForm({
        contentId,
        contentType,
        form: {
          editedContent: content || '',
          editedComment: comment || '',
          editedDescription: description || '',
          editedSecretAnswer: secretAnswer || '',
          editedTitle: title || '',
          editedUrl:
            contentType === 'video'
              ? `https://www.youtube.com/watch?v=${content}`
              : content || ''
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const editForm = inputState || {};
  const {
    editedContent = '',
    editedComment = '',
    editedDescription = '',
    editedSecretAnswer = '',
    editedTitle = '',
    editedUrl = ''
  } = editForm;
  const urlError = useMemo(
    () =>
      !stringIsEmpty(editedUrl) &&
      !(contentType === 'video'
        ? isValidYoutubeUrl(editedUrl)
        : isValidUrl(editedUrl)),
    [contentType, editedUrl]
  );
  const descriptionExceedsCharLimit = useMemo(
    () =>
      exceedsCharLimit({
        contentType,
        inputType: 'description',
        text: contentType === 'comment' ? editedComment : editedDescription
      }),
    [contentType, editedComment, editedDescription]
  );
  const secretAnswerExceedsCharLimit = useMemo(
    () =>
      exceedsCharLimit({
        inputType: 'description',
        contentType,
        text: editedSecretAnswer
      }),
    [contentType, editedSecretAnswer]
  );
  const titleExceedsCharLimit = useMemo(
    () =>
      exceedsCharLimit({
        contentType,
        inputType: 'title',
        text: editedTitle
      }),
    [contentType, editedTitle]
  );
  const urlExceedsCharLimit = useMemo(
    () =>
      exceedsCharLimit({
        contentType,
        inputType: 'url',
        text: editedUrl
      }),
    [contentType, editedUrl]
  );
  const editButtonDisabled = useMemo(() => {
    const contentUrl =
      contentType === 'video'
        ? `https://www.youtube.com/watch?v=${content}`
        : content;
    const isValid =
      contentType === 'video'
        ? isValidYoutubeUrl(editedUrl)
        : isValidUrl(editedUrl);
    if (titleExceedsCharLimit) {
      return true;
    }
    if (descriptionExceedsCharLimit) {
      return true;
    }
    if (secretAnswerExceedsCharLimit) {
      return true;
    }
    if (
      (contentType === 'vidoe' || contentType === 'url') &&
      urlExceedsCharLimit
    ) {
      return true;
    }

    switch (contentType) {
      case 'video':
      case 'url':
        if (
          stringIsEmpty(editedUrl) ||
          stringIsEmpty(editedTitle) ||
          !isValid
        ) {
          return true;
        }
        if (
          editedUrl === contentUrl &&
          editedTitle === title &&
          editedDescription === description
        ) {
          return true;
        }
        return false;
      case 'comment':
        if (stringIsEmpty(editedComment) || editedComment === comment) {
          return true;
        }
        return false;
      case 'subject':
        if (
          stringIsEmpty(editedTitle) ||
          (editedTitle === title &&
            editedDescription === description &&
            editedSecretAnswer === secretAnswer)
        ) {
          return true;
        }
        return false;
      default:
        return true;
    }
  }, [
    comment,
    content,
    contentType,
    description,
    descriptionExceedsCharLimit,
    editedComment,
    editedDescription,
    editedSecretAnswer,
    editedTitle,
    editedUrl,
    secretAnswer,
    secretAnswerExceedsCharLimit,
    title,
    titleExceedsCharLimit,
    urlExceedsCharLimit
  ]);

  return (
    <div
      style={style}
      className={css`
        small {
          font-size: 1.3rem;
          line-height: 2.5rem;
        }
      `}
    >
      <form onSubmit={onSubmit}>
        {(contentType === 'video' || contentType === 'url') && (
          <div
            className={css`
              margin-bottom: 1rem;
            `}
          >
            <Input
              hasError={urlError}
              onChange={text =>
                onSetEditForm({
                  contentId,
                  contentType,
                  form: {
                    ...editForm,
                    editedUrl: text
                  }
                })
              }
              placeholder={edit[contentType]}
              value={editedUrl}
              style={urlExceedsCharLimit?.style}
            />
            {(urlExceedsCharLimit || urlError) && (
              <small style={{ color: 'red', lineHeight: 0.5 }}>
                {urlExceedsCharLimit?.message || 'Please check the url'}
              </small>
            )}
          </div>
        )}
        {contentType !== 'comment' && (
          <>
            <Input
              onChange={text =>
                onSetEditForm({
                  contentId,
                  contentType,
                  form: {
                    ...editForm,
                    editedTitle: text
                  }
                })
              }
              onKeyUp={event =>
                onSetEditForm({
                  contentId,
                  contentType,
                  form: {
                    ...editForm,
                    editedTitle: addEmoji(event.target.value)
                  }
                })
              }
              placeholder={edit.title}
              value={editedTitle}
              style={titleExceedsCharLimit?.style}
            />
            <small style={titleExceedsCharLimit?.style}>
              {titleExceedsCharLimit?.message}
            </small>
          </>
        )}
        <div style={{ position: 'relative', marginTop: '1rem' }}>
          <Textarea
            minRows={4}
            onChange={event => {
              const { value } = event.target;
              onSetEditForm({
                contentId,
                contentType,
                form: {
                  ...editForm,
                  [contentType === 'comment'
                    ? 'editedComment'
                    : 'editedDescription']: value
                }
              });
            }}
            placeholder={
              edit[contentType === 'comment' ? 'comment' : 'description']
            }
            value={
              contentType === 'comment' ? editedComment : editedDescription
            }
            style={descriptionExceedsCharLimit?.style}
          />
          {descriptionExceedsCharLimit && (
            <small style={{ color: 'red' }}>
              {descriptionExceedsCharLimit?.message}
            </small>
          )}
        </div>
        {contentType === 'subject' && (
          <div style={{ position: 'relative', marginTop: '1rem' }}>
            <span style={{ fontWeight: 'bold' }}>Secret Message</span>
            <Textarea
              minRows={4}
              onChange={event => {
                const { value } = event.target;
                onSetEditForm({
                  contentId,
                  contentType,
                  form: {
                    ...editForm,
                    editedSecretAnswer: value
                  }
                });
              }}
              placeholder="Enter Secret Message... (Optional)"
              value={editedSecretAnswer}
              style={{
                marginTop: '0.7rem',
                ...(secretAnswerExceedsCharLimit?.style || {})
              }}
            />
            {secretAnswerExceedsCharLimit && (
              <small style={{ color: 'red' }}>
                {secretAnswerExceedsCharLimit.message}
              </small>
            )}
          </div>
        )}
        <div
          style={{
            marginTop: '1rem',
            display: 'flex',
            flexDirection: 'row-reverse'
          }}
        >
          <Button color="blue" type="submit" disabled={editButtonDisabled}>
            Done
          </Button>
          <Button
            transparent
            style={{ marginRight: '1rem' }}
            onClick={handleDismiss}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );

  function handleDismiss() {
    onSetEditForm({
      contentId,
      contentType,
      form: undefined
    });
    onDismiss();
  }

  async function onSubmit(event) {
    event.preventDefault();
    const post = {
      ...editForm,
      editedComment: finalizeEmoji(editedComment),
      editedContent: finalizeEmoji(editedContent),
      editedDescription: finalizeEmoji(editedDescription),
      editedSecretAnswer: finalizeEmoji(editedSecretAnswer),
      editedTitle: finalizeEmoji(editedTitle)
    };
    await onEditContent({ ...post, contentId, contentType });
    handleDismiss();
  }
}
