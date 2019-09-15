import axios from "axios";

export default {
    findGas: query => {
        return axios.get(`/api/gasbuddy/${query}`);
    },
    geocode: address => {
        return axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`);
    },
    directions: (a, b) => {
        return axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${a};${b}.json?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`);
    },
    register: obj => {
        return axios.post("/api/register", obj);
    }
};