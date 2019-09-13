import React from "react";
import ReactMapboxGl, { Layer, Feature, Marker } from "react-mapbox-gl";
import "./style.sass";

const Map = ReactMapboxGl({
    accessToken: process.env.REACT_APP_MAPBOX_TOKEN
});

function Mapbox() {
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
                center={[-97.7431, 30.2672]}>
                <Layer
                    type="symbol"
                    id="marker"
                    layout={{ "icon-image": "marker-15" }}>
                    <Feature coordinates={[-97.7431, 30.2672]}/>
                </Layer>
                <Marker
                    coordinates={[-97.7431, 30.2672]}
                    anchor="bottom">
                    <i className="fas fa-circle"></i>
                </Marker>
            </Map>
        </div>
    );
}

export default Mapbox;