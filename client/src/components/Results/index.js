import React from "react";
import "./style.sass";

function Results(props) {
    return (
        <div className="results-card">
            <div className="result-container">
                <img className="logo" src={props.logo} alt={props.station} />
                <div className="result-info">
                    <h4>{props.station}</h4>
                    <div className="location">
                        <i className="fas fa-map-marker-alt"></i><p>{props.address}</p>
                    </div>
                    <div className="grade-container">
                        {props.gasType.map(fuel => {
                            return (
                                <div className="grade">
                                    <p>{fuel.type}</p>
                                    {(fuel.price === "- - -") ? <h5>{fuel.price}</h5> : <h5>{fuel.price}<span className="units">/gal</span></h5>}
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