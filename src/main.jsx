import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard.jsx";
import { BarangMasuk } from "./pages/BarangMasuk.jsx";
import { BarangKeluar } from "./pages/BarangKeluar.jsx";
import { BarangKadaluwarsa } from "./pages/BarangKadaluwarsa.jsx";
import { RiwayatBarang } from "./pages/RiwayatBarang.jsx";
import "primereact/resources/themes/saga-blue/theme.css"; // atau tema lain
import "primereact/resources/primereact.min.css"; // CSS PrimeReact
import "primeicons/primeicons.css"; // PrimeIcons
import "primeflex/primeflex.css"; // PrimeFlex untuk utilitas CSS opsional

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/barang-masuk",
    element: <BarangMasuk />,
  },
  {
    path: "/barang-keluar",
    element: <BarangKeluar />,
  },
  {
    path: "/barang-kadaluwarsa",
    element: <BarangKadaluwarsa />,
  },
  {
    path: "/riwayat-barang",
    element: <RiwayatBarang />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
