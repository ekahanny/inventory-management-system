import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard.jsx";
import { BarangMasuk } from "./pages/BarangMasuk.jsx";
import { BarangKeluar } from "./pages/BarangKeluar.jsx";
import { RiwayatBarangMasuk } from "./pages/RiwayatBarangMasuk.jsx";
import { PrimeReactProvider } from "primereact/api";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { Kategori } from "./pages/Kategori.jsx";
import { RiwayatBarangKeluar } from "./pages/RiwayatBarangKeluar.jsx";

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
    path: "/kategori",
    element: <Kategori />,
  },
  {
    path: "/riwayat-barang-masuk",
    element: <RiwayatBarangMasuk />,
  },
  {
    path: "/riwayat-barang-keluar",
    element: <RiwayatBarangKeluar />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PrimeReactProvider>
      <RouterProvider router={router} />
    </PrimeReactProvider>
  </StrictMode>
);
