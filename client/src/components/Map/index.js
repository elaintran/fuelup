import React from "react";
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
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
                    height: "calc(100vh - 52px)",
                    width: "100%",
                    borderRadius: "5px",
                    border: "1px solid #e9e9e9"
                }}>
                <Layer
                    type="symbol"
                    id="marker"
                    layout={{ "icon-image": "marker-15" }}>
                    <Feature coordinates={[-0.481747846041145, 51.3233379650232]}/>
                </Layer>
            </Map>
        </div>
    );
}

export default Mapbox;