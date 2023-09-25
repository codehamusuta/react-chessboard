import { useState } from "react";
import { Chess } from "chess.js";

import './App.css';

function getPieceImg(piece) {
  /** Retrive the image path of a piece given its notation.
   *  Piece notation follows chessjs format {type: str, color: str}
  */
 if(piece == null) return;
 return 'images/' + piece['color'] + piece['type'] + '.png'; //e.g. image/bk.png
}

// coordinates on chess board
const RANKS = [1,2,3,4,5,6,7,8];
const FILES = ['a','b','c','d','e','f','g','h'];

function ChessPiece({piece, rank, file}) {
  const [isDragging, setIsDragging] = useState(false)
  
  const onDragStart = (e) => {
    
    e.dataTransfer.setData("piece", piece);
    e.dataTransfer.setData("rank", rank);
    e.dataTransfer.setData("file", file);
    
    e.dataTransfer.effectAllowed = "move";
    console.log(e.target);
    setIsDragging(true);
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
    
    // onMove(
    //   e.dataTransfer.getData("piece"),
    //   [e.dataTransfer.getData("rank"), e.dataTransfer.getData("file")],
    //   [rank, file]
    // );

    console.log(e.dataTransfer.getData("piece"));
    console.log(rank, file);
  }
  return (
    <div className={"square " + color} 
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <span className="file-text">{rank === 7? FILES[file] : null}</span>
      <span className="rank-text">{file == 0? RANKS[rank] : null}</span>
      <ChessPiece piece={piece} rank={rank} file={file}/>
    </div>
  );
}

function setBoard() {    
  const _f = (fen) => {
    return fen.split("").map((piece, i) => {
      return {type: piece, color: piece.toLowerCase() === piece? "b": "w"}
    })
  }
  // Set the initial position of board to a new game 
  const position = new Array(8).fill(null).map(()=> new Array(8).fill(null));
  position[0] = _f('rnbqkbnr');
  position[1] = _f('pppppppp');
  position[position.length - 1] = _f('RNBQKBNR');
  position[position.length - 2] = _f('PPPPPPPP');
  return position
}



function ChessBoard({position = setBoard()}) {
  const board = Array(8).fill(0).map((_, i) => {
    const row = Array(8).fill(0).map((_, j) => {
      return (
        <Square 
          key={FILES[j] + RANKS[i]} 
          rank={i} 
          file={j} 
          color={(i+j) % 2 === 0? "light":"dark"}
          piece={position[i][j]}
          // onMove={onMove}
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

export default ChessBoard;