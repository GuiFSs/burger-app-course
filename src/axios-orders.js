import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-699ec.firebaseio.com/'
});

export default instance;