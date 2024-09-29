import { useState } from "react";
import { BarChart } from "../components/elements/BarChart";
import { NavBar } from "../components/elements/NavBar";
import { VerticalTabs } from "../components/elements/VerticalTabs";
import { Data } from "../utils/Data";

export function Dashboard() {
  const [data, setData] = useState({
    labels: Data.map((data) => data.month),
    datasets: [
      {
        label: "Barang Masuk",
        backgroundColor: "#5898d9",
        data: Data.map((data) => data.barangMasuk),
      },
      {
        label: "Barang Keluar",
        backgroundColor: "#a3ceed",
        data: Data.map((data) => data.barangKeluar),
      },
    ],
  });
  return (
    <>
      <NavBar />
      <div className="flex flex-row bg-slate-200">
        <VerticalTabs />

        <div className="m-5">
          <div className="w-[700px] bg-white px-5 py-3 rounded-md">
            <h1 className="mt-3 mb-5 text-center font-semibold">Jumlah Barang Masuk & Barang Keluar Per Bulan</h1>
            <BarChart chartData={data} />
          </div>
        </div>
      </div>
    </>
  );
}
