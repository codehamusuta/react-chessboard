import { useState } from "react";

import './App.css';

/*******************************************************************************
 * Helper Functions
 ******************************************************************************/
function getPieceImg(piece) {
  // Retrive the image path of a piece given its notation.
  // Piece notation follows chessjs format {type: str, color: str}
 if(piece == null) return;
 return 'images/' + piece['color'] + piece['type'] + '.png'; //e.g. image/bk.png
}

function getSquareName(rank, file) {
  return file + rank; //e.g 'a5'
}

/*******************************************************************************
 * Components
 ******************************************************************************/
function ChessPiece({piece, position, showLegalMoves}) {
  const [isDragging, setIsDragging] = useState(false) 
  
  const onDragStart = (e) => {
    
    e.dataTransfer.setData("piece", piece);
    e.dataTransfer.setData("from", position);
    
    e.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
    showLegalMoves(position);
  }
  const onDragEnd = (e) => {
    setIsDragging(false);
    showLegalMoves(null);
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

function Square({rank, file, color, piece, onMove, highlightAsLegal, showLegalMoves}) {
  const [isDragOver, setIsDragOver] = useState(false) //for highlighting squares

  function onDragEnter(e) {
    setIsDragOver(true);
  }
  function onDragLeave(e) {
    setIsDragOver(false);
  }
  function onDragOver(e) {
    e.preventDefault();
  }
  function onDrop(e) {
    e.preventDefault();
    
    let from = e.dataTransfer.getData("from")
    let to = getSquareName(rank, file);
    onMove(from, to);
    
    setIsDragOver(false);
  }
  
  return (
    <div className={"square " + color + (isDragOver? " dragover": "") + (highlightAsLegal? " legal": "")}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
    >
      <div className="square__dot"></div>
      <span className="file-text">{rank === 1? file : null}</span>
      <span className="rank-text">{file === 'a'? rank : null}</span>
      <ChessPiece piece={piece} position={getSquareName(rank, file)} showLegalMoves={showLegalMoves}/>
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


function ChessBoard({position = setBoard(), onMove, getLegalMoves}) {
  const [legalMoves, setLegalMoves] = useState([]); //highlight legal moves
  
  function showLegalMoves(square) {
    if(square === null) {
      setLegalMoves([]);
    } else {
      setLegalMoves(getLegalMoves(square));
    }
  }

  // coordinates on chess board
  const RANKS = [1,2,3,4,5,6,7,8];
  const FILES = ['a','b','c','d','e','f','g','h'];

  //baord is a collection of rows
  const board = RANKS.reverse().map((rank, i) => {
    //row is a collection of squares
    const row = FILES.map((file, j) => {
      return (
        <Square 
          key={getSquareName(rank, file)} 
          rank={rank}
          file={file}
          color={(i+j) % 2 === 0? "light":"dark"}
          piece={position[i][j]} 
          onMove={onMove}
          highlightAsLegal={legalMoves.includes(getSquareName(rank, file))}
          showLegalMoves={showLegalMoves}
        />
      );
    });
    return (
      <div key={rank} className="board-row">
        {row}
      </div>
    )
  });
  return (
    <div className="chess-board">{board}</div>
  )
}

export default ChessBoard;