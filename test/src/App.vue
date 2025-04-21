<template>
    <Left></Left>
    <Right></Right>
</template>

<script>
    import Left from './component/Left.vue'
    import Right from './component/Right.vue'

    export default{
        components:{
            Left,
            Right
        },
        setup(){
            return {Left,Right}
        }
    }
</script>
<style></style>