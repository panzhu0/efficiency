<template>
    <h1>Todo</h1>
    <div class="container">
        <!-- 左侧模块 -->
        <Left></Left>
        <!-- 右侧模块 -->
        <Right></Right>
    </div>
</template>

<script>
    import Left from "@/components/Left.vue"
    import Right from '@/components/Right.vue'

    export default{
        // 部件
        name : 'App',
        components: {
            Left,
            Right 
        }
    }
</script>


<style>
    body{
        margin: 0;
        padding: 0;
        height: 100%;
        /* background: #1f242d; */
        /* background: #949597; */
        /* color:#fff; */
        color:#8a4c4c;
    }

    h1{
        text-align: center;
    }

    input{
        font-size: 16px;
    }

    .container{
        width: 1000px;
        /* text-align: center; */
        margin: 0 auto;
        display: flex;
    }

    .left{
        float: left;
        width: 500px;
    }

    .right{
        float: right;
        width: 500px;
    }
</style>