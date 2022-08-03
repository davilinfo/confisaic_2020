import axios from 'axios';

const api = axios.create({
    baseURL : 'https://www.liskrestaurant.com:3443'
});

export default api;