import axiosInstance from "../utils/api";

const InProdService = {
  // Fungsi untuk menambahkan produk
  addProduct: async (productData) => {
    try {
      const response = await axiosInstance.post("/produk/log", productData);
      return response.data;
    } catch (error) {
      console.error("Gagal menambahkan produk:", error);
      throw error;
    }
  },

  // Fungsi untuk mengambil daftar produk
  getProducts: async () => {
    try {
      const response = await axiosInstance.get("/produk/log");
      return response.data;
    } catch (error) {
      console.error("Gagal mengambil log produk:", error);
      return [];
    }
  },
};

export default InProdService;
