import axios from 'axios';
const BASE_URL = '/image';

export default {
    upload: (file) => axios.post(BASE_URL, file, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}