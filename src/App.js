import { useState } from "react";
import { Chess } from "chess.js";
import ChessBoard, { getPieceImg } from "./ChessBoard.js";

// import logo from './logo.svg';
import './App.scss';

const chess = new Chess(); //object that handles logic

//to remove
const test_fen = "k7/4P3/8/8/8/8/4p3/7K w - - 0 1"
chess.load(test_fen);

function Player({opponentColor, capturedPieces}) {
  //the order to display the captured pieces
  const pieceTypes = ['p', 'n', 'b', 'r', 'q', 'k']; 
  const images = [];
  for (let type of pieceTypes) {
    for (let i=0; i<capturedPieces[type]; i++) {
      images.push(
        <img key={type+i.toString()}
             className="player__captures"
             src={getPieceImg({color: opponentColor, type: type})} 
        /> 
      );
    }
  }
  return (
    <div className="player">
      {images}
    </div>
  )
}

function Game() {
  const [position, setPosition] = useState(chess.board());
  const [history, setHistory] = useState(null);
  const [msg, setMsg] = useState(getDisplayMsg());
  const [captures, setCaptures] = useState(resetCaptures());

  function resetCaptures() {
    return {
      'b': {'p': 0,'n': 0,'b': 0, 'r': 0, 'q': 0, 'k': 0},
      'w': {'p': 0,'n': 0,'b': 0, 'r': 0, 'q': 0, 'k': 0}
    }
  }
  function updateGameState() {
    setPosition(chess.board());
    setHistory(chess.history().reduce((curr="", move, moveNo)=>{
        return curr + String(moveNo+1) + ". " + move + ", ";
      }, ""));

    //update board msg
    setMsg(getDisplayMsg());
  }
  function updateCaptures(move, undo=false) {
    const captured = (move && move['captured']) || null;
    if(captured) {
      const change = undo? -1: 1; 
      const player = move['color'];
      const updates = {
        ...captures[player],
        [captured]: captures[player][captured] + change // current count of captured pieces that are similar to captured + 1
      }
      setCaptures({
        ...captures,
        [player]: updates
      });
    }
  }
  function onMove(from, to) {
    try {
      if(chess.isGameOver()) {
        return;
      }
      // move piece and update board state
      const move = chess.move({from, to});
      updateCaptures(move, undo=false);
      updateGameState();
    } catch (error) {
      // handle invalid moves here
      console.log(error);
    }
  }
  function undo() {
    const move = chess.undo();
    updateCaptures(move, undo=true);
    updateGameState();
  }
  function getLegalMoves(square) {
    //return list of squares current piece can move to
    return chess.moves({square: square, verbose: true}).map((move, _)=>{
      return move['to'];
    }); //use verbose because the information on destination squares only available in verbose mode
  }
  function resetBoard() {
    chess.reset();
    updateGameState();
    setCaptures(resetCaptures());
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
      return `It's ${turn}'s turn to move.`;
    }
  }
  
  return (
    <div className="game">
      <div className="game-mid">
        <div className="game-mid__left">
          <Player opponentColor={"w"} capturedPieces={captures["b"]} />
          <ChessBoard position={position} onMove={onMove} getLegalMoves={getLegalMoves}/>
          <Player opponentColor={"b"} capturedPieces={captures["w"]} />
        </div>
        <div className="history">
          <h4>History</h4>
          <p>{history}</p>
        </div> 
      </div>
      
      <div className="game-bottom">
        <div className="msg-board">{msg}</div>
        <div className="button-board">
          <button onClick={resetBoard}>New Game</button>
          <button onClick={undo}>Undo</button>
        </div>
      </div>
    </div>
  );
}

export default Game;