import axios from 'axios';

let BASE = '/category';

export default {
    getList: (skip, limit, language, search) => {
        let url = `${BASE}/${skip}/${limit}`;
        if (language) url += `/${language}`;
        if (search) url += '?search=' + search;
        return axios.get(url);
    },
    getUpdate: (id) => axios.get(`${BASE}/update/${id}`),
    update: (model) => axios.put(`${BASE}/update`, model),
    delete: (id) => axios.delete(`${BASE}/${id}`)
}