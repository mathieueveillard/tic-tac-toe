import { EMPTY_BOARD, FinishedGame, Game, Move, OngoingGame, play } from ".";

const playMoves = (moves: Move[]): Game => {
  const NOT_STARTED_GAME: OngoingGame = {
    status: "ONGOING",
    board: EMPTY_BOARD,
    nextPlayer: "X",
  };
  return moves.reduce((game, move) => play(game)(move), NOT_STARTED_GAME);
};

test("Allow a player to play on an empty cell", () => {
  // GIVEN
  const game: OngoingGame = {
    status: "ONGOING",
    board: EMPTY_BOARD,
    nextPlayer: "X",
  };
  const move: Move = {
    player: "X",
    position: {
      row: 0,
      column: 0,
    },
  };

  // WHEN
  const actual = play(game)(move);

  // THEN
  const expected: Partial<OngoingGame> = {
    board: [
      { position: { row: 0, column: 0 }, content: "X" },
      { position: { row: 0, column: 1 }, content: "" },
      { position: { row: 0, column: 2 }, content: "" },
      { position: { row: 1, column: 0 }, content: "" },
      { position: { row: 1, column: 1 }, content: "" },
      { position: { row: 1, column: 2 }, content: "" },
      { position: { row: 2, column: 0 }, content: "" },
      { position: { row: 2, column: 1 }, content: "" },
      { position: { row: 2, column: 2 }, content: "" },
    ],
  };
  expect(actual.board).toEqual(expected.board);
});

test("[Triangulation] Allow a player to play on an empty cell", () => {
  // GIVEN
  const game: OngoingGame = {
    status: "ONGOING",
    board: EMPTY_BOARD,
    nextPlayer: "X",
  };
  const move: Move = {
    player: "X",
    position: {
      row: 0,
      column: 1,
    },
  };

  // WHEN
  const actual = play(game)(move);

  // THEN
  const expected: Partial<OngoingGame> = {
    board: [
      { position: { row: 0, column: 0 }, content: "" },
      { position: { row: 0, column: 1 }, content: "X" },
      { position: { row: 0, column: 2 }, content: "" },
      { position: { row: 1, column: 0 }, content: "" },
      { position: { row: 1, column: 1 }, content: "" },
      { position: { row: 1, column: 2 }, content: "" },
      { position: { row: 2, column: 0 }, content: "" },
      { position: { row: 2, column: 1 }, content: "" },
      { position: { row: 2, column: 2 }, content: "" },
    ],
  };
  expect(actual.board).toEqual(expected.board);
});

test("Allow the other player to play on an empty cell", () => {
  // GIVEN
  const game: OngoingGame = {
    status: "ONGOING",
    board: EMPTY_BOARD,
    nextPlayer: "O",
  };
  const move: Move = {
    player: "O",
    position: {
      row: 0,
      column: 0,
    },
  };

  // WHEN
  const actual = play(game)(move);

  // THEN
  const expected: Partial<OngoingGame> = {
    board: [
      { position: { row: 0, column: 0 }, content: "O" },
      { position: { row: 0, column: 1 }, content: "" },
      { position: { row: 0, column: 2 }, content: "" },
      { position: { row: 1, column: 0 }, content: "" },
      { position: { row: 1, column: 1 }, content: "" },
      { position: { row: 1, column: 2 }, content: "" },
      { position: { row: 2, column: 0 }, content: "" },
      { position: { row: 2, column: 1 }, content: "" },
      { position: { row: 2, column: 2 }, content: "" },
    ],
  };
  expect(actual.board).toEqual(expected.board);
});

test("Force players to play one after the other", () => {
  // GIVEN
  const game: OngoingGame = {
    status: "ONGOING",
    board: EMPTY_BOARD,
    nextPlayer: "X",
  };
  const move: Move = {
    player: "X",
    position: {
      row: 0,
      column: 0,
    },
  };

  // WHEN
  const actual = play(game)(move);

  // THEN
  const expected: OngoingGame = {
    status: "ONGOING",
    board: [
      { position: { row: 0, column: 0 }, content: "X" },
      { position: { row: 0, column: 1 }, content: "" },
      { position: { row: 0, column: 2 }, content: "" },
      { position: { row: 1, column: 0 }, content: "" },
      { position: { row: 1, column: 1 }, content: "" },
      { position: { row: 1, column: 2 }, content: "" },
      { position: { row: 2, column: 0 }, content: "" },
      { position: { row: 2, column: 1 }, content: "" },
      { position: { row: 2, column: 2 }, content: "" },
    ],
    nextPlayer: "O",
  };
  expect(actual).toEqual(expected);
});

