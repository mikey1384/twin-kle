import React, { useEffect, useMemo, useRef, useState } from 'react';
import Input from './Input';
import Loading from 'components/Loading';
import EntriesContainer from './EntriesContainer';
import Definition from './Definition';
import Icon from 'components/Icon';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { Color } from 'constants/css';
import { useAppContext, useChatContext, useInputContext } from 'contexts';

export default function Dictionary() {
  const {
    requestHelpers: { lookUpWord, registerWord }
  } = useAppContext();
  const {
    state: { wordObj },
    actions: { onSetWordObj }
  } = useChatContext();
  const { state } = useInputContext();
  const inputText = state['dictionary'] || '';
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!stringIsEmpty(inputText)) {
      clearTimeout(timerRef.current);
      setLoading(true);
      timerRef.current = setTimeout(() => changeInput(inputText), 300);
    }
    async function changeInput(input) {
      const wordObject = await lookUpWord(input);
      onSetWordObj(wordObject);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputText]);

  const widgetHeight = useMemo(() => {
    return stringIsEmpty(inputText) || loading ? '15rem' : `20rem`;
  }, [inputText, loading]);

  const entriesContainerHeight = useMemo(() => {
    return `CALC(100% - ${widgetHeight})`;
  }, [widgetHeight]);

  const notRegistered = useMemo(
    () => wordObj.isNew && !stringIsEmpty(inputText) && !loading,
    [inputText, wordObj.isNew, loading]
  );

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        flexDirection: 'column'
      }}
    >
      <EntriesContainer
        style={{
          width: '100%',
          overflow: 'scroll',
          height: entriesContainerHeight
        }}
      />
      <div
        style={{
          zIndex: 5,
          width: '100%',
          height: widgetHeight,
          boxShadow:
            stringIsEmpty(inputText) && `0 -5px 6px -3px ${Color.gray()}`,
          borderTop:
            !stringIsEmpty(inputText) && `1px solid ${Color.borderGray()}`
        }}
      >
        {stringIsEmpty(inputText) && (
          <div
            style={{
              padding: '1rem',
              fontSize: '3.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              background: Color.darkBlue(),
              color: '#fff'
            }}
          >
            <div>
              <span>Type a word in the text box below</span>
              <Icon style={{ marginLeft: '1rem' }} icon="arrow-down" />
            </div>
          </div>
        )}
        {!stringIsEmpty(inputText) &&
          (loading ? (
            <Loading style={{ height: '100%' }} text="Looking up..." />
          ) : (
            <div
              style={{
                display: 'flex',
                position: 'relative',
                paddingRight: '1rem',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                overflow: 'scroll'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  width: '20%',
                  alignItems: 'center',
                  padding: '1rem',
                  fontSize: '3rem'
                }}
              >
                {inputText}
              </div>
              <Definition wordObj={wordObj} />
            </div>
          ))}
      </div>
      {notRegistered && (
        <div
          style={{
            display: 'flex',
            background: Color.brownOrange(),
            color: '#fff',
            width: '100%',
            padding: '1rem',
            fontSize: '2rem',
            justifyContent: 'center',
            alignItems: 'center',
            height: '7rem'
          }}
        >
          This word has not been registered yet. Register and earn 100 XP!
        </div>
      )}
      <div
        style={{
          background: Color.inputGray(),
          padding: '1rem',
          borderTop: `1px solid ${Color.borderGray()}`
        }}
      >
        <Input
          onHeightChange={() => console.log('height changing')}
          onSubmit={handleSubmit}
          innerRef={inputRef}
          registerButtonShown={notRegistered}
        />
      </div>
    </div>
  );

  async function handleSubmit(text) {
    const { isNew, ...definitions } = wordObj;
    if (isNew) {
      const wordObject = await registerWord({ word: text, definitions });
      onSetWordObj(wordObject);
    }
  }
}
