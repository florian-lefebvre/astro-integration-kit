<script>
let count = 0

const increment = () => count++
</script>

<div>
    <p>{ count }</p>
    <button type="button" on:click={increment}>Increment</button>
</div>