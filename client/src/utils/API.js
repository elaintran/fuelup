import axios from "axios";

export default {
    findGas: query => {
        return axios.get(`/api/gasAPI/${query}`);
    }
};