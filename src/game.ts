import { createStore } from "solid-js/store";
import type { CellT, PlayerT } from "./app.types";

export type GameStateT = {
	state: "RUNNING" | "FINISHED";
	turn: number;
	activePlayer: PlayerT;
	statusMessage: string;
	winner?: PlayerT;
};

const INITIAL_GAME_STATE: GameStateT = {
	state: "RUNNING",
	turn: 1,
	statusMessage: "Your turn, Player 1",
	activePlayer: "1",
};

const [gameState, setGameState] = createStore({ ...INITIAL_GAME_STATE });

function checkForWinner(board: Array<PlayerT>): CellT {
	if (gameState.turn < 5) {
		return;
	}

	const axes: Array<[CellT, CellT, CellT]> = [
		[board[0], board[1], board[2]],
		[board[3], board[4], board[5]],
		[board[6], board[7], board[8]],
		[board[0], board[3], board[6]],
		[board[1], board[4], board[7]],
		[board[2], board[5], board[8]],
		[board[0], board[4], board[8]],
		[board[2], board[4], board[6]],
	];

	for (const axis of axes) {
		if (axis.every((cell) => cell === "1")) {
			return "1";
		}
		if (axis.every((cell) => cell === "2")) {
			return "2";
		}
	}
}

function chooseStatusMessage({
	activePlayer,
	winner,
	state,
}: Pick<GameStateT, "activePlayer" | "winner" | "state">): string {
	return {
		RUNNING: `Your turn, Player ${activePlayer}`,
		FINISHED: winner ? `Player ${winner} won!` : "It's a draw!",
	}[state];
}

export function startGame(): void {
	setGameState(INITIAL_GAME_STATE);
}

export function manageTurn(board: Array<PlayerT>) {
	setGameState((gameState) => {
		const winner = checkForWinner(board);
		const turn = gameState.turn + 1;
		const activePlayer = (turn & 1) === 1 ? "1" : "2";
		const state = winner || turn > 9 ? "FINISHED" : "RUNNING";
		const statusMessage = chooseStatusMessage({
			state,
			activePlayer,
			winner,
		});
		return { winner, turn, activePlayer, state, statusMessage };
	});
}

export { gameState };
