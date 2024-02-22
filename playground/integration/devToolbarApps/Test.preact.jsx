import { useState } from "preact/hooks";

const Counter = () => {
	const [count, setCount] = useState(0);

	const increment = () => {
		setCount(count + 1);
	};

	const decrement = () => {
		setCount(count - 1);
	};

	return (
		<div>
			<h1>Counter: {count}</h1>
			<button onClick={increment} type="button">
				Increment
			</button>
			<button onClick={decrement} type="button">
				Decrement
			</button>
		</div>
	);
};

export default Counter;
