import React from "react";
import { BarChart } from "@opd/g2plot-react";

// export default function CompanyObjectivesChart() {
const data = [
  { objective: "Financial Objectives", value: 74 },
  { objective: "People Objectives", value: 80 },
  { objective: "Customer Objectives", value: 60 },
];
const config = {
  title: {
    visible: true,
    text: "Company Objectives",
  },
  padding: "auto",
  forceFit: true,
  data,
  xField: "value",
  yField: "objective",
  smooth: true,
};
//   return (
//     <section>
//       <BarChart {...config} />
//     </section>
//   );
// }

export default () => {
  return <BarChart {...config} />;
};
