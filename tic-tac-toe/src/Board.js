import React from 'react';

export default class Board extends React.Component {
  renderSquare(i) {
    const { winLine } = this.props;

    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlight={winLine && winLine.includes(i)}
      />
    );
  }

  render() {
    const gameBoard = [];
    let s = 0;
    for (let r = 0; r < 3; r++) {
      const miniBoard = [];
      for (let c = 0; c < 3; c++) {
        miniBoard.push(this.renderSquare(s));
        s++;
      }
      gameBoard.push(<div className="board-row">{miniBoard}</div>);
    }
    return (
      <div>
        {gameBoard}
      </div>
    );
  }
}

// generate game square
function Square(props) {
  const className = `square${props.highlight ? ' highlight' : ''}`;
  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}
