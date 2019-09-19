import React from "react";
import { ResponsiveLine } from '@nivo/line';
import "./style.sass";

function LineGraph() {
    return (
        <div className="graph-container">
            <ResponsiveLine
                data={[
                    {
                    "id": "japan",
                    "color": "hsl(47, 70%, 50%)",
                    "data": [
                        {
                        "x": "plane",
                        "y": 15
                        },
                        {
                        "x": "helicopter",
                        "y": 206
                        },
                        {
                        "x": "boat",
                        "y": 251
                        },
                        {
                        "x": "train",
                        "y": 136
                        },
                        {
                        "x": "subway",
                        "y": 89
                        },
                        {
                        "x": "bus",
                        "y": 271
                        },
                        {
                        "x": "car",
                        "y": 52
                        },
                        {
                        "x": "moto",
                        "y": 28
                        },
                        {
                        "x": "bicycle",
                        "y": 272
                        },
                        {
                        "x": "horse",
                        "y": 294
                        },
                        {
                        "x": "skateboard",
                        "y": 31
                        },
                        {
                        "x": "others",
                        "y": 239
                        }
                    ]
                    }
                ]}
                margin={{ top: 50, right: 20, bottom: 50, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', stacked: true, min: 0, max: 500 }}
                curve="natural"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    orient: 'bottom',
                    tickSize: 0,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'transportation',
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
                useMesh={true}
                enableCrosshair={false}
            />
        </div>
    );
}

export default LineGraph;