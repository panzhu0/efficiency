<template>
    <!-- 样式居中 -->
    <div style="text-align: center;"> 
        <h1 style="text-align: center;">Left</h1>

        <input type="text" v-model="todo"> <button v-on:click = "c">增加</button><br><br>

        <button v-on:click="empty">清空</button><br>
    </div>
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

            const empty = ()=>{
                alert('test')
            }

            return  {todo,c,empty}
        }
    }
</script>