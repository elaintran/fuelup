import axios from "axios";

export default {
    findGas: (query) => {
        return axios.get(`/api/gasbuddy/${query}`);
    },
    findStation: station => {
        return axios.get(`/api/gasbuddy/station/${station}`);
    },
    geocode: (address, token) => {
        return axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`);
    },
    directions: (a, b) => {
        return axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${a};${b}.json?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`);
    },
    getIP: () => {
        return axios.get("https://get.geojs.io/v1/ip/geo.json");
    },
    register: obj => {
        return axios.post("/api/register", obj);
    },
    login: obj => {
        return axios.post("/api/login", obj);
    },
    logout: () => {
        return axios.get("/api/logout");
    },
    checkUser: () => {
        return axios.get("/api/user");
    },
    favorite: (station, id) => {
        return axios.post(`/api/user/${id}`, station);
    },
    unfavorite: (id, stationId) => {
        return axios.delete(`/api/user/${id}/station/${stationId}`);
    },
    getStation: id => {
        return axios.get(`/api/station/${id}`);
    }
};