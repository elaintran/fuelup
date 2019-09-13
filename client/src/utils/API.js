import axios from "axios";

export default {
    findGas: query => {
        return axios.get(`/api/gasbuddy/${query}`);
    },
    forwardGeocode: address => {
        return axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`);
    }
};