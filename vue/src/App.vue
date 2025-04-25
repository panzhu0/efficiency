<template>
    <h1>Todo</h1>
    <div class="container">
        <div class="left"><Left></Left></div>
        <div class="right"><Right></Right></div>
    </div>
</template>

<script setup>
    import Left from './components/Left.vue';
    import Right from './components/Right.vue';
</script>

<style>

body{
    margin: 0;
    padding: 0;
    height: 100%;
    color:#8a4c4c;
}

h1{
    text-align: center;
}

.container{
    width: 1300px;
    margin: 0 auto;
}

.left{
    float: left;
    width: 600px;
}

.right{
    width: 700px;
    float: right;
}

</style>