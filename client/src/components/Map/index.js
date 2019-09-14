import React from "react";
import ReactMapboxGl, { Layer, Feature, Marker } from "react-mapbox-gl";
import PriceMarker from "../PriceMarker";
import "./style.sass";

const Map = ReactMapboxGl({
    accessToken: process.env.REACT_APP_MAPBOX_TOKEN
});

const checkCoordinates = (arr, search, price) => {
    if (search === true) {
        return arr.map((coordinates, index) => {
            return (
                <Marker
                    coordinates={[coordinates.longitude, coordinates.latitude]}
                    anchor="bottom"
                    style={{textAlign: "center"}}>
                    <PriceMarker price={price[index]} />
                    <i className="fas fa-circle"></i>
                </Marker>
            );
        })
    }
}

function Mapbox(props) {
    return (
        <div className="map-container">
            <Map
                style="mapbox://styles/elaintran/ck0ildzjc0a651clmdqxncwk9"
                containerStyle={{
                    height: "calc(100vh - 54px)",
                    width: "100%",
                    borderRadius: "5px",
                    border: "1px solid #e9e9e9"
                }}
                center={[props.center.longitude, props.center.latitude]}>
                <Layer
                    type="symbol"
                    id="marker"
                    layout={{ "icon-image": "marker-15" }}>
                    <Feature coordinates={[props.center.longitude, props.center.latitude]}/>
                </Layer>
                {checkCoordinates(props.coordinates, props.search, props.price)}
            </Map>
        </div>
    );
}

export default Mapbox;