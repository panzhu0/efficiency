export default function(api){
    return{
        // 增加用户TOOD
        async add(data){
            return await api.post('/todo/add',data);
        },

        // 移除用户TODO
        async remove(id){
            return await api.delete('/todo/'+id)
        },

        // 列举用户TODO
        async list(){
            return await api.get('/todo/list')
        },

        // 清空用户的TOD
        async clear(){
            return await api.delete('/todo/clear')
        },

        // 修改TODO的状态
        async check(id,status){
            return await api.put('/todo/check',{
                id:id,
                checked: status
            })
        }
    }
}

