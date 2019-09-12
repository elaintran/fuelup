import axios from "axios";

export default {
    findGas: query => {
        // return axios.get(`https://www.gasbuddy.com/home?search=${query}&fuel=1`);
        return axios.get("/gasAPI", query);
    }
};