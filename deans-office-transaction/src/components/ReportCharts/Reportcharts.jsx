import React from "react";
import { Chart } from "react-google-charts";

export const data = [
  ["Month", "Incoming", "Outgoing", "Archived"],
  ["July", 100, 60, 40],
  ["August", 84, 96, 30],
  ["September", 5, 5, 7],
];

export const options = {
  chart: {
    title: "CICT Documents",
    subtitle: "Incoming, Outgoing, and Archived: 2023-2024",
  },
};

export default function ReportCharts() {
  return (
    <Chart
      chartType="Bar"
      width="50vh"
      height="310px"
      data={data}
      options={options}
    />
  );
}


