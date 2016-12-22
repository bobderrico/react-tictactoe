import React from 'react';
import Board from './board.jsx';
import {List} from 'immutable';

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: List(Array(9).fill(null))
      }],
      xIsNext: true,
      stepNumber: 0
    }
  }

  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares;

    if (this.calculateWinner(squares) || squares.get(i)) {
      return;
    }

    this.setState({
      history: history.concat([{
        squares: squares.set(i, this.state.xIsNext ? 'X' : 'O')
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 ? false : true,
      history: this.state.history.slice(0, step + 1)
    })
  }

  isBoardFilled(squares) {
    return squares.filter(square => Boolean(square)).size === 9;
  }

  calculateWinner(squares) {
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
      if (squares.get(a) && squares.get(a) === squares.get(b) && squares.get(a) === squares.get(c)) {
        return squares.get(a);
      }
    }

    return null;
  }

  getStatusText(squares) {
    const winner = this.calculateWinner(squares);
    if (winner) {
      return `Winner: ${winner}!`
    }
    if (this.isBoardFilled(squares)) {
      return 'It\'s a draw!';
    }
    return `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
  }

  getMovesList(history) {
    return history.map((step, move) => {
      const description = move ? `Move #${move}` : 'Game start';
      return (
        <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)}>
            {description}
          </a>
        </li>
      );
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const squares = current.squares;
    const moves = this.getMovesList(history);

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={squares} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{this.getStatusText(squares)}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}	

export default Game;