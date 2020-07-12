import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Board from './Board';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      isAscending: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares).winner || squares[i]) return;
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares,
        lastMove: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleSortToggle() {
    this.setState({
      isAscending: !this.state.isAscending,
    });
  }

  render() {
    const { history } = this.state;
    const current = history[this.state.stepNumber];
    const { isAscending } = this.state;
    const winInfo = calculateWinner(current.squares);
    const { winner } = winInfo;

    let moves = history.map((step, move) => {
      const col = step.lastMove % 3 + 1;
      const row = Math.floor(step.lastMove / 3) + 1;
      const desc = move ? `Go to move # ${move} placed (${col}, ${row})` : 'Restart game!';

      return (
        <li key={move}>
          <button className={move === this.state.stepNumber ? 'move-list-item-selected' : ''} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    if (!isAscending) {
      moves = moves.reverse();
    }

    let status;
    if (winner) {
      status = `Winner: ${winner}`;
    } else if (winInfo.isDraw) {
      status = 'Its a Draw';
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) => this.handleClick(i)} winLine={winInfo.line} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.handleSortToggle()}>
            {' '}
            {isAscending ? 'Sorted Ascending' : 'Sorted Descending'}
            {' '}
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
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
  // check for match in all possible lines
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: lines[i],
        isDraw: false,
      };
    }
  }
  // if winner not found check if all the squares are full
  let isDraw = true;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      isDraw = false;
      break;
    }
  }

  return {
    winner: null,
    line: null,
    isDraw,
  };
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root'),
);
