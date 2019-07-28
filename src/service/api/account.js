import axios from 'axios';

let BASE = '/account';

export default {
    signIn: (model) => axios.put(`${BASE}/login`, model),
    signUp: (model) => axios.put(`${BASE}/signup`, model),
    autoSignIn: (model) => axios.put(`${BASE}/autologin`, model),
    ping: (config) => axios.get(`${BASE}/ping`, config || {}),
    setLanguage: (language) => axios.put(`${BASE}/language/${language}`),
    profile: () => axios.get(`${BASE}/profile`),
    update: {
        profile: (model) => axios.put(`${BASE}/profile`, model),
        avatar: (model) => axios.put(`${BASE}/avatar`, model),
        email: (model) => axios.put(`${BASE}/avatar`, model),
        password: (model) => axios.put(`${BASE}/password`, model)
    }
}