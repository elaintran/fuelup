import React from "react";
import { ResponsiveLine } from "@nivo/line";
import moment from "moment";
import "./style.sass";

function LineGraph() {
    return (
        <div className="graph-container">
            <ResponsiveLine
                data={[
                    {
                    "id": "$",
                    "color": "hsl(47, 70%, 50%)",
                    "data": [
                        {
                        "x": "January",
                        "y": 15
                        },
                        {
                        "x": "February",
                        "y": 206
                        },
                        {
                        "x": "March",
                        "y": 251
                        },
                        {
                        "x": "April",
                        "y": 136
                        },
                        {
                        "x": "May",
                        "y": 89
                        },
                        {
                        "x": "June",
                        "y": 271
                        },
                        {
                        "x": "July",
                        "y": 52
                        },
                        {
                        "x": "August",
                        "y": 60
                        },
                        {
                        "x": "September",
                        "y": 272
                        },
                        {
                        "x": "October",
                        "y": 294
                        },
                        {
                        "x": "November",
                        "y": 31
                        },
                        {
                        "x": "December",
                        "y": 239
                        }
                    ]
                    }
                ]}
                margin={{ top: 50, right: 40, bottom: 50, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', stacked: true, min: 0, max: 400 }}
                curve="natural"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    orient: 'bottom',
                    tickSize: 0,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Yearly Expenses",
                    legendOffset: 36,
                    legendPosition: 'middle'
                }}
                axisLeft={{
                    orient: 'left',
                    tickSize: 0,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Amount Spent',
                    legendOffset: -40,
                    legendPosition: 'middle'
                }}
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