import { useState } from "react";

// import logo from './logo.svg';
import './App.css';

function getPieceImg(pieceNotation) {
  // Retrive the image path of a piece given its notation.
  if(pieceNotation == null) return;
  let color = pieceNotation.toLowerCase() === pieceNotation? 'b' : 'w';
  return 'images/' + color + pieceNotation + '.png'; //e.g. img/bk.png
}

// coordinates on chess board
const RANKS = [1,2,3,4,5,6,7,8];
const FILES = ['a','b','c','d','e','f','g','h'];

function ChessPiece({piece}) {
  const [isDragging, setIsDragging] = useState(false)
  
  const onDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.setData("piece", piece);
    e.dataTransfer.effectAllowed = "move";
    console.log(e.target);
  }
  const onDragEnd = (e) => {
    setIsDragging(false);
  }
  return (
    <button className="chess-piece">
      <img 
        className={isDragging? "grabbing": ""}
        src={getPieceImg(piece)} 
        draggable="true" 
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />
    </button>
  )
}

function Square({rank, file, color, piece}) {
  const onDragOver = (e) => {
    e.preventDefault();
  }
  const onDrop = (e) => {
    e.preventDefault();
    console.log(e.dataTransfer.getData("piece"));
  }
  return (
    <div className={"square " + color} 
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <span className="file-text">{rank === 7? FILES[file] : null}</span>
      <span className="rank-text">{file == 0? RANKS[rank] : null}</span>
      <ChessPiece piece={piece} />
    </div>
  );
}



function ChessBoard({position}) {
  const board = Array(8).fill(0).map((_, i) => {
    const row = Array(8).fill(0).map((_, j) => {
      return (
        <Square 
          key={RANKS[i] + FILES[j]} 
          rank={i} 
          file={j} 
          color={(i+j) % 2 === 0? "light":"dark"}
          piece={position[i][j]}
        />
      );
    });
    return (
      <div key={RANKS[i]} className="board-row">
        {row}
      </div>
    )
  });
  return (
    <div className="chess-board">
      {board}
    </div>
  )
}

function setBoard() {    
  // Set the initial position of board to a new game 
  const position = Array(8).fill(Array(8));
  position[0] = 'rnbqkbnr'.split("");
  position[1] = 'pppppppp'.split("");
  position[position.length - 1] = 'RNBQKBNR'.split("");
  position[position.length - 2] = 'PPPPPPPP'.split("");
  return position
}

function Game() {
  const [position, setPosition] = useState(setBoard())
  return (
    <ChessBoard position={position} />
  )
}

export default Game;