import axiosInstance from "../utils/api";

const InProdService = {
  addProduct: async (productData) => {
    try {
      const response = await axiosInstance.post("/produk/log", productData);
      return response.data;
    } catch (error) {
      console.error("Gagal menambahkan produk:", error);
      throw error;
    }
  },

  getProducts: async () => {
    try {
      const response = await axiosInstance.get("/produk/log");
      return response.data;
    } catch (error) {
      console.error("Gagal mengambil log produk:", error);
      return [];
    }
  },

  deleteProduct: async (id_produk) => {
    try {
      const response = await axiosInstance.delete(`/produk/log/${id_produk}`);
      return response.data;
    } catch (error) {
      console.error("Gagal menghapus log produk:", error);
      return [];
    }
  },
};

export default InProdService;
