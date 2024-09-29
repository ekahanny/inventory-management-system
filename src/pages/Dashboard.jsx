import { useState } from "react";
import { BarChart } from "../components/elements/BarChart";
import { NavBar } from "../components/elements/NavBar";
import { VerticalTabs } from "../components/elements/VerticalTabs";
import { DataBar } from "../utils/DataBar";
import { DataPie } from "../utils/DataPie";

import { PieChart } from "../components/elements/PieChart";

export function Dashboard() {
  const [dataBar, setDataBar] = useState({
    labels: DataBar.map((data) => data.month),
    datasets: [
      {
        label: "Barang Masuk",
        backgroundColor: "#5898d9",
        data: DataBar.map((data) => data.barangMasuk),
      },
      {
        label: "Barang Keluar",
        backgroundColor: "#a3ceed",
        data: DataBar.map((data) => data.barangKeluar),
      },
    ],
  });

  const sortedDataPie = DataPie.sort((a, b) => b.sold - a.sold).slice(0, 5);
  const [dataPie, setDataPie] = useState({
    labels: sortedDataPie.map((product) => product.productName),
    datasets: [
      {
        label: "Total Sold",
        data: sortedDataPie.map((product) => product.sold), // Jumlah barang terjual
        backgroundColor: [
          "#447ecc",
          "#5898d9",
          "#78b3e2",
          "#a3cfed",
          "#c9e1f4",
        ],
      },
    ],
  });

  return (
    <>
      <NavBar />
      <div className="flex flex-row bg-slate-200">
        <VerticalTabs />

        <div className="m-5">
          {/* Charts */}
          <div className="flex flex-row	gap-2">
            {/* Bar Chart */}
            <div className="md:w-[700px] sm:w-[500px] bg-white px-5 py-3 rounded-md">
              <h1 className="mt-3 mb-5 text-center font-semibold">
                Jumlah Barang Masuk & Barang Keluar Per Bulan
              </h1>
              <BarChart chartData={dataBar} />
            </div>

            {/* Pie Chart */}
            <div className="md:w-[350px] bg-white p-4 py-2 rounded-md">
              <h1 className="my-3 text-center font-semibold">
                Barang Terlaris
              </h1>
              <PieChart chartData={dataPie} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
