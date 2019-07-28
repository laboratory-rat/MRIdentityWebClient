import axios from 'axios';
import store from '@/store/store';

const BASE = "/provider";
let lang = () => store.getters['common/user/LANGUAGE'];

export default {
    get: (slug) => axios.get(`${BASE}/${slug}/${lang()}`),
    getList: (skip, limit) => axios.get(`${BASE}/all/${skip}/${limit}/${lang()}`),
    getAvailable: (skip, limit) => axios.get(`${BASE}/${skip}/${limit}/${lang()}`),
    getUpdate: (id) => axios.get(`${BASE}/update/${id}`),
    update: (model) => axios.put(`${BASE}/update`, model),
    delete: (id) => axios.delete(`${BASE}/${id}`),
    access: {
        get: (providerId) => axios.get(`${BASE}/access/${providerId}`),
        token: {
            create: (providerId, model) => axios.post(`${BASE}/access/${providerId}/token`, model),
            delete: (providerId, value) => axios.delete(`${BASE}/access/${providerId}/token/${value}`)
        }
    }
}