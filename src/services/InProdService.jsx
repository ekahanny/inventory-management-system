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
      const response = await axiosInstance.get("/produk"); // Sesuaikan endpoint jika perlu
      return response.data; // Pastikan ini sesuai dengan format respons API
    } catch (error) {
      console.error("Gagal mengambil produk:", error);
      return [];
    }
  },
};

export default InProdService;
