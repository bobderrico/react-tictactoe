import React from 'react';
import Square from './square.jsx';
import {List} from 'immutable';

class Board extends React.Component {
  renderSquare(i) {
    return <Square key={i} value={this.props.squares.get(i)} onClick={() => this.props.onClick(i)}/>;
  }

  renderRow(rowNumber) {
    var squares = [];
    for (let i = 0; i < 3; i++) {
      squares.push(this.renderSquare(i + rowNumber));
    }

    return <div key={rowNumber} className="board-row">{squares}</div>
  }

  render() {
    var rows = [];
    for (let i = 0; i < 9; i += 3) {
      rows.push(this.renderRow(i));
    }

    return <div>{rows}</div>;
  }
}

export default Board;
