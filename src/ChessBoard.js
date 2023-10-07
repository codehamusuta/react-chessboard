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
function ChessPiece({piece, position, showLegalMoves, movePiece}) {
  const [isDragging, setIsDragging] = useState(false) 
  
  const onDragStart = (e) => {
    
    movePiece(position, piece['type'], piece['color'])
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

function PromotionSelect({style, pieceColor, selectPromotion}){
  const pieceTypes = ['n', 'b', ,'r', 'q'];
  const elements = pieceTypes.map((pieceType, _)=>{
    return (
      <div className="promotion__square" 
           key={pieceType} 
           onClick={()=>selectPromotion(pieceType)}
      >
        <img src={getPieceImg({'type': pieceType, 'color': pieceColor})} draggable="false"/>
      </div>
    )
  });
  return (
    <div className="promotion" style={style}>
      {elements}
    </div>
  )
}

function Square({rank, file, color, piece, 
  moveHandler, highlightAsLegal, showLegalMoves,
  dropPiece,
  movePiece
}) {
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
    dropPiece(rank, file);
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
      <ChessPiece 
          piece={piece} 
          position={getSquareName(rank, file)} 
          showLegalMoves={showLegalMoves}
          movePiece={movePiece}
      />
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

function getFileIndex(file) {
  //convert file to index
  const FILES = ['a','b','c','d','e','f','g','h'];
  return FILES.indexOf(file);
}

function ChessBoard({
  position = setBoard(), turn, moveHandler, getLegalMoves
}) {
  const [legalMoves, setLegalMoves] = useState([]); //highlight legal moves
  const [promotionSelect, setPromotionSelect] = useState({
    show: false,
    pieceColor: 'w',
    style: {
      left: 0,
      top: 0
    }
  });
  // keep tracks of piece being moved
  const move = useRef({
    from: null, 
    to: null,
    pieceType: null,
    pieceColor: null,
  }); 
  
  //============================================================================
  // Functions
  //============================================================================
  function showLegalMoves(square) {
    if(square === null) {
      setLegalMoves([]);
    } else {
      setLegalMoves(getLegalMoves(square));
    }
  }

  function movePiece(from, pieceType, pieceColor) {
    move.current = {
      from, pieceColor, pieceType
    }
  }

  function dropPiece(rank, file) {
    
    let from = move.current.from;
    let to = getSquareName(rank, file);

    if (turn != move.current.pieceColor) return //illegal move, do nothing
    if (from == to) return //not moving anything, do nothing

    //update ref
    move.current.to = to;

    //handle promotion
    if (move.current.pieceType == "p" && (rank == 8 || rank == 1)){ 
      const style = rank == 1? {bottom: 0}: {top: 0}
      setPromotionSelect({
        show: true,
        pieceColor: move.current.pieceColor,
        style: {
          ...style,
          left: getFileIndex(file) * 50
        }
      });
    }
    else {
      moveHandler({from, to});
    } 
  }

  function selectPromotion(promotion) {
    const from = move.current.from
    const to = move.current.to
    moveHandler({from, to, promotion})
    setPromotionSelect({
      ...promotionSelect,
      show: false
    });
  }

  //============================================================================
  // Render Board
  //============================================================================
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
          moveHandler={moveHandler}
          highlightAsLegal={legalMoves.includes(getSquareName(rank, file))}
          showLegalMoves={showLegalMoves}
          movePiece={movePiece}
          dropPiece={dropPiece}
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
      { promotionSelect.show? 
        <PromotionSelect 
          style={promotionSelect.style} 
          pieceColor={promotionSelect.pieceColor} 
          selectPromotion={selectPromotion}
        /> 
        : null
      }
      {board}
    </div>
  )
}

export default ChessBoard;