<template>
    <h1>Todo</h1>
    <Left></Left>
    <Right></Right>
</template>

<script lang="ts">
    import Left from './components/Left.vue'
    import Right from './components/Right.vue'
    export default {
        name:'App',
        components: {Left,Right},
    }
</script>