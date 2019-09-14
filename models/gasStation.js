const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gasStationSchema = new Schema({
    station: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    }
});

const GasStation = mongoose.model("GasStation", gasStationSchema);

module.exports = GasStation;