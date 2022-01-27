import { EMPTY_BOARD, FinishedGame, Game, Move, OngoingGame, play } from ".";

function playMoves(moves: Move[]): Game {
  const notStartedGame: OngoingGame = {
    status: "ONGOING",
    board: EMPTY_BOARD,
    nextPlayer: "X"
  };
  return moves.reduce((game, move) => play(game)(move), notStartedGame);
}

test("Allow a player to play on an empty cell", function() {
  // GIVEN
  const game: OngoingGame = {
    status: "ONGOING",
    board: EMPTY_BOARD,
    nextPlayer: "X"
  };
  const move: Move = {
    player: "X",
    position: {
      row: 0,
      column: 0
    }
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
      { position: { row: 2, column: 2 }, content: "" }
    ]
  };
  expect(actual.board).toEqual(expected.board);
});

test("[Triangulation] Allow a player to play on an empty cell", function() {
  // GIVEN
  const game: OngoingGame = {
    status: "ONGOING",
    board: EMPTY_BOARD,
    nextPlayer: "X"
  };
  const move: Move = {
    player: "X",
    position: {
      row: 0,
      column: 1
    }
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
      { position: { row: 2, column: 2 }, content: "" }
    ]
  };
  expect(actual.board).toEqual(expected.board);
});

test("Allow the other player to play on an empty cell", function() {
  // GIVEN
  const game: OngoingGame = {
    status: "ONGOING",
    board: EMPTY_BOARD,
    nextPlayer: "O"
  };
  const move: Move = {
    player: "O",
    position: {
      row: 0,
      column: 0
    }
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
      { position: { row: 2, column: 2 }, content: "" }
    ]
  };
  expect(actual.board).toEqual(expected.board);
});

test("Throw an exception if a player attempts to play on a non-empty cell", function() {
  // GIVEN
  const game = playMoves([
    {
      player: "X",
      position: {
        row: 0,
        column: 0
      }
    }
  ]);
  const move: Move = {
    player: "O",
    position: {
      row: 0,
      column: 0
    }
  };

  // WHEN
  // THEN
  expect(() => play(game)(move)).toThrowError("Can't play: the cell is not empty.");
});

test("Force players to play one after the other", function() {
  // GIVEN
  const game: OngoingGame = {
    status: "ONGOING",
    board: EMPTY_BOARD,
    nextPlayer: "X"
  };
  const move: Move = {
    player: "X",
    position: {
      row: 0,
      column: 0
    }
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
      { position: { row: 2, column: 2 }, content: "" }
    ],
    nextPlayer: "O"
  };
  expect(actual).toEqual(expected);
});

test("Throw an exception if the wrong player attempts to play", function() {
  // GIVEN
  const game: OngoingGame = {
    status: "ONGOING",
    board: EMPTY_BOARD,
    nextPlayer: "X"
  };
  const move: Move = {
    player: "O",
    position: {
      row: 0,
      column: 0
    }
  };

  // WHEN
  // THEN
  expect(() => play(game)(move)).toThrowError("Can't play: wrong player.");
});

test("Detects that a player wins (3 'X' on the first row)", function() {
  // GIVEN
  const game = playMoves([
    {
      player: "X",
      position: {
        row: 0,
        column: 0
      }
    },
    {
      player: "O",
      position: {
        row: 1,
        column: 0
      }
    },
    {
      player: "X",
      position: {
        row: 0,
        column: 1
      }
    },
    {
      player: "O",
      position: {
        row: 1,
        column: 1
      }
    }
  ]);
  const move: Move = {
    player: "X",
    position: {
      row: 0,
      column: 2
    }
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
      { position: { row: 2, column: 2 }, content: "" }
    ],
    winner: "X"
  };
  expect(actual).toEqual(expected);
});

test("Detects that a player wins (3 'X' on the second row)", function() {
  // GIVEN
  const game = playMoves([
    {
      player: "X",
      position: {
        row: 1,
        column: 0
      }
    },
    {
      player: "O",
      position: {
        row: 0,
        column: 0
      }
    },
    {
      player: "X",
      position: {
        row: 1,
        column: 1
      }
    },
    {
      player: "O",
      position: {
        row: 0,
        column: 1
      }
    }
  ]);
  const move: Move = {
    player: "X",
    position: {
      row: 1,
      column: 2
    }
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
      { position: { row: 2, column: 2 }, content: "" }
    ],
    winner: "X"
  };
  expect(actual).toEqual(expected);
});

test("Detects that a player wins (3 'X' on the third row)", function() {
  // GIVEN
  const game = playMoves([
    {
      player: "X",
      position: {
        row: 2,
        column: 0
      }
    },
    {
      player: "O",
      position: {
        row: 0,
        column: 0
      }
    },
    {
      player: "X",
      position: {
        row: 2,
        column: 1
      }
    },
    {
      player: "O",
      position: {
        row: 0,
        column: 1
      }
    }
  ]);
  const move: Move = {
    player: "X",
    position: {
      row: 2,
      column: 2
    }
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
      { position: { row: 2, column: 2 }, content: "X" }
    ],
    winner: "X"
  };
  expect(actual).toEqual(expected);
});

test("Detects that a player wins (3 'X' on the first column)", function() {
  // GIVEN
  const game = playMoves([
    {
      player: "X",
      position: {
        row: 0,
        column: 0
      }
    },
    {
      player: "O",
      position: {
        row: 0,
        column: 1
      }
    },
    {
      player: "X",
      position: {
        row: 1,
        column: 0
      }
    },
    {
      player: "O",
      position: {
        row: 1,
        column: 1
      }
    }
  ]);
  const move: Move = {
    player: "X",
    position: {
      row: 2,
      column: 0
    }
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
      { position: { row: 2, column: 2 }, content: "" }
    ],
    winner: "X"
  };
  expect(actual).toEqual(expected);
});

