import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import ProductService from "../services/ProductService";
import InLogProdService from "../services/InLogProdService";

export default function DetailRiwayatProduk() {
  const { id } = useParams();
  const location = useLocation();
  const [productLogs, setProductLogs] = useState([]);
  const [product, setProduct] = useState(location.state?.product || null);

  useEffect(() => {
    // Jika product tidak ada di state, fetch dari API
    if (!product) {
      fetchProductDetails();
    }
    fetchProductLogs();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await ProductService.getProducts();
      setProduct(response);
    } catch (error) {
      console.error("Gagal mengambil detail produk:", error);
    }
  };

  const fetchProductLogs = async () => {
    try {
      const response = await InLogProdService.getLogProducts();
      setProductLogs(response);
    } catch (error) {
      console.error("Gagal mengambil log produk:", error);
    }
  };
  return (
    <div>
      <p>ini detail produk</p>
    </div>
  );
}
