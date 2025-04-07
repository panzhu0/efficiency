<template>
    <h1 style="text-align: center;">Left</h1>
    <br>
    <input type="text" v-model="todo">
    <button v-on:click = "c">增加</button>
</template>

<script lang="ts">
    import { ref } from 'vue';

    export default {
        // 方法名
        name:'Left',
        // SETUP
        setup(){
            // Data
            const todo = ref('');

            // Method
            const c = ()=>{
                alert(todo.value);
            }

            return  {todo,c}
        }
    }
</script>