test("Detects that a player wins (3 'X' on the second column)", function() {
  // GIVEN
  const game = playMoves([
    {
      player: "X",
      position: {
        row: 0,
        column: 1
      }
    },
    {
      player: "O",
      position: {
        row: 0,
        column: 0
      }
    },
    {
      player: "X",
      position: {
        row: 1,
        column: 1
      }
    },
    {
      player: "O",
      position: {
        row: 1,
        column: 0
      }
    }
  ]);
  const move: Move = {
    player: "X",
    position: {
      row: 2,
      column: 1
    }
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
      { position: { row: 2, column: 2 }, content: "" }
    ],
    winner: "X"
  };
  expect(actual).toEqual(expected);
});

test("Detects that a player wins (3 'X' on the third column)", function() {
  // GIVEN
  const game = playMoves([
    {
      player: "X",
      position: {
        row: 0,
        column: 2
      }
    },
    {
      player: "O",
      position: {
        row: 0,
        column: 0
      }
    },
    {
      player: "X",
      position: {
        row: 1,
        column: 2
      }
    },
    {
      player: "O",
      position: {
        row: 1,
        column: 0
      }
    }
  ]);
  const move: Move = {
    player: "X",
    position: {
      row: 2,
      column: 2
    }
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
      { position: { row: 2, column: 2 }, content: "X" }
    ],
    winner: "X"
  };
  expect(actual).toEqual(expected);
});

test("Detects that a player wins (3 'X' on the descending diagonal)", function() {
  // GIVEN
  const game = playMoves([
    {
      player: "X",
      position: {
        row: 0,
        column: 0
      }
    },
    {
      player: "O",
      position: {
        row: 1,
        column: 0
      }
    },
    {
      player: "X",
      position: {
        row: 1,
        column: 1
      }
    },
    {
      player: "O",
      position: {
        row: 0,
        column: 1
      }
    }
  ]);
  const move: Move = {
    player: "X",
    position: {
      row: 2,
      column: 2
    }
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
      { position: { row: 2, column: 2 }, content: "X" }
    ],
    winner: "X"
  };
  expect(actual).toEqual(expected);
});

test("Detects that a player wins (3 'X' on the ascending diagonal)", function() {
  // GIVEN
  const game = playMoves([
    {
      player: "X",
      position: {
        row: 2,
        column: 0
      }
    },
    {
      player: "O",
      position: {
        row: 1,
        column: 0
      }
    },
    {
      player: "X",
      position: {
        row: 1,
        column: 1
      }
    },
    {
      player: "O",
      position: {
        row: 0,
        column: 1
      }
    }
  ]);
  const move: Move = {
    player: "X",
    position: {
      row: 0,
      column: 2
    }
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
      { position: { row: 2, column: 2 }, content: "" }
    ],
    winner: "X"
  };
  expect(actual).toEqual(expected);
});

test("Detects that the other player wins (3 'O' on the first row)", function() {
  // GIVEN
  const game = playMoves([
    {
      player: "X",
      position: {
        row: 1,
        column: 0
      }
    },
    {
      player: "O",
      position: {
        row: 0,
        column: 0
      }
    },
    {
      player: "X",
      position: {
        row: 1,
        column: 1
      }
    },
    {
      player: "O",
      position: {
        row: 0,
        column: 1
      }
    },
    {
      player: "X",
      position: {
        row: 2,
        column: 0
      }
    }
  ]);
  const move: Move = {
    player: "O",
    position: {
      row: 0,
      column: 2
    }
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
      { position: { row: 2, column: 2 }, content: "" }
    ],
    winner: "O"
  };
  expect(actual).toEqual(expected);
});

test("Throw an exception if a player attempts to play although the game has finished", function() {
  // GIVEN
  const game = playMoves([
    {
      player: "X",
      position: {
        row: 0,
        column: 0
      }
    },
    {
      player: "O",
      position: {
        row: 1,
        column: 0
      }
    },
    {
      player: "X",
      position: {
        row: 0,
        column: 1
      }
    },
    {
      player: "O",
      position: {
        row: 1,
        column: 1
      }
    },
    {
      player: "X",
      position: {
        row: 0,
        column: 2
      }
    }
  ]);

  const move: Move = {
    player: "O",
    position: {
      row: 2,
      column: 2
    }
  };

  // WHEN
  // THEN
  expect(() => play(game)(move)).toThrowError("Can't play: the game is finished.");
});

test("Detects that no player wins", function() {
  // GIVEN
  const game = playMoves([
    {
      player: "X",
      position: {
        row: 0,
        column: 0
      }
    },
    {
      player: "O",
      position: {
        row: 0,
        column: 1
      }
    },
    {
      player: "X",
      position: {
        row: 0,
        column: 2
      }
    },
    {
      player: "O",
      position: {
        row: 1,
        column: 2
      }
    },
    {
      player: "X",
      position: {
        row: 1,
        column: 0
      }
    },
    {
      player: "O",
      position: {
        row: 2,
        column: 0
      }
    },
    {
      player: "X",
      position: {
        row: 1,
        column: 1
      }
    },
    {
      player: "O",
      position: {
        row: 2,
        column: 2
      }
    }
  ]);
  const move: Move = {
    player: "X",
    position: {
      row: 2,
      column: 1
    }
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
      { position: { row: 2, column: 2 }, content: "O" }
    ],
    winner: "None"
  };
  expect(actual).toEqual(expected);
});
