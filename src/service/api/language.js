import axios from 'axios';
const BASE_URL = '/language';

export default {
    getAll: () => axios.get(BASE_URL)
}