import axios from "axios";

export default {
    findGasPrices: query => {
        return axios.get(`https://www.gasbuddy.com/home?search=${query}&fuel=1`);
    }
};