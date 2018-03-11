import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props){
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
}


class Board extends React.Component {
    renderSquare(j) {
      return (
          <Square
            value={this.props.squares[j-1]}
            onClick={()=>this.props.onClick(j)}
          />
        )
      }

    renderRow(nRow) {
        var cols = [];

        var colCount = this.props.bordSize;

        for (var nCol = 0; nCol< colCount; nCol++) {
            cols.push(this.renderSquare((nRow-1)*colCount+nCol+1));
        }

        return(
            <div className="board-row">
                {cols}
            </div>
        );
    }

  render() {

   var rows = [];
   var rowCount = this.props.bordSize;

   for (var i = 0; i < rowCount; i++) {
       rows.push(this.renderRow(i+1));
   }

    return (
        <div>
            {rows}
        </div>
    );
  }
}

class Game extends React.Component {

  constructor(props){

    super(props);

    var gameSize = props.gameSize;

    this.state = {
        history:[{
            squares: Array(gameSize*gameSize).fill(null),
            coordinate: Array(2).fill(null),
        }],

        xIsNext:true,
        stepCount: 0,
        winner:null,
     }
  }

  getCoordinate(i){
      var coordinate = new Array(2);
      var x = parseInt(i / this.props.gameSize,10);
      var y = parseInt(i % this.props.gameSize,10);

      coordinate[0] = y===0 ? x : x + 1;
      coordinate[1] = y===0 ? this.props.gameSize : y;

      return coordinate;
  }

  calculateWinner(squares,step){

    var curValue = squares[step-1];

    //坐标已经转换后，从1开始
    var coordinate = new Array();
    coordinate = this.getCoordinate(step);

    var trueCount = 0;
    for (var i = 0; i < this.props.gameSize; i++) {
      if(squares[(coordinate[0]-1)*this.props.gameSize+i] === curValue) {
        trueCount ++;
      }

    }
    if (trueCount === this.props.gameSize) {
        return curValue;
    }

    trueCount = 0
    for (let i = 0; i < this.props.gameSize; i++) {
      if(squares[(coordinate[1]-1)+this.props.gameSize*i] === curValue) {
        trueCount++;
      }
    }
    if (trueCount === this.props.gameSize) {
      return curValue;
    }

    if (coordinate[0]===coordinate[1] ||
        (this.props.gameSize - coordinate[0] + 1)===coordinate[1]){
      //此时需检查横竖及对角线
    trueCount = 0;
      for (let i = 0; i < this.props.gameSize; i++) {
        if (squares[i+this.props.gameSize*i] === curValue) {
          trueCount ++;
        }
      }
      if (trueCount===this.props.gameSize) {
        return curValue;
      }

      trueCount = 0;
      for (let i = 0; i < this.props.gameSize; i++) {
        if (squares[(i+1)*(this.props.gameSize-1)] === curValue) {
          trueCount++;
        }
      }
      if (trueCount === this.props.gameSize) {
        return curValue;
      }
    }

    return null;
  }

  handleClick(i){

      const history = this.state.history;
      const current = history[history.length-1];
      const squares = current.squares.slice();

      const coordinate = this.getCoordinate(i);

      if (this.state.winner || squares[i-1]) {
          return;
      }

      squares[i-1] = this.state.xIsNext ? 'X':'O';

      this.setState({
        history: history.concat([{squares:squares,coordinate:coordinate}]),
        xIsNext: !this.state.xIsNext,
        stepCount: this.state.stepCount + 1,
        winner: this.calculateWinner(squares,i),
      });

  }

  resetGame(){
      this.setState({
      history:[{
          squares: Array(this.props.gameSize*this.props.gameSize).fill(null),
          coordinate: Array(2).fill(null),
      }],
      xIsNext:true,
      stepCount: 0,
      winner:null,
   });
  }

  jump(step) {
    this.setState ({
        stepCount: step,
        xIsNext:(step % 2) ? false : true,
    })
  };

  render() {
    const history = this.state.history;
    const current = history[this.state.stepCount];

    const moves = history.map((step,move) => {
        const desc = move ? 'Step' + move + ': cord('
            + history[move].coordinate+')' : 'Game start！';

        return (
            <li key = {move}>
                <a ref="#" onClick={()=>this.jump(move)}>{desc}</a>
            </li>
        );
    });


    let status;

    if (this.state.winner){
        status = "Winner: " + this.state.winner;
    } else {
        status = "Next player: " + (this.state.xIsNext? 'X':'O');
    }

    return (
      <div className="game">
        <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
        </div>
        <div className="game-board">
          <Board
            squares={current.squares}
            bordSize={this.props.gameSize}
            onClick={(i)=>this.handleClick(i)}
          />
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game gameSize={3}/>,
  document.getElementById('root')
);
