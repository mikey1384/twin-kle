import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Chess from '../Chess';
import { updateChessMoveViewTimeStamp } from 'redux/actions/ChatActions';
import { Color } from 'constants/css';
import {
  fetchCurrentChessState,
  setChessMoveViewTimeStamp
} from 'helpers/requestHelpers';
import { connect } from 'react-redux';

ChessModal.propTypes = {
  channelId: PropTypes.number,
  dispatch: PropTypes.func,
  myId: PropTypes.number,
  onConfirmChessMove: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  opponentId: PropTypes.number,
  opponentName: PropTypes.string,
  updateChessMoveViewTimeStamp: PropTypes.func.isRequired
};

function ChessModal({
  channelId,
  dispatch,
  myId,
  onConfirmChessMove,
  onHide,
  opponentId,
  opponentName,
  updateChessMoveViewTimeStamp
}) {
  const [initialState, setInitialState] = useState();
  const [userMadeLastMove, setUserMadeLastMove] = useState(false);
  const [viewTimeStamp, setViewTimeStamp] = useState();
  const [messageId, setMessageId] = useState();
  const [newChessState, setNewChessState] = useState();
  const [loaded, setLoaded] = useState(false);
  const [spoilerOff, setSpoilerOff] = useState(false);
  const loading = useRef(null);

  useEffect(() => {
    init();
    async function init() {
      loading.current = true;
      const {
        messageId,
        chessState,
        moveViewTimeStamp
      } = await fetchCurrentChessState(channelId);
      setMessageId(messageId);
      setInitialState(chessState);
      setViewTimeStamp(moveViewTimeStamp);
      loading.current = false;
      setLoaded(true);
    }
    return function cleanUp() {
      loading.current = true;
      setInitialState(undefined);
    };
  }, []);

  useEffect(() => {
    if (!loading.current) {
      if (initialState) {
        const { move } = JSON.parse(initialState);
        const userMadeLastMove = move?.by === myId;
        setUserMadeLastMove(!!userMadeLastMove);
      }
    }
  }, [loading.current]);

  return (
    <Modal large onHide={onHide}>
      <header>Chess</header>
      <main style={{ padding: 0 }}>
        <div
          style={{
            backgroundColor: Color.subtitleGray(),
            position: 'relative',
            width: '100%'
          }}
        >
          <Chess
            interactable
            initialState={initialState}
            loaded={loaded}
            myId={myId}
            newChessState={newChessState}
            onChessMove={setNewChessState}
            opponentId={opponentId}
            opponentName={opponentName}
            spoilerOff={
              spoilerOff ||
              (!loading.current && !initialState) ||
              !!userMadeLastMove ||
              !!viewTimeStamp
            }
            onSpoilerClick={handleSpoilerClick}
          />
        </div>
      </main>
      <footer style={{ border: 0 }}>
        <Button transparent onClick={onHide} style={{ marginRight: '0.7rem' }}>
          Close
        </Button>
        {!!newChessState && (
          <Button
            style={{ marginRight: '0.7rem' }}
            color="pink"
            onClick={() => setNewChessState(undefined)}
          >
            Cancel Move
          </Button>
        )}
        <Button
          color="blue"
          onClick={submitChessMove}
          disabled={!newChessState}
        >
          Confirm Move
        </Button>
      </footer>
    </Modal>
  );

  async function handleSpoilerClick() {
    await setChessMoveViewTimeStamp({ channelId, messageId, dispatch });
    setSpoilerOff(true);
    updateChessMoveViewTimeStamp();
  }

  async function submitChessMove() {
    await onConfirmChessMove(newChessState);
    onHide();
  }
}

export default connect(
  null,
  dispatch => ({
    dispatch,
    updateChessMoveViewTimeStamp: params =>
      dispatch(updateChessMoveViewTimeStamp(params))
  })
)(ChessModal);
