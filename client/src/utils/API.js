import axios from "axios";

export default {
    findGas: query => {
        return axios.get(`/api/gasbuddy/${query}`);
    }
};