"use client";

import { ResponsivePie } from "@nivo/pie";

const PieChart = ({ data }) => {
  const getColor = bar => bar.data.color;

  return (
    <div style={{ width: '100%', height: '90%', minWidth: '300px' }}>
      <ResponsivePie
        data={data}
        colors={getColor}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.3}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderColor={{ from: "color" }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor={{ from: "color" }}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        enableArcLabels={false}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "top-to-bottom",
            itemOpacity: 1,
            symbolSize: 20,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#ffffff",
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default PieChart;
