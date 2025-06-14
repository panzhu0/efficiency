export default function(api){
    return {
        async login(data){
            return await api.post('/login',data);
        },
        valid(token){
            return api.post('/validToken',token)
        }
    }
}
