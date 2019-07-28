import axios from 'axios';

const BASE = "/user";

export default {
    roles: () => axios.get(`${BASE}/roles`),
    list: (skip, limit) => axios.get(`${BASE}/list/${skip}/${limit}`),
    update: {
        roles: (id, model) => axios.put(`${BASE}/${id}/roles`, model)
    },
}