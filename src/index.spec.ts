import {
  EMPTY_BOARD,
  WinningGame,
  Game,
  Move,
  OngoingGame,
  play,
  DrawGame,
  createOngoingGame,
  createWinningGame,
  createDrawGame,
} from ".";

const playMoves = (moves: Move[]): Game => {
  const NOT_STARTED_GAME = createOngoingGame(EMPTY_BOARD, "X");
  return moves.reduce((game, move) => play(move)(game), NOT_STARTED_GAME);
};

test("Allow a player to play on an empty cell", () => {
  // GIVEN
  const game = createOngoingGame(EMPTY_BOARD, "X");
  const move: Move = {
    player: "X",
    position: {
      row: 0,
      column: 0,
    },
  };

  // WHEN
  const actual = play(move)(game);

  // THEN
  const expected: Partial<OngoingGame> = {
    board: ["X", "", "", "", "", "", "", "", ""],
  };
  expect(actual.board).toEqual(expected.board);
});

test("Allow the other player to play on an empty cell", () => {
  // GIVEN
  const game = createOngoingGame(EMPTY_BOARD, "O");
  const move: Move = {
    player: "O",
    position: {
      row: 0,
      column: 0,
    },
  };

  // WHEN
  const actual = play(move)(game);

  // THEN
  const expected: Partial<OngoingGame> = {
    board: ["O", "", "", "", "", "", "", "", ""],
  };
  expect(actual.board).toEqual(expected.board);
});

test("Force players to play one after the other", () => {
  // GIVEN
  const game = createOngoingGame(EMPTY_BOARD, "X");
  const move: Move = {
    player: "X",
    position: {
      row: 0,
      column: 0,
    },
  };

  // WHEN
  const actual = play(move)(game);

  // THEN
  const expected = createOngoingGame(["X", "", "", "", "", "", "", "", ""], "O");
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
  const actual = play(move)(game);

  // THEN
  const expected = createWinningGame(["X", "X", "X", "O", "O", "", "", "", ""], "X");
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
  const actual = play(move)(game);

  // THEN
  const expected = createWinningGame(["O", "O", "", "X", "X", "X", "", "", ""], "X");
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
  const actual = play(move)(game);

  // THEN
  const expected = createWinningGame(["O", "O", "", "", "", "", "X", "X", "X"], "X");
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
  const actual = play(move)(game);

  // THEN
  const expected = createWinningGame(["X", "O", "", "X", "O", "", "X", "", ""], "X");
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
  const actual = play(move)(game);

  // THEN
  const expected = createWinningGame(["O", "X", "", "O", "X", "", "", "X", ""], "X");
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
  const actual = play(move)(game);

  // THEN
  const expected = createWinningGame(["O", "", "X", "O", "", "X", "", "", "X"], "X");
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
  const actual = play(move)(game);

  // THEN
  const expected = createWinningGame(["X", "O", "", "O", "X", "", "", "", "X"], "X");
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
  const actual = play(move)(game);

  // THEN
  const expected = createWinningGame(["", "O", "X", "O", "X", "", "X", "", ""], "X");
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
  const actual = play(move)(game);

  // THEN
  const expected = createWinningGame(["O", "O", "O", "X", "X", "", "X", "", ""], "O");
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
  const actual = play(move)(game);

  // THEN
  const expected = createDrawGame(["X", "O", "X", "X", "X", "O", "O", "X", "O"]);
  expect(actual).toEqual(expected);
});
