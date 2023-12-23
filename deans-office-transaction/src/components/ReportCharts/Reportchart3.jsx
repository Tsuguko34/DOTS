import React from "react";
import { Chart } from "react-google-charts";

export const data = [
  ["Document", "per Colleges"],
  ["College of Science", 11],
  ["College of Arts", 2],
  ["College of Industrial Technology", 2],
  ["College of Engineering", 2],
  ["College of Education", 7],
  ["College of Nursing", 9],
];

export const options = {
  title: "Receive Documents per College",
  is3D: true,
};

export default function ReportChart3() {
  return (
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width={"60vh"}
      height={"340px"}
    />
  );
}
