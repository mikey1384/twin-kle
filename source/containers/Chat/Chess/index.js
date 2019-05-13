import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Board from './Board';
import FallenPieces from './FallenPieces.js';
import { css } from 'emotion';
import { initialiseChessBoard } from './helpers/model.js';
import {
  checkerPos,
  getPieceIndex,
  isGameOver,
  isPossibleAndLegal,
  kingWillBeCapturedBy,
  returnBoardAfterMove,
  highlightPossiblePathsFromSrc,
  getOpponentPlayerColor,
  getPlayerPieces
} from './helpers/model';

Chess.propTypes = {
  interactable: PropTypes.bool,
  initialState: PropTypes.string,
  loading: PropTypes.bool,
  myId: PropTypes.number,
  onConfirmChessMove: PropTypes.func.isRequired,
  opponentId: PropTypes.number
};

export default function Chess({
  interactable,
  initialState,
  loading,
  myId,
  onConfirmChessMove,
  opponentId
}) {
  const [playerColors, setPlayerColors] = useState({
    [myId]: 'white',
    [opponentId]: 'black'
  });
  const [squares, setSquares] = useState([]);
  const [whiteFallenPieces, setWhiteFallenPieces] = useState([]);
  const [blackFallenPieces, setBlackFallenPieces] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [status, setStatus] = useState('');
  const [gameOverMsg, setGameOverMsg] = useState();
  const [enPassantTarget, setEnPassantTarget] = useState({});
  const [castled, setCastled] = useState({
    left: false,
    right: false
  });
  const fallenPieces = useRef({
    white: [],
    black: []
  });

  useEffect(() => {
    const playerColors = initialState
      ? JSON.parse(initialState).playerColors
      : {
          [myId]: 'white',
          [opponentId]: 'black'
        };
    setPlayerColors(playerColors);
    setSquares(initialiseChessBoard({ initialState, loading, myId }));
    if (interactable) {
      setSquares(squares =>
        squares.map(square =>
          square.color === playerColors[myId]
            ? {
                ...square,
                state:
                  gameOverMsg ||
                  ['check', 'checkmate'].indexOf(square.state) !== -1
                    ? square.state
                    : 'highlighted'
              }
            : square
        )
      );
    }
  }, [initialState, loading]);
  let myColor = 'white';
  if (initialState) {
    myColor = JSON.parse(initialState).playerColors[myId];
  }

  return (
    <div
      className={css`
        font: 14px 'Century Gothic', Futura, sans-serif;
        .dark {
          background-color: RGB(104, 136, 107);
        }

        .dark.highlighted {
          background-color: RGB(164, 236, 137);
        }

        .dark.check {
          background-color: yellow;
        }

        .dark.danger {
          background-color: yellow;
        }

        .dark.checkmate {
          background-color: red;
        }

        .light {
          background-color: RGB(234, 240, 206);
        }

        .light.highlighted {
          background-color: RGB(174, 255, 196);
        }

        .light.check {
          background-color: yellow;
        }

        .light.danger {
          background-color: yellow;
        }

        .light.checkmate {
          background-color: red;
        }
      `}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <FallenPieces myColor={myColor} whiteFallenPieces={whiteFallenPieces} />
        <Board
          interactable={interactable}
          squares={squares}
          myColor={myColor}
          onClick={handleClick}
          onCastling={handleCastling}
          castled={castled}
        />
        <div
          style={{
            display: 'flex',
            width: '100%',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div style={{ lineHeight: 2 }}>{status || gameOverMsg}</div>
          <FallenPieces
            myColor={myColor}
            blackFallenPieces={blackFallenPieces}
          />
        </div>
      </div>
    </div>
  );

  function handleCastling(direction) {
    const { playerPieces } = getPlayerPieces({
      color: getOpponentPlayerColor(myColor),
      squares
    });
    let kingPos = getPieceIndex({ color: myColor, squares, type: 'king' });
    let rookPos = -1;
    let kingMidDest = -1;
    let kingEndDest = -1;

    if (direction === 'right') {
      rookPos = 63;
      if (myColor === 'white') {
        kingMidDest = 61;
        kingEndDest = 62;
      } else {
        kingMidDest = 60;
        kingEndDest = 61;
      }
    } else {
      rookPos = 56;
      if (myColor === 'white') {
        kingMidDest = 59;
        kingEndDest = 58;
      } else {
        kingMidDest = 58;
        kingEndDest = 57;
      }
    }

    for (let piece of playerPieces) {
      if (
        isPossibleAndLegal({
          src: piece.index,
          dest: kingMidDest,
          squares,
          myColor
        })
      ) {
        setSquares(squares =>
          squares.map((square, index) => {
            if (index === piece.index) {
              return {
                ...square,
                state: 'danger'
              };
            }
            return {
              ...square,
              state: square.state === 'danger' ? '' : square.state
            };
          })
        );
        setStatus(
          `Castling not allowed because the king cannot pass through a square that is attacked by an enemy piece`
        );
        return;
      }
    }
    const rookDest = kingMidDest;
    const newSquares = returnBoardAfterMove({
      squares: returnBoardAfterMove({
        squares,
        src: kingPos,
        dest: kingEndDest,
        myColor
      }),
      src: rookPos,
      dest: rookDest,
      myColor
    });
    if (handleMove({ myKingIndex: kingEndDest, newSquares }) === 'success') {
      setCastled(castled => ({ ...castled, [direction]: true }));
    }
  }

  function handleClick(i) {
    if (!interactable) return;
    if (selectedIndex === -1) {
      if (!squares[i] || squares[i].color !== myColor) {
        return;
      }
      setSquares(squares =>
        highlightPossiblePathsFromSrc({
          color: myColor,
          squares,
          src: i,
          enPassantTarget,
          myColor
        })
      );
      setStatus('');
      setSelectedIndex(i);
    } else {
      if (squares[i] && squares[i].color === myColor) {
        setSelectedIndex(i);
        setStatus('');
        setSquares(squares =>
          highlightPossiblePathsFromSrc({
            color: myColor,
            squares,
            src: i,
            myColor
          })
        );
      } else {
        if (
          isPossibleAndLegal({
            src: selectedIndex,
            dest: i,
            squares,
            enPassantTarget,
            myColor
          })
        ) {
          const newSquares = returnBoardAfterMove({
            squares,
            src: selectedIndex,
            dest: i,
            myColor,
            enPassantTarget
          });
          const myKingIndex = getPieceIndex({
            color: myColor,
            squares: newSquares,
            type: 'king'
          });
          const result = handleMove({
            myKingIndex,
            newSquares,
            dest: i,
            src: selectedIndex
          });
          if (result === 'success') {
            const json = JSON.stringify({
              playerColors: playerColors || {
                [myId]: 'white',
                [opponentId]: 'black'
              },
              board: (myColor === 'black'
                ? newSquares.map(
                    (square, index) => newSquares[newSquares.length - 1 - index]
                  )
                : newSquares
              ).map(square =>
                square.state === 'highlighted'
                  ? { ...square, state: '' }
                  : square
              ),
              fallenPieces: fallenPieces.current
            });
            onConfirmChessMove(json);
          }
        }
      }
    }
  }

  function handleMove({ myKingIndex, newSquares, dest, src }) {
    const newWhiteFallenPieces = [...whiteFallenPieces];
    const newBlackFallenPieces = [...blackFallenPieces];
    const potentialCapturers = kingWillBeCapturedBy({
      kingIndex: myKingIndex,
      myColor,
      squares: newSquares
    });
    if (potentialCapturers.length > 0) {
      setSquares(squares =>
        squares.map((square, index) => {
          if (potentialCapturers.indexOf(index) !== -1) {
            return {
              ...square,
              state: 'danger'
            };
          }
          return {
            ...square,
            state: square.state === 'danger' ? '' : square.state
          };
        })
      );
      setStatus('Your King will be captured if you make that move.');
      return;
    }
    if (dest) {
      if (squares[src].type === 'pawn') {
        if (enPassantTarget && enPassantTarget.color) {
          const srcRow = Math.floor(src / 8);
          const destRow = Math.floor(dest / 8);
          const destColumn = dest % 8;
          const attacking = srcRow - destRow === 1;
          const enPassanting =
            !squares[dest].color &&
            enPassantTarget.color !== myColor &&
            attacking &&
            enPassantTarget.index % 8 === destColumn;
          if (enPassanting) {
            enPassantTarget.color === 'white'
              ? newWhiteFallenPieces.push(squares[enPassantTarget.index])
              : newBlackFallenPieces.push(squares[enPassantTarget.index]);
          }
        }
      }
      if (squares[dest].color) {
        squares[dest].color === 'white'
          ? newWhiteFallenPieces.push(squares[dest])
          : newBlackFallenPieces.push(squares[dest]);
      }
    }
    setSelectedIndex(-1);
    const theirKingIndex = getPieceIndex({
      color: getOpponentPlayerColor(myColor),
      squares: newSquares,
      type: 'king'
    });
    if (
      checkerPos({
        squares: newSquares,
        kingIndex: theirKingIndex,
        myColor
      }).length !== 0
    ) {
      newSquares[theirKingIndex] = {
        ...newSquares[theirKingIndex],
        state: 'check'
      };
    }
    if (dest) {
      newSquares[dest].moved = true;
    }
    setSquares(newSquares);
    setWhiteFallenPieces(newWhiteFallenPieces);
    setBlackFallenPieces(newBlackFallenPieces);
    fallenPieces.current = {
      white: newWhiteFallenPieces,
      black: newBlackFallenPieces
    };
    setStatus('');
    const gameOver = isGameOver({
      squares: newSquares,
      enPassantTarget,
      myColor
    });
    if (gameOver) {
      if (gameOver === 'Checkmate') {
        setSquares(squares =>
          squares.map((square, index) =>
            index === theirKingIndex
              ? { ...square, state: 'checkmate' }
              : square
          )
        );
      }
      setGameOverMsg(gameOver);
    }
    const target =
      newSquares[dest].type === 'pawn' &&
      (dest === src + 16 || dest === src - 16)
        ? { index: dest, color: newSquares[dest].color }
        : {};
    setEnPassantTarget(target);
    return 'success';
  }
}
