import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/*class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}*/
function Square(props){
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
}

/*
function BordRow(props){
    return(
        for (var i = 1; i <= 4; i++) {
            <Square
                value = {i}
                onClick={()=>this.props.onClick(i)}
            />
        }
    )
}*/


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
            cordinate: Array(2).fill(null),
        }],

        xIsNext:true,
        stepCount: 0,
        winner:null,
     }
  }

  getCordinate(i){
      var cordinate = new Array(2);
      var x = parseInt(i / this.props.gameSize,10);
      var y = parseInt(i % this.props.gameSize,10);

      cordinate[0] = y===0 ? x : x + 1;
      cordinate[1] = y===0 ? this.props.gameSize : y;

      return cordinate;
  }

  calculateWinner(squares,istep){

   /*if (this.state.stepCount < this.props.gameSize*2-1) {
      return null;
    }*/

    var curValue = squares[istep-1];

    //坐标已经转换后，从1开始
    var cordinate = new Array();
    cordinate = this.getCordinate(istep);

    var trueCount = 0;
    for (var i = 0; i < this.props.gameSize; i++) { 
      if(squares[(cordinate[0]-1)*this.props.gameSize+i] === curValue) {
        trueCount ++;
      }

    }
    if (trueCount === this.props.gameSize) {
        return curValue;
    } 

    trueCount = 0
    for (var i = 0; i < this.props.gameSize; i++) {
      if(squares[(cordinate[1]-1)+this.props.gameSize*i] === curValue) {
        trueCount++;
      }
    }
    if (trueCount === this.props.gameSize) {
      return curValue;
    }

    if (cordinate[0]===cordinate[1] ||
        (this.props.gameSize - cordinate[0] + 1)===cordinate[1]){
      //此时需检查横竖及对角线
    trueCount = 0;
      for (var i = 0; i < this.props.gameSize; i++) {
        if (squares[i+this.props.gameSize*i] === curValue) {
          trueCount ++;
        }
      }
      if (trueCount===this.props.gameSize) {
        return curValue;
      }

      trueCount = 0;
      for (var i = 0; i < this.props.gameSize; i++) {
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

      const cordinate = this.getCordinate(i);

      if (this.state.winner || squares[i-1]) {
          return;
      }

      squares[i-1] = this.state.xIsNext ? 'X':'O';

      this.setState({
        history: history.concat([{squares:squares,cordinate:cordinate}]),
        xIsNext: !this.state.xIsNext,
        stepCount: this.state.stepCount + 1,
        winner: this.calculateWinner(squares,i),
      });

  }

  resetGame(){
      this.setState({
      history:[{
          squares: Array(this.props.gameSize*this.props.gameSize).fill(null),
          cordinate: Array(2).fill(null),
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
        const desc = move ? 'Step'+ move + ': cord(' + history[move].cordinate+')' : 'Game start！';
    
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
  <Game gameSize={2}/>,
  document.getElementById('root')
);
