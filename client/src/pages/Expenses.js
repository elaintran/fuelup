import React, { Component } from "react";
import LineGraph from "../components/LineGraph";
import FlexContainer from "../components/Container/FlexContainer";
import SubContainer from "../components/Container/SubContainer";

class Budget extends Component {
    render() {
        return (
            <FlexContainer display="display-group">
                <SubContainer display="col-100-w">
                    <LineGraph />
                </SubContainer>
            </FlexContainer>
        );
    }
}

export default Budget;