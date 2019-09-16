import React from "react";
import HeartToggle from "../HeartToggle";
import "./style.sass";

function Results(props) {
    return (
        <div className="results-card" onClick={() => props.click(props.id)}>
            <div className="result-container">
                <div className="result-info">
                    <img className="logo" src={props.logo} alt={props.station} />
                    <div className="gas-info">
                        <h4>{props.station}</h4>
                        <div className="location">
                            <i className="fas fa-map-marker-alt"></i><p>{props.address} &#183; {props.distance} mi</p>
                        </div>
                    </div>
                    {(props.loggedIn === true) ? <HeartToggle station={props.station} address={props.address} link={props.link} favorite={props.favorite} index={props.id} /> : false}
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