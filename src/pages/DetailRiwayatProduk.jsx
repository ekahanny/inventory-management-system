import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import ProductService from "../services/ProductService";
import InLogProdService from "../services/InLogProdService";
import SidebarComponent from "../components/elements/Sidebar";
import { NavBar } from "../components/elements/NavBar";

export default function DetailRiwayatProduk() {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [logProduct, setLogProduct] = useState([]);

  const fetchDetailProduct = async () => {
    try {
      const response = await ProductService.getProductById(id);
      if (response._id) {
        setProduct(response);
      } else if (response.Produk) {
        setProduct(response.Produk);
      } else {
        throw new Error("Struktur response tidak dikenali");
      }
      console.log("Product data:", response);
    } catch (error) {
      console.error("Gagal mengambil produk:", error);
    }
  };

  const fetchLogProduct = async () => {
    try {
      const response = await InLogProdService.getAllLogProducts();

      const filteredLogs = response.LogProduk.filter(
        (log) => log.produk?._id === id
      );
      setLogProduct(filteredLogs);
      console.log("Response API Log Produk: ", filteredLogs);
    } catch (error) {
      console.error("Gagal mengambil log produk: ", error);
    }
  };

  useEffect(() => {
    if (!product) {
      fetchDetailProduct();
    }
    fetchLogProduct();
  }, [id]);

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
