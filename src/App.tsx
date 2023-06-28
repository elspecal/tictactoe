import { Component, For, Switch, Match, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { gameState, startGame, manageTurn } from "./game";
import type { CellT } from "./app.types";
import type { GameStateT } from "./game";
import styles from "./App.module.scss";

export const App: Component = () => {
	const [board, setBoard] = createStore(Array(9));

	function handleCellClick(cellId: () => number) {
		if (isCellLive(gameState.state, board[cellId()])) {
			setBoard(cellId(), gameState.activePlayer);
			manageTurn(board);
		}
	}

	function handleStart() {
		setBoard(Array(9));
		startGame();
	}

	return (
		<div class={styles.App}>
			<header class={styles.header}>
				<h1>{gameState.statusMessage}</h1>
			</header>
			<main class={styles.main}>
				<Board board={board} onCellClick={handleCellClick} />
			</main>
			<Show when={gameState.state === "FINISHED"}>
				<button
					class={styles.button}
					type="button"
					onClick={handleStart}
				>
					New game
				</button>
			</Show>
		</div>
	);
};

interface BoardProps {
	board: Array<CellT>;
	onCellClick: (id: () => number) => void;
}

const Board: Component<BoardProps> = (props) => (
	<ul class={styles.board}>
		<For each={props.board}>
			{(cellValue, cellId) => (
				<li>
					<Cell
						id={cellId}
						value={cellValue}
						onClick={props.onCellClick}
						class={
							!isCellLive(gameState.state, cellValue)
								? styles.cell
								: `${styles.cell} ${styles.empty}`
						}
					/>
				</li>
			)}
		</For>
	</ul>
);

interface CellProps {
	id: () => number;
	value: CellT;
	onClick: (id: () => number) => void;
	class: string;
}

const Cell: Component<CellProps> = (props) => (
	<span
		id={`cell${props.id}`}
		class={props.class}
		onClick={() => props.onClick(props.id)}
	>
		<Switch fallback="">
			<Match when={props.value === "1"}>X</Match>
			<Match when={props.value === "2"}>O</Match>
		</Switch>
	</span>
);

function isCellLive(state: GameStateT["state"], cell: CellT): boolean {
	return state === "RUNNING" && !cell;
}
