import axios from "axios";

export default {
    findPrices: query => {
        return axios.get(`https://cors-anywhere.herokuapp.com/https://www.gasbuddy.com/home?search=${query}&fuel=1`);
    }
};