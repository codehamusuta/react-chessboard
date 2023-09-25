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
      //move piece
      chess.move({from, to});
      //update position
      setPosition(chess.board());
    } catch (error) {
      //handle invalid moves here
      console.log(error);
    }
  }

  function resetBoard() {
    chess.reset();
    setPosition(chess.board());
  }

  return (
    <>
      <ChessBoard position={position} onMove={onMove}/>
      <div>
        <button onClick={resetBoard}>New Game</button>
      </div>
    </>
  );
}

export default Game;