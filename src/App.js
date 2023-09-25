import { useState } from "react";
import { Chess } from "chess.js";
import ChessBoard from "./ChessBoard.js";

// import logo from './logo.svg';
import './App.css';

const chess = new Chess(); //object that handles logic

function Game() {
  const [position, setPosition] = useState(chess.board());

  function onMove(from, to) {
    try {
      // move piece and update board state
      chess.move({from, to});
      setPosition(chess.board());
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
  }

  return (
    <>
      <ChessBoard position={position} onMove={onMove} getLegalMoves={getLegalMoves}/>
      <div>
        <button onClick={resetBoard}>New Game</button>
      </div>
    </>
  );
}

export default Game;