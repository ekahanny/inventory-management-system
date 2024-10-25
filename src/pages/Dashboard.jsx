import { useState } from "react";
import { BarChart } from "../components/elements/BarChart";
import { NavBar } from "../components/elements/NavBar";
import { VerticalTabs } from "../components/elements/VerticalTabs";
import { DataBar } from "../utils/DataBar";
import { DataPie } from "../utils/DataPie";

import { PieChart } from "../components/elements/PieChart";
import TabelProduk from "../components/fragments/TabelProduk";

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

        <div className=" my-5 w-5/6">
          {/* Charts */}
          <div className="flex flex-row	justify-center gap-5 ml-8">
            {/* Bar Chart */}
            <div className="md:w-[950px] sm:w-[500px] bg-white px-5 py-3 rounded-md shadow-md">
              <h1 className="mt-3 mb-5 text-center font-semibold">
                Jumlah Barang Masuk & Barang Keluar Per Bulan
              </h1>
              <BarChart chartData={dataBar} />
            </div>

            {/* Pie Chart */}
            {/* <div className="md:w-[350px] bg-white p-4 py-2 rounded-md">
              <h1 className="my-3 text-center font-semibold">
                Barang Terlaris
              </h1>
              <PieChart chartData={dataPie} />
              <p className="flex justify-center items-center mt-5 font-semibold">
                Oktober 2022
              </p>
            </div> */}

            {/* Ringkasan Penjualan  */}
            <div className="flex flex-col ">
              {/* Pemasukan */}
              <div className="bg-white p-5 w-[370px] rounded-md shadow-md">
                <div className="flex flex-row gap-2 justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill=""
                    className="size-6 mt-1 fill-sky-600"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4Zm12 4a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM4 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm13-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM1.75 14.5a.75.75 0 0 0 0 1.5c4.417 0 8.693.603 12.749 1.73 1.111.309 2.251-.512 2.251-1.696v-.784a.75.75 0 0 0-1.5 0v.784a.272.272 0 0 1-.35.25A49.043 49.043 0 0 0 1.75 14.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="font-bold text-xl">Pemasukan:</p>
                  <p className="text-sky-800 text-lg mt-0.5">Oct 2024</p>
                </div>
                <p className="flex items-center justify-center mt-3 mb-2 font-bold text-2xl">
                  Rp. 10.673.954,-
                </p>
              </div>

              {/* Pengeluaran */}
              <div className="bg-white p-5 mt-3 w-[370px] rounded-md shadow-md">
                <div className="flex flex-row gap-2 justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-6 mt-1 fill-sky-600"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1 2.75A.75.75 0 0 1 1.75 2h16.5a.75.75 0 0 1 0 1.5H18v8.75A2.75 2.75 0 0 1 15.25 15h-1.072l.798 3.06a.75.75 0 0 1-1.452.38L13.41 18H6.59l-.114.44a.75.75 0 0 1-1.452-.38L5.823 15H4.75A2.75 2.75 0 0 1 2 12.25V3.5h-.25A.75.75 0 0 1 1 2.75ZM7.373 15l-.391 1.5h6.037l-.392-1.5H7.373Zm7.49-8.931a.75.75 0 0 1-.175 1.046 19.326 19.326 0 0 0-3.398 3.098.75.75 0 0 1-1.097.04L8.5 8.561l-2.22 2.22A.75.75 0 1 1 5.22 9.72l2.75-2.75a.75.75 0 0 1 1.06 0l1.664 1.663a20.786 20.786 0 0 1 3.122-2.74.75.75 0 0 1 1.046.176Z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <p className="font-bold text-xl">Pengeluaran:</p>
                  <p className="text-sky-800 text-lg mt-0.5">Oct 2024</p>
                </div>
                <p className="flex items-center justify-center mt-3 mb-2 font-bold text-2xl">
                  Rp. 7.364.952,-
                </p>
              </div>

              {/* Barang Kadaluwarsa */}
              <div className="bg-white p-5 mt-3 w-[370px] rounded-md shadow-md">
                <div className="flex flex-row gap-2 justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-7 fill-sky-600"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.339 2.237a.531.531 0 0 0-.678 0 11.947 11.947 0 0 1-7.078 2.75.5.5 0 0 0-.479.425A12.11 12.11 0 0 0 2 7c0 5.163 3.26 9.564 7.834 11.257a.48.48 0 0 0 .332 0C14.74 16.564 18 12.163 18 7c0-.538-.035-1.069-.104-1.589a.5.5 0 0 0-.48-.425 11.947 11.947 0 0 1-7.077-2.75ZM10 6a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 6Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <p className="font-bold text-xl">Kadaluwarsa:</p>
                  <p className="text-sky-800 text-lg mt-0.5">Oct 2024</p>
                </div>
                <div className="flex items-center justify-center flex-col">
                  <p className="mt-3 mb-2 font-bold text-2xl text-red-400">
                    4 Barang
                  </p>
                  <button className=" bg-sky-300 px-6 py-1.5 rounded mt-3 shadow-md hover:bg-sky-500">
                    Detail
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="">
            <TabelProduk />
          </div>
        </div>
      </div>
    </>
  );
}
