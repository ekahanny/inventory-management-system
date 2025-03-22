import axiosInstance from "../utils/api";

const ProductService = {
  getProducts: async () => {
    try {
      const response = await axiosInstance.get("/produk");
      return response.data;
    } catch (error) {
      console.error("Gagal mengambil produk", error);
      return [];
    }
  },
};

export default ProductService;
