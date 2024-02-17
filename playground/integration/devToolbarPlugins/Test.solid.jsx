import { createSignal } from "solid-js";

function Counter() {
  const [count, setCount] = createSignal(1);
  const increment = () => setCount(count() + 1);

  return (
    // <p>hi</p>
    <button type="button" onClick={increment}>
      {count()}
    </button>
  );
}

export default Counter;
