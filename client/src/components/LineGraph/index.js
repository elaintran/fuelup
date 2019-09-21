import React from "react";
import { ResponsiveLine } from "@nivo/line";
import moment from "moment";
import "./style.sass";

function LineGraph() {
    return (
        <div className="graph-container">
            <p>Yearly Expenses</p>
            <ResponsiveLine
                data={[
                    {
                    "id": "$",
                    "color": "hsl(47, 70%, 50%)",
                    "data": [
                        {
                        "x": "Jan",
                        "y": 15
                        },
                        {
                        "x": "Feb",
                        "y": 206
                        },
                        {
                        "x": "Mar",
                        "y": 251
                        },
                        {
                        "x": "Apr",
                        "y": 136
                        },
                        {
                        "x": "May",
                        "y": 89
                        },
                        {
                        "x": "Jun",
                        "y": 271
                        },
                        {
                        "x": "Jul",
                        "y": 52
                        },
                        {
                        "x": "Aug",
                        "y": 60
                        },
                        {
                        "x": "Sept",
                        "y": 272
                        },
                        {
                        "x": "Oct",
                        "y": 294
                        },
                        {
                        "x": "Nov",
                        "y": 31
                        },
                        {
                        "x": "Dec",
                        "y": 239
                        }
                    ]
                    }
                ]}
                margin={{ top: 50, right: 30, bottom: 50, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', stacked: true, min: 0, max: 350 }}
                curve="natural"
                axisTop={null}
                axisRight={null}
                colors={["#5c99ff"]}
                lineWidth={3}
                enablePoints={false}
                enableGridX={false}
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabel="y"
                pointLabelYOffset={-12}
                enableArea={true}
                areaBlendMode="multiply"
                areaOpacity={0.4}
                enableSlices="x"
                useMesh={true}
                enableCrosshair={false}
            />
        </div>
    );
}

export default LineGraph;