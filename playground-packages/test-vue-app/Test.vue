<script setup lang="ts">
    import { ref } from 'vue'

    const count = ref(0)
</script>

<template>
    <div>
        <h1>Count is: {{ count }}</h1>
        <button type="button" @click="count++">Increment</button>
    </div>
</template>