test("Detects that a player wins (3 'X' on the first row)", () => {
  // GIVEN
  const game = playMoves([
    {
      player: "X",
      position: {
        row: 0,
        column: 0,
      },
    },
    {
      player: "O",
      position: {
        row: 1,
        column: 0,
      },
    },
    {
      player: "X",
      position: {
        row: 0,
        column: 1,
      },
    },
    {
      player: "O",
      position: {
        row: 1,
        column: 1,
      },
    },
  ]);
  const move: Move = {
    player: "X",
    position: {
      row: 0,
      column: 2,
    },
  };

  // WHEN
  const actual = play(game)(move);

  // THEN
  const expected: FinishedGame = {
    status: "FINISHED",
    board: [
      { position: { row: 0, column: 0 }, content: "X" },
      { position: { row: 0, column: 1 }, content: "X" },
      { position: { row: 0, column: 2 }, content: "X" },
      { position: { row: 1, column: 0 }, content: "O" },
      { position: { row: 1, column: 1 }, content: "O" },
      { position: { row: 1, column: 2 }, content: "" },
      { position: { row: 2, column: 0 }, content: "" },
      { position: { row: 2, column: 1 }, content: "" },
      { position: { row: 2, column: 2 }, content: "" },
    ],
    winner: "X",
  };
  expect(actual).toEqual(expected);
});

test("Detects that a player wins (3 'X' on the second row)", () => {
  // GIVEN
  const game = playMoves([
    {
      player: "X",
      position: {
        row: 1,
        column: 0,
      },
    },
    {
      player: "O",
      position: {
        row: 0,
        column: 0,
      },
    },
    {
      player: "X",
      position: {
        row: 1,
        column: 1,
      },
    },
    {
      player: "O",
      position: {
        row: 0,
        column: 1,
      },
    },
  ]);
  const move: Move = {
    player: "X",
    position: {
      row: 1,
      column: 2,
    },
  };

  // WHEN
  const actual = play(game)(move);

  // THEN
  const expected: FinishedGame = {
    status: "FINISHED",
    board: [
      { position: { row: 0, column: 0 }, content: "O" },
      { position: { row: 0, column: 1 }, content: "O" },
      { position: { row: 0, column: 2 }, content: "" },
      { position: { row: 1, column: 0 }, content: "X" },
      { position: { row: 1, column: 1 }, content: "X" },
      { position: { row: 1, column: 2 }, content: "X" },
      { position: { row: 2, column: 0 }, content: "" },
      { position: { row: 2, column: 1 }, content: "" },
      { position: { row: 2, column: 2 }, content: "" },
    ],
    winner: "X",
  };
  expect(actual).toEqual(expected);
});

test("Detects that a player wins (3 'X' on the third row)", () => {
  // GIVEN
  const game = playMoves([
    {
      player: "X",
      position: {
        row: 2,
        column: 0,
      },
    },
    {
      player: "O",
      position: {
        row: 0,
        column: 0,
      },
    },
    {
      player: "X",
      position: {
        row: 2,
        column: 1,
      },
    },
    {
      player: "O",
      position: {
        row: 0,
        column: 1,
      },
    },
  ]);
  const move: Move = {
    player: "X",
    position: {
      row: 2,
      column: 2,
    },
  };

  // WHEN
  const actual = play(game)(move);

  // THEN
  const expected: FinishedGame = {
    status: "FINISHED",
    board: [
      { position: { row: 0, column: 0 }, content: "O" },
      { position: { row: 0, column: 1 }, content: "O" },
      { position: { row: 0, column: 2 }, content: "" },
      { position: { row: 1, column: 0 }, content: "" },
      { position: { row: 1, column: 1 }, content: "" },
      { position: { row: 1, column: 2 }, content: "" },
      { position: { row: 2, column: 0 }, content: "X" },
      { position: { row: 2, column: 1 }, content: "X" },
      { position: { row: 2, column: 2 }, content: "X" },
    ],
    winner: "X",
  };
  expect(actual).toEqual(expected);
});

