//boilerplate
//ChessBoard
//Squares

// import logo from './logo.svg';
import './App.css';

function getPieceImg(pieceNotation) {
  if(pieceNotation == null) return;
  let color = pieceNotation.toLowerCase() === pieceNotation? 'b' : 'w';
  return 'images/' + color + pieceNotation + '.png'; //e.g. img/bk.png
}

function Square({rank, file, color, piece}) {
  return (
    <div className={"square " + color}>
      <span className="file-text">{rank === 1? file : null}</span>
      <span className="rank-text">{file == 'a'? rank : null}</span>
      <button className="chess-piece">
        <img src={getPieceImg(piece)} />
      </button>
    </div>
  );
}

function Game() {
  const position = Array(8).fill(Array(8));
  position[0] = 'rnbqkbnr'.split("");
  position[1] = 'pppppppp'.split("");
  position[position.length - 1] = 'RNBQKBNR'.split("");
  position[position.length - 2] = 'PPPPPPPP'.split("");

  console.log(position);
  return (
    <ChessBoard position={position} />
  )

}

function ChessBoard({position}) {
  let ranks = [1,2,3,4,5,6,7,8];
  let files = ['a','b','c','d','e','f','g','h'];
  
  const board = ranks.reverse().map((rank, i) => {
    const row = files.map((file, j) => {
      return (
        <Square 
          key={rank+file} 
          rank={rank} 
          file={file} 
          color={(i+j) % 2 === 0? "light":"dark"}
          piece={position[i][j]}
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
      {board}
    </div>
  )
}

export default Game;