import React from "react";
import "./style.sass";

function Results(props) {
    return (
        <div className="results-card">
            <div className="result-container">
                <div className="result-info">
                    <img className="logo" src={props.logo} alt={props.station} />
                    <div className="gas-info">
                        <h4>{props.station}</h4>
                        <div className="location">
                            <i className="fas fa-map-marker-alt"></i><p>{props.address}</p>
                        </div>
                    </div>
                </div>
                <div className="fuel-info">
                    <div className="grade-container">
                        {props.gasType.map(fuel => {
                            return (
                                <div className="grade">
                                    <p>{fuel.type}</p>
                                    {(fuel.price === "- - -") ? <h5>{fuel.price}</h5> : <h5>{fuel.price}<span className="units">/gal</span></h5>}
                                    <p className="update-time">{fuel.lastUpdated}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Results;