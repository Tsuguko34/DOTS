import React from "react";
import { Chart } from "react-google-charts";

export const data = [
  ["Year", "Incoming", "Outgoing", "Archived"],
  ["2014", 1000, 400, 200],
  ["2015", 1170, 460, 250],
  ["2016", 660, 1120, 300],
  ["2017", 1030, 540, 350],
  ["2018", 200, 540, 350],
  ["2019", 370, 600, 350],
  ["2020", 460, 450, 350],
  ["2021", 1030, 200, 350],
  ["2022", 1230, 320, 350],
  ["2023", 1030, 400, 350],


];

export const options = {
  chart: {
    title: "CICT Documents",
    subtitle: "Incoming, Outgoing, and Archived: 2014-2023",
  },
};

export default function ReportCharts() {
  return (
    <Chart
      chartType="Bar"
      width="100%"
      height="550px"
      data={data}
      options={options}
    />
  );
}
