<template>
    <h1 style="text-align: center;">今日待办</h1>
    <div class="container">
        <div class="left">
            <Left></Left>
        </div>

        <div class="right">
            <Right></Right>
        </div>
    </div>
</template>

<script>
    import Left from './components/Left.vue'
    import Right from './components/Right.vue'
    export default {
        name:'App',
        components: {Left,Right},
        setup(){},
    }
</script>

<!-- 设置总体布局 -->
<style>
body{
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    color:#8a4c4c;
}

.container{
    overflow: hidden;
    width: 1050px;
    margin: 0 auto;
}

.left{
    float: left;
    width: 250px;
    margin: 0 auto;
}

.right{
    float: right;
    width: 650px;
    margin: 0 auto;
}
</style>