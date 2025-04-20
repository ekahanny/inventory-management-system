import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import ProductService from "../services/ProductService";
import InLogProdService from "../services/InLogProdService";
import SidebarComponent from "../components/elements/Sidebar";
import { NavBar } from "../components/elements/NavBar";

export default function DetailRiwayatProduk() {
  const { id } = useParams();
  const location = useLocation();

  return (
    <div className="flex bg-slate-200">
      <SidebarComponent />
      <div className="flex-1">
        <div className="ml-[210px] mt-[60px] p-4">
          <NavBar />

          {/* Konten Kategori Barang */}
          <div className="min-h-screen">
            <h1>Detail Riwayat Produk</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
