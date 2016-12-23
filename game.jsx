import React from 'react';
import Board from './board.jsx';
import {List} from 'immutable';

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: List([{
        squares: List(Array(9).fill(null))
      }]),
      xIsNext: true,
      stepNumber: 0,
      isMovesListDescending: false
    }
  }

  handleClick(i) {
    const history = this.state.history;
    const current = history.get(history.size - 1);
    const squares = current.squares;

    if (this.calculateWinner(squares) || squares.get(i)) {
      return;
    }

    const player = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.push({
        squares: squares.set(i, player),
        coordinates: this.getBoardCoordinates(i),
        player
      }),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.size
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

  getBoardCoordinates(index) {
    return [
      Math.floor(index / 3) + 1,
      index % 3 + 1
    ];
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
    const movesList = history.map((step, move) => {
      const description = move ? `Move #${move}: ${step.player} to (${step.coordinates[0]}, ${step.coordinates[1]})` : 'Game start';
      return (
        <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)}>
            {description}
          </a>
        </li>
      );
    });

    if (this.state.isMovesListDescending) {
      return movesList.reverse();
    }
    return movesList;
  }

  toggleHistorySortDirection() {
    this.setState({
      isMovesListDescending: !this.state.isMovesListDescending
    })
  }

  render() {
    const history = this.state.history;
    const current = history.get(this.state.stepNumber);
    const squares = current.squares;
    const moves = this.getMovesList(history);

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={squares} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <button className="sort-history" onClick={() => this.toggleHistorySortDirection()}>
            {this.state.isMovesListDescending ? 'Sort Ascending' : 'Sort Descending'}
          </button>
          <div>{this.getStatusText(squares)}</div>
          <ol reversed={this.state.isMovesListDescending}>{moves}</ol>
        </div>
      </div>
    );
  }
}	

export default Game;