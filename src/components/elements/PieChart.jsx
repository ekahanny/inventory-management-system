import { Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

// eslint-disable-next-line react/prop-types
export function PieChart({ chartData }) {
  return (
    <>
      <Pie width={100} height={100} data={chartData} />
    </>
  );
}