test("Detects that a player wins (3 'X' on the first column)", () => {
  // GIVEN
  const game = playMoves([
    {
      player: "X",
      position: {
        row: 0,
        column: 0,
      },
    },
    {
      player: "O",
      position: {
        row: 0,
        column: 1,
      },
    },
    {
      player: "X",
      position: {
        row: 1,
        column: 0,
      },
    },
    {
      player: "O",
      position: {
        row: 1,
        column: 1,
      },
    },
  ]);
  const move: Move = {
    player: "X",
    position: {
      row: 2,
      column: 0,
    },
  };

  // WHEN
  const actual = play(game)(move);

  // THEN
  const expected: FinishedGame = {
    status: "FINISHED",
    board: [
      { position: { row: 0, column: 0 }, content: "X" },
      { position: { row: 0, column: 1 }, content: "O" },
      { position: { row: 0, column: 2 }, content: "" },
      { position: { row: 1, column: 0 }, content: "X" },
      { position: { row: 1, column: 1 }, content: "O" },
      { position: { row: 1, column: 2 }, content: "" },
      { position: { row: 2, column: 0 }, content: "X" },
      { position: { row: 2, column: 1 }, content: "" },
      { position: { row: 2, column: 2 }, content: "" },
    ],
    winner: "X",
  };
  expect(actual).toEqual(expected);
});

test("Detects that a player wins (3 'X' on the second column)", () => {
  // GIVEN
  const game = playMoves([
    {
      player: "X",
      position: {
        row: 0,
        column: 1,
      },
    },
    {
      player: "O",
      position: {
        row: 0,
        column: 0,
      },
    },
    {
      player: "X",
      position: {
        row: 1,
        column: 1,
      },
    },
    {
      player: "O",
      position: {
        row: 1,
        column: 0,
      },
    },
  ]);
  const move: Move = {
    player: "X",
    position: {
      row: 2,
      column: 1,
    },
  };

  // WHEN
  const actual = play(game)(move);

  // THEN
  const expected: FinishedGame = {
    status: "FINISHED",
    board: [
      { position: { row: 0, column: 0 }, content: "O" },
      { position: { row: 0, column: 1 }, content: "X" },
      { position: { row: 0, column: 2 }, content: "" },
      { position: { row: 1, column: 0 }, content: "O" },
      { position: { row: 1, column: 1 }, content: "X" },
      { position: { row: 1, column: 2 }, content: "" },
      { position: { row: 2, column: 0 }, content: "" },
      { position: { row: 2, column: 1 }, content: "X" },
      { position: { row: 2, column: 2 }, content: "" },
    ],
    winner: "X",
  };
  expect(actual).toEqual(expected);
});

test("Detects that a player wins (3 'X' on the third column)", () => {
  // GIVEN
  const game = playMoves([
    {
      player: "X",
      position: {
        row: 0,
        column: 2,
      },
    },
    {
      player: "O",
      position: {
        row: 0,
        column: 0,
      },
    },
    {
      player: "X",
      position: {
        row: 1,
        column: 2,
      },
    },
    {
      player: "O",
      position: {
        row: 1,
        column: 0,
      },
    },
  ]);
  const move: Move = {
    player: "X",
    position: {
      row: 2,
      column: 2,
    },
  };

  // WHEN
  const actual = play(game)(move);

  // THEN
  const expected: FinishedGame = {
    status: "FINISHED",
    board: [
      { position: { row: 0, column: 0 }, content: "O" },
      { position: { row: 0, column: 1 }, content: "" },
      { position: { row: 0, column: 2 }, content: "X" },
      { position: { row: 1, column: 0 }, content: "O" },
      { position: { row: 1, column: 1 }, content: "" },
      { position: { row: 1, column: 2 }, content: "X" },
      { position: { row: 2, column: 0 }, content: "" },
      { position: { row: 2, column: 1 }, content: "" },
      { position: { row: 2, column: 2 }, content: "X" },
    ],
    winner: "X",
  };
  expect(actual).toEqual(expected);
});

test("Detects that a player wins (3 'X' on the descending diagonal)", () => {
  // GIVEN
  const game = playMoves([
    {
      player: "X",
      position: {
        row: 0,
        column: 0,
      },
    },
    {
      player: "O",
      position: {
        row: 1,
        column: 0,
      },
    },
    {
      player: "X",
      position: {
        row: 1,
        column: 1,
      },
    },
    {
      player: "O",
      position: {
        row: 0,
        column: 1,
      },
    },
  ]);
  const move: Move = {
    player: "X",
    position: {
      row: 2,
      column: 2,
    },
  };

  // WHEN
  const actual = play(game)(move);

  // THEN
  const expected: FinishedGame = {
    status: "FINISHED",
    board: [
      { position: { row: 0, column: 0 }, content: "X" },
      { position: { row: 0, column: 1 }, content: "O" },
      { position: { row: 0, column: 2 }, content: "" },
      { position: { row: 1, column: 0 }, content: "O" },
      { position: { row: 1, column: 1 }, content: "X" },
      { position: { row: 1, column: 2 }, content: "" },
      { position: { row: 2, column: 0 }, content: "" },
      { position: { row: 2, column: 1 }, content: "" },
      { position: { row: 2, column: 2 }, content: "X" },
    ],
    winner: "X",
  };
  expect(actual).toEqual(expected);
});

