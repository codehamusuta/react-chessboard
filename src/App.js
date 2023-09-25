import { useState } from "react";
import { Chess } from "chess.js";
import ChessBoard from "./ChessBoard.js";

// import logo from './logo.svg';
import './App.css';

const chess = new Chess(); //object that handles logic

function Game() {
  const [position, setPosition] = useState(chess.board());
  const [history, setHistory] = useState(null);
  const [msg, setMsg] = useState(getDisplayMsg());

  function onMove(from, to) {
    try {
      if(chess.isGameOver()) {
        return;
      }

      // move piece and update board state
      chess.move({from, to});
      setPosition(chess.board());
      setHistory(chess.history().reduce((curr="", move, moveNo)=>{
        return curr + String(moveNo+1) + ". " + move + ", ";
      }, ""));

      //update board msg
      setMsg(getDisplayMsg());

    } catch (error) {
      // handle invalid moves here
      // console.log(error);
    }
  }
  function getLegalMoves(square) {
    //return list of squares current piece can move to
    return chess.moves({square: square, verbose: true}).map((move, _)=>{
      return move['to'];
    }); //use verbose because the information on destination squares only available in verbose mode
  }
  function resetBoard() {
    chess.reset();
    setPosition(chess.board());
    setHistory(null);
    setMsg(getDisplayMsg());
  }
  function getDisplayMsg() {
    if(chess.isGameOver()) {
      if(chess.isCheckmate()) {
        let turn = chess.turn() === 'b'? 'White': 'Black';
        return `Checkmate! ${turn} wins.`;
      } else if(chess.isInsufficientMaterial()) {
        return "Game drawn due to insufficient material.";
      } else if(chess.isStalemate()) {
        return `Game drawn by stalemate.`;
      } else if(chess.isThreefoldRepetition()){
        return `Game drawn due to reptition.`;
      } else {
        return "Game Over.";
      };
    } else {
      let turn = chess.turn() === 'b'? 'black': 'white';
      return `It's ${turn} turn to move.`;
    }
  }

  return (
    <div className="game">
      <div className="mid">
        <ChessBoard position={position} onMove={onMove} getLegalMoves={getLegalMoves}/>
        <div className="history">{history}</div> 
      </div>
      <div className="bottom">
        <div className="msg-board">{msg}</div>
        <div className="button-board">
          <button onClick={resetBoard}>New Game</button>
          <button onClick={()=>{}}>Undo</button>
        </div>
      </div>
    </div>
  );
}

export default Game;