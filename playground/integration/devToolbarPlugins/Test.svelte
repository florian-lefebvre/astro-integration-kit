<script>
let count = 0

const increment = () => count++
</script>

<p>{ count }</p>
<button type="button" on:click={increment}>Increment</button>