test("Detects that a player wins (3 'X' on the ascending diagonal)", () => {
  // GIVEN
  const game = playMoves([
    {
      player: "X",
      position: {
        row: 2,
        column: 0,
      },
    },
    {
      player: "O",
      position: {
        row: 1,
        column: 0,
      },
    },
    {
      player: "X",
      position: {
        row: 1,
        column: 1,
      },
    },
    {
      player: "O",
      position: {
        row: 0,
        column: 1,
      },
    },
  ]);
  const move: Move = {
    player: "X",
    position: {
      row: 0,
      column: 2,
    },
  };

  // WHEN
  const actual = play(game)(move);

  // THEN
  const expected: FinishedGame = {
    status: "FINISHED",
    board: [
      { position: { row: 0, column: 0 }, content: "" },
      { position: { row: 0, column: 1 }, content: "O" },
      { position: { row: 0, column: 2 }, content: "X" },
      { position: { row: 1, column: 0 }, content: "O" },
      { position: { row: 1, column: 1 }, content: "X" },
      { position: { row: 1, column: 2 }, content: "" },
      { position: { row: 2, column: 0 }, content: "X" },
      { position: { row: 2, column: 1 }, content: "" },
      { position: { row: 2, column: 2 }, content: "" },
    ],
    winner: "X",
  };
  expect(actual).toEqual(expected);
});

test("Detects that the other player wins (3 'O' on the first row)", () => {
  // GIVEN
  const game = playMoves([
    {
      player: "X",
      position: {
        row: 1,
        column: 0,
      },
    },
    {
      player: "O",
      position: {
        row: 0,
        column: 0,
      },
    },
    {
      player: "X",
      position: {
        row: 1,
        column: 1,
      },
    },
    {
      player: "O",
      position: {
        row: 0,
        column: 1,
      },
    },
    {
      player: "X",
      position: {
        row: 2,
        column: 0,
      },
    },
  ]);
  const move: Move = {
    player: "O",
    position: {
      row: 0,
      column: 2,
    },
  };

  // WHEN
  const actual = play(game)(move);

  // THEN
  const expected: FinishedGame = {
    status: "FINISHED",
    board: [
      { position: { row: 0, column: 0 }, content: "O" },
      { position: { row: 0, column: 1 }, content: "O" },
      { position: { row: 0, column: 2 }, content: "O" },
      { position: { row: 1, column: 0 }, content: "X" },
      { position: { row: 1, column: 1 }, content: "X" },
      { position: { row: 1, column: 2 }, content: "" },
      { position: { row: 2, column: 0 }, content: "X" },
      { position: { row: 2, column: 1 }, content: "" },
      { position: { row: 2, column: 2 }, content: "" },
    ],
    winner: "O",
  };
  expect(actual).toEqual(expected);
});

test("Detects that no player wins", () => {
  // GIVEN
  const game = playMoves([
    {
      player: "X",
      position: {
        row: 0,
        column: 0,
      },
    },
    {
      player: "O",
      position: {
        row: 0,
        column: 1,
      },
    },
    {
      player: "X",
      position: {
        row: 0,
        column: 2,
      },
    },
    {
      player: "O",
      position: {
        row: 1,
        column: 2,
      },
    },
    {
      player: "X",
      position: {
        row: 1,
        column: 0,
      },
    },
    {
      player: "O",
      position: {
        row: 2,
        column: 0,
      },
    },
    {
      player: "X",
      position: {
        row: 1,
        column: 1,
      },
    },
    {
      player: "O",
      position: {
        row: 2,
        column: 2,
      },
    },
  ]);
  const move: Move = {
    player: "X",
    position: {
      row: 2,
      column: 1,
    },
  };

  // WHEN
  const actual = play(game)(move);

  // THEN
  const expected: FinishedGame = {
    status: "FINISHED",
    board: [
      { position: { row: 0, column: 0 }, content: "X" },
      { position: { row: 0, column: 1 }, content: "O" },
      { position: { row: 0, column: 2 }, content: "X" },
      { position: { row: 1, column: 0 }, content: "X" },
      { position: { row: 1, column: 1 }, content: "X" },
      { position: { row: 1, column: 2 }, content: "O" },
      { position: { row: 2, column: 0 }, content: "O" },
      { position: { row: 2, column: 1 }, content: "X" },
      { position: { row: 2, column: 2 }, content: "O" },
    ],
    winner: "None",
  };
  expect(actual).toEqual(expected);
});
