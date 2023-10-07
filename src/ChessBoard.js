/**
 * Refactor Plan
 * - manage all states in chessboard (for now)
 * - treat chessboard like redux state
 * - use reducer to manage actions (for cleaner state management)
 */


import { useState } from "react";
import { useRef } from "react";

import './App.scss';

/*******************************************************************************
 * Helper Functions
 ******************************************************************************/
export function getPieceImg(piece) {
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
    
    e.dataTransfer.setData("piece color", piece['color']);
    e.dataTransfer.setData("piece type", piece['type']);
    e.dataTransfer.setData("from", position);
    
    e.dataTransfer.effectAllowed = "move";

    // set timeout trick to allow js to clone the element for dragging
    // before hiding the original element
    // https://stackoverflow.com/questions/36379184/html5-draggable-hide-original-element
    setTimeout(()=>{
      setIsDragging(true);
    }, 0.01); 

    showLegalMoves(position);
  }
  const onDragEnd = (e) => {
    setIsDragging(false);
    showLegalMoves(null);
  }
  return (
    <button className="chess-piece">
      <img 
        className={isDragging? "chess-piece--dragging": ""}
        src={getPieceImg(piece)} 
        draggable="true" 
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />
    </button>
  )
}

function PromotionSelect({style}){
  const pieceTypes = ['n', 'b', ,'r', 'q'];
  const color = 'w';
  const elements = pieceTypes.map((pieceType, _)=>{
    return (
      <div className="promotion__square">
        <img src={getPieceImg({'type': pieceType, 'color': color})} draggable="false"/>
      </div>
    )
  });
  return (
    <div className="promotion" style={style}>
      {elements}
    </div>
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
    
    let pieceType = e.dataTransfer.getData("piece type");
    let from = e.dataTransfer.getData("from");
    let to = getSquareName(rank, file);

    // if from == to, do nothing
    if (from != to) {
      //handle promotion
      if (pieceType == "p" && (rank == 8 || rank == 1)){ 
        console.log("promotion");
        alert("promotion");
      }
      else {
        onMove(from, to);
      }
    }
    
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
  const [promotionSelect, setPromotionSelect] = useState({
    show: true,
    left: 0,
    top: 0
  });
  // //keep tracks of piece being moved
  // const move = useRef({
  //   from: null, 
  //   to: null,
  //   pieceType: null,
  //   pieceColor: null,
  // }); 
  
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
    <div className="chess-board">
      {promotionSelect.show? <PromotionSelect style={promotionSelect}/> : ""}
      {board}
    </div>
  )
}

export default ChessBoard;