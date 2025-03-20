import axiosInstance from "../utils/api";

const CategoryService = {
  getCategories: async () => {
    try {
      const response = await axiosInstance.get("/kategori");
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      //   return [];
    }
  },
};

export default CategoryService;
