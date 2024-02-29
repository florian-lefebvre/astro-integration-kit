import { createSignal } from "solid-js";

function Counter() {
	const [count, setCount] = createSignal(1);
	const increment = () => setCount(count() + 1);

	return (
		<div>
			<h1>Count: {count()}</h1>
			<button type="button" onClick={increment}>
				Increment
			</button>
		</div>
	);
}

export default Counter;
