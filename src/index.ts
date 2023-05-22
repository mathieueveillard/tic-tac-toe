import and from "./util/and";
import not from "./util/not";

type Player = "X" | "O";

const GRID_SIZE = 3;

type ValidIndex = 0 | 1 | 2;

type Position = Readonly<{
  row: ValidIndex;
  column: ValidIndex;
}>;

type CellContent = Player | "";

type Cell = Readonly<{
  position: Position;
  content: CellContent;
}>;

type Board = Cell[];

type AbstractGame = Readonly<{
  status: string;
  board: Board;
}>;

export type OngoingGame = AbstractGame &
  Readonly<{
    status: "ONGOING";
    nextPlayer: Player;
  }>;

export type FinishedGame = AbstractGame &
  Readonly<{
    status: "FINISHED";
    winner: Player | "None";
  }>;

export type Game = OngoingGame | FinishedGame;

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

export const EMPTY_BOARD: Board = [
  { position: { row: 0, column: 0 }, content: "" },
  { position: { row: 0, column: 1 }, content: "" },
  { position: { row: 0, column: 2 }, content: "" },
  { position: { row: 1, column: 0 }, content: "" },
  { position: { row: 1, column: 1 }, content: "" },
  { position: { row: 1, column: 2 }, content: "" },
  { position: { row: 2, column: 0 }, content: "" },
  { position: { row: 2, column: 1 }, content: "" },
  { position: { row: 2, column: 2 }, content: "" },
];

export const play =
  (game: Game) =>
  (move: Move): Game => {
    if (gameHasAlreadyFinished(game)) {
      // Temporary solution: not the canonical way to handle user input errors
      throw Error("Can't play: the game is finished.");
    }

    if (wrongPlayer(game)(move)) {
      // Temporary solution: not the canonical way to handle user input errors
      throw Error("Can't play: wrong player.");
    }

    const nextBoard = setCellContent(move)(game.board);

    if (playerWins(nextBoard)(move.player)) {
      return {
        status: "FINISHED",
        board: nextBoard,
        winner: move.player,
      };
    }

    if (boardIsFull(nextBoard)) {
      return {
        status: "FINISHED",
        board: nextBoard,
        winner: "None",
      };
    }

    return {
      status: "ONGOING",
      board: nextBoard,
      nextPlayer: otherPlayer(move.player),
    };
  };

const setCellContent =
  (move: Move) =>
  (board: Board): Board => {
    return board.map((cell) => {
      if (positionsMatch(move.position)(cell.position)) {
        if (!isEmpty(cell)) {
          // Temporary solution: not the canonical way to handle user input errors
          throw Error("Can't play: the cell is not empty.");
        }
        return {
          position: cell.position,
          content: move.player,
        };
      }
      return cell;
    });
  };

const positionsMatch =
  (positionToMatch: Position) =>
  (position: Position): boolean => {
    return positionToMatch.row === position.row && positionToMatch.column === position.column;
  };

const isEmpty = ({ content }: Cell): boolean => {
  return content === "";
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
    row: (from.row + direction.deltaRow * times) as ValidIndex,
    column: (from.column + direction.deltaColumn * times) as ValidIndex,
  });

const getCell =
  (board: Board) =>
  (position: Position): Cell =>
    board[position.row * GRID_SIZE + position.column];

const matchesPlayer =
  (player: Player) =>
  (cell: Cell): boolean =>
    cell.content === player;

const boardIsFull = (board: Board): boolean => {
  return board.map(not(isEmpty)).reduce(and, true);
};

const gameHasAlreadyFinished = (game: Game): game is FinishedGame => {
  return game.status === "FINISHED";
};

const wrongPlayer = (game: OngoingGame) => (move: Move) => {
  return move.player !== game.nextPlayer;
};
