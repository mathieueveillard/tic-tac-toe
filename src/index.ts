import and from "./util/and";
import not from "./util/not";

type Player = "X" | "O";

const GRID_SIZE = 3;

type Index = 0 | 1 | 2;

type Position = Readonly<{
  row: Index;
  column: Index;
}>;

type Cell = "" | Player;

// [ 0, 1, 2,
//   3, 4, 5,
//   6, 7, 8]
type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];

type AbstractGame<Status extends string> = Readonly<{
  status: Status;
  board: Board;
}>;

export type OngoingGame = AbstractGame<"ONGOING"> &
  Readonly<{
    nextPlayer: Player;
  }>;

export type WinningGame = AbstractGame<"WINNING"> &
  Readonly<{
    winner: Player;
  }>;

export type DrawGame = AbstractGame<"DRAW">;

export type Game = OngoingGame | WinningGame | DrawGame;

export const createOngoingGame = (board: Board, nextPlayer: Player): OngoingGame => ({
  status: "ONGOING",
  board,
  nextPlayer,
});

export const createWinningGame = (board: Board, winner: Player): WinningGame => ({
  status: "WINNING",
  board,
  winner,
});

export const createDrawGame = (board: Board): DrawGame => ({
  status: "DRAW",
  board,
});

export type Move = Readonly<{
  player: Player;
  position: Position;
}>;

type Direction = Readonly<{
  deltaRow: number;
  deltaColumn: number;
}>;

const DIRECTION_ROW: Direction = {
  deltaRow: 0,
  deltaColumn: 1,
};

const DIRECTION_COLUMN: Direction = {
  deltaRow: 1,
  deltaColumn: 0,
};

const DIRECTION_DIAGONAL_DESCENDING: Direction = {
  deltaRow: 1,
  deltaColumn: 1,
};

const DIRECTION_DIAGONAL_ASCENDING: Direction = {
  deltaRow: -1,
  deltaColumn: 1,
};

export const EMPTY_BOARD: Board = ["", "", "", "", "", "", "", "", ""];

// This function is **NOT** pure because it throws exceptions. Otherwise, it would be pure.
export const play =
  (move: Move) =>
  (game: Game): Game => {
    if (hasFinished(game)) {
      // Temporary solution: not the canonical way to handle user input errors
      throw Error("Can't play: the game has already finished.");
    }

    if (wrongPlayer(game)(move)) {
      // Temporary solution: not the canonical way to handle user input errors
      throw Error("Can't play: wrong player.");
    }

    const nextBoard = setCellContent(move)(game.board);

    if (playerWins(nextBoard)(move.player)) {
      return createWinningGame(nextBoard, move.player);
    }

    if (boardIsFull(nextBoard)) {
      return createDrawGame(nextBoard);
    }

    return createOngoingGame(nextBoard, otherPlayer(move.player));
  };

const computeBoardIndexFromPosition = ({ row, column }: Position): number => {
  return row * GRID_SIZE + column;
};

const setCellContent =
  (move: Move) =>
  (board: Board): Board => {
    const nextBoard: Board = [...board];

    const index = computeBoardIndexFromPosition(move.position);

    if (!isEmpty(nextBoard[index])) {
      // Temporary solution: not the canonical way to handle user input errors
      throw Error("Can't play: the cell is not empty.");
    }

    nextBoard[index] = move.player;
    return nextBoard;
  };

const isEmpty = (cell: Cell): boolean => {
  return cell === "";
};

const otherPlayer = (player: Player): Player => {
  switch (player) {
    case "X":
      return "O";
    case "O":
      return "X";
  }
};

const playerWins =
  (board: Board) =>
  (player: Player): boolean => {
    const checkDirection =
      (from: Position) =>
      (direction: Direction): boolean => {
        return [0, 1, 2]
          .map(shiftPosition(from)(direction))
          .map(getCell(board))
          .map(matchesPlayer(player))
          .reduce(and, true);
      };

    return (
      checkDirection({ row: 0, column: 0 })(DIRECTION_ROW) ||
      checkDirection({ row: 1, column: 0 })(DIRECTION_ROW) ||
      checkDirection({ row: 2, column: 0 })(DIRECTION_ROW) ||
      checkDirection({ row: 0, column: 0 })(DIRECTION_COLUMN) ||
      checkDirection({ row: 0, column: 1 })(DIRECTION_COLUMN) ||
      checkDirection({ row: 0, column: 2 })(DIRECTION_COLUMN) ||
      checkDirection({ row: 0, column: 0 })(DIRECTION_DIAGONAL_DESCENDING) ||
      checkDirection({ row: 2, column: 0 })(DIRECTION_DIAGONAL_ASCENDING)
    );
  };

const shiftPosition =
  (from: Position) =>
  (direction: Direction) =>
  (times: number): Position => ({
    row: (from.row + direction.deltaRow * times) as Index,
    column: (from.column + direction.deltaColumn * times) as Index,
  });

const getCell =
  (board: Board) =>
  (position: Position): Cell =>
    board[position.row * GRID_SIZE + position.column];

const matchesPlayer =
  (player: Player) =>
  (cell: Cell): boolean =>
    cell === player;

const boardIsFull = (board: Board): boolean => {
  return board.map(not(isEmpty)).reduce(and, true);
};

const hasFinished = (game: Game): game is WinningGame | DrawGame => {
  return game.status === "WINNING" || game.status === "DRAW";
};

const wrongPlayer = (game: OngoingGame) => (move: Move) => {
  return move.player !== game.nextPlayer;
};
