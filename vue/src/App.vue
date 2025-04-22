<template>
    <h1>Todo</h1>
    <div class="container">
        <div class="left"><Left></Left></div>
        <div class="right"><Right></Right></div>
    </div>
</template>

<script>
    import Left from './components/Left.vue';
    import Right from './components/Right.vue';

    export default{
        components:{
            Left,Right
        },
        setup(){}
    }
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
    width: 1000px;
    margin: 0 auto;
}

.left{
    float: left;
    width: 500px;
}

.right{
    width: 500px;
    float: right;
}

</style>