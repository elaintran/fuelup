import React from "react";
import "./style.sass";

function Results(props) {
    return (
        <div className="results-card">
            <h4>Circle K</h4>
            <div className="location">
                <i className="fas fa-map-marker-alt"></i><p>400 Chris Kelley Blvd, Hutto, TX</p>
            </div>
            <div className="grade-container">
                <div className="grade">
                    <p>Regular</p>
                    <h5>$2.15<span className="units">/gal</span></h5>
                </div>
                <div className="grade">
                    <p>Midgrade</p>
                    <h5>$2.15<span className="units">/gal</span></h5>
                </div>
                <div className="grade">
                    <p>Premium</p>
                    <h5>$2.15<span className="units">/gal</span></h5>
                </div>
                <div className="grade">
                    <p>Diesel</p>
                    <h5>$2.15<span className="units">/gal</span></h5>
                </div>
            </div>
            {/* <p>{props.station}</p>
            <p>{props.address}</p>
            {props.gasType.map(gas => {
                return (
                    <div>
                        <p>{gas.type}</p>
                        <p>{gas.price}</p>
                    </div>
                )
            })}
            <p>{props.link}</p> */}
        </div>
    );
}

export default Results;