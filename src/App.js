import { useState } from 'react';

function Square({ value, onSquareClick, isWinnerCell }) {
  return (
    // highlight square that caused the win
    <button className={"square " + (isWinnerCell ? " winner-cell" : "")} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const result = calculateWinner(squares);

  function handleClick(i) {
    if (result.winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }


  let status;
  if (result.winner) {
    status = 'Winner: ' + result.winner;
  } else {
    if (!result.isDraw) {
      status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    } else {
      // display a message about the result being a draw
      status = 'Draw';
    }
  }

  // Rewrite Board to use two loops to make the squares instead of hardcoding them.
  var board = [];
  for (let i = 0; i < 3; i++) {
    let row = [];
    for (let j = 0; j < 3; j++) {
      row.push(<Square key={'square' + i * 3 + j} value={squares[i * 3 + j]} onSquareClick={() => handleClick(i * 3 + j)} isWinnerCell={result.lines && result.lines.includes(i * 3 + j)} />);
    }
    board.push(<div className="board-row" key={'row' + i}>{row}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isAscendingSort, setIsAscendingSort] = useState(true);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        { /*For the current move only, show “You are at move #…” instead of a button.*/}
        {move !== currentMove ? <button className='history-point' onClick={() => jumpTo(move)}>{description}</button> : <div className='history-point current-point'>You are at move #{currentMove}</div>}
      </li>
    );
  });

  if (!isAscendingSort) moves.reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>

      <div className="game-info">
        {/*Add a toggle button that lets you sort the moves in either ascending or descending order.*/}
        <button className='history-point sort' onClick={() => {
          setIsAscendingSort(!isAscendingSort);
        }}>
          {'Sort... '}
          {isAscendingSort ?
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-800v487L216-537l-56 57 320 320 320-320-56-57-224 224v-487h-80Z" /></svg>}
        </button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {

  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        lines: lines[i],
        isDraw: false
      }
    }
  }

  let isDraw = true;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] == null) {
      isDraw = false;
      break;
    }
  }

  return {
    winner: null,
    lines: null,
    isDraw: isDraw
  };
}
